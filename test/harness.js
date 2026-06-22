// Minimal Chrome DevTools Protocol driver — no npm deps (Node 18+ globals: fetch, WebSocket).
// Launches headless Chrome, loads a page, captures console + uncaught exceptions,
// and lets a test evaluate JS in the page. Used by run-tests.js.
const { spawn } = require('child_process');
const os = require('os'), path = require('path'), fs = require('fs');

const CHROME = ['/usr/bin/google-chrome-stable','/usr/bin/google-chrome','google-chrome']
  .find(p => { try { return p.startsWith('/') ? fs.existsSync(p) : true; } catch { return false; } }) || 'google-chrome';

function wait(ms){ return new Promise(r=>setTimeout(r,ms)); }

class Browser {
  constructor(){ this.id=0; this.pending=new Map(); this.exceptions=[]; this.console=[]; }

  async launch(){
    const port = 9333 + Math.floor((Date.now()%500));
    this.userDir = fs.mkdtempSync(path.join(os.tmpdir(),'ovfc-cdp-'));
    this.proc = spawn(CHROME, [
      '--headless=new','--disable-gpu','--no-first-run','--no-default-browser-check',
      '--disable-extensions','--mute-audio','--window-size=1200,800',
      `--remote-debugging-port=${port}`, `--user-data-dir=${this.userDir}`, 'about:blank'
    ], { stdio:'ignore' });

    // wait for the debugging endpoint
    let info;
    for(let i=0;i<60;i++){
      try { info = await (await fetch(`http://127.0.0.1:${port}/json/version`)).json(); break; }
      catch { await wait(100); }
    }
    if(!info) throw new Error('Chrome debugging endpoint never came up');
    this.ws = new WebSocket(info.webSocketDebuggerUrl);
    await new Promise((res,rej)=>{ this.ws.onopen=res; this.ws.onerror=rej; });
    this.ws.onmessage = (ev)=>this._onMessage(JSON.parse(ev.data));

    // create a page target and attach (flatten => messages carry sessionId)
    const { targetId } = await this.send('Target.createTarget',{url:'about:blank'});
    const { sessionId } = await this.send('Target.attachToTarget',{targetId,flatten:true});
    this.session = sessionId;
    await this.send('Runtime.enable',{},sessionId);
    await this.send('Log.enable',{},sessionId);
    await this.send('Page.enable',{},sessionId);
  }

  _onMessage(msg){
    if(msg.id && this.pending.has(msg.id)){
      const {resolve,reject}=this.pending.get(msg.id); this.pending.delete(msg.id);
      msg.error ? reject(new Error(msg.error.message)) : resolve(msg.result);
      return;
    }
    const m=msg.method;
    if(m==='Runtime.exceptionThrown'){
      const d=msg.params.exceptionDetails;
      this.exceptions.push(d.exception?.description || d.text || JSON.stringify(d));
    } else if(m==='Runtime.consoleAPICalled'){
      const text=(msg.params.args||[]).map(a=>a.value??a.description??'').join(' ');
      this.console.push({type:msg.params.type,text});
      if(msg.params.type==='error') this.exceptions.push('console.error: '+text);
    } else if(m==='Log.entryAdded'){
      const e=msg.params.entry;
      if(e.level==='error') this.exceptions.push('log: '+e.text);
    }
  }

  send(method,params={},sessionId){
    const id=++this.id;
    const payload={id,method,params}; if(sessionId) payload.sessionId=sessionId;
    return new Promise((resolve,reject)=>{
      this.pending.set(id,{resolve,reject});
      this.ws.send(JSON.stringify(payload));
    });
  }

  async goto(url){
    await this.send('Page.navigate',{url},this.session);
    // crude but reliable: wait for document ready + a couple rAF ticks
    for(let i=0;i<50;i++){
      const r=await this.eval(`document.readyState==='complete' && !!window.OVFC`);
      if(r) break; await wait(80);
    }
    await wait(120);
  }

  async eval(expr){
    const r=await this.send('Runtime.evaluate',
      {expression:`(()=>{ try { return JSON.stringify(${expr}); } catch(e){ return JSON.stringify({__err:String(e&&e.stack||e)}); } })()`,
       returnByValue:true, awaitPromise:true}, this.session);
    if(r.exceptionDetails) throw new Error(r.exceptionDetails.text);
    const v=r.result.value;
    const out = v===undefined?undefined:JSON.parse(v);
    if(out && out.__err) throw new Error('page eval threw: '+out.__err);
    return out;
  }

  async close(){
    try{ this.proc.kill('SIGKILL'); }catch{}
    try{ fs.rmSync(this.userDir,{recursive:true,force:true}); }catch{}
  }
}

module.exports = { Browser };
