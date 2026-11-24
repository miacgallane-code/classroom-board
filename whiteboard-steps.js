/* Whiteboard expectations: the four steps and how a picked child moves through them.
   Plain logic with no page code, so it runs in the board and in `node --test tests/`. */
(function (root) {
  'use strict';

  const DEFAULT_STEPS = Object.freeze([
    { key: 'seed', label: 'Sleepy Seed', text: 'Boards down, markers capped.' },
    { key: 'bee', label: 'Busy Bee', text: 'Board on your lap, marker up.' },
    { key: 'sun', label: 'Sunflower', text: 'Hold it up high so I can see.' },
    { key: 'rain', label: 'Rain to Rub Out', text: 'Wipe it clean, back to Sleepy Seed.' },
  ]);
  const LAST = DEFAULT_STEPS.length - 1;

  /* the teacher's own words (from settings) on top of the usual ones; an empty box keeps the usual words */
  const stepsWith = (custom = []) => DEFAULT_STEPS.map((s, i) => {
    const mine = (custom && custom[i]) || {};
    const label = typeof mine.label === 'string' ? mine.label.trim() : '';
    const text = typeof mine.text === 'string' ? mine.text.trim() : '';
    return { key: s.key, label: label || s.label, text: text || s.text };
  });

  /* card on its own: Rain to Rub Out goes round to Sleepy Seed */
  const nextStep = i => (i + 1) % DEFAULT_STEPS.length;

  /* number formation: one picked child at a time, no repeats until everyone has had a go */
  const start = () => ({ child: null, step: 0, done: [] });

  const pick = (s, names, random = Math.random) => {
    if (s.child || !names.length) return s;
    let done = s.done.filter(n => names.includes(n));
    let pool = names.filter(n => !done.includes(n));
    if (!pool.length) { done = []; pool = names.slice(); }
    const child = pool[Math.floor(random() * pool.length)];
    return { child, step: 0, done: [...done, child] };
  };

  /* Sleepy Seed → Busy Bee → Sunflower → Rain to Rub Out → back to Sleepy Seed, ready for the next child */
  const advance = s => {
    if (!s.child) return s;
    if (s.step < LAST) return { ...s, step: s.step + 1 };
    return { ...s, child: null, step: 0 };
  };

  const api = { DEFAULT_STEPS, LAST, stepsWith, nextStep, start, pick, advance };
  if (typeof module === 'object' && module.exports) module.exports = api;
  else root.WhiteboardSteps = api;
})(typeof window !== 'undefined' ? window : globalThis);
