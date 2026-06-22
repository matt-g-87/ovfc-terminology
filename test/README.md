# Tests

End-to-end tests that load `index.html` in **real headless Chrome** and exercise the
actual engine + render path. Because they render every frame, a render-time exception
(like the one that made players vanish on Play) fails the suite instead of silently
breaking in the browser.

## Run

```bash
npm test          # or: node test/run-tests.js
```

Requires Google Chrome on the machine (`/usr/bin/google-chrome[-stable]`). No npm
dependencies — the harness speaks the Chrome DevTools Protocol over Node's built-in
`fetch` / `WebSocket` (Node 18+).

## What it covers

- **Every term × every variant** is driven through its whole timeline from `t=0`
  (simulating pressing Play, resuming through each annotation pause). It asserts:
  - no uncaught page exceptions and no `console.error`s,
  - every entity position stays finite and on-pitch at all times,
  - the clock actually halts at each annotation pause.
- **Scrubbing** to arbitrary times never throws and keeps entities on-pitch.

## How it works

- `harness.js` — launches headless Chrome, attaches via CDP, captures
  `Runtime.exceptionThrown` / `console` / `Log` errors, and runs `eval()` in the page.
- `run-tests.js` — the assertions. It drives the engine through the test surface
  exposed on `window.OVFC` in `index.html` (`step`, `snapshot`, `seekFraction`,
  `selectById`, `play`, …).

## Adding a term

New terms are pure data in the `TERMS` array in `index.html`. The suite automatically
picks them up — no test changes needed; it will validate the new sequences too.
