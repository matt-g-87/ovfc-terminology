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
  //    Assert: no uncaught exceptions, no console errors, all positions finite & on-pitch,
  //    and the clock actually halts at each annotation pause.
  for(const t of terms){
    for(let v=0; v<t.n; v++){
      await b.eval(`(window.OVFC.selectById(${JSON.stringify(t.id)}, ${v}), 1)`);
      const dur = await b.eval(`window.OVFC.S.comp.duration`);
      const label = `${t.id} v${v}`;

      // simulate Play: nudge off t=0 pause then step the clock in 60fps increments
      await b.eval(`(window.OVFC.play(), 1)`);
      const steps = Math.ceil((dur+1.0)/0.05) + 5;
      let sawPause = false, badPos = null, lastT = -1, stalls = 0;
      for(let i=0;i<steps;i++){
        const snap = await b.eval(`window.OVFC.snapshot()`);
        for(const id in snap.entities){
          const p = snap.entities[id];
          if(!finite(p)) { badPos = `${label}: ${id} non-finite ${JSON.stringify(p)} @t=${snap.t}`; break; }
          if(!onPitch(p)) { badPos = `${label}: ${id} off-pitch ${JSON.stringify(p)} @t=${snap.t.toFixed(2)}`; break; }
        }
        if(badPos) break;
        if(snap.activePause) sawPause = true;
        // if the engine paused at an annotation, resume (mimic the user pressing play)
        if(!snap.playing && snap.t < dur - 1e-3){ await b.eval(`(window.OVFC.play(), 1)`); }
        await b.eval(`(window.OVFC.step(0.05), 1)`);
      }
      check(badPos===null, badPos || `${label}: positions stayed finite & on-pitch`);
      check(sawPause===true, `${label}: hit at least one annotation pause`);
    }
  }

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
