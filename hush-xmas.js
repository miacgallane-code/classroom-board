/* Hush Bush: the North Pole scene (Christmas). Adds itself to window.HUSH after hush-data.js.
   Same cute style as Santa's Sleigh: no outlines, soft gradient shading, glossy eyes with a
   star highlight and pink cheeks. The background picture is 400 x 225; each character is drawn
   in a 60 x 60 box standing on its feet at the bottom. */
(() => {
const H = window.HUSH;
if (!H) return;
const n = v => Math.round(v * 100) / 100;
const stops = s => s.map(([o, c, a]) => `<stop offset="${o}" stop-color="${c}"${a != null ? ` stop-opacity="${a}"` : ''}/>`).join('');
const rad = (id, s, cx = 0.42, cy = 0.32, r = 0.78) => `<radialGradient id="${id}" cx="${cx}" cy="${cy}" r="${r}">${stops(s)}</radialGradient>`;
const lin = (id, s, x2 = 0, y2 = 1) => `<linearGradient id="${id}" x1="0" y1="0" x2="${x2}" y2="${y2}">${stops(s)}</linearGradient>`;

/* the shared colour ramps, each character gets its own copy with its own id prefix */
const RAMPS = {
  fur: [[0, '#FFFFFF'], [0.55, '#F4F1EC'], [0.85, '#E2DDD5'], [1, '#C9C2B8']],
  snow: [[0, '#FFFFFF'], [0.5, '#F2F5F8'], [0.82, '#DCE5EF'], [1, '#BDCBDD']],
  deer: [[0, '#D9A57A'], [0.55, '#B9835A'], [1, '#86573A']],
  red: [[0, '#F07A84'], [0.5, '#D9505D'], [0.85, '#B23545'], [1, '#8E2333']],
  mint: [[0, '#C6EEDF'], [0.5, '#9ED9C4'], [0.85, '#6FBFA6'], [1, '#4C9A84']],
  green: [[0, '#7CC394'], [0.5, '#4E9E6C'], [0.85, '#357A50'], [1, '#245A3A']],
  gold: [[0, '#FFE7A6'], [0.5, '#F7D27A'], [0.85, '#E8B44A'], [1, '#C48D2A']],
  skin: [[0, '#FFE6D6'], [0.6, '#F9D2BC'], [1, '#E9AF95']],
  cookie: [[0, '#E9A866'], [0.6, '#CB8442'], [1, '#9E5B26']],
  grey: [[0, '#E4E8EE'], [0.55, '#C5CCD8'], [0.85, '#9EA8B8'], [1, '#7F8A9C']],
  narwhal: [[0, '#B9CBE2'], [0.55, '#8FA8CC'], [0.85, '#6C86AE'], [1, '#536C94']],
  navy: [[0, '#55658F'], [0.5, '#3B4A72'], [1, '#1E2540']],
  water: [[0, '#2E4A78'], [1, '#18284A']],
};
const kit = (p, names) => `<defs>${names.map(k => rad(`${p}${k}`, RAMPS[k])).join('')}</defs>`;
const F = (p, k) => `url(#${p}${k})`;

const star = (x, y, s, fill = '#FFF4E0') => `<path transform="translate(${n(x)} ${n(y)}) scale(${n(s)})" fill="${fill}" d="M0 -7 C0.9 -2.2 2.2 -0.9 7 0 C2.2 0.9 0.9 2.2 0 7 C-0.9 2.2 -2.2 0.9 -7 0 C-2.2 -0.9 -0.9 -2.2 0 -7 Z"/>`;
const eye = (x, y, r) => `<ellipse cx="${n(x)}" cy="${n(y)}" rx="${n(r)}" ry="${n(r * 1.15)}" fill="#1B1424"/>` +
  star(x + r * 0.32, y - r * 0.42, r / 8.5) + `<circle cx="${n(x - r * 0.32)}" cy="${n(y + r * 0.45)}" r="${n(r * 0.18)}" fill="#FFF4E0"/>`;
const eyes = (x1, x2, y, r) => eye(x1, y, r) + eye(x2, y, r);
const blush = (x1, x2, y, rx = 2.6) => [x1, x2].map(x => `<ellipse cx="${n(x)}" cy="${n(y)}" rx="${rx}" ry="${n(rx * 0.6)}" fill="#FF8FAE" opacity="0.6"/>`).join('');
const smile = (x, y, w = 1.8) => `<path d="M${n(x - w)},${n(y)} Q${n(x)},${n(y + w)} ${n(x + w)},${n(y)}" stroke="#4A2230" stroke-width="0.9" fill="none" stroke-linecap="round"/>`;
const scarf = (p, col, y, w = 11) => `<path d="M${30 - w},${y} Q30,${y + 4} ${30 + w},${y} L${30 + w},${y + 3.6} Q30,${y + 7.6} ${30 - w},${y + 3.6} Z" fill="${F(p, col)}"/>` +
  `<path d="M${33},${y + 4} l2,9 l3.6,-1 l-1.6,-8.6 Z" fill="${F(p, col)}"/>`;
const santaHat = (p, x, y, s = 1, tilt = -14) => `<g transform="translate(${x} ${y}) rotate(${tilt}) scale(${s})">` +
  `<path d="M-10,0 Q-4,-16 9,-15 Q4,-9 6,-1 Z" fill="${F(p, 'red')}"/><rect x="-11" y="-2.4" width="19" height="4.8" rx="2.4" fill="#FFF4E0"/><circle cx="9.4" cy="-15" r="2.6" fill="#FFF4E0"/></g>`;

/* ---------- the characters ---------- */
const reindeer = (p, rudolph) => kit(p, ['deer', 'red', 'mint']) + `
  <g fill="#7A4A2C"><rect x="20" y="46" width="4.2" height="11" rx="2"/><rect x="26" y="47" width="4.2" height="10" rx="2"/><rect x="31" y="47" width="4.2" height="10" rx="2"/><rect x="37" y="46" width="4.2" height="11" rx="2"/></g>
  <ellipse cx="30.5" cy="44" rx="13.5" ry="9.5" fill="${F(p, 'deer')}"/>
  <ellipse cx="30.5" cy="46" rx="7" ry="5" fill="#F1DCC2"/>
  <path d="M24,15 q-3,-7 -9,-9 M19,9 l-2,-6 M22,12 l-7,1 M36,15 q3,-7 9,-9 M41,9 l2,-6 M38,12 l7,1" stroke="#8A5A36" stroke-width="2.2" fill="none" stroke-linecap="round"/>
  <ellipse cx="18.5" cy="21" rx="5" ry="2.4" fill="${F(p, 'deer')}" transform="rotate(-24 18.5 21)"/><ellipse cx="41.5" cy="21" rx="5" ry="2.4" fill="${F(p, 'deer')}" transform="rotate(24 41.5 21)"/>
  <circle cx="30" cy="25" r="10.5" fill="${F(p, 'deer')}"/>
  <ellipse cx="30" cy="30.5" rx="6.2" ry="4.4" fill="#EBCDAE"/>
  ${scarf(p, rudolph ? 'mint' : 'red', 34)}
  ${eyes(25.8, 34.2, 23.5, 1.8)}${blush(22, 38, 28)}
  ${rudolph ? `<circle cx="30" cy="28.6" r="5.2" fill="#FF6B7A" opacity="0.35"/><circle cx="30" cy="28.6" r="3" fill="${F(p, 'red')}"/><circle cx="29" cy="27.6" r="0.9" fill="#FFD0D6"/>`
    : `<ellipse cx="30" cy="28.4" rx="2.4" ry="1.7" fill="#4A2A2A"/>`}
  ${smile(30, 32, 1.4)}`;

const polarCub = p => kit(p, ['fur', 'red']) + `
  <ellipse cx="22" cy="55" rx="6" ry="3.4" fill="${F(p, 'fur')}"/><ellipse cx="38" cy="55" rx="6" ry="3.4" fill="${F(p, 'fur')}"/>
  <ellipse cx="30" cy="45" rx="14" ry="11.5" fill="${F(p, 'fur')}"/>
  <ellipse cx="22.5" cy="48" rx="4" ry="3" fill="${F(p, 'fur')}"/><ellipse cx="37.5" cy="48" rx="4" ry="3" fill="${F(p, 'fur')}"/>
  <circle cx="20.5" cy="18.5" r="3.8" fill="${F(p, 'fur')}"/><circle cx="39.5" cy="18.5" r="3.8" fill="${F(p, 'fur')}"/>
  <circle cx="30" cy="27" r="11.5" fill="${F(p, 'fur')}"/>
  <ellipse cx="30" cy="31.5" rx="5.4" ry="4" fill="#FFFFFF"/>
  <ellipse cx="30" cy="29.4" rx="2.4" ry="1.7" fill="#1B1424"/>
  ${eyes(25.5, 34.5, 25.5, 1.8)}${blush(22, 38, 30)}${smile(30, 32.4, 1.3)}
  ${santaHat(p, 27, 17.5, 0.95, -16)}`;

const fox = p => kit(p, ['fur', 'green']) + `
  <path d="M40,54 Q56,52 52,38 Q50,31 44,34 Q49,40 44,47 Z" fill="${F(p, 'fur')}"/>
  <ellipse cx="32" cy="47" rx="12" ry="9" fill="${F(p, 'fur')}"/>
  <ellipse cx="26" cy="55" rx="4" ry="2.4" fill="${F(p, 'fur')}"/><ellipse cx="34" cy="55.5" rx="4" ry="2.4" fill="${F(p, 'fur')}"/>
  <path d="M18,22 l-2,-12 l9,7 Z M34,22 l2,-12 l-9,7 Z" fill="${F(p, 'fur')}"/>
  <path d="M18.6,19 l-1,-6 l4.4,3.6 Z M33.4,19 l1,-6 l-4.4,3.6 Z" fill="#F6C4CF"/>
  <path d="M15,29 Q15,18 26,18 Q37,18 37,29 Q37,35 30,37 L26,41 L22,37 Q15,35 15,29 Z" fill="${F(p, 'fur')}"/>
  <ellipse cx="26" cy="39.4" rx="1.8" ry="1.3" fill="#1B1424"/>
  ${eyes(22, 30, 28, 1.7)}${blush(19, 33, 32.5, 2.2)}
  <path d="M15.5,37 Q26,42 36.5,37 L36.5,40 Q26,45 15.5,40 Z" fill="${F(p, 'green')}"/>`;

const hare = p => kit(p, ['fur', 'mint']) + `
  <ellipse cx="25.5" cy="14" rx="3.6" ry="11" fill="${F(p, 'fur')}" transform="rotate(-10 25.5 14)"/><ellipse cx="34.5" cy="14" rx="3.6" ry="11" fill="${F(p, 'fur')}" transform="rotate(10 34.5 14)"/>
  <ellipse cx="25.5" cy="15" rx="1.6" ry="7.5" fill="#F6C4CF" transform="rotate(-10 25.5 15)"/><ellipse cx="34.5" cy="15" rx="1.6" ry="7.5" fill="#F6C4CF" transform="rotate(10 34.5 15)"/>
  <ellipse cx="30" cy="47" rx="11.5" ry="10" fill="${F(p, 'fur')}"/>
  <circle cx="40.5" cy="49" r="3.4" fill="#FFFFFF"/>
  <ellipse cx="25" cy="56" rx="4.6" ry="2.4" fill="${F(p, 'fur')}"/><ellipse cx="35" cy="56" rx="4.6" ry="2.4" fill="${F(p, 'fur')}"/>
  <circle cx="30" cy="31" r="9.5" fill="${F(p, 'fur')}"/>
  <path d="M28.6,33.6 h2.8 l-1.4,1.6 Z" fill="#F08AA4"/>
  ${eyes(26.4, 33.6, 30.5, 1.6)}${blush(23.5, 36.5, 34, 2.2)}${smile(30, 35.4, 1.1)}
  ${scarf(p, 'mint', 38.5, 8.5)}`;

const owl = p => kit(p, ['fur', 'red', 'gold']) + `
  <g class="hb-wings"><ellipse cx="17" cy="34" rx="6.5" ry="11" fill="${F(p, 'fur')}" transform="rotate(18 17 34)"/><ellipse cx="43" cy="34" rx="6.5" ry="11" fill="${F(p, 'fur')}" transform="rotate(-18 43 34)"/></g>
  <ellipse cx="30" cy="35" rx="12" ry="15" fill="${F(p, 'fur')}"/>
  <g fill="#9AA5B5" opacity="0.7"><path d="M26,40 l1.5,1.5 l1.5,-1.5 M32,43 l1.5,1.5 l1.5,-1.5 M27,46 l1.5,1.5 l1.5,-1.5 M33,38 l1.5,1.5 l1.5,-1.5" stroke="#9AA5B5" stroke-width="0.9" fill="none"/></g>
  <circle cx="25" cy="29" r="4.6" fill="${F(p, 'gold')}"/><circle cx="35" cy="29" r="4.6" fill="${F(p, 'gold')}"/>
  ${eyes(25, 35, 29, 2.6)}
  <path d="M28.4,32.4 h3.2 l-1.6,3 Z" fill="#7A6A5A"/>
  ${blush(20.5, 39.5, 34, 2.2)}
  <path d="M25,50 l-1.4,3 M27,50 l0,3.4 M33,50 l0,3.4 M35,50 l1.4,3" stroke="#E8A040" stroke-width="1.4" stroke-linecap="round"/>
  ${santaHat(p, 28, 21, 0.85, -10)}`;

const puffin = p => kit(p, ['navy', 'fur', 'red']) + `
  <g class="hb-wings"><ellipse cx="18" cy="36" rx="5.5" ry="9" fill="${F(p, 'navy')}" transform="rotate(22 18 36)"/><ellipse cx="42" cy="36" rx="5.5" ry="9" fill="${F(p, 'navy')}" transform="rotate(-22 42 36)"/></g>
  <ellipse cx="30" cy="37" rx="11" ry="13" fill="${F(p, 'navy')}"/>
  <ellipse cx="30" cy="41" rx="7.4" ry="9" fill="${F(p, 'fur')}"/>
  <ellipse cx="30" cy="26" rx="8.4" ry="7" fill="#F4F1EC"/>
  <path d="M30,27 Q38,26 36,31 Q33,33 30,31 Z" fill="#F08A3A"/><path d="M30,29 Q35,29 36,31" stroke="#D9505D" stroke-width="1" fill="none"/>
  ${eye(26.4, 25.6, 1.6)}${blush(23.5, 23.5, 29.5, 1.8)}
  <path d="M25,50 l-2,3 h4 Z M35,50 l2,3 h-4 Z" fill="#F08A3A"/>
  <path d="M21,32 Q30,37 39,32 L39,35 Q30,40 21,35 Z" fill="${F(p, 'red')}"/>`;

const snowFriend = p => kit(p, ['snow', 'red', 'green']) + `
  <path d="M19,38 q-7,-4 -11,-10 M11,30 l-3,-1 M41,38 q7,-4 11,-11 M49,29 l3,-2" stroke="#7E4E2E" stroke-width="1.8" fill="none" stroke-linecap="round"/>
  <circle cx="30" cy="45" r="12.5" fill="${F(p, 'snow')}"/>
  <circle cx="30" cy="25.5" r="10" fill="${F(p, 'snow')}"/>
  <circle cx="30" cy="42" r="1.4" fill="#2A2438"/><circle cx="30" cy="48" r="1.4" fill="#2A2438"/>
  ${eyes(26.6, 33.4, 24, 1.6)}<path d="M30,27 l7,2 l-7,1.6 Z" fill="#F0A040"/>${blush(23.6, 36.4, 29, 2)}${smile(29, 31.2, 1.3)}
  <path d="M20.5,33 Q30,38 39.5,33 L39.5,36.4 Q30,41.4 20.5,36.4 Z" fill="${F(p, 'red')}"/><path d="M33,37.4 l2,7 l3,-0.8 l-1.4,-6.6 Z" fill="${F(p, 'red')}"/>
  <rect x="21" y="15" width="18" height="3" rx="1.5" fill="#2A2438"/><rect x="24" y="4" width="12" height="12" rx="2" fill="#2A2438"/><rect x="24" y="12" width="12" height="2.4" fill="${F(p, 'green')}"/>`;

const elf = p => kit(p, ['skin', 'green', 'red', 'gold']) + `
  <rect x="24" y="46" width="4.6" height="9" rx="2.3" fill="#2C6B47"/><rect x="31.4" y="46" width="4.6" height="9" rx="2.3" fill="#245A3A"/>
  <path d="M23,57 q-5,0 -5,-3 q0,-2 4,-2 h4 v5z M37,57 q5,0 5,-3 q0,-2 -4,-2 h-4 v5z" fill="#C23A48"/>
  <path d="M20,48 Q19,33 30,32 Q41,33 40,48 Q30,51 20,48 Z" fill="${F(p, 'green')}"/>
  <rect x="20.4" y="41" width="19.2" height="3.4" rx="1.6" fill="${F(p, 'gold')}"/>
  <path d="M20.6,36 q-5,4 -4,10 M39.4,36 q5,4 4,10" stroke="${F(p, 'green')}" stroke-width="4.4" stroke-linecap="round" fill="none"/>
  <circle cx="16.6" cy="46.6" r="2.6" fill="${F(p, 'skin')}"/><circle cx="43.4" cy="46.6" r="2.6" fill="${F(p, 'skin')}"/>
  <path d="M21,23 L13,19 L21.4,28 Z M39,23 L47,19 L38.6,28 Z" fill="#F3C2A8"/>
  <circle cx="30" cy="24.5" r="9.2" fill="${F(p, 'skin')}"/>
  <path d="M20,20 Q25,1 42,3 Q36,9 38,18 Q29,15 20,20 Z" fill="${F(p, 'red')}"/>
  <path d="M20,20 Q30,15 39.6,19" stroke="#FFF4E0" stroke-width="3.6" stroke-linecap="round" fill="none"/><circle cx="42" cy="3.4" r="2.8" fill="#FFF4E0"/>
  ${eyes(26.6, 33.4, 24.5, 1.6)}${blush(23.6, 36.4, 28.4, 2)}${smile(30, 29.2, 1.6)}`;

const gingerbread = p => kit(p, ['cookie']) + `
  <circle cx="30" cy="18" r="9" fill="${F(p, 'cookie')}"/>
  <path d="M22,27 Q12,27 12,32.5 Q12,36 21,35 L20,42 Q16,52 20.5,53 Q24,54 26,46 L30,44.5 L34,46 Q36,54 39.5,53 Q44,52 40,42 L39,35 Q48,36 48,32.5 Q48,27 38,27 Z" fill="${F(p, 'cookie')}"/>
  <path d="M14.4,31 q1.8,-1.8 3.6,0 M42,31 q1.8,-1.8 3.6,0 M20.6,49 q1.8,-1.8 3.6,0 M35.8,49 q1.8,-1.8 3.6,0" stroke="#FFF4E0" stroke-width="1.4" fill="none" stroke-linecap="round"/>
  <circle cx="30" cy="31" r="1.7" fill="#D9505D"/><circle cx="30" cy="37" r="1.7" fill="#6FBFA6"/>
  <path d="M26,26.4 l4,2.4 l4,-2.4 l-4,-1.4 z" fill="#D9505D"/>
  ${eyes(26.8, 33.2, 17.5, 1.5)}${blush(24.4, 35.6, 21, 1.8)}${smile(30, 21, 1.8)}`;

const seal = p => kit(p, ['grey', 'water', 'red']) + `
  <ellipse cx="30" cy="54" rx="22" ry="4.6" fill="${F(p, 'water')}"/>
  <path d="M9,54 Q30,50 51,54" stroke="#DCEAF4" stroke-width="1.4" fill="none" opacity="0.8"/>
  <path d="M14,53 Q12,36 26,30 Q40,26 44,38 Q47,47 46,53 Z" fill="${F(p, 'grey')}"/>
  <path d="M42,46 q8,-4 9,-10 q-6,2 -10,6" fill="${F(p, 'grey')}"/>
  <circle cx="27" cy="31" r="11" fill="${F(p, 'grey')}"/>
  <ellipse cx="27" cy="35.4" rx="5.6" ry="3.8" fill="#EEF1F5"/>
  <ellipse cx="27" cy="33.4" rx="2" ry="1.4" fill="#1B1424"/>
  <path d="M21,35 l-7,-1 M21,36.6 l-6.6,1.6 M33,35 l7,-1 M33,36.6 l6.6,1.6" stroke="#5A6272" stroke-width="0.7" stroke-linecap="round"/>
  ${eyes(22.8, 31.2, 29.6, 2)}${blush(20, 34, 33.4, 2.2)}
  <path d="M17,41 Q27,46 37,41 L37.6,44 Q27,49 16.4,44 Z" fill="${F(p, 'red')}"/>`;

const narwhal = p => kit(p, ['narwhal', 'water', 'fur']) + `
  <path d="M30,24 L29,4" stroke="#FFF4E0" stroke-width="3" stroke-linecap="round"/>
  <path d="M28.6,20 l2.6,-1.6 M28.4,15 l2.6,-1.6 M28.1,10 l2.4,-1.4" stroke="#E2C9A4" stroke-width="1"/>
  <ellipse cx="30" cy="54" rx="23" ry="4.6" fill="${F(p, 'water')}"/>
  <path d="M13,54 Q13,26 30,24 Q47,26 47,54 Z" fill="${F(p, 'narwhal')}"/>
  <g fill="#6C86AE" opacity="0.55"><circle cx="21" cy="44" r="1.4"/><circle cx="38" cy="40" r="1.2"/><circle cx="36" cy="48" r="1.5"/><circle cx="24" cy="50" r="1"/></g>
  <path d="M9,54 Q30,50 51,54" stroke="#DCEAF4" stroke-width="1.4" fill="none" opacity="0.8"/>
  ${eyes(24.5, 35.5, 36, 2)}${blush(21, 39, 40.4, 2.4)}${smile(30, 40.6, 1.6)}`;

const santa = p => kit(p, ['red', 'skin', 'fur', 'gold']) + `
  <ellipse cx="23.6" cy="56.4" rx="5.4" ry="2.4" fill="#2A2438"/><ellipse cx="36.4" cy="56.4" rx="5.4" ry="2.4" fill="#2A2438"/>
  <circle cx="30" cy="43.5" r="13" fill="${F(p, 'red')}"/>
  <path d="M17.2,46 h25.6 v4 h-25.6 Z" fill="#2A2438"/><rect x="26.6" y="45" width="6.8" height="6" rx="1" fill="${F(p, 'gold')}"/>
  <path d="M30,31 v12" stroke="#FFF4E0" stroke-width="3"/>
  <circle cx="16.4" cy="41" r="3.6" fill="#2C6B47"/><circle cx="43.6" cy="41" r="3.6" fill="#2C6B47"/>
  <circle cx="30" cy="24" r="9.6" fill="${F(p, 'skin')}"/>
  <path d="M19.6,24 Q19,40 30,41 Q41,40 40.4,24 Q36,29 30,28 Q24,29 19.6,24 Z" fill="${F(p, 'fur')}"/>
  <path d="M25.6,28.6 q4.4,-2.4 8.8,0 q-4.4,1.6 -8.8,0 z" fill="#FFFFFF"/>
  <circle cx="30" cy="26" r="1.8" fill="#F2A08E"/>
  ${eyes(26.4, 33.6, 22.4, 1.5)}${blush(23.4, 36.6, 25.6, 1.8)}
  <path d="M20,18 Q24,0 41,3 Q35,9 37,17 Q29,14 20,18 Z" fill="${F(p, 'red')}"/>
  <path d="M19.6,18 Q30,13.6 40,17.6" stroke="#FFF4E0" stroke-width="4" stroke-linecap="round" fill="none"/><circle cx="41.4" cy="3.6" r="3.2" fill="#FFF4E0"/>`;

const critters = {
  reindeer: { name: 'Reindeer', size: 11, weight: 9, spots: ['snow'], draw: p => reindeer(p, false) },
  cub: { name: 'Polar bear cub', size: 10, weight: 9, spots: ['snow'], draw: polarCub },
  fox: { name: 'Arctic fox', size: 9.5, weight: 8, spots: ['snow'], draw: fox },
  hare: { name: 'Snowshoe hare', size: 7.5, weight: 8, spots: ['snow'], draw: hare },
  seal: { name: 'Seal pup', size: 9.5, weight: 8, spots: ['hole'], draw: seal },
  owl: { name: 'Snowy owl', size: 8.5, weight: 7, spots: ['air'], draw: owl },
  puffin: { name: 'Puffin', size: 7.5, weight: 7, spots: ['air'], draw: puffin },
  gingerbread: { name: 'Gingerbread friend', size: 7, weight: 6, spots: ['snow'], draw: gingerbread },
  snowman: { name: 'Snow friend', size: 10.5, weight: 5, spots: ['snow'], draw: snowFriend },
  elf: { name: 'Elf', size: 9, weight: 4, spots: ['snow'], draw: elf },
  narwhal: { name: 'Narwhal', size: 11, weight: 2.5, spots: ['hole'], draw: narwhal },
  rudolph: { name: 'Rudolph', size: 11, weight: 1.6, spots: ['snow'], draw: p => reindeer(p, true) },
  santa: { name: 'Santa', size: 12.5, weight: 1, spots: ['snow'], draw: santa },
};
for (const [k, c] of Object.entries(critters)) { c.art = c.draw(`np${k}-`); delete c.draw; }

/* ---------- the background (400 x 225) ---------- */
const grain = `<filter id="np-grain" x="-5%" y="-5%" width="110%" height="110%" color-interpolation-filters="sRGB">
  <feTurbulence type="fractalNoise" baseFrequency="1.9" numOctaves="1" seed="7" result="n"/>
  <feColorMatrix in="n" type="matrix" values="0 0 0 0 0.16  0 0 0 0 0.1  0 0 0 0 0.24  0 -2.0 0 0 1.02" result="dk"/>
  <feGaussianBlur in="SourceAlpha" stdDeviation="1.6" result="b"/>
  <feComposite in="SourceAlpha" in2="b" operator="arithmetic" k1="0" k2="2.0" k3="-1.8" k4="0" result="w"/>
  <feColorMatrix in="SourceGraphic" type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  -0.66 -1.3 -0.24 0 1.82" result="dw"/>
  <feComposite in="w" in2="dw" operator="arithmetic" k1="1.4" k2="0" k3="0.1" k4="0" result="wt"/>
  <feComposite in="wt" in2="SourceAlpha" operator="in" result="wm"/>
  <feComposite in="dk" in2="wm" operator="in" result="g"/>
  <feBlend in="g" in2="SourceGraphic" mode="multiply"/>
</filter>`;
const Gr = svg => `<g filter="url(#np-grain)">${svg}</g>`;
const tw = (x, y, s, op = 0.9) => star(x, y, s).replace('<path ', `<path opacity="${op}" `);
const bg = `<defs>${grain}
  <filter id="np-soft" x="-20%" y="-50%" width="140%" height="200%"><feGaussianBlur stdDeviation="7"/></filter>
  ${lin('np-sky', [[0, '#17203D'], [0.6, '#27395F'], [1, '#43598A']])}
  ${lin('np-hill', [[0, '#DCE6F2'], [1, '#B9C9DE']])}
  ${lin('np-snow', [[0, '#FBF8F2'], [0.6, '#EEF1F4'], [1, '#D3DEEA']])}
  ${rad('np-tree', [[0, '#5FA97A'], [0.5, '#3F8A5E'], [0.85, '#2C6B47'], [1, '#1F5236']], 0.45, 0.25, 0.85)}
  ${rad('np-gold', RAMPS.gold)}${rad('np-red', RAMPS.red)}${rad('np-mint', RAMPS.mint)}
  ${lin('np-ginger', [[0, '#E3A266'], [0.5, '#CC8649'], [1, '#A9652E']])}
  ${lin('np-roof', [[0, '#E0606C'], [0.55, '#C23A48'], [1, '#8E2333']])}
  ${lin('np-water', [[0, '#2E4A78'], [1, '#18284A']])}
  <pattern id="np-cane" patternUnits="userSpaceOnUse" width="8" height="8" patternTransform="rotate(35)"><rect width="8" height="8" fill="#FFF6EC"/><rect width="4" height="8" fill="#D9505D"/></pattern>
</defs>
<rect width="400" height="225" fill="url(#np-sky)"/>
<g filter="url(#np-soft)" opacity="0.32"><path d="M60,52 Q140,18 220,44 T380,30 L380,46 Q300,62 220,60 T60,70 Z" fill="#7FE0C2"/><path d="M120,70 Q200,48 280,66 T400,58 L400,70 Q320,80 280,78 T120,84 Z" fill="#FF9FD0"/></g>
${[[28, 22, 0.55], [96, 12, 0.4], [150, 30, 0.35], [232, 14, 0.5], [300, 24, 0.4], [372, 12, 0.5], [356, 64, 0.35], [180, 70, 0.3], [256, 92, 0.3], [20, 88, 0.35]].map(([x, y, s]) => tw(x, y, s)).join('')}
${[[60, 40], [124, 56], [200, 22], [268, 40], [330, 50], [390, 30], [12, 60], [160, 92], [312, 88]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="0.9" fill="#FFF4E0" opacity="0.75"/>`).join('')}
${Gr(`<path d="M44,18 a14,14 0 1 0 14,20 a11,11 0 1 1 -14,-20z" fill="url(#np-gold)"/>`)}
${Gr(`<path d="M0,132 Q60,108 130,122 T260,116 T400,124 V225 H0 Z" fill="url(#np-hill)"/>`)}

