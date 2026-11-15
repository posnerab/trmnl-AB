// Cache the pinned official framework and its fonts so rendering is offline.
const fs = require('node:fs/promises');
const path = require('node:path');
const { PurgeCSS } = require('purgecss');
async function download(url) {
  const r = await fetch(url, { signal: AbortSignal.timeout(30000) });
  if (!r.ok) throw new Error(`Asset download HTTP ${r.status}`);
  return { bytes: Buffer.from(await r.arrayBuffer()), type: r.headers.get('content-type').split(';')[0] };
}
async function main() {
  const dir = process.argv[2];
  if (!dir) throw new Error('Usage: node assets.cjs ASSET_DIRECTORY');
  await fs.mkdir(dir, { recursive: true });
  const base = 'https://trmnl.com/css/3.4.6/plugins.min.css';
  let css = (await download(base)).bytes.toString();
  const content = await fs.readFile(path.join(__dirname,'../plugins/zmanim/src/full.liquid'),'utf8');
  const shell = await fs.readFile(path.join(__dirname,'renderer.cjs'),'utf8');
  [ { css } ] = await new PurgeCSS().purge({content:[{raw:content+shell,extension:'html'}],css:[{raw:css}],safelist:['trmnl','screen','view','screen--og_plus','screen--1bit','screen--fonts-classic','view--full','screen--md','screen--landscape'],fontFace:false,variables:false});
  const refs = [...new Set([...css.matchAll(/url\(([^)]+)\)/g)].map(m=>m[1].replace(/^['"]|['"]$/g,'')).filter(v=>!v.startsWith('data:')))];
  for (const ref of refs) {
    const { bytes, type } = await download(new URL(ref, base));
    css = css.split(ref).join(`data:${type};base64,${bytes.toString('base64')}`);
  }
  await fs.writeFile(path.join(dir,'plugins.css'), css);
  await fs.writeFile(path.join(dir,'plugins.js'), (await download('https://trmnl.com/js/3.4.6/plugins.min.js')).bytes);
  console.log(`Cached framework 3.4.6 and ${refs.length} assets`);
}
main().catch(()=>{console.error('Framework asset preparation failed'); process.exit(1);});
