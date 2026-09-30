// Chụp màn bản Gimkit + bắt lỗi runtime — node _gimkit.js
'use strict';
const path = require('path');
const { chromium } = require(path.join('c:/Trường học số - source code/prj-gkebook-shadcn-frontend/node_modules/playwright'));

const sleep = ms => new Promise(r => setTimeout(r, ms));

(async () => {
  const b = await chromium.launch({ headless: true });
  const pg = await b.newPage({ viewport: { width: 1280, height: 720 } });
  const loi = [];
  pg.on('pageerror', e => loi.push('PAGEERROR: ' + e.message));
  pg.on('console', m => { if (m.type() === 'error') loi.push('CONSOLE: ' + m.text()); });

  const url = 'file:///' + path.resolve(__dirname, '..', 'xuong-te-bao-gimkit.html').replace(/\\/g, '/');
  await pg.goto(url);
  await sleep(500);
  await pg.screenshot({ path: '_gk-1-intro.png' });

  // ─── kiểm bản đồ đúng kích thước ───
  const chk = await pg.evaluate(() => {
    const out = {};
    // đọc lại MAP qua nguồn trang vì nó nằm trong closure
    return out;
  });

  // vào xưởng
  await pg.click('#sh-intro .btn.go');
  await sleep(700);
  await pg.screenshot({ path: '_gk-2-xuong.png' });

  // đi tới bàn hỏi (góc trên bên trái) rồi mở câu hỏi
  const diTo = async (keys, ms) => {
    for (const k of keys) await pg.keyboard.down(k);
    await sleep(ms);
    for (const k of keys) await pg.keyboard.up(k);
    await sleep(250);
  };

  // đi tới bàn hỏi bằng cách lái dần, dừng khi nhắc phím bật lên
  let toi = false;
  for (let i = 0; i < 28 && !toi; i++){
    await diTo(['w'], 220);
    toi = await pg.evaluate(() =>
      document.getElementById('prompt').classList.contains('on') &&
      document.getElementById('prompt-txt').textContent.includes('câu hỏi'));
    if (toi) break;
    await diTo(['a'], 120);
    toi = await pg.evaluate(() =>
      document.getElementById('prompt').classList.contains('on') &&
      document.getElementById('prompt-txt').textContent.includes('câu hỏi'));
  }
  await sleep(300);
  await pg.screenshot({ path: '_gk-3-canh-ban-hoi.png' });

  const nhac = await pg.textContent('#prompt-txt').catch(() => '');
  const nhacHien = await pg.evaluate(() => document.getElementById('prompt').classList.contains('on'));

  await pg.keyboard.press('e');
  await sleep(400);
  await pg.screenshot({ path: '_gk-4-cau-hoi.png' });
  const moHoi = await pg.evaluate(() => document.getElementById('sh-dlg').classList.contains('on'));

  // trả lời đúng 8 lần để có đủ năng lượng
  for (let i = 0; i < 8; i++){
    const nut = await pg.$$('#dlg-panel .btn:not(.nhe):not(.go)');
    if (!nut.length){ // đang ở màn kết quả -> bấm "Câu nữa"
      const go = await pg.$('#dlg-panel .btn.go');
      if (go) { await go.click(); await sleep(220); }
      continue;
    }
    // tìm nút đúng bằng cách đọc onclick
    let clicked = false;
    for (const n of nut){
      const oc = await n.getAttribute('onclick');
      if (oc && oc.startsWith('G.dap(1')){ await n.click(); clicked = true; break; }
    }
    if (!clicked) await nut[0].click();
    await sleep(260);
    const go = await pg.$('#dlg-panel .btn.go');
    if (go){
      const t = await go.textContent();
      if (t.includes('Câu nữa') || t.includes('Thử câu khác')){ await go.click(); await sleep(240); }
    }
  }
  const nl = await pg.textContent('#ui-nl');
  await pg.screenshot({ path: '_gk-5-sau-tra-loi.png' });
  await pg.keyboard.press('Escape');
  await sleep(200);

  // lắp cả bốn máy bằng API nội bộ, rồi xem dây chuyền chạy
  await pg.evaluate(() => {
    // nạp thẳng năng lượng và mua đủ bốn máy
    for (const id of ['ribo','lnc','golgi','tithe']) G.mua(id);
  });
  await pg.evaluate(() => {
    G.dong();
    G.lap(1,'ribo'); G.lap(2,'lnc'); G.lap(3,'golgi'); G.lap(4,'tithe');
  });
  await sleep(900);
  await pg.keyboard.press('Escape');
  await sleep(200);
  await pg.screenshot({ path: '_gk-6-day-chuyen-chay.png' });
  const may = await pg.textContent('#ui-may');

  // chờ ra đủ ba gói
  await sleep(9000);
  await pg.screenshot({ path: '_gk-7-ket-qua.png' });
  const sp = await pg.textContent('#ui-sp');
  const thang = await pg.evaluate(() =>
    document.getElementById('dlg-panel').textContent.includes('chạy lại được'));

  // mobile
  const pg2 = await b.newPage({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true });
  pg2.on('pageerror', e => loi.push('MOBILE PAGEERROR: ' + e.message));
  await pg2.goto(url);
  await sleep(400);
  await pg2.click('#sh-intro .btn.go');
  await sleep(600);
  await pg2.screenshot({ path: '_gk-8-mobile.png' });
  const padHien = await pg2.evaluate(() =>
    getComputedStyle(document.getElementById('pad')).display !== 'none');

  console.log(JSON.stringify({
    nhacHien, nhac, moHoi, nangLuongSauTraLoi: nl,
    mayDaLap: may, goiDam: sp, hienManThang: thang, canCamHien: padHien,
    loi
  }, null, 2));

  await b.close();
})().catch(e => { console.error('SCRIPT LỖI:', e.message); process.exit(1); });
