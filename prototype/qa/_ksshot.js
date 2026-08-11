// Smoke game 3: mở manh mối → bật lớp → cắm sai một lần (thấy hậu quả) → cắm đúng → thắng
'use strict';
const path = require('path');
const { chromium } = require(path.join('c:/Trường học số - source code/prj-gkebook-shadcn-frontend/node_modules/playwright'));
(async () => {
  const b = await chromium.launch({ headless: true });
  const pg = await b.newPage({ viewport: { width: 1280, height: 720 } });
  const errs = []; pg.on('pageerror', e => errs.push(e.message)); pg.on('console', m => { if (m.type() === 'error') errs.push(m.text()); });
  const shot = n => pg.screenshot({ path: path.join(__dirname, `_ks-${n}.png`) });
  await pg.goto('file:///' + path.resolve(__dirname, '..', 'xuong-lap-te-bao.html').split(path.sep).join('/'));
  await pg.waitForTimeout(400);
  await pg.evaluate(() => window.__goScreen('khaosat'));
  await pg.waitForTimeout(400);
  await shot('1-start');

  // mở đủ 3 manh mối (6 ngày công)
  for (let i = 0; i < 3; i++){
    await pg.click('#kclues button.kclue');
    await pg.waitForTimeout(250);
  }
  let st = await pg.evaluate(() => window.__kstate());
  console.log('sau 3 manh mối:', JSON.stringify(st));

  // bật 2 lớp còn lại
  await pg.click('#klayers .klayer:nth-child(2)');
  await pg.waitForTimeout(200);
  await pg.click('#klayers .klayer:nth-child(3)');
  await pg.waitForTimeout(300);
  await shot('2-layers-clues');

  // cắm SAI trước (ô đồng bằng 1,3 — gần lều) để thấy hậu quả
  await pg.locator('.kcell[data-c="1"][data-r="3"]').click({ force: true });
  await pg.waitForTimeout(400);
  st = await pg.evaluate(() => window.__kstate());
  console.log('sau cắm sai:', JSON.stringify(st));
  await shot('3-camsai');

  // cắm ĐÚNG: mùa 0 (attempt 0 chẵn) đáp án là đồi (2,1)
  await pg.locator('.kcell[data-c="2"][data-r="1"]').click({ force: true });
  await pg.waitForFunction(() => window.__kstate().win === true, null, { timeout: 6000 });
  await pg.waitForTimeout(1300);
  await shot('4-win-theory');
  st = await pg.evaluate(() => ({ k: window.__kstate(), mam: window.__state().mamStage, screen: window.__state().screen }));
  console.log('kết quả:', JSON.stringify(st));
  console.log(errs.length ? 'ERRORS:\n' + errs.join('\n') : 'no console/page errors');
  await b.close();
  process.exit(errs.length ? 1 : 0);
})();
