// Chụp 3 màn canonical — node _shot.js (dùng playwright của prj-gkebook-shadcn-frontend)
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
  await pg.waitForTimeout(400);
  await pg.screenshot({ path: '_shot-1-map.png' });

  // vào chơi, xếp một phần rồi chạy để thấy dồn ứ
  await pg.evaluate(() => { window.__goScreen('play'); });
  await pg.waitForTimeout(200);
  await pg.screenshot({ path: '_shot-2-empty.png' });

  await pg.evaluate(() => {
    window.__place('P1', 'ribo');           // có ribo nhưng CHƯA có điện → pin đỏ + ứ
    window.__setRun(true);
    window.__step(9);
  });
  await pg.waitForTimeout(350);
  await pg.screenshot({ path: '_shot-3-jam.png' });

  await pg.evaluate(() => {
    window.__place('S1', 'tithe');
    window.__place('P2', 'lnc');
    window.__place('P3', 'golgi');
    window.__place('P4', 'tuiti');
    window.__step(12);
  });
  await pg.waitForTimeout(350);
  await pg.screenshot({ path: '_shot-4-running.png' });

  await pg.evaluate(() => { window.__step(40); });
  await pg.waitForTimeout(300);
  await pg.screenshot({ path: '_shot-5-done.png' });

  const st = await pg.evaluate(() => window.__state());
  console.log('state:', JSON.stringify({ screen: st.screen, out: st.out, done: st.done, powered: st.powered, queues: st.queues }));
  console.log(errors.length ? 'ERRORS:\n' + errors.join('\n') : 'no console/page errors');
  await b.close();
})();
