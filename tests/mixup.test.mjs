// Mr MixUp tests. Run from the Classroom Board folder with:  node --test tests/*.test.mjs
import test from 'node:test';
import assert from 'node:assert/strict';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const D = require('../mixup-data.js');
const L = require('../mixup-logic.js');

/* a repeatable "random" for tests */
const seeded = seed => () => { seed = (seed * 1664525 + 1013904223) % 4294967296; return seed / 4294967296; };

const EXPECTED = {
  w7: [
    ['Ten, nine, eight, six, five.', 'Ten, nine, eight, seven, six, five. Seven was missing.'],
    ['Eight take away three is four.', 'Count what’s left: five. Eight take away three is five.'],
    ['Seven take away two. I start with the two.', 'Start with the bigger number, seven. Seven take away two is five.'],
    ['Nine take away four is six.', 'Nine take away four is five.'],
    ['Ten take away three is seven.', null],
  ],
  w8: [
    ['Three plus four is eight.', 'Three plus four is seven.'],
    ['Four plus three is six.', 'Four plus three is seven. The order doesn’t change the total.'],
    ['Seven take away three is three.', 'Seven take away three is four.'],
    ['Seven take away four is four.', 'Seven take away four is three.'],
    ['Three, four and seven are a family. Three plus four is seven.', null],
  ],
  w9: [
    ['Six and five make ten.', 'Six and four make ten. Six plus four is ten.'],
    ['Seven and four make ten.', 'Seven and three make ten.'],
    ['Two and eight make eleven.', 'Two and eight make ten.'],
    ['Ten take away three is six.', 'Ten take away three is seven.'],
    ['Nine and one make ten.', null],
  ],
  w10: [
    ['Sixteen is one and six.', 'Sixteen is ten and six. The 1 means one ten.'],
    ['Forty.', 'Fourteen. Ten and four.'],
    ['Eighteen, nineteen, twenty-two.', 'Eighteen, nineteen, twenty, twenty-one, twenty-two. Twenty was missing.'],
    ['Seven and two make ten.', 'Seven and three make ten.'],
    ['Seventeen is ten and seven.', null],
  ],
};

test('each preset has its five items, word for word and in order', () => {
  assert.deepEqual(Object.keys(D.presets), ['w7', 'w8', 'w9', 'w10']);
  for (const [k, want] of Object.entries(EXPECTED)) {
    const items = L.presetItems(D.presets[k]);
    assert.equal(items.length, 5, k);
    items.forEach((it, i) => {
      assert.equal(it.say, want[i][0], `${k} item ${i + 1} line`);
      assert.equal(it.fix, want[i][1], `${k} item ${i + 1} fix`);
      assert.equal(it.correct, want[i][1] === null, `${k} item ${i + 1} CORRECT flag`);
    });
  }
});

test('each preset sets its range, cue and music finish', () => {
  const p = D.presets;
  assert.deepEqual([p.w7.range, p.w8.range, p.w9.range, p.w10.range], ['1-10', '1-10', '1-10', '1-30']);
  for (const k of Object.keys(p)) assert.equal(p[k].cue, 'boards');
  assert.deepEqual([p.w7.music, p.w8.music, p.w9.music, p.w10.music],
    ['Teen or Ty', 'Which Instrument Is Missing', 'Drumming to Ten', 'Class Favourites']);
});

test('a CORRECT item never shows a fix', () => {
  for (const p of Object.values(D.presets)) {
    for (const it of L.presetItems(p)) if (it.correct) {
      assert.equal(it.fix, null);
      assert.equal(it.say, it.right, 'a CORRECT line is the right line');
    }
  }
  for (const t of Object.keys(D.types)) {
    const it = L.makeItem(t, '1-20', false, seeded(3));
    if (it) { assert.equal(it.fix, null, t); assert.equal(it.correct, true, t); }
  }
  for (const it of L.buildTemplate({ types: Object.keys(D.types), rng: seeded(9) })) if (it.correct) assert.equal(it.fix, null);
});

