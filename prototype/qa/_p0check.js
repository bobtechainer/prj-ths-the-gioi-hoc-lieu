'use strict';
const path = require('path');
const { chromium } = require(path.join('c:/Trường học số - source code/prj-gkebook-shadcn-frontend/node_modules/playwright'));
(async () => {
  const b = await chromium.launch({ headless: true });
  const pg = await b.newPage({ viewport: { width: 1280, height: 720 } });
  const errors = [];
  pg.on('pageerror', e => errors.push(e.message));
  const url = 'file:///' + path.resolve(__dirname, '..', 'xuong-lap-te-bao.html').replace(/\\/g, '/');
  await pg.goto(url);
  await pg.evaluate(() => window.__goScreen('play'));
  await pg.waitForTimeout(300);
  let pass = 0, fail = 0;
  const t = (n, ok, x = '') => { ok ? pass++ : fail++; console.log((ok ? '  ok  ' : '  FAIL ') + n + (x ? ' :: ' + x : '')); };

  // 1. Chạm-không-kéo vào chip → thẻ thông tin hiện, KHÔNG đặt gì
  const chip = await pg.locator('.chip[data-org="tithe"]').boundingBox();
  await pg.mouse.click(chip.x + chip.width / 2, chip.y + chip.height / 2);
  await pg.waitForTimeout(150);
  const infoOn = await pg.evaluate(() => document.getElementById('infocard').classList.contains('on'));
  let st = await pg.evaluate(() => window.__state());
  t('chạm chip → thẻ thông tin hiện, không đặt gì', infoOn && !Object.values(st.pads).includes('tithe'));

  // 2. P0-1: kéo Ti thể vào Ô NGUỒN (S1) khi thẻ thông tin ĐANG MỞ
  const s1 = await pg.evaluate(() => window.__screenPos('S1'));
  await pg.mouse.move(chip.x + chip.width / 2, chip.y + chip.height / 2);
  await pg.mouse.down();
  let hiddenWhileDrag = false;
  for (let i = 1; i <= 14; i++) {
    await pg.mouse.move(chip.x + (s1.x - chip.x) * i / 14, chip.y + (s1.y - chip.y) * i / 14);
    if (i === 10) hiddenWhileDrag = await pg.evaluate(() => getComputedStyle(document.getElementById('infocard')).display === 'none');
  }
  await pg.mouse.up();
  await pg.waitForTimeout(150);
  st = await pg.evaluate(() => window.__state());
  t('P0-1: kéo Ti thể vào Ô NGUỒN thành công', st.pads.S1 === 'tithe', JSON.stringify(st.pads));
  t('P0-1: thẻ thông tin ẩn trong lúc kéo', hiddenWhileDrag);

  // 3. Escape giữa lúc kéo → ghost tắt; chạm pad sau đó không đặt lén
  const chip2 = await pg.locator('.chip[data-org="lyso"]').boundingBox();
  await pg.mouse.move(chip2.x + 20, chip2.y + 20); await pg.mouse.down();
  await pg.mouse.move(600, 300, { steps: 6 });
  await pg.keyboard.press('Escape');
  await pg.mouse.move(700, 350);
  const ghostGone = await pg.evaluate(() => getComputedStyle(document.getElementById('ghost')).display === 'none');
  await pg.mouse.up();
  t('Escape giữa kéo → ghost tắt', ghostGone);
  const p2 = await pg.evaluate(() => window.__screenPos('P2'));
  await pg.mouse.click(p2.x, p2.y);
  await pg.waitForTimeout(100);
  st = await pg.evaluate(() => window.__state());
  t('sau Escape, chạm pad không đặt lén chip cũ', st.pads.P2 === null, JSON.stringify(st.pads));

  // 4. Thắng thật ở chế độ auto (đồng hồ thật) rồi "Chơi lại" dọn sạch
  await pg.evaluate(() => { window.__place('P1', 'ribo'); window.__place('P2', 'lnc'); window.__place('P3', 'golgi'); window.__place('P4', 'tuiti'); });
  await pg.click('#btnRun');
  await pg.waitForFunction(() => window.__state().done, null, { timeout: 60000 });
  await pg.waitForTimeout(1200);          // doneTimer 900ms
  const sheetShown = await pg.evaluate(() => document.getElementById('scr-play').classList.contains('done-mode'));
  const doneTime = await pg.evaluate(() => document.getElementById('thTime').textContent);
  await pg.evaluate(() => { for (const b of document.querySelectorAll('#theory .btn')) if (b.textContent.includes('Làm lại')) b.click(); });
  await pg.waitForTimeout(250);
  st = await pg.evaluate(() => window.__state());
  t('auto thắng thật → bảng lý thuyết hiện TẠI CHỖ, giờ từ sim (' + doneTime + ')', sheetShown && /giây|phút/.test(doneTime) && doneTime !== '0 giây');
  t('Làm lại → dọn sạch, bảng lý thuyết đóng', st.out === 0 && st.screen === 'play', JSON.stringify({ out: st.out, screen: st.screen }));

  t('không lỗi console/page', errors.length === 0, errors.join('|'));
  console.log(`\n${pass} pass, ${fail} fail`);
  await b.close();
  process.exit(fail ? 1 : 0);
})();
