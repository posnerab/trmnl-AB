const fs = require('node:fs/promises');
const path = require('node:path');
const { execFile } = require('node:child_process');
const { promisify } = require('node:util');
const { Liquid } = require('liquidjs');
const { chromium } = require('playwright-core');
const exec = promisify(execFile);
class Renderer {
  constructor(assets, chromiumPath) { this.assets = assets; this.chromiumPath = chromiumPath; this.liquid = new Liquid(); }
  async open() {
    this.css = await fs.readFile(path.join(this.assets,'plugins.css'),'utf8');
    this.js = await fs.readFile(path.join(this.assets,'plugins.js'),'utf8');
    this.markup = await fs.readFile(path.join(__dirname,'../plugins/zmanim/src/full.liquid'),'utf8');
    this.browser = await chromium.launch({ executablePath: this.chromiumPath, headless: true, args: ['--disable-dev-shm-usage'], chromiumSandbox: true });
    this.page = await this.browser.newPage({ viewport:{width:800,height:480}, deviceScaleFactor:1 });
    this.page.setDefaultTimeout(20000);
    // The renderer has no network access: all approved assets are embedded.
    await this.page.route('**/*', route=>route.abort());
  }
  async render(payload, destination) {
    if (!this.browser?.isConnected()) await this.open();
    const body = await this.liquid.parseAndRender(this.markup, payload);
    await this.page.setContent(`<!doctype html><html><head><meta charset="utf-8"><style>${this.css}</style></head><body class="trmnl"><div class="screen screen--og_plus screen--1bit screen--fonts-classic"><div class="view view--full">${body}</div></div></body></html>`);
    await this.page.addScriptTag({content:this.js});
    await this.page.evaluate(async()=>{await document.fonts.ready;});
    await this.page.screenshot({path:destination+'.raw.png', animations:'disabled'});
    await exec('/usr/bin/convert',[destination+'.raw.png','-alpha','off','-colorspace','Gray','-threshold','60%','-type','bilevel','-define','png:color-type=0','-depth','1',destination],{timeout:15000});
    await fs.unlink(destination+'.raw.png');
  }
  async close() { await this.browser?.close(); }
}
module.exports = { Renderer };
