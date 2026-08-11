// Chụp bản đồ ở hai giai đoạn cây của Mầm + màn lý thuyết tại chỗ
'use strict';
const path = require('path');
const { chromium } = require(path.join('c:/Trường học số - source code/prj-gkebook-shadcn-frontend/node_modules/playwright'));
(async () => {
  const b = await chromium.launch({ headless: true });
  const pg = await b.newPage({ viewport: { width: 1280, height: 720 } });
  const errs = [];
  pg.on('pageerror', e => errs.push('pageerror: ' + e.message));
  pg.on('console', m => { if (m.type() === 'error') errs.push('console: ' + m.text()); });

  const url = 'file:///' + path.resolve(__dirname, '..', 'xuong-lap-te-bao.html').replace(/\\/g, '/');
  await pg.goto(url);
  await pg.waitForTimeout(350);
  await pg.screenshot({ path: path.join(__dirname, '_map-stage1.png') });

  await pg.evaluate(() => window.__goScreen('play'));
  await pg.evaluate(() => {
    window.__place('P1', 'ribo'); window.__place('P2', 'lnc');
    window.__place('P3', 'golgi'); window.__place('P4', 'tuiti');
    window.__place('S1', 'tithe'); window.__setRun(true); window.__step(45);
  });
  await pg.waitForTimeout(350);
  await pg.screenshot({ path: path.join(__dirname, '_play-done.png') });

  await pg.evaluate(() => window.__goScreen('map'));
  await pg.waitForTimeout(350);
  await pg.screenshot({ path: path.join(__dirname, '_map-stage2.png') });

  const st = await pg.evaluate(() => window.__state());
  console.log('mamStage:', st.mamStage, '| screen:', st.screen, '| out:', st.out);
  console.log(errs.length ? 'ERRORS:\n' + errs.join('\n') : 'no console/page errors');
  await b.close();
})();