<!-- the workshop, far away, with glowing windows -->
${Gr(`<rect x="327" y="70" width="12" height="22" fill="url(#np-red)"/><path d="M286,104 L330,74 L374,104 Z" fill="url(#np-roof)"/><rect x="292" y="102" width="76" height="40" rx="2" fill="url(#np-ginger)"/>`)}
<path d="M283,106 L330,72 L377,106 L372,110 Q366,104 360,110 Q352,104 344,110 L330,86 L316,110 Q308,104 300,110 Q294,104 288,110 Z" fill="#FBF8F2"/>
<rect x="325" y="67" width="16" height="5" rx="2.5" fill="#FBF8F2"/>
<g fill="#FFD98A"><rect x="299" y="112" width="13" height="12" rx="2"/><rect x="348" y="112" width="13" height="12" rx="2"/></g>
<path d="M322,142 V126 Q330,118 338,126 V142 Z" fill="#8E5A38"/>
<g fill="#E6ECF4" opacity="0.7"><circle cx="334" cy="62" r="4"/><circle cx="339" cy="54" r="5"/><circle cx="335" cy="45" r="4.4"/></g>
${['#FF6B7A', '#FFD25E', '#7FE0C2', '#FF9FD0', '#9FC8FF'].map((c, i) => [0, 5, 10].map(j => {
  const x = 296 + (i + j) * 4.9; return `<circle cx="${n(x)}" cy="${n(108 + Math.sin((i + j) / 2) * 1.4)}" r="1.5" fill="${c}"/>`;
}).join('')).join('')}

