/* Santa's Sleigh: the snowy picture, where words can sit in it, and the default word list.
   Coordinates are in picture units (1000 x 560). A spot with a "home" word is where that word
   goes when it's in the list (cake in the gingerbread house, whale in the lake...). */
(() => {
const deer = (x, y, rudolph) => `
<g class="ss-deer" style="animation-delay:${rudolph ? 0 : 0.5}s">
  <path d="M${x + 10},${y + 32} l-5,24 M${x + 20},${y + 32} l2,24 M${x + 42},${y + 32} l-3,24 M${x + 52},${y + 32} l4,24" stroke="#8A6A52" stroke-width="5" stroke-linecap="round"/>
  <path d="M${x + 58},${y + 16} q10,-4 10,6" stroke="#A9866A" stroke-width="7" fill="none" stroke-linecap="round"/>
  <ellipse cx="${x + 32}" cy="${y + 22}" rx="30" ry="15" fill="#A9866A"/>
  <path d="M${x + 14},${y + 10} v24" stroke="#C0727C" stroke-width="6"/>
  <path d="M${x + 8},${y + 16} Q${x},${y} ${x - 6},${y - 8}" stroke="#A9866A" stroke-width="13" stroke-linecap="round" fill="none"/>
  <path d="M${x - 6},${y - 20} q-2,-14 7,-24 M${x - 2},${y - 34} l9,-4 M${x - 14},${y - 20} q-9,-12 -5,-25 M${x - 16},${y - 35} l-8,-3" stroke="#7A5C45" stroke-width="3.5" fill="none" stroke-linecap="round"/>
  <ellipse cx="${x - 12}" cy="${y - 12}" rx="14" ry="10" fill="#A9866A"/>
  <circle cx="${x - 13}" cy="${y - 16}" r="2.2" fill="#3a3038"/>
  <circle class="${rudolph ? 'ss-nose' : ''}" cx="${x - 26}" cy="${y - 10}" r="${rudolph ? 6.5 : 4}" fill="${rudolph ? '#D0505F' : '#5b4537'}"/>
</g>`;

const stocking = (x, col) => `
<path d="M${x - 22},78 H${x + 22} V124 Q${x + 22},148 ${x - 2},148 H${x - 30} Q${x - 48},148 ${x - 48},133 Q${x - 48},120 ${x - 30},120 H${x - 22} Z" fill="${col}"/>
<rect x="${x - 30}" y="60" width="60" height="22" rx="8" fill="#FBFAF6" stroke="#E2DCD0" stroke-width="2"/>`;

const scene = `
<defs>
  <linearGradient id="ss-sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#D9E5EA"/><stop offset="1" stop-color="#F6F2E9"/></linearGradient>
  <linearGradient id="ss-ice" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#DCEAEF"/><stop offset="1" stop-color="#C2D8E0"/></linearGradient>
</defs>
<rect width="1000" height="560" fill="url(#ss-sky)"/>
<g fill="#FFFFFF" opacity=".8"><circle cx="620" cy="150" r="2.5"/><circle cx="700" cy="30" r="2"/><circle cx="990" cy="18" r="2.5"/><circle cx="260" cy="40" r="2"/><circle cx="40" cy="30" r="2.5"/><circle cx="760" cy="190" r="2"/></g>

<path d="M0,345 Q120,300 260,325 T540,318 T820,300 T1000,322 L1000,560 L0,560 Z" fill="#E8EFF1"/>

<!-- snowy hill with the cave -->
<path d="M716,410 Q740,255 830,206 Q900,172 960,190 Q1000,204 1000,232 L1000,430 Z" fill="#F4F6F6" stroke="#DCE3E6" stroke-width="3"/>
<path d="M816,396 Q816,302 872,296 Q928,302 928,396 Z" fill="#6A6778"/>
<path d="M836,396 Q838,324 872,318 Q906,324 908,396 Z" fill="#4E4B5C"/>
<path d="M830,318 l6,14 l5,-12 l6,10 l5,-14 l6,12 l5,-13 l6,11 l5,-12 l6,12 l5,-10" stroke="#FBFAF6" stroke-width="3" fill="none" stroke-linejoin="round"/>
<rect x="868" y="248" width="8" height="48" rx="3" fill="#9C7A5B"/>

<!-- ground -->
<path d="M0,412 Q180,382 380,404 Q600,428 780,398 Q900,382 1000,400 L1000,560 L0,560 Z" fill="#FBFAF6"/>
<g stroke="#E4EAED" stroke-width="4" fill="none" stroke-linecap="round">
  <path d="M330,440 Q370,432 410,440"/><path d="M700,520 Q740,512 780,520"/><path d="M20,548 Q70,540 120,548"/><path d="M640,410 Q680,404 720,410"/>
</g>

<!-- stockings on a line -->
<path d="M296,40 Q445,74 594,40" stroke="#9C7A5B" stroke-width="2.5" fill="none"/>
${stocking(345, '#C0727C')}${stocking(440, '#8FAA8A')}${stocking(535, '#7FA2AE')}

<!-- Christmas tree -->
<ellipse cx="160" cy="470" rx="150" ry="16" fill="#E9EEF0"/>
<rect x="146" y="428" width="28" height="44" rx="4" fill="#9C7A5B"/>
<path d="M160,250 L345,445 Q160,472 -25,445 Z" fill="#6F8C6E"/>
<path d="M160,150 L300,322 Q160,342 20,322 Z" fill="#7E9B7B"/>
<path d="M160,70 L245,205 Q160,222 75,205 Z" fill="#8FAA8A"/>
<g stroke="#FBFAF6" stroke-width="7" fill="none" stroke-linecap="round">
  <path d="M80,205 Q100,215 120,207 Q140,217 160,209 Q180,219 200,208 Q222,216 240,205"/>
  <path d="M26,322 Q60,334 94,324 Q127,336 160,326 Q193,337 226,325 Q260,335 294,322"/>
  <path d="M-15,445 Q30,458 75,448 Q118,460 160,450 Q203,461 246,449 Q290,459 335,445"/>
</g>
<g stroke="#E2C27A" stroke-width="4" fill="none" stroke-dasharray="2 8" stroke-linecap="round">
  <path d="M112,150 Q165,172 214,148"/><path d="M60,300 Q160,318 262,292"/><path d="M28,425 Q160,440 300,415"/>
</g>
<polygon points="160,38 165.9,53.9 182.8,54.6 169.5,65.1 174.1,81.4 160,72 145.9,81.4 150.5,65.1 137.2,54.6 154.1,53.9" fill="#E9C25E" stroke="#C9A256" stroke-width="2" stroke-linejoin="round"/>

<!-- presents -->
<rect x="28" y="468" width="100" height="70" rx="6" fill="#D49BA3"/>
<rect x="72" y="468" width="12" height="70" fill="#FBF6EA"/>
<path d="M78,468 q-22,-22 -30,-6 q8,10 30,6 q22,-22 30,-6 q-8,10 -30,6" fill="#FBF6EA"/>
<rect x="136" y="450" width="74" height="88" rx="6" fill="#A9C1C8"/>
<rect x="136" y="486" width="74" height="12" fill="#E2C27A"/>
<path d="M173,450 q-16,-20 -24,-6 q6,8 24,6 q16,-20 24,-6 q-6,8 -24,6" fill="#E2C27A"/>
<rect x="222" y="470" width="98" height="68" rx="6" fill="#E5CF98"/>
<path d="M222,492 H300 L314,486" stroke="#F8F2DF" stroke-width="10" stroke-linecap="round" fill="none" opacity=".9"/>
<circle cx="334" cy="526" r="13" fill="#F3EEE2" stroke="#C9B48A" stroke-width="4"/><circle cx="334" cy="526" r="5" fill="#FBFAF6" stroke="#C9B48A" stroke-width="2"/>

<!-- gingerbread house -->
<rect x="500" y="178" width="24" height="50" fill="#B07A5C"/>
<rect x="496" y="172" width="32" height="10" rx="5" fill="#FBFAF6"/>
<rect x="368" y="255" width="170" height="168" fill="#CFA27A"/>
<path d="M348,265 L453,168 L558,265 Z" fill="#B07A5C"/>
<path d="M348,265 L453,168 L558,265" stroke="#FBFAF6" stroke-width="9" fill="none" stroke-linejoin="round" stroke-linecap="round"/>
<g fill="#FBFAF6"><circle cx="372" cy="250" r="5"/><circle cx="392" cy="232" r="5"/><circle cx="412" cy="214" r="5"/><circle cx="494" cy="214" r="5"/><circle cx="514" cy="232" r="5"/><circle cx="534" cy="250" r="5"/></g>
<rect x="380" y="280" width="56" height="46" rx="6" fill="#F6E7C1" stroke="#FBFAF6" stroke-width="5"/>
<path d="M408,280 v46 M380,303 h56" stroke="#FBFAF6" stroke-width="4"/>
<rect x="466" y="280" width="56" height="46" rx="6" fill="#F6E7C1" stroke="#FBFAF6" stroke-width="5"/>
<path d="M478,320 h32" stroke="#C9B48A" stroke-width="3" stroke-linecap="round"/>
<rect x="482" y="302" width="24" height="17" rx="3" fill="#E8C3C8"/>
<path d="M482,306 q4,4 8,0 q4,4 8,0 q4,4 8,0" stroke="#FBFAF6" stroke-width="3" fill="none"/>
<path d="M494,302 v-8" stroke="#9FB7C0" stroke-width="3"/><circle cx="494" cy="291" r="3" fill="#E9A85E"/>
<path d="M386,423 V372 Q386,350 408,350 Q430,350 430,372 V423 Z" fill="#8E6248"/>
<circle cx="422" cy="390" r="3" fill="#E2C27A"/>
<g><circle cx="378" cy="418" r="5" fill="#C0727C"/><circle cx="398" cy="418" r="5" fill="#8FAA8A"/><circle cx="440" cy="418" r="5" fill="#7FA2AE"/><circle cx="460" cy="418" r="5" fill="#C0727C"/><circle cx="480" cy="418" r="5" fill="#8FAA8A"/><circle cx="500" cy="418" r="5" fill="#7FA2AE"/><circle cx="520" cy="418" r="5" fill="#C0727C"/></g>

<!-- fence and gate -->
<rect x="543" y="366" width="108" height="7" rx="3" fill="#E3D6BE"/>
<rect x="543" y="394" width="108" height="7" rx="3" fill="#E3D6BE"/>
${[548, 561, 574, 587, 600, 613, 626, 639].map(x => `<rect x="${x}" y="352" width="9" height="62" rx="4.5" fill="#FBF6EA" stroke="#D3C6AE" stroke-width="2"/>`).join('')}

<!-- snowman -->
<g stroke="#D3DDE2" stroke-width="3">
  <circle cx="695" cy="442" r="46" fill="#FFFFFF"/><circle cx="695" cy="375" r="33" fill="#FFFFFF"/><circle cx="695" cy="322" r="24" fill="#FFFFFF"/>
</g>
<path d="M664,372 q-24,-14 -36,-30 M726,372 q22,-10 34,-28" stroke="#8A6A52" stroke-width="4" fill="none" stroke-linecap="round"/>
<path d="M672,344 Q695,354 718,344 L716,352 Q695,362 674,352 Z" fill="#C0727C"/>
<path d="M708,348 l8,24 l9,-3 l-7,-22 Z" fill="#C0727C"/>
<rect x="676" y="290" width="38" height="8" rx="3" fill="#4E4B5C"/>
<rect x="682" y="266" width="26" height="28" rx="4" fill="#4E4B5C"/>
<rect x="682" y="284" width="26" height="6" fill="#C0727C"/>
<circle cx="687" cy="317" r="2.6" fill="#3a3038"/><circle cx="703" cy="317" r="2.6" fill="#3a3038"/>
<path d="M695,324 l14,4 l-14,3 Z" fill="#E9A85E"/>
<g fill="#4E4B5C"><circle cx="695" cy="368" r="3"/><circle cx="695" cy="384" r="3"/></g>

<!-- lane sign post -->
<rect x="778" y="300" width="8" height="100" rx="3" fill="#9C7A5B"/>

<!-- frozen lake and the whale -->
<ellipse cx="520" cy="500" rx="158" ry="43" fill="url(#ss-ice)" stroke="#B4CDD6" stroke-width="3"/>
<path d="M400,488 l40,-10 M470,520 l50,-12 M560,478 l28,-6" stroke="#FFFFFF" stroke-width="4" stroke-linecap="round" opacity=".8"/>
<ellipse cx="644" cy="490" rx="24" ry="7" fill="#8FB0BC"/>
<path d="M641,490 Q636,474 642,460 Q630,452 616,456 Q628,444 643,452 Q658,444 672,456 Q658,452 647,460 Q652,474 648,490 Z" fill="#7E9CB0"/>
<g fill="#C5DCE4"><circle cx="632" cy="440" r="3"/><circle cx="650" cy="432" r="2.5"/><circle cx="640" cy="424" r="2"/></g>

<!-- hedge maze -->
<rect x="798" y="432" width="192" height="116" rx="18" fill="#8FAA8A"/>
<path d="M816,450 H972 M816,450 V530 H880 M900,470 V530 H972 M836,470 H880 V510 M920,450 V490 H952 M972,450 V505" stroke="#FBFAF6" stroke-width="9" fill="none" stroke-linecap="round" stroke-linejoin="round"/>

<!-- Santa's sleigh and reindeer -->
<g class="ss-sleigh">
  <path d="M672,104 Q700,112 740,104 M760,100 Q796,108 832,112" stroke="#C9A256" stroke-width="3" fill="none"/>
  ${deer(630, 90, true)}
  ${deer(722, 84, false)}
  <rect x="934" y="30" width="16" height="16" rx="2" fill="#C0727C"/>
  <rect x="952" y="24" width="14" height="22" rx="2" fill="#8FAA8A"/>
  <g class="ss-sack">
    <path d="M916,114 Q904,76 928,58 L924,46 Q950,36 974,46 L968,58 Q994,78 982,114 Z" fill="#B99470" stroke="#9A7756" stroke-width="2"/>
    <path d="M928,57 Q948,64 968,57" stroke="#7E6249" stroke-width="4" fill="none" stroke-linecap="round"/>
  </g>
  <path d="M858,94 Q846,80 850,66" stroke="#B5545F" stroke-width="9" stroke-linecap="round" fill="none"/>
  <circle cx="850" cy="63" r="5.5" fill="#FBFAF6"/>
  <circle cx="880" cy="98" r="22" fill="#B5545F"/>
  <circle cx="880" cy="68" r="13" fill="#F1D3BF"/>
  <path d="M867,70 Q880,96 893,70 Q886,77 880,76 Q874,77 867,70 Z" fill="#FBFAF6"/>
  <path d="M866,61 Q872,43 890,47 L899,58 Q886,55 866,61 Z" fill="#B5545F"/>
  <path d="M866,61 Q880,55 894,59" stroke="#FBFAF6" stroke-width="5" stroke-linecap="round" fill="none"/>
  <circle cx="900" cy="58" r="4.5" fill="#FBFAF6"/>
  <circle cx="876" cy="66" r="1.7" fill="#3a3038"/><circle cx="885" cy="66" r="1.7" fill="#3a3038"/>
  <path d="M826,100 q-14,-4 -12,-16 q2,-8 10,-6" stroke="#C0727C" stroke-width="8" fill="none" stroke-linecap="round"/>
  <path d="M826,98 Q822,150 852,152 H938 Q962,152 966,122 L970,92 Q956,104 934,106 H872 Q850,106 842,98 Z" fill="#C0727C"/>
  <path d="M842,99 Q850,106 872,106 H934 Q956,104 970,92" stroke="#E2C27A" stroke-width="4" fill="none" stroke-linecap="round"/>
  <path d="M850,152 v14 M935,152 v14" stroke="#C9A256" stroke-width="5"/>
  <path d="M812,166 H948 Q972,166 972,146 M812,166 q-12,0 -12,-10" stroke="#C9A256" stroke-width="5" fill="none" stroke-linecap="round"/>
</g>`;

window.SLEIGH = {
  words: ['name', 'game', 'make', 'bake', 'cake', 'lake', 'came', 'gate', 'late', 'hate', 'made', 'gave', 'cape', 'tape',
    'shape', 'save', 'cave', 'shade', 'whale', 'take', 'safe', 'lane', 'same', 'mate', 'wake', 'pale', 'fake', 'tame', 'maze'],
  sack: { x: 950, y: 84 },
  spots: [
    { id: 't1', x: 160, y: 176, kind: 'bauble', c: 0 },
    { id: 't2', x: 105, y: 268, kind: 'bauble', c: 1 },
    { id: 't3', x: 218, y: 268, kind: 'bauble', c: 2 },
    { id: 't4', x: 82, y: 380, kind: 'bauble', c: 2 },
    { id: 't5', x: 240, y: 380, kind: 'bauble', c: 0 },
    { id: 'p1', x: 78, y: 503, kind: 'tag' },
    { id: 'p2', x: 173, y: 512, kind: 'tag' },
    { id: 'p3', x: 270, y: 506, kind: 'tag', home: 'tape' },
    { id: 's1', x: 345, y: 98, kind: 'stocking' },
    { id: 's2', x: 440, y: 106, kind: 'stocking' },
    { id: 's3', x: 535, y: 98, kind: 'stocking' },
    { id: 'h1', x: 494, y: 366, kind: 'snow', home: 'cake' },
    { id: 'h2', x: 453, y: 230, kind: 'snow' },
    { id: 'h3', x: 408, y: 303, kind: 'snow' },
    { id: 'a1', x: 300, y: 206, kind: 'star' },
    { id: 'a2', x: 590, y: 222, kind: 'star' },
    { id: 'gt', x: 597, y: 383, kind: 'sign', home: 'gate' },
    { id: 'sm', x: 695, y: 448, kind: 'snow' },
    { id: 'ln', x: 782, y: 300, kind: 'sign', home: 'lane' },
    { id: 'cv', x: 872, y: 244, kind: 'sign', home: 'cave' },
    { id: 'lk', x: 444, y: 508, kind: 'ice', home: 'lake' },
    { id: 'wh', x: 574, y: 497, kind: 'ice', home: 'whale' },
    { id: 'mz', x: 894, y: 490, kind: 'sign', home: 'maze' },
  ],
  scene,
  testNames: ['Test Ava', 'Test Noah', 'Test Mia', 'Test Leo', 'Test Isla', 'Test Jack', 'Test Zara', 'Test Kai'],
};
})();
