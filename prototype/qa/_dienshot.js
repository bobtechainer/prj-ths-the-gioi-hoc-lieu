'use strict';
const path = require('path');
const { chromium } = require(path.join('c:/Trường học số - source code/prj-gkebook-shadcn-frontend/node_modules/playwright'));
(async () => {
  const b = await chromium.launch({ headless: true });
  const pg = await b.newPage({ viewport: { width: 1280, height: 720 } });
  const errs = [];
  pg.on('pageerror', e => errs.push('pageerror: ' + e.message));
  pg.on('console', m => { if (m.type() === 'error') errs.push('console: ' + m.text()); });
  const shot = n => pg.screenshot({ path: path.join(__dirname, `_dien-${n}.png`) });
  await pg.goto('file:///' + path.resolve(__dirname, '..', 'xuong-lap-te-bao.html').split(path.sep).join('/'));
  await pg.waitForTimeout(500);
  await shot('0-topic-mix');

  // thẻ 2 trong carousel giờ phải là Vật lý (xen kẽ) — lật sang và vào
  await pg.click('#hero-next');
  await pg.waitForTimeout(800);
  await shot('1-topic-dien');
  await pg.click('#hero-go');
  await pg.waitForFunction(() => window.__state().screen === 'map', null, { timeout: 6000 });
  await pg.waitForTimeout(400);
  await shot('2-garden');
  await pg.evaluate(() => UI.gardenGo('dien'));
  await pg.waitForFunction(() => window.__state().screen === 'dien', null, { timeout: 9000 });
  await pg.waitForTimeout(600);
  await shot('3-pho-toi');

  // 1) cầm bút thử, đo sau cầu chì B (ca 0 hỏng cầu chì B) → mất điện
  await pg.click('#dboard .chip[data-tool="but"]');
  await pg.waitForFunction(() => window.__dstate() && window.__dstate().carry === 'but', null, { timeout: 8000 });
  await pg.locator('[data-tp="sauBr:B"]').click({ force: true });
  await pg.waitForFunction(() => window.__dstate().probes === 1, null, { timeout: 8000 });
  await pg.locator('[data-tp="sauFuse:B"]').click({ force: true });
  await pg.waitForFunction(() => window.__dstate().probes === 2, null, { timeout: 8000 });
  await pg.waitForTimeout(400);
  await shot('4-do-dien');

  // 2) thử thay khi CHƯA ngắt điện → bị giật (hậu quả, không hỏng gì)
  await pg.click('#dboard .chip[data-tool="fuse"]');
  await pg.waitForFunction(() => window.__dstate().carry === 'fuse', null, { timeout: 8000 });
  await pg.locator('[data-comp="fuseB"]').click({ force: true });
  await pg.waitForFunction(() => window.__dstate().zaps === 1, null, { timeout: 8000 });
  await pg.waitForTimeout(300);
  await shot('5-bi-giat');

  // 3) ngắt cầu dao B → thay → bật lại → cả phố sáng
  await pg.locator('[data-act="br"][data-b="B"]').click({ force: true });
  await pg.waitForFunction(() => window.__dstate().br.B === false, null, { timeout: 8000 });
  await pg.locator('[data-comp="fuseB"]').click({ force: true });
  await pg.waitForFunction(() => window.__dstate().swaps === 1, null, { timeout: 8000 });
  await pg.locator('[data-act="br"][data-b="B"]').click({ force: true });
  await pg.waitForFunction(() => window.__dstate().win === true, null, { timeout: 8000 });
  await pg.waitForTimeout(1300);
  await shot('6-thang-lythuyet');
  const st = await pg.evaluate(() => ({ d: window.__dstate(), s: window.__state().screen, mam: window.__state().mamStage }));
  console.log('kết quả:', JSON.stringify({ lit: st.d.lit, win: st.d.win, zaps: st.d.zaps, screen: st.s, mamStage: st.mam }));
  console.log(errs.length ? 'ERRORS:\n' + errs.join('\n') : 'no console/page errors');
  await b.close();
  process.exit(errs.length ? 1 : 0);
})();
