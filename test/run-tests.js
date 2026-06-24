// End-to-end tests for the OVFC Terminology Trainer.
// Loads index.html in headless Chrome and exercises the real engine + render path,
// so a render-time exception (the kind that makes players vanish on Play) FAILS the suite.
//
//   node test/run-tests.js
//
const path = require('path');
const { Browser } = require('./harness');

const URL = 'file://' + path.resolve(__dirname, '..', 'index.html');

let passed = 0, failed = 0;
const fails = [];
function check(cond, msg){ if(cond){ passed++; } else { failed++; fails.push(msg); console.log('  ✗ '+msg); } }
function ok(msg){ passed++; }

const wait = ms => new Promise(r=>setTimeout(r,ms));   // real wall-clock; lets the page's rAF run
function finite(p){ return Array.isArray(p) && p.length===2 && Number.isFinite(p[0]) && Number.isFinite(p[1]); }
function onPitch(p){ // allow a little slack for the goal/keeper drawn just beyond the line
  return p[0] >= -0.1 && p[0] <= 1.1 && p[1] >= -0.12 && p[1] <= 1.12;
}

(async()=>{
  const b = new Browser();
  await b.launch();
  await b.goto(URL);

  // 0) page loaded clean
  check((await b.eval(`!!window.OVFC`))===true, 'engine (window.OVFC) is exposed');
  const terms = await b.eval(`window.OVFC.TERMS.map(t=>({id:t.id,n:t.variants.length}))`);
  check(terms.length>=10, `at least 10 terms present (got ${terms.length})`);

  // 1) Drive EVERY term/variant through its whole timeline from t=0, like pressing Play.
  //    dwellBase=0 makes the auto-cycle flow straight through stages (no 8s holds) so the
  //    sweep is fast. Assert: no exceptions, all positions finite & on-pitch, the clock
  //    actually lands on each stage, and auto-cycle stops cleanly at the end (never past it).
  await b.eval(`(window.OVFC.S.dwellBase=0, 1)`);
  for(const t of terms){
    for(let v=0; v<t.n; v++){
      await b.eval(`(window.OVFC.selectById(${JSON.stringify(t.id)}, ${v}), 1)`);
      const dur = await b.eval(`window.OVFC.S.comp.duration`);
      const label = `${t.id} v${v}`;

      await b.eval(`(window.OVFC.play(), 1)`);
      const steps = Math.ceil((dur+1.0)/0.05) + 10;
      let sawPause = false, badPos = null, overran = false;
      for(let i=0;i<steps;i++){
        const snap = await b.eval(`window.OVFC.snapshot()`);
        for(const id in snap.entities){
          const p = snap.entities[id];
          if(!finite(p)) { badPos = `${label}: ${id} non-finite ${JSON.stringify(p)} @t=${snap.t}`; break; }
          if(!onPitch(p)) { badPos = `${label}: ${id} off-pitch ${JSON.stringify(p)} @t=${snap.t.toFixed(2)}`; break; }
        }
        if(badPos) break;
        if(snap.t > dur + 1e-6) overran = true;
        if(snap.activePause) sawPause = true;
        await b.eval(`(window.OVFC.step(0.05), 1)`);
      }
      const endSnap = await b.eval(`window.OVFC.snapshot()`);
      check(badPos===null, badPos || `${label}: positions stayed finite & on-pitch`);
      check(sawPause===true, `${label}: hit at least one annotation stage`);
      check(!overran && endSnap.t<=dur+1e-6 && endSnap.playing===false,
        `${label}: auto-cycle stopped cleanly at the end (no loop/overrun)`);
    }
  }
  await b.eval(`(window.OVFC.S.dwellBase=8, 1)`);  // restore default for the dwell/step checks

  // 1b) Auto-cycle dwell: play starts MOVING immediately, then HOLDS on the first stage it
  //     ARRIVES at (not the t=0 start). Driven via step() in virtual time.
  await b.eval(`(window.OVFC.selectById("press",1), window.OVFC.S.dwellBase=8, 1)`);
  const pauses = await b.eval(`window.OVFC.S.comp.pauses.map(p=>p.t)`);
  const firstStage = pauses.find(p=>p>1e-3);
  await b.eval(`(window.OVFC.play(), 1)`);
  for(let i=0;i<60;i++) await b.eval(`(window.OVFC.step(0.05), 1)`);  // ~3s of virtual time
  const held = await b.eval(`window.OVFC.snapshot()`);
  check(Math.abs(held.t - firstStage) < 0.2 && held.playing===true && held.activePause!==null,
    `dwell: auto-cycle moves off t=0 and holds on the first arrived stage (t≈${firstStage})`);

  // 1c) REAL playback through requestAnimationFrame, in wall-clock time — this is what the
  //     play BUTTON actually does. Catches "play does nothing" (the bug the unit path missed).
  await b.eval(`(window.OVFC.S.dwellBase=8, window.OVFC.selectById("touch-tight",0), window.OVFC.seekFraction(0), 1)`);
  await b.eval(`(window.OVFC.play(), 1)`);
  await wait(900);
  const live = await b.eval(`window.OVFC.snapshot()`);
  check(live.t > 0.2 && live.playing===true,
    `REAL play: pressing play advances the clock via rAF within ~1s (t=${live.t.toFixed(2)})`);

  // 1d) Forward/Back ANIMATE the transition (live render), not an instant jump.
  await b.eval(`(window.OVFC.pause(), window.OVFC.seekFraction(0), 1)`);
  const stages = await b.eval(`window.OVFC.S.comp.pauses.map(p=>p.t)`);
  const target1 = stages.find(p=>p>1e-3);
  await b.eval(`(window.OVFC.nextStage(), 1)`);
  await wait(80);                                   // shortly after: should be MID-glide
  const mid = await b.eval(`window.OVFC.S.t`);
  check(mid>1e-3 && mid<target1-1e-3,
    `Forward animates: mid-transition t (${mid.toFixed(2)}) is between start and stage ${target1}`);
  await wait(1500);                                 // allow arrival
  const landed = await b.eval(`window.OVFC.snapshot()`);
  check(Math.abs(landed.t-target1)<0.06 && landed.playing===false,
    `Forward lands on the next stage and parks (t≈${target1})`);
  // Back animates in reverse and parks at the previous stage (t=0 here)
  await b.eval(`(window.OVFC.prevStage(), 1)`);
  await wait(1500);
  const backLanded = await b.eval(`window.OVFC.snapshot()`);
  check(backLanded.t < target1-0.05 && backLanded.playing===false,
    `Back animates in reverse and parks at the previous stage (t=${backLanded.t.toFixed(2)})`);

  // 1e) Gliding progress bar: during a dwell hold the playhead t is FROZEN but the scrub
  //     fraction (playFrac, pp-based) keeps INCREASING. And the step counter advances.
  await b.eval(`(window.OVFC.S.dwellBase=8, window.OVFC.selectById("press",1), window.OVFC.play(), 1)`);
  for(let i=0;i<40;i++) await b.eval(`(window.OVFC.step(0.05), 1)`);   // reach + sit on the first stage
  const g1 = await b.eval(`({t:window.OVFC.S.t, frac:window.OVFC.playFrac(), step:window.OVFC.stepInfo()})`);
  for(let i=0;i<20;i++) await b.eval(`(window.OVFC.step(0.05), 1)`);   // still within the 8s dwell
  const g2 = await b.eval(`({t:window.OVFC.S.t, frac:window.OVFC.playFrac()})`);
  check(Math.abs(g2.t-g1.t)<1e-6 && g2.frac>g1.frac+1e-4,
    `gliding bar: during a dwell t is frozen (${g1.t.toFixed(2)}) but the scrub keeps moving (${g1.frac.toFixed(3)}→${g2.frac.toFixed(3)})`);
  const nStages = await b.eval(`window.OVFC.S.comp.pauses.length`);
  check(g1.step.total===nStages && g1.step.cur>=1 && g1.step.cur<=g1.step.total,
    `step counter: shows cur/total (got ${g1.step.cur} / ${g1.step.total}, expected total ${nStages})`);
  // dwellBase=0 ⇒ pp is linear with time (scrub fraction == t/duration)
  await b.eval(`(window.OVFC.S.dwellBase=0, window.OVFC.selectById("press",1), window.OVFC.seekFraction(0.5), 1)`);
  const lin = await b.eval(`({frac:window.OVFC.playFrac(), t:window.OVFC.S.t, dur:window.OVFC.S.comp.duration})`);
  check(Math.abs(lin.frac - lin.t/lin.dur) < 1e-6, `dwellBase=0: scrub fraction is linear with time`);
  await b.eval(`(window.OVFC.S.dwellBase=8, 1)`);

  // 2) Scrubbing to arbitrary times never throws and stays on-pitch (seek path).
  await b.eval(`(window.OVFC.selectById("touch-tight",0),1)`);
  for(const f of [0,0.1,0.37,0.5,0.83,1]){
    await b.eval(`(window.OVFC.seekFraction(${f}), window.OVFC.render(), 1)`);
    const snap = await b.eval(`window.OVFC.snapshot()`);
    let bad=false; for(const id in snap.entities) if(!onPitch(snap.entities[id])) bad=true;
    check(!bad, `scrub to ${f}: all entities on-pitch`);
  }

  // 2b) Team-colour mapping: "our team" is one colour everywhere, the keeper matches its
  //     team, and custom colours are reflected.
  const us = await b.eval(`window.OVFC.S.colors.us`);
  const them = await b.eval(`window.OVFC.S.colors.them`);
  check(us && them && us!==them, `default colours present and distinct (us=${us}, them=${them})`);
  // defending term: our defenders + GK = us, their attacker = them
  check(await b.eval(`window.OVFC.entityColorFor("touch-tight",2,"d1")`)===us, 'defending: our defender uses us-colour');
  check(await b.eval(`window.OVFC.entityColorFor("touch-tight",2,"gk")`)===us, 'defending: GK uses us-colour');
  check(await b.eval(`window.OVFC.entityColorFor("touch-tight",2,"a1")`)===them, 'defending: their attacker uses them-colour');
  // attacking term: our attacker = us, their defender + opponent GK = them (the GK-colour fix)
  check(await b.eval(`window.OVFC.entityColorFor("check-in-out",1,"a1")`)===us, 'attacking: our attacker uses us-colour');
  check(await b.eval(`window.OVFC.entityColorFor("check-in-out",1,"d1")`)===them, 'attacking: their defender uses them-colour');
  check(await b.eval(`window.OVFC.entityColorFor("check-in-out",1,"gk")`)===them, 'attacking: opponent GK uses them-colour (not always blue)');
  // custom colour is honoured
  await b.eval(`(window.OVFC.S.colors.us="#00ff88", 1)`);
  check(await b.eval(`window.OVFC.entityColorFor("touch-tight",2,"d1")`)==="#00ff88", 'custom us-colour is reflected');
  await b.eval(`(window.OVFC.S.colors.us=${JSON.stringify(us)}, 1)`); // restore

  // 2c) "YOU" focus markers: every term has exactly one focal player, present in every
  //     variant, and on OUR team (so its rendered colour is the us-colour).
  const focusOk = await b.eval(`(function(){
    const F=window.OVFC.FOCUS, US=window.OVFC.S.colors.us;
    for(const t of window.OVFC.TERMS){
      const fid=F[t.id]; if(!fid) return "no focus for "+t.id;
      for(let i=0;i<t.variants.length;i++){
        if(!t.variants[i].entities.some(e=>e.id===fid)) return "focus "+fid+" missing in "+t.id+" v"+i;
        if(window.OVFC.entityColorFor(t.id,i,fid)!==US) return "focus "+fid+" not our-team in "+t.id+" v"+i;
      }
    }
    return "ok";
  })()`);
  check(focusOk==="ok", `YOU focus: one focal our-team player per term/variant (${focusOk})`);

  // 2d) Throw-ins have a visible thrower entity on the sideline.
  const throwOk = await b.eval(`(function(){
    for(const id of ["touch-tight","check-in-out"]){
      const t=window.OVFC.TERMS.find(x=>x.id===id);
      for(let i=0;i<t.variants.length;i++){
        const v=t.variants[i]; if(!v.throwIn) continue;
        const thr=v.entities.find(e=>e.id==="thr"); if(!thr) return "no thrower in "+id+" v"+i;
        const k0=v.keyframes[0].pos.thr; if(!k0 || k0[0]>0.08) return "thrower not on sideline in "+id+" v"+i;
      }
    }
    return "ok";
  })()`);
  check(throwOk==="ok", `throw-in: a sideline thrower entity is present (${throwOk})`);

  // 2e) Vision cones resolve a facing target on the terms that should have them.
  for(const [id,v,ent] of [["half-turn",1,"a1"],["goal-side",0,"d1"],["switch",1,"a1"]]){
    await b.eval(`(window.OVFC.selectById(${JSON.stringify(id)},${v}), window.OVFC.seekFraction(0.05), 1)`);
    const hasFace = await b.eval(`!!window.OVFC.sampleFace(window.OVFC.S.comp, ${JSON.stringify(ent)}, window.OVFC.S.t)`);
    check(hasFace===true, `vision cone: ${id} v${v} ${ent} has a facing target`);
  }

  // 2f) Hidden debug mode: toggle, drag override, inspector panel, sequence number.
  await b.eval(`(window.OVFC.selectById("half-turn",1), window.OVFC.seekFraction(0), 1)`);
  check(await b.eval(`document.getElementById('stage').classList.contains('debug')`)===false, 'debug: hidden by default');
  await b.eval(`(window.OVFC.setDebug(true), 1)`);
  check(await b.eval(`document.getElementById('stage').classList.contains('debug')`)===true, 'debug: setDebug(true) shows the inspector');
  // seqNumber: integer on a stage, decimal between stages
  const seqAtStage = await b.eval(`window.OVFC.seqNumber()`);
  check(Math.abs(seqAtStage-1)<1e-6, `debug seq: 1 at the first stage (got ${seqAtStage})`);
  const seqMid = await b.eval(`(function(){ const ps=window.OVFC.S.comp.pauses; window.OVFC.S.t=(ps[0].t+ps[1].t)/2; window.OVFC.render(); return window.OVFC.seqNumber(); })()`);
  check(seqMid>1 && seqMid<2, `debug seq: decimal between stages 1 and 2 (got ${seqMid.toFixed(2)})`);
  // drag override → samplePos reflects it and the panel reports id + coords
  await b.eval(`(window.OVFC.S.sel="a1", window.OVFC.S.debugPos={a1:[0.33,0.44]}, window.OVFC.render(), 1)`);
  const ov = await b.eval(`window.OVFC.samplePos(window.OVFC.S.comp,"a1",window.OVFC.S.t)`);
  check(Math.abs(ov[0]-0.33)<1e-9 && Math.abs(ov[1]-0.44)<1e-9, 'debug drag: samplePos returns the dragged position');
  const panel = await b.eval(`window.OVFC.debugPanelText()`);
  check(panel.includes("a1") && panel.includes("0.33") && panel.includes("0.44"), 'debug panel: shows selected id + coordinates');
  // 2g) REAL drag via synthesized mouse input — exercises the actual pointer handlers,
  //     not just the state (the "play doesn't work" lesson: test the real interaction path).
  await b.eval(`(window.OVFC.selectById("half-turn",1), window.OVFC.seekFraction(0), window.OVFC.setDebug(true), 1)`);
  const ri = await b.eval(`(function(){ const r=document.getElementById('cv').getBoundingClientRect(); const p=window.OVFC.canvasPointOf("a1"); return {rx:r.left, ry:r.top, px:p[0], py:p[1]}; })()`);
  const dx=ri.rx+ri.px, dy=ri.ry+ri.py;
  await b.send('Input.dispatchMouseEvent',{type:'mousePressed',x:dx,y:dy,button:'left',buttons:1,clickCount:1}, b.session);
  await b.send('Input.dispatchMouseEvent',{type:'mouseMoved',x:dx-50,y:dy-35,button:'left',buttons:1}, b.session);
  await b.send('Input.dispatchMouseEvent',{type:'mouseReleased',x:dx-50,y:dy-35,button:'left',buttons:1,clickCount:1}, b.session);
  const drag = await b.eval(`({sel:window.OVFC.S.sel, moved:!!window.OVFC.S.debugPos.a1})`);
  check(drag.sel==="a1" && drag.moved, `debug REAL drag: a press+move on a circle selects and repositions it (sel=${drag.sel}, moved=${drag.moved})`);

  // turning debug off clears overrides and hides the panel
  await b.eval(`(window.OVFC.setDebug(false), 1)`);
  check(await b.eval(`Object.keys(window.OVFC.S.debugPos).length===0`)===true, 'debug: turning off clears drag overrides');
  check(await b.eval(`document.getElementById('stage').classList.contains('debug')`)===false, 'debug: off hides the inspector');

  // 3) The whole run must be free of page exceptions / console errors.
  check(b.exceptions.length===0,
    b.exceptions.length ? 'NO uncaught exceptions — but found:\n    '+b.exceptions.slice(0,6).join('\n    ')
                        : 'no uncaught exceptions or console errors');

  await b.close();

  console.log(`\n${failed? '❌':'✅'} ${passed} passed, ${failed} failed`);
  if(failed){ console.log('\nFailures:\n - '+fails.join('\n - ')); process.exit(1); }
  process.exit(0);
})().catch(e=>{ console.error('HARNESS ERROR:', e); process.exit(2); });
