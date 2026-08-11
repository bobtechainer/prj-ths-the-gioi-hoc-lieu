// Kiểm tra kéo-thả thật bằng pointer (S10, S11) + khung dọc mobile (S16)
'use strict';
const path = require('path');
const { chromium } = require(path.join('c:/Trường học số - source code/prj-gkebook-shadcn-frontend/node_modules/playwright'));

(async () => {
  const b = await chromium.launch({ headless: true });
  const pg = await b.newPage({ viewport: { width: 1280, height: 720 } });
  const errors = [];
  pg.on('pageerror', e => errors.push('pageerror: ' + e.message));
  pg.on('console', m => { if (m.type() === 'error') errors.push('console: ' + m.text()); });
  const url = 'file:///' + path.resolve(__dirname, '..', 'xuong-lap-te-bao.html').replace(/\\/g, '/');
  await pg.goto(url);
  await pg.evaluate(() => window.__goScreen('play'));
  await pg.waitForTimeout(300);

  let pass = 0, fail = 0;
  const t = (name, ok, extra='') => { ok ? pass++ : fail++; console.log((ok?'  ok  ':'  FAIL ') + name + (extra?' :: '+extra:'')); };

  // S10a: kéo chip Ribosome → thả vào TRẠM 1
  const chip = await pg.locator('.chip[data-org="ribo"]').boundingBox();
  const p1 = await pg.evaluate(() => window.__screenPos('P1'));
  await pg.mouse.move(chip.x + chip.width/2, chip.y + chip.height/2);
  await pg.mouse.down();
  for (let i = 1; i <= 12; i++)
    await pg.mouse.move(chip.x + (p1.x - chip.x) * i/12, chip.y + (p1.y - chip.y) * i/12);
  await pg.mouse.up();
  await pg.waitForTimeout(150);
  let st = await pg.evaluate(() => window.__state());
  t('S10a kéo Ribosome vào TRẠM 1 bằng chuột thật', st.pads.P1 === 'ribo', JSON.stringify(st.pads));

  // S10b: chip đã dùng phải mờ (class used)
  const usedClass = await pg.evaluate(() => document.querySelector('.chip[data-org="ribo"]').classList.contains('used'));
  t('S10b chip đã dùng mờ đi', usedClass);

  // S10c: thả ra chỗ trống → không đặt, không lỗi
  const chip2 = await pg.locator('.chip[data-org="lyso"]').boundingBox();
  await pg.mouse.move(chip2.x + 20, chip2.y + 20);
  await pg.mouse.down();
  await pg.mouse.move(640, 120, { steps: 8 });   // giữa sàn, không phải pad
  await pg.mouse.up();
  await pg.waitForTimeout(120);
  st = await pg.evaluate(() => window.__state());
  t('S10c thả ngoài pad → về khay', !Object.values(st.pads).includes('lyso'));

  // S11: chạm trạm đã đặt → gỡ (khi đang chạy)
  await pg.evaluate(() => window.__setRun(true));
  await pg.waitForTimeout(400);
  const p1pos = await pg.evaluate(() => window.__screenPos('P1'));
  await pg.mouse.click(p1pos.x, p1pos.y);
  await pg.waitForTimeout(150);
  st = await pg.evaluate(() => window.__state());
  t('S11 chạm trạm → gỡ về khay khi đang chạy', st.pads.P1 === null, JSON.stringify(st.pads));

  // spam click không lỗi
  for (let i = 0; i < 12; i++) await pg.mouse.click(300 + i*30, 300);
  t('spam click không lỗi console', errors.length === 0, errors.join(' | '));

  // S16: khung dọc điện thoại
  await pg.setViewportSize({ width: 390, height: 844 });
  await pg.waitForTimeout(300);
  await pg.screenshot({ path: '_shot-6-mobile.png' });
  const overflow = await pg.evaluate(() => document.body.scrollWidth > window.innerWidth + 2);
  t('S16 mobile không tràn ngang', !overflow);

  console.log(`\n${pass} pass, ${fail} fail`);
  console.log(errors.length ? 'ERRORS:\n' + errors.join('\n') : 'no console/page errors');
  await b.close();
  process.exit(fail ? 1 : 0);
})();
