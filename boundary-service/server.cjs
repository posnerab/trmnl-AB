const fs = require('node:fs/promises');
const path = require('node:path');
const http = require('node:http');
const crypto = require('node:crypto');
const { execFile } = require('node:child_process');
const { promisify } = require('node:util');
const { Renderer } = require('./renderer.cjs');
const { payloadAt, refreshSeconds, fingerprint, selectFrame, matchesFrame } = require('./planner.cjs');
const { openMeteoURL, fromOpenMeteo } = require('./vendor/weather-mamish/score.js');
// Zippopotam.us coordinates used by Weather Mamish when Milwaukee ZIP 53216 is selected.
const mamishURL = openMeteoURL(43.0859, -87.9742);
const fiveMinutes = 5 * 60000;
let mamishWeather = null, nextMamishFetch = 0;
const exec = promisify(execFile);
const state = process.env.STATE_DIRECTORY || '/var/lib/trmnl-boundary';
const publicBase = process.env.PUBLIC_BASE || 'https://zmanim.abie.live/trmnl';
const renderer = new Renderer(path.join(state,'assets'), process.env.CHROMIUM_PATH || '/usr/bin/chromium');
let input = {}, frames = [], fallback, lastSources = 0, lastSolar = 0, lastFrame = 0;
let sourceStatus = 'pending', solarStatus = 'pending';
const isoDay = date => new Intl.DateTimeFormat('en-CA',{timeZone:'America/Chicago',year:'numeric',month:'2-digit',day:'2-digit'}).format(date);
const shiftDay = (key,n)=>new Date(Date.parse(key+'T12:00:00Z')+n*86400000).toISOString().slice(0,10);
async function atomic(name, data) { const dest=path.join(state,name); await fs.writeFile(dest+'.tmp',JSON.stringify(data)); await fs.rename(dest+'.tmp',dest); }
async function fetchJSON(url) {
  const r=await fetch(url,{signal:AbortSignal.timeout(20000),headers:{'User-Agent':'abie-trmnl-boundary/1.0'}});
  if(!r.ok) throw new Error('Source unavailable');
  return r.json();
}
async function refreshMamish() {
  const now = Date.now();
  if (now < nextMamishFetch) return;
  try {
    mamishWeather = fromOpenMeteo(await fetchJSON(mamishURL));
    nextMamishFetch = (Math.floor(now / fiveMinutes) + 1) * fiveMinutes;
  } catch {
    mamishWeather = null;
    nextMamishFetch = now + 60000;
  }
}
async function sources() {
  const now=Date.now(), day=isoDay(new Date());
  if(now-lastSolar>=6*3600000 || !input.IDX_0) {
    try {
      const [solar,calendar]=await Promise.all([
        fetchJSON(`https://www.hebcal.com/zmanim?cfg=json&sec=1&zip=53216&start=${shiftDay(day,-1)}&end=${shiftDay(day,3)}`),
        fetchJSON(`https://www.hebcal.com/hebcal?v=1&cfg=json&zip=53216&start=${shiftDay(day,-1)}&end=${shiftDay(day,370)}&d=on&s=on&c=on&M=on&lg=a&maj=on&min=on&mf=on&nx=on&ss=on&mvch=on&leyning=off`)
      ]);
      const candidate={...input,IDX_0:solar,IDX_1:calendar}; payloadAt(candidate,now);
      input=candidate; lastSolar=now; solarStatus='ok';
      await atomic('input.json',input);
    } catch { solarStatus='delayed'; lastSolar=now-6*3600000+60000; }
  }
  if(now-lastSources>=900000) {
    try {
      const {stdout}=await exec(process.env.SOURCE_PYTHON || '/home/xander/projects/shared/.venv/bin/python', [path.join(__dirname,'fetch_sources.py')],{timeout:55000,maxBuffer:1024*1024});
      input={...input,...JSON.parse(stdout)}; sourceStatus='ok'; await atomic('input.json',input);
    } catch { sourceStatus='delayed'; }
    lastSources=now;
  }
}
async function makeFrame(payload, validFrom) {
  const temporary=path.join(state,'frame.png');
  await renderer.render(payload,temporary);
  const bytes=await fs.readFile(temporary);
  const hash=crypto.createHash('sha256').update(bytes).digest('hex');
  const name=`${hash}.png`;
  await fs.rename(temporary,path.join(state,'images',name));
  return {name, fingerprint:fingerprint(payload),validFrom,validUntil:Date.parse(payload.next_transition_at),nextTransition:payload.next_transition_at, nextZman:payload.next_zman,contextTile:payload.mamish?'mamish':'lunar',mamishScore:payload.mamish?.score??null,
    mamishLabel:payload.mamish?.label??null, mamishObservedAt:payload.mamish?.observedAt??null, renderedAt:Date.now()};
}
async function prepare() {
  const now=Date.now();
  try {
    const payload=payloadAt(input,now,mamishWeather), current=selectFrame(frames,now);
    if(!matchesFrame(current,payload) || now-lastFrame>=900000) {
      const frame=await makeFrame(payload,now);
      frames=frames.filter(f=>f.validFrom<now && f.validUntil<=now).concat(frame); lastFrame=Date.now();
    }
    // Have the post-boundary screen in memory/disk before a sleeping device wakes.
    const boundary=Date.parse(payload.next_transition_at);
    const target=boundary+1;
    if(boundary-now<=16*60000) {
      const nextPayload=payloadAt(input,target,mamishWeather);
      if(!frames.some(f=>f.validFrom===boundary && matchesFrame(f,nextPayload))) {
        const nextFrame=await makeFrame(nextPayload,boundary);
        frames=frames.filter(f=>f.validFrom!==boundary).concat(nextFrame);
      }
    }
    frames=frames.filter(f=>f.validUntil>now-3600000).slice(-8);
    await atomic('frames.json',frames);
  } catch { console.error('Screen preparation delayed; serving bounded fallback if needed'); }
  finally { await renderer.close(); }
}
function json(res,status,body) { res.writeHead(status,{'Content-Type':'application/json','Cache-Control':'no-store'});res.end(JSON.stringify(body)); }
async function handler(req,res) {
  if(req.method!=='GET' && req.method!=='HEAD') return json(res,405,{error:'Method not allowed'});
  const now=Date.now();
  if(req.url==='/trmnl/display') {
    const frame=selectFrame(frames,now);
    const name=frame?.name || fallback;
    if(!name) return json(res,503,{error:'Screen preparation pending'});
    console.log(JSON.stringify({event:'display',at:new Date(now).toISOString(),image:name,transition:frame?.nextTransition, fallback:!frame}));
    return json(res,200,{filename:name.slice(0,-4),url:`${publicBase}/images/${name}`,refresh_rate:frame ? refreshSeconds(now,frame.nextTransition,frame.mamishObservedAt) : 60});
  }
  if(req.url==='/trmnl/health') {
    const frame=selectFrame(frames,now);
    return json(res,frame?200:503,{ready:!!frame,solar:solarStatus,sources:sourceStatus,rendered_at:frame?.renderedAt,next_transition_at:frame?.nextTransition,next_zman:frame?.nextZman,context_tile:frame?.contextTile,mamish_score:frame?.mamishScore,mamish_label:frame?.mamishLabel,mamish_observed_at:frame?.mamishObservedAt,prepared_frames:frames.filter(f=>f.validUntil>now).length});
  }
  const match=req.url.match(/^\/trmnl\/images\/([a-f0-9]{64}\.png)$/);
  if(match) {
    try { const bytes=await fs.readFile(path.join(state,'images',match[1]));res.writeHead(200,{'Content-Type':'image/png','Content-Length':bytes.length,'Cache-Control':'public, max-age=86400, immutable'});return res.end(req.method==='HEAD'?undefined:bytes); } catch {}
  }
  json(res,404,{error:'Not found'});
}
async function main() {
  await fs.mkdir(path.join(state,'images'),{recursive:true});
  try {input=JSON.parse(await fs.readFile(path.join(state,'input.json'),'utf8'));}catch{}
  // A restart regenerates frames instead of trusting old template/source revisions.
  const tmp=path.join(state,'fallback.png');
  await renderer.render({error:'Refresh delayed. Reconnectingâ€¦',current_time:'â€”'},tmp);
  const data=await fs.readFile(tmp);fallback=crypto.createHash('sha256').update(data).digest('hex')+'.png';await fs.rename(tmp,path.join(state,'images',fallback));
  await renderer.close();
  const server=http.createServer((req,res)=>handler(req,res).catch(()=>json(res,500,{error:'Unavailable'})));
  server.listen(Number(process.env.PORT||8794),'127.0.0.1');
  // Network fetches never block display/image requests or boundary promotion.
  let loading=false;
  const load=async()=>{if(loading)return;loading=true;try{await Promise.all([sources(), refreshMamish()]);}finally{loading=false;}};
  await load();
  let working=false;
  const work=async()=>{if(working)return;working=true;try{await prepare();}finally{working=false;}};
  await work();
  const prepareTimer=setInterval(work,10000),sourceTimer=setInterval(load,30000);
  const cleanupTimer=setInterval(async()=>{
    for(const name of await fs.readdir(path.join(state,'images'))) {
      if(!/^[a-f0-9]{64}\.png$/.test(name)||name===fallback||frames.some(f=>f.name===name))continue;
      const file=path.join(state,'images',name);if(Date.now()-(await fs.stat(file)).mtimeMs>2*86400000)await fs.unlink(file);
    }
  },3600000);
  process.on('SIGTERM',async()=>{clearInterval(prepareTimer);clearInterval(sourceTimer);clearInterval(cleanupTimer);server.close();await renderer.close();process.exit(0);});
}
main().catch(error=>{console.error('Boundary service startup failed', error.message.split('\n').slice(0,2).join(' '));process.exit(1);});
