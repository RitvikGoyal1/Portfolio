import { readFile } from 'node:fs/promises';
import { chromium } from '@playwright/test';
const sans = (await readFile('node_modules/@fontsource/barlow/files/barlow-latin-400-normal.woff2')).toString('base64');
const display = (await readFile('node_modules/@fontsource/barlow-condensed/files/barlow-condensed-latin-700-normal.woff2')).toString('base64');
const sculpture = (await readFile('public/forma/playground-poster.svg')).toString('base64');
const browser = await chromium.launch();
try {
 const page = await browser.newPage({ viewport: { width: 1200, height: 630 }, deviceScaleFactor: 1 });
 await page.setContent(`<!doctype html><html lang="en"><style>
 @font-face{font-family:Barlow;src:url(data:font/woff2;base64,${sans})}@font-face{font-family:Display;src:url(data:font/woff2;base64,${display});font-weight:700}
 *{box-sizing:border-box}body{margin:0;background:#101115;color:#f1f0e8;font-family:Barlow;padding:38px 50px}header{display:flex;align-items:center;gap:25px;font-size:13px;letter-spacing:1px}header strong{font-size:36px;letter-spacing:-2px}header span{color:#d5ff5f}main{position:relative}h1{font:700 117px/.88 Display;letter-spacing:-2px;margin:50px 0 24px;position:relative;z-index:2}h1 span{color:transparent;-webkit-text-stroke:1px #f1f0e8}img{position:absolute;right:-45px;top:-55px;width:650px;height:550px}footer{position:relative;z-index:3;font-size:16px;color:#b9b9c5}small{display:block;font-size:11px;letter-spacing:1px;margin-top:18px;color:#d5ff5f}
 </style><body><header><strong>rg<span>✳</span></strong><span>THE WORLD OF RITVIK GOYAL</span></header><main><img src="data:image/svg+xml;base64,${sculpture}" alt=""><h1>MAKE<br>SOMETHING<br><span>MATTER.</span></h1></main><footer>Code is my medium. Curiosity is the whole point.<small>SOFTWARE DEVELOPER · SHOPIFY DEV DEGREE · TORONTO</small></footer></body></html>`);
 await page.evaluate(() => document.fonts.ready);
 await page.screenshot({ path: 'public/social-card.png' });
} finally { await browser.close(); }
