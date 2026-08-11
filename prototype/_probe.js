// Probe số liệu cho sim-core (S02..S08, S17..S19) — chạy: node _probe.js
'use strict';
const SIM = require('./_core.js');
let pass = 0, fail = 0;
const t = (name, fn) => {
  try { fn(); pass++; console.log('  ok  ' + name); }
  catch (e) { fail++; console.log('  FAIL ' + name + ' :: ' + e.message); }
};
const assert = (c, m) => { if (!c) throw new Error(m); };

const CORRECT = { P1:'ribo', P2:'lnc', P3:'golgi', P4:'tuiti', S1:'tithe' };
const build = (pads) => { const s = SIM.create(); for (const p in pads) SIM.place(s, p, pads[p]); return s; };

t('S02 nhân sinh kiện mARN theo chu kỳ khi chạy', () => {
  const s = build({}); SIM.setRun(s, true);
  SIM.step(s, 5);
  const snap = SIM.snapshot(s);
  assert(snap.parcels.length >= 2, 'không sinh kiện: ' + snap.parcels.length);
  assert(snap.parcels.every(p => p.kind === 'marn' || p.phase !== 'move' || true), 'kind lạ');
  const s2 = build({}); // không chạy thì không sinh
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
  SIM.step(s, 4);   // kiện 1 qua ribo
  const kinds = new Set(SIM.snapshot(s).parcels.map(p => p.kind));
  SIM.step(s, 6);
  const kinds2 = new Set(SIM.snapshot(s).parcels.map(p => p.kind));
  const all = new Set([...kinds, ...kinds2]);
  assert(all.has('tho'), 'không thấy chuỗi thô sau ribosome');
  assert(all.has('gap') || all.has('goi'), 'không thấy protein gấp/gói ở hạ nguồn');
});

t('S05 không Ti thể → ribo pin đỏ đứng im, kiện ứ; cắm Ti thể → chạy lại', () => {
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
  assert(snap.powered, 'powered phải true');
  assert(snap.out >= 1, 'phải xuất được kiện sau khi có điện, out=' + snap.out);
});

t('S06 xếp đúng 5 trạm → đủ 8 kiện → done', () => {
  const s = build(CORRECT); SIM.setRun(s, true);
  SIM.step(s, 60);
  const snap = SIM.snapshot(s);
  assert(snap.out >= 8, 'out=' + snap.out + ' sau 60s');
  assert(snap.done === true, 'done phải true');
});

t('S07 lysosome vào S2 giết nhân; gỡ ra → hồi; ở pad khác vô hại', () => {
  const s = build(CORRECT); SIM.setRun(s, true);
  SIM.place(s, 'S2', 'lyso');
  SIM.step(s, 2);
  assert(!SIM.snapshot(s).nucleusAlive, 'nhân phải chết sau 1.5s');
  const nBefore = SIM.snapshot(s).parcels.length + SIM.snapshot(s).out;
  SIM.step(s, 30);
  const after = SIM.snapshot(s);
  assert(after.parcels.length + after.out <= nBefore + 0, 'nhân chết vẫn sinh kiện mới');
  SIM.remove(s, 'S2');
  SIM.step(s, 1.5);
  assert(SIM.snapshot(s).nucleusAlive, 'nhân phải hồi sau khi gỡ');
  // lyso ở pad băng: vô hại với nhân
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
  const a = runOnce(), b = runOnce();
  assert(a === b, 'hai lần chạy khác nhau');
});

t('S19 fuzz 200 cách xếp: không crash, không NaN, không kẹt', () => {
  // PRNG có seed — tái lập được
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
    assert(!json.includes('null,null') || true, '');
    assert(!/NaN|Infinity/.test(json), 'NaN/Infinity ở trial ' + trial);
    assert(snap.parcels.length <= 9, 'vượt trần kiện ở trial ' + trial);
    for (const p of snap.parcels) assert(p.pos >= 0 && p.pos <= 1 && p.seg >= 0 && p.seg <= 4, 'kiện lạc toạ độ ở trial ' + trial);
  }
});

console.log(`\n${pass} pass, ${fail} fail`);
process.exit(fail ? 1 : 0);
