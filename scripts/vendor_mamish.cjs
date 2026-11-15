// Pin the canonical scorer from a committed sibling release; no network at runtime.
const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');
const { execFileSync } = require('node:child_process');
const source = path.resolve(__dirname, '../../abie.live');
const destination = path.resolve(__dirname, '../boundary-service/vendor/weather-mamish');
const file = 'weather-mamish/score.js';
const git = args => execFileSync('git', ['-C', source, ...args], { encoding:'utf8' }).trim();
const commit = git(['rev-parse', 'HEAD']);
const bytes = execFileSync('git', ['-C', source, 'show', `${commit}:${file}`]);
if (!bytes.equals(fs.readFileSync(path.join(source, file)))) throw new Error('Commit the canonical scorer before pinning');
const manifest = JSON.stringify({repository:'https://github.com/posnerab/abie.live',commit,path:file,sha256:crypto.createHash('sha256').update(bytes).digest('hex')},null,2)+'\n';
if (process.argv.includes('--check')) {
  const installed=JSON.parse(fs.readFileSync(path.join(destination,'source.json'),'utf8'));
  if (!bytes.equals(fs.readFileSync(path.join(destination,'score.js'))) || installed.sha256!==JSON.parse(manifest).sha256) throw new Error('Pinned scorer differs from canonical source');
} else {
  fs.mkdirSync(destination,{recursive:true});fs.writeFileSync(path.join(destination,'score.js'),bytes);fs.writeFileSync(path.join(destination,'source.json'),manifest);
}
console.log('Weather Mamish scorer verified');
