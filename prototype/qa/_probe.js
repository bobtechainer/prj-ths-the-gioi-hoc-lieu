// Probe số liệu cho sim-core — chạy: node _probe.js
// Tự bốc <script id="sim-core"> từ HTML (một nguồn sự thật, không nuôi bản sao).
'use strict';
const fs = require('fs'), path = require('path');
const html = fs.readFileSync(path.join(__dirname, '..', 'xuong-lap-te-bao.html'), 'utf8');
const core = html.match(/<script id="sim-core">([\s\S]*?)<\/script>/)[1];
fs.writeFileSync(path.join(__dirname, '_core.js'), core);
const SIM = require('./_core.js');

let pass = 0, fail = 0;
const t = (name, fn) => {
  try { fn(); pass++; console.log('  ok  ' + name); }
  catch (e) { fail++; console.log('  FAIL ' + name + ' :: ' + e.message); }
};
const assert = (c, m) => { if (!c) throw new Error(m); };

const CORRECT = { P1:'ribo', P2:'lnc', P3:'golgi', P4:'tuiti', S1:'tithe' };
const build = (pads) => { const s = SIM.create(); for (const p in pads) SIM.place(s, p, pads[p]); return s; };

t('S02 nhân sinh kiện mARN theo chu kỳ khi chạy, kind hợp lệ', () => {
  const s = build({}); SIM.setRun(s, true);
  SIM.step(s, 5);
  const snap = SIM.snapshot(s);
  assert(snap.parcels.length >= 2, 'không sinh kiện: ' + snap.parcels.length);
  assert(snap.parcels.every(p => p.kind in SIM.KINDS), 'kind lạ: ' + JSON.stringify(snap.parcels.map(p=>p.kind)));
  const s2 = build({});
  SIM.step(s2, 5);
  assert(SIM.snapshot(s2).parcels.length === 0, 'sinh kiện khi chưa chạy');
});

t('S03 kiện dồn ứ trước pad trống', () => {
  const s = build({}); SIM.setRun(s, true);
  SIM.step(s, 12);
  const snap = SIM.snapshot(s);
  assert(snap.queues.P1 >= 3, 'phải ứ ≥3 trước P1, được ' + snap.queues.P1);
  assert(snap.parcels.every(p => p.seg === 0), 'kiện vượt qua pad trống!');
});

t('S04 trạm biến đổi đúng loại kiện', () => {
  const s = build(CORRECT); SIM.setRun(s, true);
  SIM.step(s, 4);
  const kinds = new Set(SIM.snapshot(s).parcels.map(p => p.kind));
  SIM.step(s, 6);
  SIM.snapshot(s).parcels.forEach(p => kinds.add(p.kind));
  assert(kinds.has('tho'), 'không thấy chuỗi thô sau ribosome');
  assert(kinds.has('gap') || kinds.has('goi'), 'không thấy protein gấp/gói ở hạ nguồn');
});

t('S05 không Ti thể → ứ + không xuất; cắm Ti thể → chạy lại', () => {
  const pads = { ...CORRECT }; delete pads.S1;
  const s = build(pads); SIM.setRun(s, true);
  SIM.step(s, 10);
  let snap = SIM.snapshot(s);
  assert(!snap.powered, 'powered phải false');
  assert(snap.queues.P1 >= 2, 'kiện phải ứ trước ribo, được ' + snap.queues.P1);
  assert(snap.out === 0, 'không được xuất kiện khi mất điện');
  SIM.place(s, 'S1', 'tithe');
  SIM.step(s, 14);
  snap = SIM.snapshot(s);
  assert(snap.powered && snap.out >= 1, 'phải xuất được kiện sau khi có điện, out=' + snap.out);
});