<!-- the Christmas tree with presents -->
${Gr(`<rect x="51" y="140" width="10" height="16" rx="2" fill="#7A4A2C"/>
  <path d="M56,92 L90,145 Q56,154 22,145 Z" fill="url(#np-tree)"/><path d="M56,70 L82,112 Q56,120 30,112 Z" fill="url(#np-tree)"/><path d="M56,50 L74,82 Q56,88 38,82 Z" fill="url(#np-tree)"/>`)}
<g fill="#FBF8F2"><path d="M38,81 q6,5 12,2 q6,4 12,1 q6,4 12,-2 q-18,6 -36,-1z"/><path d="M30,111 q9,6 17,2 q9,5 18,1 q9,5 17,-3 q-26,9 -52,0z"/><path d="M22,144 q11,7 22,2 q12,6 24,1 q11,6 22,-3 q-34,11 -68,0z"/></g>
${[[48, 68, '#FF6B7A'], [62, 76, '#FFD25E'], [44, 96, '#7FE0C2'], [66, 102, '#FF9FD0'], [36, 128, '#FFD25E'], [56, 132, '#FF6B7A'], [76, 126, '#9FC8FF'], [55, 112, '#FFD25E']].map(([x, y, c]) =>
  `<circle cx="${x}" cy="${y}" r="3" fill="${c}" opacity="0.35"/><circle cx="${x}" cy="${y}" r="1.6" fill="${c}"/>`).join('')}
