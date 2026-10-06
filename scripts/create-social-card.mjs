import { readFile } from 'node:fs/promises';
import { chromium } from '@playwright/test';
const sans = (await readFile('node_modules/@fontsource-variable/manrope/files/manrope-latin-wght-normal.woff2')).toString('base64');
const serif = (await readFile('node_modules/@fontsource/instrument-serif/files/instrument-serif-latin-400-italic.woff2')).toString('base64');
const browser = await chromium.launch();
try {
  const page = await browser.newPage({ viewport: { width: 1200, height: 630 }, deviceScaleFactor: 1 });
  await page.setContent(`<!doctype html><html lang="en"><style>
@font-face{font-family:Manrope;src:url(data:font/woff2;base64,${sans})} @font-face{font-family:PortfolioSerif;src:url(data:font/woff2;base64,${serif})}
*{box-sizing:border-box}body{margin:0;padding:58px 64px;background:#111310;color:#eeede5;font-family:Manrope}header,footer{display:flex;justify-content:space-between;align-items:center}header{font-size:14px;letter-spacing:2px;color:#c8cabb}header span:last-child{color:#b7a181}main{position:relative;margin:58px 0 38px}h1{font-size:108px;line-height:.97;letter-spacing:-7px;font-weight:400;margin:0}h1 span{display:block;font-family:PortfolioSerif;color:#b7a181;font-weight:400;font-size:122px;letter-spacing:-5px}aside{position:absolute;right:16px;top:25px;width:190px;height:190px;display:grid;place-items:center;border:1px solid #b7a18150;border-radius:50%;font-family:PortfolioSerif;font-size:105px;color:#d0e1b5}aside:before{content:'';position:absolute;inset:27px -14px;border:1px solid #b7a18150;border-radius:50%;transform:rotate(-35deg)}footer{padding-top:30px;border-top:1px solid #dee2cf30;font-size:17px;color:#bdc1b3}footer strong{font-weight:400;color:#eeede5}footer div{line-height:1.7}
</style><body><header><span>SOFTWARE DEVELOPER</span><span>TORONTO, CANADA</span></header><main><h1>Ritvik<span>Goyal.</span></h1><aside>rg.</aside></main><footer><div><strong>Shopify Dev Degree · York University</strong><br>Projects, experience, and a few side quests.</div><span>ritvikgoyal.com ↗</span></footer></body></html>`);
  await page.evaluate(() => document.fonts.ready);
  await page.screenshot({ path: 'public/social-card.png' });
} finally { await browser.close(); }