t('S05b RÚT điện giữa lúc trạm đang biến đổi → máy đứng, có điện lại → chạy tiếp', () => {
  const s = build(CORRECT); SIM.setRun(s, true);
  SIM.step(s, 3.5);                       // kiện 1 đang transform tại ribo
  const inTransform = SIM.snapshot(s).parcels.some(p => p.phase === 'transform');
  assert(inTransform, 'setup: phải có kiện đang biến đổi');
  SIM.remove(s, 'S1');
  SIM.step(s, 2);
  const frozen = SIM.snapshot(s).parcels.find(p => p.phase === 'transform' && p.seg === 0);
  assert(frozen, 'kiện phải đứng yên trong máy khi mất điện, không tự xong');
  SIM.place(s, 'S1', 'tithe');
  SIM.step(s, 2);
  assert(SIM.snapshot(s).parcels.some(p => p.seg >= 1) , 'có điện lại phải chạy tiếp');
});

t('S06 xếp đúng 5 trạm → đủ 8 kiện → done, và DỪNG Ở ĐÚNG 8', () => {
  const s = build(CORRECT); SIM.setRun(s, true);
  SIM.step(s, 90);
  const snap = SIM.snapshot(s);
  assert(snap.done === true, 'done phải true');
  assert(snap.out === SIM.WIN, 'hết ca phải dừng ở đúng ' + SIM.WIN + ', được ' + snap.out);
  assert(snap.running === false, 'hết ca sim phải tự dừng');
});

t('S07 lysosome vào S2 giết nhân; gỡ ra → hồi; ở pad khác vô hại', () => {
  const s = build(CORRECT); SIM.setRun(s, true);
  SIM.place(s, 'S2', 'lyso');
  SIM.step(s, 2);
  assert(!SIM.snapshot(s).nucleusAlive, 'nhân phải chết sau 1.5s');
  const nBefore = SIM.snapshot(s).parcels.length + SIM.snapshot(s).out;
  SIM.step(s, 30);
  const after = SIM.snapshot(s);
  assert(after.parcels.length + after.out <= nBefore, 'nhân chết vẫn sinh kiện mới');
  SIM.remove(s, 'S2');
  SIM.step(s, 1.5);
  assert(SIM.snapshot(s).nucleusAlive, 'nhân phải hồi sau khi gỡ');
  const s2 = build({ P1:'lyso' }); SIM.setRun(s2, true);
  SIM.step(s2, 3);
  assert(SIM.snapshot(s2).nucleusAlive, 'lyso ngoài S2 không được giết nhân');
});

t('S08 sai thứ tự (Golgi ở P1) → ứ trước P1, không crash, không deadlock', () => {
  const s = build({ P1:'golgi', P2:'ribo', P3:'lnc', P4:'tuiti', S1:'tithe' });
  SIM.setRun(s, true);
  SIM.step(s, 30);
  const snap = SIM.snapshot(s);
  assert(snap.queues.P1 >= 3, 'kiện phải ứ trước Golgi đặt nhầm');
  assert(snap.out === 0, 'không được xuất khi thứ tự sai');
  assert(snap.parcels.length <= 9, 'vượt trần MAX_LIVE');
});

t('S11b GỠ trạm đúng lúc kiện đang biến đổi → không TypeError, kiện về hàng chờ', () => {
  const s = build({ P1:'ribo', S1:'tithe' }); SIM.setRun(s, true);
  SIM.step(s, 3.5);                       // kiện 1 vào máy ribo
  assert(SIM.snapshot(s).parcels.some(p => p.phase === 'transform'), 'setup: cần kiện đang biến đổi');
  SIM.remove(s, 'P1');                    // gỡ trạm ngay lúc đó
  SIM.step(s, 5);                         // trước đây: TypeError reading "ra" mỗi substep
  const snap = SIM.snapshot(s);
  assert(snap.parcels.every(p => p.phase !== 'transform'), 'kiện kẹt trong máy đã gỡ');
  assert(snap.queues.P1 >= 1, 'kiện phải quay về hàng chờ trước pad');
  SIM.place(s, 'P1', 'ribo');             // đặt lại → phải tiêu hoá được hàng chờ
  SIM.step(s, 5);
  assert(SIM.snapshot(s).parcels.some(p => p.seg >= 1), 'đặt lại trạm phải xử lý tiếp hàng chờ');
});

