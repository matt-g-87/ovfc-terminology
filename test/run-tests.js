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

  // 3) The whole run must be free of page exceptions / console errors.
  check(b.exceptions.length===0,
    b.exceptions.length ? 'NO uncaught exceptions — but found:\n    '+b.exceptions.slice(0,6).join('\n    ')
                        : 'no uncaught exceptions or console errors');

  await b.close();

  console.log(`\n${failed? '❌':'✅'} ${passed} passed, ${failed} failed`);
  if(failed){ console.log('\nFailures:\n - '+fails.join('\n - ')); process.exit(1); }
  process.exit(0);
})().catch(e=>{ console.error('HARNESS ERROR:', e); process.exit(2); });