${Gr(`<path d="M56,38 l3,6 6.6,1 -4.8,4.6 1.1,6.5 -5.9,-3.1 -5.9,3.1 1.1,-6.5 -4.8,-4.6 6.6,-1z" fill="url(#np-gold)"/>`)}
${Gr(`<rect x="20" y="150" width="20" height="15" rx="2" fill="url(#np-red)"/><rect x="74" y="146" width="16" height="19" rx="2" fill="url(#np-mint)"/>`)}
<path d="M30,150 v15 M20,157 h20 M82,146 v19 M74,155 h16" stroke="#FFE7A6" stroke-width="2.2"/>

<!-- snowy ground and the ice hole -->
${Gr(`<path d="M0,150 Q100,138 200,150 Q300,162 400,148 V225 H0 Z" fill="url(#np-snow)"/>`)}
<g fill="#C9D6E6" opacity="0.6"><ellipse cx="56" cy="160" rx="48" ry="4"/><ellipse cx="200" cy="162" rx="22" ry="3"/><ellipse cx="330" cy="145" rx="46" ry="3"/></g>
${Gr(`<ellipse cx="346" cy="202" rx="44" ry="12" fill="#E3EEF6"/><ellipse cx="346" cy="203" rx="38" ry="9" fill="url(#np-water)"/>`)}
<path d="M318,202 q10,-3 20,0 M352,206 q8,-2 16,0" stroke="#7FA2BE" stroke-width="1.2" fill="none" opacity="0.8"/>