t('S17 sản lượng == số kiện exit (đếm qua events)', () => {
  const s = build(CORRECT); SIM.setRun(s, true);
  let exits = 0;
  for (let i = 0; i < 240; i++){
    SIM.step(s, 0.25);
    exits += SIM.drainEvents(s).filter(e => e.type === 'exit').length;
  }
  const snap = SIM.snapshot(s);
  assert(snap.out === exits, `out=${snap.out} nhưng đếm exit event=${exits}`);
});

t('S18 tất định: hai lần chạy giống nhau byte-một', () => {
  const runOnce = () => {
    const s = build({}); SIM.setRun(s, true);
    SIM.step(s, 3); SIM.place(s, 'P1', 'ribo'); SIM.place(s, 'S1', 'tithe');
    SIM.step(s, 4.37); SIM.place(s, 'P2', 'lnc'); SIM.place(s, 'P3', 'golgi'); SIM.place(s, 'P4', 'tuiti');
    SIM.step(s, 21.11);
    SIM.drainEvents(s);
    return JSON.stringify(SIM.snapshot(s));
  };
  assert(runOnce() === runOnce(), 'hai lần chạy khác nhau');
});

t('S19 fuzz 200 cách xếp: không crash, không NaN, không kẹt', () => {
  let seed = 42;
  const rnd = () => (seed = (seed * 1103515245 + 12345) & 0x7fffffff) / 0x7fffffff;
  const orgIds = Object.keys(SIM.ORGS);
  for (let trial = 0; trial < 200; trial++){
    const s = SIM.create(); SIM.setRun(s, true);
    const shuffled = [...orgIds].sort(() => rnd() - 0.5);
    SIM.PADS.forEach((pad, i) => { if (rnd() < 0.8 && shuffled[i]) SIM.place(s, pad, shuffled[i]); });
    SIM.step(s, 60);
    const snap = SIM.snapshot(s);
    const json = JSON.stringify(snap);
    assert(!/NaN|Infinity/.test(json), 'NaN/Infinity ở trial ' + trial);
    assert(snap.parcels.length <= 9, 'vượt trần kiện ở trial ' + trial);
    assert(snap.parcels.every(p => p.kind in SIM.KINDS), 'kind hỏng ở trial ' + trial);
    for (const p of snap.parcels) assert(p.pos >= 0 && p.pos <= 1 && p.seg >= 0 && p.seg <= 4, 'kiện lạc toạ độ ở trial ' + trial);
  }
});

t('S20b __step(0) không được tiến thời gian (contract render-only)', () => {
  const s = build({}); SIM.setRun(s, true);
  SIM.step(s, 0);
  assert(SIM.snapshot(s).t === 0, '__step(0) đã tiến t=' + SIM.snapshot(s).t);
});

t('S13b runT chỉ đếm lúc ca đang chạy — nguồn cho đồng hồ màn chốt', () => {
  const s = build(CORRECT);
  SIM.step(s, 5);                          // chưa chạy: runT đứng im
  assert(SIM.snapshot(s).runT === 0, 'runT phải 0 khi chưa chạy');
  SIM.setRun(s, true);
  SIM.step(s, 90);
  let snap = SIM.snapshot(s);
  assert(snap.done, 'phải xong ca');
  assert(snap.runT > 0 && snap.runT < 60, 'runT vô lý: ' + snap.runT);
  const frozen = snap.runT;
  SIM.step(s, 10);                         // hết ca rồi: runT phải đóng băng
  snap = SIM.snapshot(s);
  assert(snap.runT === frozen, `runT trôi sau khi hết ca: ${snap.runT} != ${frozen}`);
});

console.log(`\n${pass} pass, ${fail} fail`);
process.exit(fail ? 1 : 0);
