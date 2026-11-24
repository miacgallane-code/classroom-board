/* Santa's Sleigh: the snowy workshop village, where words can sit in it, and the default word list.
   Coordinates are in picture units (1000 x 560). A spot with a "home" word is where that word
   goes when it's in the list (cake in the kitchen, whale in the lake...).
   The look borrows the grainy-gouache technique: no outlines, soft gradient shading on every
   rounded form, and a fine grain that gathers at shape edges. Two layers: `scene` is the still
   picture (grained once, never animated); `front` holds Santa's sleigh, the fairy lights and the
   characters children can tap (class ss-tap, data-tap = what it does). */
(() => {
const n = v => Math.round(v * 10) / 10;

/* ---------- colour ramps ---------- */
const lin = (id, stops, x2 = 0, y2 = 1) => `<linearGradient id="ss-${id}" x1="0" y1="0" x2="${x2}" y2="${y2}">${
  stops.map(([o, c, a]) => `<stop offset="${o}" stop-color="${c}"${a != null ? ` stop-opacity="${a}"` : ''}/>`).join('')}</linearGradient>`;
const rad = (id, stops, cx = 0.44, cy = 0.32, r = 0.76) => `<radialGradient id="ss-${id}" cx="${cx}" cy="${cy}" r="${r}">${
  stops.map(([o, c, a]) => `<stop offset="${o}" stop-color="${c}"${a != null ? ` stop-opacity="${a}"` : ''}/>`).join('')}</radialGradient>`;

/* grain from the gouache skill, specks tinted navy-plum so they sit well on a winter night */
const grain = (id, dens, k1, k3) => `<filter id="ss-${id}" x="-5%" y="-5%" width="110%" height="110%" color-interpolation-filters="sRGB">
  <feTurbulence type="fractalNoise" baseFrequency="1.6" numOctaves="1" seed="5" result="n"/>
  <feColorMatrix in="n" type="matrix" values="0 0 0 0 0.16  0 0 0 0 0.1  0 0 0 0 0.24  0 -2.0 0 0 ${dens}" result="dk"/>
  <feGaussianBlur in="SourceAlpha" stdDeviation="3.2" result="b"/>
  <feComposite in="SourceAlpha" in2="b" operator="arithmetic" k1="0" k2="2.0" k3="-1.8" k4="0" result="w"/>
  <feColorMatrix in="SourceGraphic" type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  -0.66 -1.3 -0.24 0 1.82" result="dw"/>
  <feComposite in="w" in2="dw" operator="arithmetic" k1="${k1}" k2="0" k3="${k3}" k4="0" result="wt"/>
  <feComposite in="wt" in2="SourceAlpha" operator="in" result="wm"/>
  <feComposite in="dk" in2="wm" operator="in" result="g"/>
  <feBlend in="g" in2="SourceGraphic" mode="multiply"/>
</filter>`;

const defs = `<defs>
${grain('grain', 1.06, 1.9, 0.15)}
${grain('grainL', 0.98, 0.75, 0.06)}
<filter id="ss-soft" x="-30%" y="-30%" width="160%" height="160%"><feGaussianBlur stdDeviation="6"/></filter>
${lin('sky', [[0, '#17203D'], [0.55, '#25365F'], [1, '#3F5684']])}
${lin('hills', [[0, '#DCE6F2'], [1, '#B9C9DE']])}
${lin('snow', [[0, '#FBF8F2'], [0.6, '#EEF1F4'], [1, '#D3DEEA']])}
${rad('snowball', [[0, '#FFFFFF'], [0.5, '#F2F5F8'], [0.82, '#DCE5EF'], [1, '#BDCBDD']])}
${rad('tree', [[0, '#5FA97A'], [0.5, '#3F8A5E'], [0.85, '#2C6B47'], [1, '#1F5236']], 0.45, 0.25, 0.85)}
${lin('trunk', [[0, '#6B4430'], [0.4, '#946043'], [1, '#5A3826']], 1, 0)}
${lin('roof', [[0, '#E0606C'], [0.55, '#C23A48'], [1, '#8E2333']])}
${lin('brick', [[0, '#C9504F'], [1, '#8E2E33']], 1, 0)}
${lin('ginger', [[0, '#E3A266'], [0.5, '#CC8649'], [1, '#A9652E']])}
${lin('beam', [[0, '#B5784A'], [1, '#7E4E2E']])}
${lin('wood', [[0, '#E0AC72'], [1, '#BC8149']])}
${lin('woodDark', [[0, '#A86B3F'], [1, '#774423']])}
${rad('lamp', [[0, '#FFF1C9', 0.85], [0.6, '#FFE2A0', 0.25], [1, '#FFE2A0', 0]], 0.5, 0.05, 0.9)}
${rad('fire', [[0, '#FFF2B0'], [0.45, '#FFC04D'], [1, '#F06A2E']], 0.5, 0.7, 0.8)}
${lin('ice', [[0, '#EAF4FA'], [0.6, '#CFE2EE'], [1, '#AFC9DE']])}
${lin('cave', [[0, '#2A3760'], [1, '#18203F']])}
${lin('hedge', [[0, '#4E9A6C'], [1, '#2B6446']])}
${rad('red', [[0, '#F07A84'], [0.5, '#D9505D'], [0.85, '#B23545'], [1, '#8E2333']])}
${rad('pink', [[0, '#FFD3DE'], [0.5, '#F6B0C2'], [0.85, '#E58FA6'], [1, '#C56E88']])}
${rad('mint', [[0, '#C6EEDF'], [0.5, '#9ED9C4'], [0.85, '#6FBFA6'], [1, '#4C9A84']])}
${rad('gold', [[0, '#FFE7A6'], [0.5, '#F7D27A'], [0.85, '#E8B44A'], [1, '#C48D2A']])}
${rad('green', [[0, '#7CC394'], [0.5, '#4E9E6C'], [0.85, '#357A50'], [1, '#245A3A']])}
${rad('skin', [[0, '#FFE6D6'], [0.6, '#F9D2BC'], [1, '#E9AF95']])}
${rad('fur', [[0, '#FFFFFF'], [0.55, '#F4F1EC'], [0.85, '#E2DDD5'], [1, '#C9C2B8']])}
${rad('navy', [[0, '#55658F'], [0.5, '#3B4A72'], [1, '#1E2540']])}
${rad('cookie', [[0, '#E9A866'], [0.6, '#CB8442'], [1, '#9E5B26']])}
${rad('ginCat', [[0, '#FFC98A'], [0.55, '#F2A65A'], [1, '#C97A34']])}
${rad('deer', [[0, '#D9A57A'], [0.55, '#B9835A'], [1, '#86573A']])}
${rad('sack', [[0, '#E8C49A'], [0.6, '#CFA273'], [1, '#9F7550']])}
<pattern id="ss-pStripe" patternUnits="userSpaceOnUse" width="16" height="16"><rect width="16" height="16" fill="#CFEDE2"/><rect width="7" height="16" fill="#B7E2D3"/></pattern>
<pattern id="ss-pDots" patternUnits="userSpaceOnUse" width="18" height="18"><rect width="18" height="18" fill="#F9D9E2"/><circle cx="4.5" cy="4.5" r="2.3" fill="#F3BFCD"/><circle cx="13.5" cy="13.5" r="2.3" fill="#F3BFCD"/></pattern>
<pattern id="ss-pCandy" patternUnits="userSpaceOnUse" width="20" height="20"><rect width="20" height="20" fill="#FFF4E6"/><rect x="2" width="5" height="20" fill="#F4D0D3"/></pattern>
<pattern id="ss-pButter" patternUnits="userSpaceOnUse" width="22" height="22"><rect width="22" height="22" fill="#FBEBC0"/><path d="M11 5 l1.6 4.4 4.4 1.6 -4.4 1.6 -1.6 4.4 -1.6 -4.4 -4.4 -1.6 4.4 -1.6z" fill="#F4DB9A"/></pattern>
<pattern id="ss-pHall" patternUnits="userSpaceOnUse" width="24" height="24"><rect width="24" height="24" fill="#B9465A"/><path d="M12 3 l3 9 -3 9 -3 -9z" fill="#A83C50"/></pattern>
<pattern id="ss-pPlank" patternUnits="userSpaceOnUse" width="40" height="14"><rect width="40" height="14" fill="#D9A26E"/><rect y="12.5" width="40" height="1.5" fill="#B57F4F"/><rect x="26" width="1.5" height="13" fill="#C48D5B"/></pattern>
<pattern id="ss-pCane" patternUnits="userSpaceOnUse" width="10" height="10" patternTransform="rotate(35)"><rect width="10" height="10" fill="#FFF6EC"/><rect width="5" height="10" fill="#D9505D"/></pattern>
<path id="ss-twink" d="M0 -7 C0.9 -2.2 2.2 -0.9 7 0 C2.2 0.9 0.9 2.2 0 7 C-0.9 2.2 -2.2 0.9 -7 0 C-2.2 -0.9 -0.9 -2.2 0 -7 Z"/>
</defs>`;

const G = (svg, f = 'grain') => `<g filter="url(#ss-${f})">${svg}</g>`;
const twink = (x, y, s, fill = '#FFF4E0', op = 1) => `<use href="#ss-twink" transform="translate(${n(x)} ${n(y)}) scale(${s})" fill="${fill}" opacity="${op}"/>`;

/* ---------- cute faces: glossy eyes with a star highlight, pink blush ---------- */
const eye = (x, y, r, look = 0) => `<ellipse cx="${n(x)}" cy="${n(y)}" rx="${n(r)}" ry="${n(r * 1.15)}" fill="#1B1424"/>` +
  twink(x + r * (0.3 + look * 0.15), y - r * 0.42, n(r / 9), '#FFF4E0') +
  `<circle cx="${n(x - r * 0.32)}" cy="${n(y + r * 0.45)}" r="${n(r * 0.17)}" fill="#FFF4E0"/>`;
const ringEye = (x, y, r) => `<circle cx="${n(x)}" cy="${n(y)}" r="${n(r * 1.35)}" fill="#FFF4E0"/>` + eye(x, y, r);
const blush = (x, y, rx = 4.5) => `<ellipse cx="${n(x)}" cy="${n(y)}" rx="${rx}" ry="${n(rx * 0.6)}" fill="#FF8FAE" opacity="0.6"/>`;
const smile = (x, y, w = 4) => `<path d="M${n(x - w)},${n(y)} Q${n(x)},${n(y + w * 0.9)} ${n(x + w)},${n(y)}" stroke="#4A2230" stroke-width="1.3" fill="none" stroke-linecap="round"/>`;

/* ---------- characters (drawn around their feet at 0,0) ---------- */
const elf = (tunic, hat) => G(`
  <rect x="-9" y="-15" width="7" height="14" rx="3.5" fill="#2C6B47"/><rect x="2" y="-15" width="7" height="14" rx="3.5" fill="#245A3A"/>
  <path d="M-12,-2 q-6,0 -6,-4 q0,-3 5,-3 h6 v7z M12,-2 q6,0 6,-4 q0,-3 -5,-3 h-6 v7z" fill="#C23A48"/>
  <path d="M-15,-13 Q-17,-36 0,-38 Q17,-36 15,-13 Q0,-9 -15,-13 Z" fill="url(#ss-${tunic})"/>
  <rect x="-15" y="-23" width="30" height="5" rx="2" fill="#E8B44A"/>
  <path d="M-14,-33 q-9,6 -7,15" stroke="url(#ss-${tunic})" stroke-width="7" stroke-linecap="round" fill="none"/>
  <path d="M14,-33 q9,6 7,15" stroke="url(#ss-${tunic})" stroke-width="7" stroke-linecap="round" fill="none"/>
  <circle cx="-21" cy="-17" r="4" fill="url(#ss-skin)"/><circle cx="21" cy="-17" r="4" fill="url(#ss-skin)"/>
  <path d="M-12,-50 L-22,-56 L-11,-43 Z M12,-50 L22,-56 L11,-43 Z" fill="#F3C2A8"/>
  <circle cx="0" cy="-48" r="13" fill="url(#ss-skin)"/>
  <path d="M-14,-54 Q-6,-80 18,-79 Q9,-70 12,-58 Q0,-62 -14,-54 Z" fill="url(#ss-${hat})"/>
  <path d="M-14,-54 Q0,-61 14,-55" stroke="#FFF4E0" stroke-width="5" stroke-linecap="round" fill="none"/>
  <circle cx="18" cy="-79" r="4" fill="#FFF4E0"/>`) +
  eye(-4.6, -48, 2.3, 0.5) + eye(4.6, -48, 2.3, 0.5) + blush(-8, -43, 3) + blush(8, -43, 3) + smile(0, -42, 2.6);

const penguin = scarf => G(`
  <ellipse cx="-6" cy="-1.5" rx="6" ry="2.6" fill="#F0A040"/><ellipse cx="6" cy="-1.5" rx="6" ry="2.6" fill="#F0A040"/>
  <ellipse cx="0" cy="-22" rx="16" ry="22" fill="url(#ss-navy)"/>
  <ellipse cx="0" cy="-18" rx="10.5" ry="16" fill="url(#ss-snowball)"/>
  <path d="M-15,-24 q-7,8 -3,16 M15,-24 q7,8 3,16" stroke="#2A3459" stroke-width="5" stroke-linecap="round" fill="none"/>
  <path d="M-11,-28 Q0,-23 11,-28 L11,-24 Q0,-19 -11,-24 Z" fill="url(#ss-${scarf})"/>`) +
  ringEye(-5, -35, 2.1) + ringEye(5, -35, 2.1) +
  `<path d="M-3.5,-31 L3.5,-31 L0,-26.5 Z" fill="#F0A040"/>` + blush(-9, -30, 2.6) + blush(9, -30, 2.6);

const bear = () => G(`
  <ellipse cx="0" cy="-26" rx="32" ry="26" fill="url(#ss-fur)"/>
  <ellipse cx="-16" cy="-3" rx="11" ry="6" fill="url(#ss-fur)"/><ellipse cx="14" cy="-3" rx="11" ry="6" fill="url(#ss-fur)"/>
  <circle cx="4" cy="-60" r="5.5" fill="url(#ss-fur)"/><circle cx="30" cy="-60" r="5.5" fill="url(#ss-fur)"/>
  <circle cx="17" cy="-48" r="19" fill="url(#ss-fur)"/>
  <ellipse cx="20" cy="-41" rx="9" ry="6.5" fill="#FFFFFF"/>
  <path d="M-4,-34 Q17,-27 34,-36 L34,-30 Q17,-21 -4,-28 Z" fill="url(#ss-mint)"/>`) +
  eye(11, -50, 2.5, 0.6) + eye(24, -50, 2.5, 0.6) +
  `<ellipse cx="20" cy="-43.5" rx="3.6" ry="2.6" fill="#1B1424"/>` + blush(7, -43, 3.4) + blush(30, -43, 3.4) + smile(20, -39.5, 2.4);

const snowman = () => G(`
  <path d="M-24,-56 q-14,-8 -22,-20 M-38,-72 l-6,-2 M24,-56 q14,-8 22,-22 M40,-74 l5,-4" stroke="#7E4E2E" stroke-width="3" fill="none" stroke-linecap="round"/>
  <circle cx="0" cy="-24" r="25" fill="url(#ss-snowball)"/>
  <circle cx="0" cy="-62" r="18" fill="url(#ss-snowball)"/>
  <path d="M-16,-49 Q0,-41 16,-49 L16,-43 Q0,-35 -16,-43 Z" fill="url(#ss-red)"/>
  <path d="M8,-45 l4,20 l7,-2 l-4,-19 Z" fill="url(#ss-red)"/>`) +
  `<g class="ss-hat">${G(`<rect x="-15" y="-80" width="30" height="5" rx="2.5" fill="#2A2438"/><rect x="-10" y="-102" width="20" height="24" rx="3" fill="#2A2438"/><rect x="-10" y="-84" width="20" height="4" fill="#D9505D"/>`)}</g>` +
  eye(-5.5, -65, 2.4) + eye(5.5, -65, 2.4) + `<path d="M0,-60 l11,3 l-11,2.5 Z" fill="#F0A040"/>` + blush(-10, -58, 3) + blush(10, -58, 3) +
  `<circle cx="0" cy="-30" r="2.4" fill="#2A2438"/><circle cx="0" cy="-19" r="2.4" fill="#2A2438"/>`;

const gingerKid = () => G(`<path d="M0,-44 a10,10 0 1 1 0.1,0 Z M-9,-30 Q-20,-30 -20,-24 Q-20,-20 -10,-21 L-11,-13 Q-15,-2 -10,-1 Q-6,0 -4,-9 L0,-11 L4,-9 Q6,0 10,-1 Q15,-2 11,-13 L10,-21 Q20,-20 20,-24 Q20,-30 9,-30 Z" fill="url(#ss-cookie)"/>`) +
  `<path d="M-16,-25 q2,-2 4,0 M12,-25 q2,-2 4,0 M-12,-6 q2,-2 4,0 M8,-6 q2,-2 4,0" stroke="#FFF4E0" stroke-width="1.6" fill="none" stroke-linecap="round"/>` +
  `<circle cx="0" cy="-22" r="1.8" fill="#D9505D"/><circle cx="0" cy="-15" r="1.8" fill="#6FBFA6"/>` +
  eye(-3.6, -36, 1.7) + eye(3.6, -36, 1.7) + blush(-6.5, -32, 2) + blush(6.5, -32, 2) + smile(0, -32, 2.2);

const cat = () => G(`
  <path d="M18,-6 q16,2 12,-12 q-2,-6 -7,-3" stroke="#E08E46" stroke-width="5" fill="none" stroke-linecap="round"/>
  <ellipse cx="2" cy="-10" rx="22" ry="11" fill="url(#ss-ginCat)"/>
  <path d="M-25,-22 l2,-11 l7,7 Z M-11,-24 l4,-10 l4,9 Z" fill="#E08E46"/>
  <circle cx="-15" cy="-16" r="11" fill="url(#ss-ginCat)"/>`) +
  `<path d="M-21,-17 q2,2 4,0 M-13,-17 q2,2 4,0" stroke="#4A2230" stroke-width="1.3" fill="none" stroke-linecap="round"/>` + blush(-22, -12, 2.4) + blush(-8, -12, 2.4);

const reindeerHead = () => G(`
  <path d="M-12,-36 q-6,-16 -18,-22 M-22,-50 l-6,-12 M-15,-44 l-13,-2 M12,-36 q6,-16 18,-22 M22,-50 l6,-12 M15,-44 l13,-2" stroke="#8A5A36" stroke-width="4" fill="none" stroke-linecap="round"/>
  <ellipse cx="-17" cy="-28" rx="8" ry="4" fill="url(#ss-deer)" transform="rotate(-20 -17 -28)"/><ellipse cx="17" cy="-28" rx="8" ry="4" fill="url(#ss-deer)" transform="rotate(20 17 -28)"/>
  <rect x="-10" y="-14" width="20" height="16" rx="6" fill="url(#ss-deer)"/>
  <ellipse cx="0" cy="-24" rx="15" ry="14" fill="url(#ss-deer)"/>
  <ellipse cx="0" cy="-15" rx="9" ry="6.5" fill="#E9C9A6"/>`) +
  eye(-6, -27, 2.4) + eye(6, -27, 2.4) + `<ellipse cx="0" cy="-17" rx="3.6" ry="2.6" fill="#4A2A2A"/>` + blush(-10, -20, 3) + blush(10, -20, 3);

/* Santa's sleigh and reindeer (in the sky, top right) */
const skyDeer = (x, y, rudolph) => `
  <path d="M${x + 10},${y + 32} l-5,22 M${x + 20},${y + 32} l2,22 M${x + 42},${y + 32} l-3,22 M${x + 52},${y + 32} l4,22" stroke="#86573A" stroke-width="5" stroke-linecap="round"/>
  <path d="M${x + 58},${y + 16} q10,-4 10,6" stroke="#B9835A" stroke-width="7" fill="none" stroke-linecap="round"/>
  <ellipse cx="${x + 32}" cy="${y + 22}" rx="30" ry="15" fill="url(#ss-deer)"/>
  <path d="M${x + 14},${y + 9} v25" stroke="#D9505D" stroke-width="6"/><circle cx="${x + 14}" cy="${y + 20}" r="3.5" fill="#F7D27A"/>
  <path d="M${x + 8},${y + 16} Q${x},${y} ${x - 6},${y - 8}" stroke="#B9835A" stroke-width="13" stroke-linecap="round" fill="none"/>
  <path d="M${x - 6},${y - 20} q-2,-14 7,-24 M${x - 2},${y - 34} l9,-4 M${x - 14},${y - 20} q-9,-12 -5,-25 M${x - 16},${y - 35} l-8,-3" stroke="#8A5A36" stroke-width="3.5" fill="none" stroke-linecap="round"/>
  <ellipse cx="${x - 12}" cy="${y - 12}" rx="14" ry="10.5" fill="url(#ss-deer)"/>`;
const skyDeerFace = (x, y, rudolph) => eye(x - 14, y - 15, 2.2, -0.6) + blush(x - 8, y - 8, 2.8) +
  `<circle class="${rudolph ? 'ss-nose' : ''}" cx="${x - 26}" cy="${y - 10}" r="${rudolph ? 6.5 : 4}" fill="${rudolph ? '#E0404F' : '#5b4537'}"/>` +
  (rudolph ? `<circle cx="${x - 28}" cy="${y - 12}" r="1.8" fill="#FFD0D6"/>` : '');

const sleigh = `<g class="ss-sleigh"><g transform="translate(40 -5) scale(0.95)">
  <path d="M672,104 Q700,112 740,104 M760,100 Q796,108 832,112" stroke="#E8B44A" stroke-width="3" fill="none"/>
  ${G(skyDeer(630, 90) + skyDeer(722, 84))}
  ${skyDeerFace(630, 90, true)}${skyDeerFace(722, 84, false)}
  ${G(`<rect x="934" y="30" width="16" height="16" rx="3" fill="url(#ss-red)"/><rect x="952" y="24" width="14" height="22" rx="3" fill="url(#ss-mint)"/>`)}
  <g class="ss-sack">${G(`<path d="M916,114 Q904,76 928,58 L924,46 Q950,36 974,46 L968,58 Q994,78 982,114 Z" fill="url(#ss-sack)"/>`)}
    <path d="M928,57 Q948,64 968,57" stroke="#7E5A3A" stroke-width="4" fill="none" stroke-linecap="round"/></g>
  ${G(`<path d="M858,94 Q846,80 850,66" stroke="#C23A48" stroke-width="9" stroke-linecap="round" fill="none"/>
  <circle cx="880" cy="98" r="22" fill="url(#ss-red)"/>
  <circle cx="880" cy="68" r="13" fill="url(#ss-skin)"/>
  <path d="M866,61 Q872,43 890,47 L899,58 Q886,55 866,61 Z" fill="url(#ss-red)"/>`)}
  <circle cx="850" cy="63" r="5.5" fill="#FFF4E0"/>
  <path d="M867,70 Q880,96 893,70 Q886,77 880,76 Q874,77 867,70 Z" fill="#FFF8EE"/>
  <path d="M866,61 Q880,55 894,59" stroke="#FFF4E0" stroke-width="5" stroke-linecap="round" fill="none"/>
  <circle cx="900" cy="58" r="4.5" fill="#FFF4E0"/>
  ${eye(875.5, 66, 1.8, -0.5)}${eye(884.5, 66, 1.8, -0.5)}${blush(871, 71, 2.6)}${blush(889, 71, 2.6)}
  ${G(`<path d="M826,100 q-14,-4 -12,-16 q2,-8 10,-6" stroke="#C23A48" stroke-width="8" fill="none" stroke-linecap="round"/>
  <path d="M826,98 Q822,150 852,152 H938 Q962,152 966,122 L970,92 Q956,104 934,106 H872 Q850,106 842,98 Z" fill="url(#ss-red)"/>`)}
  <path d="M842,99 Q850,106 872,106 H934 Q956,104 970,92" stroke="#F7D27A" stroke-width="4" fill="none" stroke-linecap="round"/>
  ${twink(900, 128, 1.1, '#F7D27A')}
  <path d="M850,152 v14 M935,152 v14" stroke="#E8B44A" stroke-width="5"/>
  <path d="M812,166 H948 Q972,166 972,146 M812,166 q-12,0 -12,-10" stroke="#E8B44A" stroke-width="5" fill="none" stroke-linecap="round"/>
</g></g>`;

/* ---------- the still picture ---------- */
const stars = [[40, 40, 0.7], [200, 30, 0.5], [300, 150, 0.45], [420, 22, 0.6], [585, 28, 0.45], [700, 160, 0.5], [960, 175, 0.55],
  [990, 330, 0.4], [20, 230, 0.5], [270, 230, 0.4], [770, 230, 0.45], [600, 190, 0.35]];
const dots = [[120, 140], [345, 40], [470, 140], [655, 15], [980, 260], [60, 300], [720, 230], [250, 120], [555, 105], [810, 215], [30, 130], [905, 250]];

const tree = G(`
  <rect x="139" y="398" width="22" height="44" rx="4" fill="url(#ss-trunk)"/>
  <path d="M150,250 L282,412 Q150,438 18,412 Z" fill="url(#ss-tree)"/>
  <path d="M150,160 L252,305 Q150,326 48,305 Z" fill="url(#ss-tree)"/>
  <path d="M150,94 L216,205 Q150,222 84,205 Z" fill="url(#ss-tree)"/>`) +
  `<g fill="#FBF8F2"><path d="M86,203 Q100,215 114,207 Q128,218 142,209 Q156,219 170,209 Q186,218 200,207 Q210,214 216,205 Q150,222 86,203Z"/>
  <path d="M50,303 Q70,318 92,307 Q112,321 134,309 Q156,322 176,309 Q198,321 220,307 Q238,317 252,305 Q150,326 50,303Z"/>
  <path d="M20,410 Q44,428 70,415 Q96,431 122,417 Q150,433 176,418 Q204,432 230,416 Q258,429 282,412 Q150,438 20,410Z"/></g>
  <g stroke="#F7D27A" stroke-width="3.5" fill="none" stroke-dasharray="1 9" stroke-linecap="round" opacity="0.9">
  <path d="M104,170 Q150,190 198,165"/><path d="M66,282 Q150,302 236,276"/><path d="M38,392 Q150,410 262,386"/></g>` +
  G(`<path d="M150,64 l7.4,15 16.6,2.4 -12,11.7 2.8,16.5 -14.8,-7.8 -14.8,7.8 2.8,-16.5 -12,-11.7 16.6,-2.4z" fill="url(#ss-gold)"/>`);

const maze = G(`<rect x="15" y="462" width="176" height="88" rx="18" fill="url(#ss-hedge)"/>`) +
  `<path d="M32,478 H174 M32,478 V534 H90 M108,494 V534 H174 M50,494 H90 V520 M128,478 V512 H156 M174,478 V520" stroke="#E9F1EC" stroke-width="8" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
  <path d="M15,470 Q15,458 30,460 Q50,452 70,460 Q92,452 112,460 Q134,452 154,460 Q176,452 191,468 L191,474 Q100,462 15,476Z" fill="#FBF8F2"/>`;

const signpost = G(`<rect x="236" y="440" width="9" height="78" rx="4" fill="url(#ss-pCane)"/>`) +
  `<ellipse cx="240" cy="520" rx="16" ry="4" fill="#B9C9DE"/>`;

const fence = G(`<rect x="294" y="478" width="154" height="7" rx="3.5" fill="#E8D3B8"/><rect x="294" y="502" width="154" height="7" rx="3.5" fill="#E8D3B8"/>
  ${[298, 314, 330, 410, 426, 442].map(x => `<rect x="${x - 4}" y="464" width="9" height="60" rx="4.5" fill="url(#ss-pCane)"/>`).join('')}
  <path d="M344,526 V478 Q371,452 398,478 V526" stroke="#E8B44A" stroke-width="7" fill="none"/>`, 'grainL');

/* the workshop, cut open so you can see into every room */
const rooms = [
  [293, 178, 139, 115, 'pStripe'], [438, 178, 144, 115, 'pDots'], [588, 178, 139, 115, 'pCandy'],
  [293, 303, 139, 133, 'pButter'], [438, 303, 144, 133, 'pHall'], [588, 303, 139, 133, 'pPlank'],
];
const roomBits = `
  <!-- kitchen: oven and a table with a cake -->
  ${G(`<rect x="378" y="232" width="50" height="61" rx="6" fill="url(#ss-red)"/>`)}
  <rect x="386" y="252" width="34" height="24" rx="5" fill="#FFD58A"/><rect x="384" y="238" width="38" height="5" rx="2.5" fill="#8E2333"/>
  ${G(`<rect x="298" y="268" width="66" height="8" rx="3" fill="url(#ss-wood)"/><rect x="304" y="274" width="6" height="19" fill="url(#ss-woodDark)"/><rect x="352" y="274" width="6" height="19" fill="url(#ss-woodDark)"/>`)}
  ${G(`<rect x="316" y="246" width="30" height="22" rx="5" fill="url(#ss-pink)"/>`)}
  <path d="M316,251 q3.7,4 7.5,0 q3.7,4 7.5,0 q3.7,4 7.5,0 q3.7,4 7.5,0" stroke="#FFF4E0" stroke-width="3" fill="none"/>
  <circle cx="331" cy="243" r="4" fill="#D9505D"/>
  <!-- toy room: a shelf of toys -->
  ${G(`<rect x="444" y="240" width="132" height="7" rx="3" fill="url(#ss-wood)"/>`)}
  ${G(`<rect x="560" y="222" width="14" height="18" rx="3" fill="url(#ss-mint)"/><rect x="546" y="228" width="12" height="12" rx="3" fill="url(#ss-gold)"/>
  <circle cx="452" cy="230" r="8" fill="url(#ss-deer)"/><circle cx="452" cy="218" r="6" fill="url(#ss-deer)"/><circle cx="447" cy="213" r="2.6" fill="url(#ss-deer)"/><circle cx="457" cy="213" r="2.6" fill="url(#ss-deer)"/>
  <rect x="548" y="268" width="26" height="25" rx="4" fill="url(#ss-red)"/><path d="M548,272 h26" stroke="#F7D27A" stroke-width="3"/>`)}
  <!-- wrapping room: a table piled with presents -->
  ${G(`<rect x="596" y="272" width="94" height="8" rx="3" fill="url(#ss-wood)"/><rect x="602" y="278" width="6" height="15" fill="url(#ss-woodDark)"/><rect x="678" y="278" width="6" height="15" fill="url(#ss-woodDark)"/>
  <rect x="650" y="246" width="26" height="26" rx="3" fill="url(#ss-mint)"/><rect x="657" y="232" width="16" height="14" rx="3" fill="url(#ss-gold)"/>`)}
  <path d="M663,246 v26 M650,259 h26" stroke="#D9505D" stroke-width="3.5"/>
  ${G(`<circle cx="602" cy="200" r="7" fill="url(#ss-red)"/><circle cx="620" cy="200" r="7" fill="url(#ss-gold)"/>`)}
  <path d="M596,192 h32" stroke="#7E4E2E" stroke-width="3" stroke-linecap="round"/>
  <!-- mail room: pigeonholes and a sack of letters -->
  ${G(`<rect x="300" y="314" width="126" height="64" rx="5" fill="url(#ss-woodDark)"/>`)}
  ${[0, 1, 2, 3].flatMap(c => [0, 1].map(r => `<rect x="${306 + c * 30}" y="${320 + r * 28}" width="25" height="22" rx="2" fill="#5E3820"/><rect x="${309 + c * 30}" y="${329 + r * 28}" width="19" height="12" rx="1.5" fill="${['#FFF4E0', '#F9D9E2', '#CFEDE2', '#FBEBC0'][(c + r) % 4]}"/>`)).join('')}
  ${G(`<path d="M370,436 Q356,400 378,388 L374,380 Q396,372 418,380 L412,388 Q434,400 422,436 Z" fill="url(#ss-sack)"/>`)}
  <path d="M396,410 c-6,-7 -14,1 0,10 c14,-9 6,-17 0,-10z" fill="#D9505D"/>
  <!-- hall: fireplace with stockings -->
  ${G(`<rect x="468" y="356" width="84" height="80" rx="6" fill="url(#ss-brick)"/><rect x="460" y="348" width="100" height="10" rx="4" fill="url(#ss-wood)"/>`)}
  <path d="M484,436 V398 Q510,374 536,398 V436 Z" fill="#3A2030"/>
  <path class="ss-flame" d="M496,436 Q490,416 502,404 Q500,418 508,414 Q506,398 516,392 Q516,408 524,410 Q528,420 524,436 Z" fill="url(#ss-fire)"/>
  ${G(`<path d="M474,358 h14 v14 q0,6 -6,6 h-12 q-4,0 -4,-4 q0,-4 4,-4 h4 z" fill="url(#ss-red)"/><path d="M503,358 h14 v14 q0,6 -6,6 h-12 q-4,0 -4,-4 q0,-4 4,-4 h4 z" fill="url(#ss-mint)"/><path d="M532,358 h14 v14 q0,6 -6,6 h-12 q-4,0 -4,-4 q0,-4 4,-4 h4 z" fill="url(#ss-gold)"/>`)}
  <!-- stable: hay, a cape on a peg and a stall -->
  ${G(`<path d="M600,346 q14,-6 28,0 l10,40 q-24,8 -48,0 z" fill="url(#ss-red)"/>`)}
  <circle cx="614" cy="343" r="3" fill="#7E4E2E"/>
  ${G(`<rect x="596" y="412" width="44" height="24" rx="5" fill="url(#ss-gold)"/><rect x="650" y="390" width="72" height="46" rx="3" fill="url(#ss-woodDark)"/>`)}
  <path d="M600,420 h36 M600,428 h36" stroke="#C48D2A" stroke-width="1.6"/><path d="M656,396 L716,430 M716,396 L656,430" stroke="#5E3820" stroke-width="4"/>`;

const house = G(`
  <rect x="366" y="58" width="36" height="66" rx="3" fill="url(#ss-brick)"/>
  <path d="M255,172 L510,40 L765,172 Z" fill="url(#ss-roof)"/>
  <rect x="283" y="168" width="454" height="276" rx="6" fill="url(#ss-ginger)"/>`) +
  `<rect x="362" y="52" width="44" height="12" rx="6" fill="#FBF8F2"/>
  <path d="M247,176 L510,30 L773,176 L765,186 Q752,176 740,186 Q726,178 712,188 Q700,168 676,152 L510,58 L344,152 Q320,168 308,188 Q294,178 280,186 Q268,176 255,186 Z" fill="#FBF8F2"/>` +
  G(`<circle cx="510" cy="118" r="26" fill="url(#ss-gold)"/>`) + `<path d="M510,94 v48 M486,118 h48" stroke="#B5784A" stroke-width="4"/>` +
  rooms.map(([x, y, w, h, pat]) => `<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="url(#ss-${pat})"/>`).join('') +
  `<clipPath id="ss-roomClip">${rooms.map(([x, y, w, h]) => `<rect x="${x}" y="${y}" width="${w}" height="${h}"/>`).join('')}</clipPath>` +
  `<g clip-path="url(#ss-roomClip)">${rooms.map(([x, y, w, h]) => `<ellipse cx="${x + w / 2}" cy="${y}" rx="${w * 0.62}" ry="${h * 0.95}" fill="url(#ss-lamp)"/>`).join('')}</g>` +
  G(`<rect x="285" y="293" width="450" height="11" fill="url(#ss-beam)"/><rect x="285" y="436" width="450" height="9" fill="url(#ss-beam)"/>
  <rect x="432" y="176" width="7" height="264" fill="url(#ss-beam)"/><rect x="582" y="176" width="7" height="264" fill="url(#ss-beam)"/>`) +
  roomBits;

const ground = G(`<path d="M0,442 Q250,428 500,447 Q750,464 1000,450 V560 H0 Z" fill="url(#ss-snow)"/>`, 'grainL') +
  `<g fill="#C9D6E6" opacity="0.7"><ellipse cx="150" cy="446" rx="140" ry="9"/><ellipse cx="510" cy="451" rx="240" ry="9"/><ellipse cx="680" cy="532" rx="44" ry="6"/><ellipse cx="500" cy="534" rx="36" ry="6"/></g>`;

const caveHill = G(`<path d="M742,452 Q752,300 850,252 Q930,214 1000,238 V470 Z" fill="url(#ss-snow)"/>`, 'grainL') +
  G(`<path d="M836,454 Q836,362 886,356 Q936,362 936,454 Z" fill="url(#ss-cave)"/><rect x="882" y="330" width="8" height="28" rx="3" fill="url(#ss-woodDark)"/>`) +
  `<path d="M846,372 l5,13 l5,-11 l5,10 l5,-13 l5,12 l5,-12 l5,11 l5,-12 l5,12 l5,-10 l5,11 l5,-12 l5,10" stroke="#EAF4FA" stroke-width="3.5" fill="none" stroke-linejoin="round"/>`;

const lake = G(`<ellipse cx="850" cy="505" rx="136" ry="40" fill="url(#ss-ice)"/>`, 'grainL') +
  `<path d="M740,496 l40,-10 M812,526 l50,-12 M900,478 l30,-6" stroke="#FFFFFF" stroke-width="4" stroke-linecap="round" opacity="0.8"/>
  <ellipse cx="958" cy="498" rx="22" ry="6.5" fill="#7FA2BE"/>` +
  G(`<path d="M955,498 Q950,482 956,468 Q944,460 930,464 Q942,452 957,460 Q972,452 986,464 Q972,460 961,468 Q966,482 962,498 Z" fill="url(#ss-navy)"/>`) +
  `<g fill="#CFE2EE"><circle cx="946" cy="448" r="3"/><circle cx="964" cy="440" r="2.5"/><circle cx="954" cy="432" r="2"/></g>`;

const hills = G(`<path d="M0,338 Q150,282 300,312 T600,300 T850,286 T1000,302 V560 H0 Z" fill="url(#ss-hills)"/>`, 'grainL') +
  [[60, 330, 0.8], [96, 318, 0.6], [598, 300, 0.7], [628, 306, 0.55], [770, 292, 0.6]].map(([x, y, s]) =>
    `<path d="M${x},${y - 40 * s} L${x + 16 * s},${y} H${x - 16 * s} Z" fill="#7DAE96" opacity="0.8"/>`).join('');

const scene = `${defs}
<rect width="1000" height="560" fill="url(#ss-sky)"/>
${stars.map(([x, y, s]) => twink(x, y, s, '#FFF4E0', 0.9)).join('')}
${dots.map(([x, y]) => `<circle cx="${x}" cy="${y}" r="1.4" fill="#FFF4E0" opacity="0.75"/>`).join('')}
${G(`<path d="M86,44 a30,30 0 1 0 30,42 a24,24 0 1 1 -30,-42z" fill="url(#ss-gold)"/>`)}
${hills}${caveHill}${ground}${tree}${house}${maze}${signpost}${fence}${lake}`;

/* ---------- the front layer: sleigh, fairy lights and characters to tap ---------- */
const bulbColours = ['#FF6B7A', '#FFD25E', '#7FE0C2', '#FF9FD0', '#9FC8FF'];
const bulbPts = [];
for (let x = 268; x <= 752; x += 22) bulbPts.push([x, 178 + Math.sin((x - 268) / 44 * Math.PI) * -1 + 6 + ((x / 22) % 2 ? 3 : 0)]);
[[112, 172], [136, 181], [162, 182], [188, 174], [76, 288], [104, 296], [134, 300], [166, 300], [198, 294], [228, 284],
  [48, 396], [80, 404], [112, 407], [146, 408], [180, 406], [214, 401], [248, 393]].forEach(p => bulbPts.push(p));
[[306, 188], [336, 192], [366, 192], [396, 188], [454, 188], [486, 193], [518, 193], [550, 188], [604, 188], [636, 192], [668, 192], [700, 188],
  [306, 314], [340, 318], [374, 318], [408, 314], [454, 314], [488, 318], [522, 318], [556, 314], [604, 314], [638, 318], [672, 318], [706, 314]].forEach(p => bulbPts.push(p));
// light them up all over the picture, not left to right
const order = bulbPts.map((_, i) => i).sort((a, b) => ((a * 37) % 61) - ((b * 37) % 61));
const lights = `<path d="M262,180 Q510,${196} 758,180" stroke="#2A2438" stroke-width="1.5" fill="none" opacity="0.6"/>` +
  bulbPts.map(([x, y], i) => {
    const c = bulbColours[i % bulbColours.length];
    return `<g class="ss-bulb" data-i="${order.indexOf(i)}" style="--tw:${((i * 0.37) % 2).toFixed(2)}s"><circle class="ss-halo" cx="${n(x)}" cy="${n(y + 2)}" r="8" fill="${c}"/><circle cx="${n(x)}" cy="${n(y + 2)}" r="3.6" fill="${c}"/><rect x="${n(x - 1.6)}" y="${n(y - 3)}" width="3.2" height="3" fill="#2A2438"/></g>`;
  }).join('');

const tap = (kind, x, y, s, svg, label) => `<g class="ss-tap" data-tap="${kind}" role="img" aria-label="${label}" transform="translate(${x} ${y}) scale(${s})"><g class="ss-tap-in">${svg}</g></g>`;
const front = `
${sleigh}
${lights}
<g class="ss-smoke" aria-hidden="true"><circle cx="384" cy="36" r="9" fill="#E6ECF4"/><circle cx="396" cy="20" r="12" fill="#E6ECF4"/><circle cx="380" cy="4" r="10" fill="#E6ECF4"/></g>
${tap('puff', 0, 0, 1, '<rect x="362" y="50" width="44" height="74" fill="transparent"/>', 'Chimney')}
${tap('flare', 0, 0, 1, '<rect x="484" y="390" width="52" height="46" fill="transparent"/>', 'Fireplace')}
${tap('wave', 468, 293, 0.78, elf('green', 'red'), 'Elf')}
${tap('hop', 708, 293, 0.72, elf('red', 'mint'), 'Elf')}
${tap('nod', 686, 394, 0.9, reindeerHead(), 'Reindeer')}
${tap('purr', 568, 436, 0.75, cat(), 'Cat')}
${tap('hop', 270, 532, 0.9, gingerKid(), 'Gingerbread kid')}
${tap('hat', 500, 534, 0.85, snowman(), 'Snowman')}
${tap('wave', 680, 538, 0.95, bear(), 'Polar bear')}
${tap('slide', 772, 452, 0.85, penguin('red'), 'Penguin')}
${tap('slide', 806, 458, 0.75, penguin('mint'), 'Penguin')}`;

window.SLEIGH = {
  words: ['name', 'game', 'make', 'bake', 'cake', 'lake', 'came', 'gate', 'late', 'hate', 'made', 'gave', 'cape', 'tape',
    'shape', 'save', 'cave', 'shade', 'whale', 'take', 'safe', 'lane', 'same', 'mate', 'wake', 'pale', 'fake', 'tame', 'maze'],
  sack: { x: 943, y: 75 },
  bulbs: bulbPts.length,
  spots: [
    { id: 't1', x: 150, y: 196, kind: 'bauble', c: 0 },
    { id: 't2', x: 98, y: 280, kind: 'bauble', c: 1 },
    { id: 't3', x: 204, y: 280, kind: 'bauble', c: 2 },
    { id: 't4', x: 150, y: 366, kind: 'bauble', c: 1 },
    { id: 'a1', x: 248, y: 82, kind: 'star' },
    { id: 'a2', x: 860, y: 196, kind: 'star' },
    { id: 'k1', x: 332, y: 210, kind: 'tag', home: 'cake' },
    { id: 'k2', x: 398, y: 262, kind: 'sign', home: 'bake' },
    { id: 'r1', x: 510, y: 208, kind: 'tag', home: 'game' },
    { id: 'r2', x: 536, y: 266, kind: 'tag', home: 'make' },
    { id: 'w1', x: 628, y: 254, kind: 'tag', home: 'tape' },
    { id: 'w2', x: 686, y: 208, kind: 'tag', home: 'gave' },
    { id: 'm1', x: 352, y: 346, kind: 'stocking', home: 'name' },
    { id: 'm2', x: 360, y: 408, kind: 'stocking', home: 'made' },
    { id: 'hl', x: 510, y: 330, kind: 'sign', home: 'save' },
    { id: 'sb', x: 628, y: 336, kind: 'tag', home: 'cape' },
    { id: 'ln', x: 240, y: 452, kind: 'sign', home: 'lane' },
    { id: 'gt', x: 371, y: 494, kind: 'sign', home: 'gate' },
    { id: 'mz', x: 102, y: 506, kind: 'sign', home: 'maze' },
    { id: 'fg', x: 588, y: 506, kind: 'snow', home: 'shape' },
    { id: 'cv', x: 886, y: 318, kind: 'sign', home: 'cave' },
    { id: 'lk', x: 786, y: 510, kind: 'ice', home: 'lake' },
    { id: 'wh', x: 886, y: 506, kind: 'ice', home: 'whale' },
  ],
  scene,
  front,
  testNames: ['Test Ava', 'Test Noah', 'Test Mia', 'Test Leo', 'Test Isla', 'Test Jack', 'Test Zara', 'Test Kai'],
};
})();
