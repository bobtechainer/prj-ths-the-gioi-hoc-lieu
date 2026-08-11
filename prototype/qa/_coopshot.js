// Co-op 2 người: P2 vào bằng phím, giữ cầu dao bằng cách ĐỨNG lên nó
'use strict';
const path = require('path');
const { chromium } = require(path.join('c:/Trường học số - source code/prj-gkebook-shadcn-frontend/node_modules/playwright'));
(async () => {
  const b = await chromium.launch({ headless: true });
  const pg = await b.newPage({ viewport: { width: 1280, height: 720 } });
  const errs = []; pg.on('pageerror', e => errs.push(e.message)); pg.on('console', m => { if (m.type() === 'error') errs.push(m.text()); });
  const shot = n => pg.screenshot({ path: path.join(__dirname, `_coop-${n}.png`) });
  await pg.goto('file:///' + path.resolve(__dirname, '..', 'xuong-lap-te-bao.html').split(path.sep).join('/'));
  await pg.waitForTimeout(400);
  await pg.evaluate(() => window.__goScreen('dien'));
  await pg.waitForTimeout(400);
  await shot('1-join');

  // khoảnh khắc Pico Park: bấm phím bất kỳ là người 2 nhảy vào
  await pg.keyboard.press('a');
  await pg.waitForTimeout(400);
  await shot('2-both-in');

  // P1 (chuột) lấy cầu chì trước
  await pg.click('#dboard .chip[data-tool="fuse"]');
  await pg.waitForFunction(() => window.__dstate().carry === 'fuse', null, { timeout: 9000 });

  // P2 (phím) chạy tới ĐỨNG GIỮ cầu dao B — giữ phím để đi
  await pg.keyboard.down('ArrowRight');
  await pg.waitForTimeout(800);
  await pg.keyboard.up('ArrowRight');
  await pg.keyboard.down('ArrowDown');
  await pg.waitForTimeout(200);
  await pg.keyboard.up('ArrowDown');
  // tinh chỉnh tới zone (430, 376): đi từng nhịp ngắn tới khi br.B ngắt
  for (let i = 0; i < 30; i++){
    const st = await pg.evaluate(() => window.__dstate());
    if (!st.br.B) break;
    const pos = await pg.evaluate(() => ({ x: window.__p2 ? window.__p2().x : 0, y: window.__p2 ? window.__p2().y : 0 }));
    const key = Math.abs(pos.x - 430) > 20 ? (pos.x > 430 ? 'ArrowLeft' : 'ArrowRight')
              : (pos.y > 376 ? 'ArrowUp' : 'ArrowDown');
    await pg.keyboard.down(key); await pg.waitForTimeout(140); await pg.keyboard.up(key);
  }
  const held = await pg.evaluate(() => window.__dstate().br.B === false);
  console.log('P2 giữ được cầu dao B:', held);
  await shot('3-p2-holding');

  // P1 thay cầu chì trong lúc P2 giữ
  await pg.locator('[data-comp="fuseB"]').click({ force: true });
  await pg.waitForFunction(() => window.__dstate().swaps === 1, null, { timeout: 12000 });
  // P2 rời ra → lò xo tự đóng → phố sáng
  await pg.keyboard.down('ArrowLeft'); await pg.waitForTimeout(700); await pg.keyboard.up('ArrowLeft');
  await pg.waitForFunction(() => window.__dstate().win === true, null, { timeout: 12000 });
  await pg.waitForTimeout(1300);
  await shot('4-coop-win');
  const st = await pg.evaluate(() => window.__dstate());
  console.log('kết quả co-op:', JSON.stringify({ lit: st.lit, win: st.win, zaps: st.zaps }));
  console.log(errs.length ? 'ERRORS:\n' + errs.join('\n') : 'no console/page errors');
  await b.close();
  process.exit(errs.length ? 1 : 0);
})();
