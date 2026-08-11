'use strict';
const path = require('path');
const { chromium } = require(path.join('c:/Trường học số - source code/prj-gkebook-shadcn-frontend/node_modules/playwright'));
(async () => {
  const b = await chromium.launch({ headless: true });
  const pg = await b.newPage({ viewport: { width: 1280, height: 720 } });
  const errs = []; pg.on('pageerror', e => errs.push(e.message));
  await pg.goto('file:///' + path.resolve(__dirname, '..', 'xuong-lap-te-bao.html').split(path.sep).join('/'));
  await pg.waitForTimeout(400);
  await pg.evaluate(() => window.__goScreen('dien'));
  await pg.waitForTimeout(400);
  await pg.click('.djoin-row .btn');
  await pg.waitForTimeout(300);
  const dump = () => pg.evaluate(() => ({ ...window.__dstate(), npc: window.__npc ? window.__npc() : null }));
  console.log('sau join:', JSON.stringify(await dump()));

  await pg.locator('[data-act="br"][data-b="B"]').click({ force: true });
  await pg.waitForTimeout(3000);
  console.log('sau nhờ giữ B +3s:', JSON.stringify(await dump()));

  await pg.click('#dboard .chip[data-tool="fuse"]');
  await pg.waitForTimeout(3000);
  console.log('sau lấy cầu chì +3s:', JSON.stringify(await dump()));

  await pg.locator('[data-comp="fuseB"]').click({ force: true });
  await pg.waitForTimeout(3500);
  console.log('sau thay +3.5s:', JSON.stringify(await dump()));

  await pg.locator('[data-act="br"][data-b="B"]').click({ force: true });
  await pg.waitForTimeout(3500);
  console.log('sau buông +3.5s:', JSON.stringify(await dump()));
  console.log(errs.length ? 'ERR ' + errs.join('|') : 'no errors');
  await b.close();
})();
