/* Mr MixUp: everything you might want to change lives here, not in app.js.
   - types:    the kinds of mix-up Mr MixUp can make. Teachers switch each one on or off.
   - presets:  the fixed Term 4 Kindy (ES1) warm-ups, Weeks 7-10. Five items each, run in order.
               say   = what Mr MixUp says first (his mix-up, or a CORRECT line)
               fix   = what the class says together after Reveal (null on a CORRECT item)
               right = what Mr MixUp says when he tries again and gets it right
               board / fixed = what shows on screen before and after Reveal:
                 text (numerals), dots {n, cross}, frame {a, b} (ten frame), mirror (numeral reversal)
   - template: Weeks 11 and later. Items are made fresh from the switched-on mix-up types.
   - sheep():  draws Mr MixUp in SVG. No image files.
   No names or results are kept in this file - those stay in the browser on this device. */
(() => {
  const root = typeof window !== 'undefined' ? window : globalThis;

  const types = {
    countOrder:   'Counting order',
    skipRepeat:   'Skipped or repeated numbers',
    teenTy:       'Teen and -ty swaps',
    digitOrder:   'Digit order (13 written as 31)',
    reversal:     'Numeral reversals (6 and 9)',
    makeTen:      'Make-ten partners',
    takeAway:     'Take-away results',
    factFamily:   'Fact families (plus facts)',
    smallerFirst: 'Starting at the smaller number',
    breakApart:   'Break-apart errors',
    countFrom:    'Counting on from a given number',
  };

  const ranges = {
    '1-10':  { label: '1–10', lo: 1, hi: 10 },
    '1-20':  { label: '1–20', lo: 1, hi: 20 },
    '1-30':  { label: '1–30', lo: 1, hi: 30 },
    'teens': { label: 'Teens only', lo: 11, hi: 19 },
  };

  const cues = {
    thumbs:   { label: 'Thumbs', say: 'Thumbs up or thumbs down?' },
    boards:   { label: 'Boards', say: 'Boards – show me!' },
    together: { label: 'All together', say: 'All together!' },
    partner:  { label: 'Tell your partner', say: 'Tell your partner.' },
  };

  const presets = {
    w7: {
      week: 7, label: 'Week 7', title: 'Take away to 10 and counting back', range: '1-10', cue: 'boards',
      intention: 'Today I can take away to 10 and count back.',
      why: 'Taking away tells us how many are left.',
      music: 'Teen or Ty',
      items: [
        { kind: 'Count back', type: 'skipRepeat', count: true,
          say: 'Ten, nine, eight, six, five.',
          fix: 'Ten, nine, eight, seven, six, five. Seven was missing.',
          right: 'Ten, nine, eight, seven, six, five.',
          board: { text: '10, 9, 8, 6, 5' }, fixed: { text: '10, 9, 8, 7, 6, 5' } },
        { kind: 'Take away', type: 'takeAway',
          say: 'Eight take away three is four.',
          fix: 'Count what’s left: five. Eight take away three is five.',
          right: 'Eight take away three is five.',
          board: { text: '8 − 3 = 4', dots: { n: 8, cross: 3 } }, fixed: { text: '8 − 3 = 5', dots: { n: 8, cross: 3 } } },
        { kind: 'Start at the bigger number', type: 'smallerFirst',
          say: 'Seven take away two. I start with the two.',
          fix: 'Start with the bigger number, seven. Seven take away two is five.',
          right: 'Seven take away two. I start with the seven. Seven take away two is five.',
          board: { text: '7 − 2' }, fixed: { text: '7 − 2 = 5', dots: { n: 7, cross: 2 } } },
        { kind: 'Take away', type: 'takeAway',
          say: 'Nine take away four is six.',
          fix: 'Nine take away four is five.',
          right: 'Nine take away four is five.',
          board: { text: '9 − 4 = 6', dots: { n: 9, cross: 4 } }, fixed: { text: '9 − 4 = 5', dots: { n: 9, cross: 4 } } },
        { kind: 'Take away', type: 'takeAway', correct: true,
          say: 'Ten take away three is seven.',
          fix: null,
          right: 'Ten take away three is seven.',
          board: { text: '10 − 3 = 7', dots: { n: 10, cross: 3 } }, fixed: { text: '10 − 3 = 7', dots: { n: 10, cross: 3 } } },
      ],
      exit: { question: 'Nine take away four.', board: { text: '9 − 4 = ?' },
        kind: 'number', accept: ['5'], key: '5',
        wrongLine: 'Nine take away four is six!' },
    },

    w8: {
      week: 8, label: 'Week 8', title: 'Fact families to 10', range: '1-10', cue: 'boards',
      intention: 'Today I can find the fact family for three numbers.',
      why: 'When I know one fact, I know the whole family.',
      music: 'Which Instrument Is Missing',
      items: [
        { kind: 'Addition total', type: 'factFamily',
          say: 'Three plus four is eight.',
          fix: 'Three plus four is seven.',
          right: 'Three plus four is seven.',
          board: { text: '3 + 4 = 8', frame: { a: 3, b: 4 } }, fixed: { text: '3 + 4 = 7', frame: { a: 3, b: 4 } } },
        { kind: 'Addition order', type: 'factFamily',
          say: 'Four plus three is six.',
          fix: 'Four plus three is seven. The order doesn’t change the total.',
          right: 'Four plus three is seven.',
          board: { text: '4 + 3 = 6', frame: { a: 4, b: 3 } }, fixed: { text: '4 + 3 = 7', frame: { a: 4, b: 3 } } },
        { kind: 'Subtraction', type: 'takeAway',
          say: 'Seven take away three is three.',
          fix: 'Seven take away three is four.',
          right: 'Seven take away three is four.',
          board: { text: '7 − 3 = 3', dots: { n: 7, cross: 3 } }, fixed: { text: '7 − 3 = 4', dots: { n: 7, cross: 3 } } },
        { kind: 'Subtraction', type: 'takeAway',
          say: 'Seven take away four is four.',
          fix: 'Seven take away four is three.',
          right: 'Seven take away four is three.',
          board: { text: '7 − 4 = 4', dots: { n: 7, cross: 4 } }, fixed: { text: '7 − 4 = 3', dots: { n: 7, cross: 4 } } },
        { kind: 'Family', type: 'factFamily', correct: true,
          say: 'Three, four and seven are a family. Three plus four is seven.',
          fix: null,
          right: 'Three, four and seven are a family. Three plus four is seven.',
          board: { text: '3, 4, 7   3 + 4 = 7' }, fixed: { text: '3, 4, 7   3 + 4 = 7' } },
      ],
      exit: { question: 'Show me the family for 3, 4 and 7.', board: { text: '3, 4, 7' },
        kind: 'family', accept: ['3 + 4 = 7', '4 + 3 = 7', '7 − 3 = 4', '7 − 4 = 3'],
        key: 'All four: 3 + 4 = 7, 4 + 3 = 7, 7 − 3 = 4, 7 − 4 = 3',
        wrongLine: 'Three plus four is seven. That’s the whole family!' },
    },

    w9: {
      week: 9, label: 'Week 9', title: 'Make ten', range: '1-10', cue: 'boards',
      intention: 'Today I can find partners to 10.',
      why: 'Making ten helps me add and take away quickly.',
      music: 'Drumming to Ten',
      items: [
        { kind: 'Partners', type: 'makeTen',
          say: 'Six and five make ten.',
          fix: 'Six and four make ten. Six plus four is ten.',
          right: 'Six and four make ten.',
          board: { text: '6 and 5 make 10', frame: { a: 6, b: 5 } }, fixed: { text: '6 + 4 = 10', frame: { a: 6, b: 4 } } },
        { kind: 'Partners', type: 'makeTen',
          say: 'Seven and four make ten.',
          fix: 'Seven and three make ten.',
          right: 'Seven and three make ten.',
          board: { text: '7 and 4 make 10', frame: { a: 7, b: 4 } }, fixed: { text: '7 + 3 = 10', frame: { a: 7, b: 3 } } },
        { kind: 'Partners', type: 'makeTen',
          say: 'Two and eight make eleven.',
          fix: 'Two and eight make ten.',
          right: 'Two and eight make ten.',
          board: { text: '2 and 8 make 11', frame: { a: 2, b: 8 } }, fixed: { text: '2 + 8 = 10', frame: { a: 2, b: 8 } } },
        { kind: 'Take away', type: 'takeAway',
          say: 'Ten take away three is six.',
          fix: 'Ten take away three is seven.',
          right: 'Ten take away three is seven.',
          board: { text: '10 − 3 = 6', dots: { n: 10, cross: 3 } }, fixed: { text: '10 − 3 = 7', dots: { n: 10, cross: 3 } } },
        { kind: 'Partners', type: 'makeTen', correct: true,
          say: 'Nine and one make ten.',
          fix: null,
          right: 'Nine and one make ten.',
          board: { text: '9 + 1 = 10', frame: { a: 9, b: 1 } }, fixed: { text: '9 + 1 = 10', frame: { a: 9, b: 1 } } },
      ],
      exit: { question: 'Ten take away eight.', board: { text: '10 − 8 = ?' },
        kind: 'number', accept: ['2'], key: '2',
        wrongLine: 'Ten take away eight is three!' },
    },

    w10: {
      week: 10, label: 'Week 10', title: 'Place value and review', range: '1-30', cue: 'boards',
      intention: 'Today I can say what the digits in a teen number mean.',
      why: 'The 1 in a teen number means one ten.',
      music: 'Class Favourites',
      items: [
        { kind: 'Teen digits', type: 'breakApart',
          say: 'Sixteen is one and six.',
          fix: 'Sixteen is ten and six. The 1 means one ten.',
          right: 'Sixteen is ten and six.',
          board: { text: '16', frame: { a: 16 } }, fixed: { text: '16 = 10 and 6', frame: { a: 16 } } },
        { kind: 'Teen versus ty', type: 'teenTy',
          say: 'Forty.',
          fix: 'Fourteen. Ten and four.',
          right: 'Fourteen.',
          board: { text: '14' }, fixed: { text: '14 = 10 and 4', frame: { a: 14 } } },
        { kind: 'Counting', type: 'skipRepeat', count: true,
          say: 'Eighteen, nineteen, twenty-two.',
          fix: 'Eighteen, nineteen, twenty, twenty-one, twenty-two. Twenty was missing.',
          right: 'Eighteen, nineteen, twenty, twenty-one, twenty-two.',
          board: { text: '18, 19, 22' }, fixed: { text: '18, 19, 20, 21, 22' } },
        { kind: 'Partners (review)', type: 'makeTen',
          say: 'Seven and two make ten.',
          fix: 'Seven and three make ten.',
          right: 'Seven and three make ten.',
          board: { text: '7 and 2 make 10', frame: { a: 7, b: 2 } }, fixed: { text: '7 + 3 = 10', frame: { a: 7, b: 3 } } },
        { kind: 'Teen place value', type: 'breakApart', correct: true,
          say: 'Seventeen is ten and seven.',
          fix: null,
          right: 'Seventeen is ten and seven.',
          board: { text: '17 = 10 and 7', frame: { a: 17 } }, fixed: { text: '17 = 10 and 7', frame: { a: 17 } } },
      ],
      exit: { question: 'What does the 1 mean?', board: { text: '17', frame: { a: 17 } },
        kind: 'words', accept: ['one ten', 'ten'], key: '“one ten” or “ten”',
        wrongLine: 'The 1 in seventeen means one!' },
    },
  };

  const template = {
    week: 11, label: 'Weeks 11+', title: 'Your own warm-up', range: '1-20', cue: 'boards',
    intention: 'Today I can count, add and take away to 20.',
    why: 'Checking carefully helps me catch mistakes.',
    music: '',
    types: ['smallerFirst', 'breakApart', 'countFrom'],
  };

  /* made-up names for trying it out with no class list */
  const testNames = ['Ari', 'Bea', 'Cal', 'Dev', 'Eli', 'Fen', 'Gus', 'Hana', 'Ivy', 'Jai', 'Kit', 'Lu'];

  const wools = {
    cream: { label: 'Cream', fill: '#F6F1E1', edge: '#DEDDC3' },
    white: { label: 'White', fill: '#FFFFFF', edge: '#D9D9E0' },
    pink:  { label: 'Rose',  fill: '#F3E3E9', edge: '#D7B6C2' },
    blue:  { label: 'Blue',  fill: '#E3EDF0', edge: '#A3BFC7' },
    green: { label: 'Pistachio', fill: '#EEF1DF', edge: '#C8D29D' },
  };

  /* Mr MixUp: a lopsided wool puff, one big eye and one small, a floppy ear and a goofy grin */
  const sheep = (woolKey = 'cream') => {
    const w = wools[woolKey] || wools.cream;
    const puff = (x, y, r) => `<circle cx="${x}" cy="${y}" r="${r}" fill="${w.fill}" stroke="${w.edge}" stroke-width="3"/>`;
    const face = '#5B5563', leg = '#4A4552';
    return `<svg viewBox="0 0 220 210" role="img" aria-label="Mr MixUp the sheep">
  <g class="mx-legs">
    <rect x="72" y="150" width="11" height="44" rx="5.5" fill="${leg}"/>
    <rect x="98" y="156" width="11" height="40" rx="5.5" fill="${leg}"/>
    <rect x="136" y="154" width="11" height="42" rx="5.5" fill="${leg}"/>
    <rect x="160" y="148" width="11" height="44" rx="5.5" fill="${leg}"/>
  </g>
  <g class="mx-wool">
    ${puff(176, 120, 30)}${puff(160, 88, 34)}${puff(124, 74, 40)}${puff(90, 92, 30)}
    ${puff(82, 128, 30)}${puff(116, 140, 34)}${puff(152, 140, 30)}${puff(128, 110, 44)}
    ${puff(196, 98, 16)}
  </g>
  <g class="mx-head">
    <ellipse cx="44" cy="70" rx="16" ry="8" fill="${face}" transform="rotate(-35 44 70)"/>
    <ellipse cx="22" cy="112" rx="9" ry="20" fill="${face}" transform="rotate(28 22 112)"/>
    <ellipse cx="58" cy="108" rx="34" ry="40" fill="${face}" transform="rotate(-10 58 108)"/>
    ${puff(44, 70, 14)}${puff(64, 62, 19)}${puff(84, 72, 11)}
    <circle cx="46" cy="100" r="14" fill="#fff"/><circle cx="50" cy="104" r="6.5" fill="#2F2E35"/><circle cx="52" cy="101" r="2" fill="#fff"/>
    <circle cx="76" cy="96" r="8" fill="#fff"/><circle cx="74" cy="93" r="3.6" fill="#2F2E35"/>
    <circle cx="36" cy="124" r="6" fill="#D7B6C2" opacity=".85"/><circle cx="84" cy="118" r="5" fill="#D7B6C2" opacity=".85"/>
    <path d="M40 130 Q60 152 84 126 Q62 140 40 130Z" fill="#fff" stroke="#2F2E35" stroke-width="3" stroke-linejoin="round"/>
    <rect x="58" y="134" width="7" height="8" rx="2" fill="#fff" stroke="#2F2E35" stroke-width="2"/>
  </g>
</svg>`;
  };

  const data = { types, ranges, cues, presets, template, testNames, wools, sheep };
  root.MIXUP = data;
  if (typeof module === 'object' && module.exports) module.exports = data;
})();