<!-- the North Pole itself -->
${Gr(`<rect x="196" y="76" width="8" height="82" rx="3" fill="url(#np-cane)"/><circle cx="200" cy="72" r="7" fill="url(#np-gold)"/>`)}
<circle cx="197.6" cy="69.6" r="1.8" fill="#FFF4E0" opacity="0.8"/>
<ellipse cx="200" cy="158" rx="14" ry="3" fill="#C9D6E6"/>
${Gr(`<rect x="176" y="92" width="48" height="16" rx="4" fill="#FFF8EC"/>`)}
<text x="200" y="103.6" text-anchor="middle" font-family="'Edu NSW ACT Foundation', Figtree, cursive" font-weight="600" font-size="9.5" fill="#C23A48">North Pole</text>
${[[112, 172], [268, 178]].map(([x, y]) => Gr(`<path d="M${x},${y} v-22 q0,-6 6,-6 q6,0 6,6" stroke="url(#np-cane)" stroke-width="3.4" fill="none" stroke-linecap="round"/>`)).join('')}`;

H.scenes.northpole = {
  card: '#e7ecf5', name: 'North Pole', title: 'the North Pole friends',
  hazeText: 'Shh… Santa’s having a nap', haze: 'rgba(255, 255, 255, .86)', hazeInk: '#9c4e6a', tone: 'rose',
  bg,
  slots: {
    g0: { type: 'snow', x: 13, y: 93, s: 0.92 }, g1: { type: 'snow', x: 27, y: 85, s: 0.86 },
    g2: { type: 'snow', x: 40, y: 96, s: 0.96 }, g3: { type: 'snow', x: 57, y: 86, s: 0.86 },
    g4: { type: 'snow', x: 66, y: 97, s: 0.96 }, g5: { type: 'snow', x: 34, y: 71, s: 0.72 },
    g6: { type: 'snow', x: 63, y: 70, s: 0.72 }, g7: { type: 'snow', x: 92, y: 74, s: 0.7 },
    w0: { type: 'hole', x: 80, y: 91 }, w1: { type: 'hole', x: 91, y: 91 },
    a0: { type: 'air', x: 30, y: 26 }, a1: { type: 'air', x: 62, y: 18 }, a2: { type: 'air', x: 88, y: 26 },
  },
  critters,
};
})();
