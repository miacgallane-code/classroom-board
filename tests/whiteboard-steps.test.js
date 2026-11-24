// Run with: node --test tests/
const test = require('node:test');
const assert = require('node:assert/strict');
const WB = require('../whiteboard-steps.js');

const ORDER = ['Sleepy Seed', 'Busy Bee', 'Sunflower', 'Rain to Rub Out'];

test('the four whiteboard steps show in order', () => {
  assert.deepEqual(WB.stepsWith().map(s => s.label), ORDER);
});

test('on the card, Rain to Rub Out goes back to Sleepy Seed', () => {
  const seen = [0];
  for (let i = 0; i < 4; i++) seen.push(WB.nextStep(seen.at(-1)));
  assert.deepEqual(seen.map(i => ORDER[i]), [...ORDER, 'Sleepy Seed']);
});

test('a picked child moves through the steps in order, and Rain to Rub Out returns them to Sleepy Seed', () => {
  let s = WB.pick(WB.start(), ['Ava', 'Ben'], () => 0);
  assert.equal(s.child, 'Ava');
  const steps = [ORDER[s.step]];
  for (let i = 0; i < 3; i++) { s = WB.advance(s); steps.push(ORDER[s.step]); }
  assert.deepEqual(steps, ORDER);

  s = WB.advance(s); // after Rain to Rub Out
  assert.equal(ORDER[s.step], 'Sleepy Seed');
  assert.equal(s.child, null, 'ready for the next child');
});

test('the next child is only picked after Rain to Rub Out, with no repeats', () => {
  let s = WB.pick(WB.start(), ['Ava', 'Ben'], () => 0);
  s = WB.advance(s);
  assert.equal(WB.pick(s, ['Ava', 'Ben']), s, 'no new pick mid-way through the steps');
  for (let i = 0; i < 3; i++) s = WB.advance(s);
  s = WB.pick(s, ['Ava', 'Ben'], () => 0);
  assert.equal(s.child, 'Ben');
  assert.equal(s.step, 0);
});

test("the teacher's own words keep the same order, and empty boxes keep the usual words", () => {
  const steps = WB.stepsWith([{ label: 'Seed', text: 'Board down.' }, {}, { label: '  ' }, { label: 'Rub Out' }]);
  assert.deepEqual(steps.map(s => s.label), ['Seed', 'Busy Bee', 'Sunflower', 'Rub Out']);
  assert.equal(steps[0].text, 'Board down.');
  assert.equal(steps[1].text, WB.DEFAULT_STEPS[1].text);
});
