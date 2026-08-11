// Smoke test trọn luồng 4 màn — node qa/_flowshot.js
'use strict';
const path = require('path');
const { chromium } = require(path.join('c:/Trường học số - source code/prj-gkebook-shadcn-frontend/node_modules/playwright'));
(async () => {
  const b = await chromium.launch({ headless: true });
  const pg = await b.newPage({ viewport: { width: 1280, height: 720 } });
  const errs = [];
  pg.on('pageerror', e => errs.push('pageerror: ' + e.message));
  pg.on('console', m => { if (m.type() === 'error') errs.push('console: ' + m.text()); });
  const shot = n => pg.screenshot({ path: path.join(__dirname, `_flow-${n}.png`) });

  await pg.goto('file:///' + path.resolve(__dirname, '..', 'xuong-lap-te-bao.html').replace(/\\/g, '/'));
  await pg.waitForTimeout(350);
  await shot('1-topic');

  // ① lọc môn rồi chọn thẻ có game mẫu
  await pg.click('.subchip:nth-child(2)');            // Sinh học
  await pg.waitForTimeout(200);
  await shot('2-topic-sinh');
  await pg.click('.tcard');
  await pg.waitForTimeout(500);
  await shot('4-garden');

  // ③ chạm đất để Mầm đi, rồi chạm nhà bài học
  await pg.mouse.click(640, 300);
  await pg.waitForTimeout(700);
  await shot('5-garden-walk');
  await pg.evaluate(() => UI.gardenGo('lab'));
  await pg.waitForFunction(() => window.__state().screen === 'play', null, { timeout: 8000 });
  await pg.waitForTimeout(400);
  await shot('6-play-empty');

  // ④ chạm chip → Mầm đi lấy máy → chạm trạm → Mầm mang tới đặt
  await pg.click('.chip[data-org="ribo"]');
  await pg.waitForTimeout(1600);
  await shot('7-carrying');
  const p1 = await pg.evaluate(() => window.__screenPos('P1'));
  await pg.mouse.click(p1.x, p1.y);
  await pg.waitForTimeout(2200);
  await shot('8-placed');
  let st = await pg.evaluate(() => window.__state());
  console.log('sau khi đặt ribo:', JSON.stringify(st.pads));

  // đặt nốt bằng cách chơi thật qua tap
  for (const [org, pad] of [['tithe','S1'], ['lnc','P2'], ['golgi','P3'], ['tuiti','P4']]){
    await pg.click(`.chip[data-org="${org}"]`);
    const pp = await pg.evaluate((p) => window.__screenPos(p), pad);
    await pg.mouse.click(pp.x, pp.y);      // bấm ngay khi Mầm còn đang chạy — phải tự nhớ việc
    await pg.waitForFunction(([o, pd]) => window.__state().pads[pd] === o, [org, pad], { timeout: 15000 });
  }
  st = await pg.evaluate(() => window.__state());
  console.log('đủ máy:', JSON.stringify(st.pads));
  await pg.click('#btnRun');
  await pg.waitForFunction(() => window.__state().done, null, { timeout: 60000 });
  await pg.waitForTimeout(1300);
  await shot('9-theory');
  st = await pg.evaluate(() => window.__state());
  console.log('kết quả:', JSON.stringify({ screen: st.screen, out: st.out, mamStage: st.mamStage }));
  console.log(errs.length ? 'ERRORS:\n' + errs.join('\n') : 'no console/page errors');
  await b.close();
  process.exit(errs.length ? 1 : 0);
})();