test('switching a mix-up type off makes that preset item a CORRECT one', () => {
  const items = L.presetItems(D.presets.w7, { takeAway: false });
  assert.equal(items[1].correct, true);
  assert.equal(items[1].say, 'Eight take away three is five.');
  assert.equal(items[1].fix, null);
  assert.equal(items[0].correct, false, 'other types are unchanged');
});

test('each exit check marks the listed answers right and nothing else', () => {
  const { w7, w8, w9, w10 } = D.presets;
  const ok = (p, a) => L.checkExit(p.exit, a);
  assert.ok(ok(w7, '5')); assert.ok(ok(w7, 'five'));
  for (const a of ['4', '6', '13', '', 'nine', '5 5']) assert.ok(!ok(w7, a), `w7 ${a}`);
  assert.ok(ok(w9, '2')); assert.ok(ok(w9, 'two'));
  for (const a of ['3', '8', '18', '12']) assert.ok(!ok(w9, a), `w9 ${a}`);
  assert.ok(ok(w10, 'one ten')); assert.ok(ok(w10, 'Ten')); assert.ok(ok(w10, 'one ten.'));
  for (const a of ['one', '1', 'seventeen', 'seven', 'ten and seven', 'tens']) assert.ok(!ok(w10, a), `w10 ${a}`);
  assert.ok(ok(w8, ['3 + 4 = 7', '4 + 3 = 7', '7 − 3 = 4', '7 − 4 = 3']));
  assert.ok(ok(w8, '7-4=3; 7-3=4; 4+3=7; 3+4=7'), 'order and spacing don’t matter');
  assert.ok(!ok(w8, ['3 + 4 = 7', '4 + 3 = 7', '7 − 3 = 4']), 'three of four is not enough');
  assert.ok(!ok(w8, ['3 + 4 = 7', '4 + 3 = 7', '7 − 3 = 4', '7 − 4 = 4']), 'one wrong sentence');
  assert.ok(!ok(w8, ['3 + 4 = 7', '4 + 3 = 7', '7 − 3 = 4', '7 − 4 = 3', '3 + 3 = 7']), 'an extra wrong sentence');
});

test('the spinner never repeats a name until everyone has had a turn', () => {
  const roster = ['Ava', 'Ben', 'Cy', 'Dot', 'Ed', 'Flo', 'Gem'];
  const rng = seeded(42);
  let pool = [];
  for (let round = 0; round < 5; round++) {
    const seen = new Set();
    for (let i = 0; i < roster.length; i++) {
      const r = L.takeName(pool, roster, rng); pool = r.pool;
      assert.ok(!seen.has(r.name), `round ${round}: ${r.name} came up twice`);
      seen.add(r.name);
    }
    assert.equal(seen.size, roster.length);
  }
});

test('the spinner skips children who are away and keeps the rest of the round', () => {
  const rng = seeded(7);
  let { pool } = L.takeName([], ['A', 'B', 'C', 'D'], rng);
  const here = ['A', 'B', 'C'];                  // D is away today
  const seen = new Set();
  while (pool.filter(n => here.includes(n)).length) { const r = L.takeName(pool, here, rng); pool = r.pool; seen.add(r.name); }
  assert.ok(!seen.has('D'));
  assert.equal(L.takeName([], [], rng).name, null);
});

test('no mix-up is accidentally correct', () => {
  for (const type of Object.keys(L.MAKERS)) {
    for (const range of ['1-10', '1-20', '1-30', 'teens']) {
      for (let s = 1; s <= 200; s++) {
        const it = L.makeItem(type, range, true, seeded(s));
        if (!it) continue;
        assert.notDeepEqual(it.claim, it.truth, `${type} ${range} seed ${s}`);
        assert.notEqual(it.say, it.right, `${type} ${range} seed ${s}`);
        assert.ok(it.fix, `${type} has a fix`);
      }
    }
  }
});

test('each preset only makes the mix-ups it lists', () => {
  const listed = {
    w7: ['skipRepeat', 'takeAway', 'smallerFirst'],
    w8: ['factFamily', 'takeAway'],
    w9: ['makeTen', 'takeAway'],
    w10: ['breakApart', 'teenTy', 'skipRepeat', 'makeTen'],
  };
  for (const [k, types] of Object.entries(listed)) {
    const used = new Set(L.presetItems(D.presets[k]).filter(it => !it.correct).map(it => it.type));
    assert.deepEqual([...used].sort(), types.slice().sort(), k);
    for (const t of used) assert.ok(D.types[t], `${t} is a known type`);
  }
});

test('the Weeks 11+ template only uses switched-on types that fit the range', () => {
  for (let s = 1; s <= 50; s++) {
    const items = L.buildTemplate({ types: ['smallerFirst', 'countFrom'], range: '1-20', rng: seeded(s) });
    assert.equal(items.length, 5);
    for (const it of items) assert.ok(['smallerFirst', 'countFrom'].includes(it.type));
  }
  const tens = L.buildTemplate({ types: ['teenTy', 'takeAway'], range: '1-10', rng: seeded(1) });
  assert.ok(tens.every(it => it.type === 'takeAway'), 'teen swaps can’t happen in 1–10');
  assert.ok(D.template.types.every(t => L.typeFits(t, '1-20')));
});

test('the mix-up rate sets how many template items are wrong', () => {
  const wrong = rate => L.buildTemplate({ types: ['takeAway'], rate, rng: seeded(5) }).filter(it => !it.correct).length;
  assert.equal(wrong('rarely'), 1);
  assert.equal(wrong('normal'), 2);   // one in three of five, rounded
  assert.equal(wrong('often'), 3);
});

test('teacher items run first in the template', () => {
  const items = L.buildTemplate({ types: ['makeTen'], custom: [{ say: 'Five and five make eleven.', fix: 'Five and five make ten.' }], rng: seeded(2) });
  assert.equal(items.length, 5);
  assert.equal(items[0].say, 'Five and five make eleven.');
  assert.equal(items[0].correct, false);
});

test('the 80/80 result follows the threshold setting', () => {
  const marks = n => Object.fromEntries(Array.from({ length: 10 }, (_, i) => [`c${i}`, i < n ? 'right' : 'wrong']));
  assert.equal(L.eightyEighty(marks(8), 80).moveOn, true);
  assert.equal(L.eightyEighty(marks(7), 80).moveOn, false);
  assert.equal(L.eightyEighty(marks(7), 70).moveOn, true);
  assert.equal(L.eightyEighty(marks(8), 90).moveOn, false);
  assert.equal(L.eightyEighty(marks(9), 90).moveOn, true);
  assert.equal(L.eightyEighty(marks(8)).pct, 80);
  const some = { a: 'right', b: 'right', c: 'right', d: 'wrong', e: undefined };
  assert.deepEqual(L.eightyEighty(some, 75), { right: 3, total: 4, pct: 75, moveOn: true, threshold: 75 }, 'unmarked children don’t count');
  assert.equal(L.eightyEighty({}, 80).moveOn, false);
});

test('step timers add up to the warm-up length', () => {
  const t5 = L.stepTimes(5, 5);
  assert.deepEqual([t5.hook, t5.item, t5.exit], [30, 45, 45]);
  assert.ok(t5.hook + 5 * t5.item + t5.exit <= 300);
  const t10 = L.stepTimes(10, 5);
  assert.deepEqual([t10.hook, t10.item, t10.exit], [60, 90, 90]);
});

test('the CSV holds names and marks only, safely quoted', () => {
  const csv = L.resultsCsv([{ date: '2026-11-24', weekLabel: 'Week 7', question: 'Nine take away four.', marks: { Ava: 'right', '=Bo, J': 'wrong', Cy: undefined }, pct: 50, moveOn: false }], 'KB');
  const lines = csv.trim().split('\r\n');
  assert.equal(lines.length, 3, 'header + two marked children');
  assert.equal(lines[1], '2026-11-24,KB,Week 7,Nine take away four.,Ava,Right,50%,Reteach');
  assert.ok(lines[2].includes('"\'=Bo, J"'), 'formula-looking names are made safe');
});
