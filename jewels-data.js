/* Magic Jewels: everything you might want to change lives here, not in app.js.
   - tiles:      the 20 tiles in order. col/row place each tile on the 7 x 3 picture grid
                 (tile 20 is two cells tall, in the middle). min/max = how many items it can show.
   - palettes:   facet colours, in this order: band, crown left, crown right, table,
                 pavilion left, pavilion centre, pavilion right.
   - themes:     how one counting item is drawn (40 x 40). {0}…{6} are swapped for the
                 palette colours above, so every theme uses the same palettes.
   - characters: the four mystery friends, drawn on a 700 x 300 picture.
   No names or results are kept in this file – those stay in the browser on this device. */
(() => {
  /* four-point sparkle star */
  const star = (x, y, r, fill) => {
    const k = r * 0.22;
    return `<path d="M${x} ${y - r} Q${x + k} ${y - k} ${x + r} ${y} Q${x + k} ${y + k} ${x} ${y + r} Q${x - k} ${y + k} ${x - r} ${y} Q${x - k} ${y - k} ${x} ${y - r}Z" fill="${fill}"/>`;
  };
  /* draw a part on the left and its mirror image on the right */
  const both = svg => `${svg}<g transform="matrix(-1 0 0 1 700 0)">${svg}</g>`;
  const eye = (x, y, c) => `<ellipse cx="${x}" cy="${y}" rx="7" ry="9" fill="${c}"/><circle cx="${x + 2.5}" cy="${y - 3}" r="2.6" fill="#fff"/>`;
  const blush = (y, r = 7) => `<circle cx="316" cy="${y}" r="${r}" fill="#ED93B1"/><circle cx="384" cy="${y}" r="${r}" fill="#ED93B1"/>`;
  const plate = (name, ink) => `<g class="mj-plate"><rect x="304" y="246" width="92" height="40" rx="14" fill="#fff" stroke="${ink}" stroke-width="3"/>` +
    `<text x="350" y="274" text-anchor="middle" class="mj-name" fill="${ink}">${name}</text></g>`;

  /* shared background: the glow and sparkles are the same for every character,
     so the first six tiles (the outer columns) never give the answer away */
  const background =
    '<rect width="700" height="300" fill="#F8F5FB"/>' +
    '<circle cx="350" cy="150" r="340" fill="#F2EDF8"/>' +
    '<circle cx="350" cy="150" r="272" fill="#ECE5F5"/>' +
    '<circle cx="350" cy="150" r="205" fill="#E6DDF2"/>' +
    '<circle cx="350" cy="150" r="140" fill="#DFD3EE"/>' +
    [[40, 34, 13, '#EF9F27'], [72, 150, 9, '#D4537E'], [28, 252, 11, '#7F77DD'], [82, 268, 6, '#EF9F27'],
     [664, 46, 11, '#7F77DD'], [628, 160, 13, '#EF9F27'], [676, 262, 9, '#D4537E'], [616, 276, 6, '#7F77DD'],
     [22, 106, 6, '#EF9F27'], [690, 120, 6, '#EF9F27'], [150, 22, 8, '#D4537E'], [556, 284, 8, '#D4537E'],
     [470, 18, 7, '#EF9F27'], [236, 284, 7, '#7F77DD']].map(s => star(...s)).join('');

  const characters = {
    dragon: {
      name: 'Ember', title: 'Ember the dragon', ink: '#0F6E56',
      art:
        `<g class="mj-wing">${both(
          '<path d="M305 150 L262 52 L215 78 L160 46 L172 112 L118 140 L176 168 L138 222 L226 204 L298 196Z" fill="#5DCAA5" stroke="#0F6E56" stroke-width="4" stroke-linejoin="round"/>' +
          '<path d="M300 160 L215 78 M300 166 L172 112 M298 176 L176 168 M298 186 L138 222" stroke="#1D9E75" stroke-width="4" stroke-linecap="round"/>')}</g>` +
        '<g class="mj-tail"><path d="M395 268 Q470 298 520 262 Q552 238 578 252" fill="none" stroke="#1D9E75" stroke-width="18" stroke-linecap="round"/>' +
        '<path d="M566 236 L598 228 L590 266Z" fill="#0F6E56"/></g>' +
        both('<ellipse cx="284" cy="284" rx="28" ry="15" fill="#1D9E75"/><circle cx="266" cy="290" r="4" fill="#9FE1CB"/><circle cx="280" cy="294" r="4" fill="#9FE1CB"/>') +
        '<ellipse cx="350" cy="240" rx="72" ry="62" fill="#5DCAA5" stroke="#0F6E56" stroke-width="4"/>' +
        '<ellipse cx="350" cy="252" rx="44" ry="44" fill="#9FE1CB"/>' +
        '<path d="M318 236h64M314 254h72M320 272h60" stroke="#5DCAA5" stroke-width="4" stroke-linecap="round"/>' +
        '<g class="mj-head">' +
          both('<path d="M306 122 L268 102 L282 132 L258 148 L302 158Z" fill="#1D9E75" stroke="#0F6E56" stroke-width="3" stroke-linejoin="round"/>' +
               '<path d="M324 112 Q304 76 314 40 Q332 76 344 104Z" fill="#FAC775" stroke="#BA7517" stroke-width="3" stroke-linejoin="round"/>') +
          '<circle cx="350" cy="148" r="50" fill="#5DCAA5" stroke="#0F6E56" stroke-width="4"/>' +
          '<path d="M340 101 L350 84 L360 101Z" fill="#1D9E75"/>' +
          '<ellipse cx="350" cy="172" rx="32" ry="20" fill="#9FE1CB"/>' +
          '<circle cx="340" cy="167" r="3.5" fill="#0F6E56"/><circle cx="360" cy="167" r="3.5" fill="#0F6E56"/>' +
          eye(330, 140, '#085041') + eye(370, 140, '#085041') + blush(162) +
          '<path d="M336 181 Q350 191 364 181" stroke="#0F6E56" stroke-width="3.5" fill="none" stroke-linecap="round"/>' +
        '</g>' +
        `<g class="mj-quirk">${star(312, 196, 12, '#FAC775')}${star(392, 192, 10, '#EF9F27')}${star(350, 214, 9, '#FAC775')}${star(296, 172, 7, '#ED93B1')}${star(406, 168, 8, '#FAC775')}</g>`,
    },

    fairy: {
      name: 'Willow', title: 'Willow the fairy', ink: '#993556',
      art:
        `<g class="mj-wing">${both(
          '<ellipse cx="236" cy="96" rx="96" ry="50" transform="rotate(28 236 96)" fill="#CECBF6" stroke="#7F77DD" stroke-width="4"/>' +
          '<ellipse cx="248" cy="206" rx="72" ry="36" transform="rotate(-24 248 206)" fill="#F4C0D1" stroke="#D4537E" stroke-width="4"/>' +
          '<circle cx="200" cy="74" r="11" fill="#AFA9EC"/><circle cx="244" cy="104" r="7" fill="#AFA9EC"/><circle cx="222" cy="214" r="8" fill="#ED93B1"/>')}</g>` +
        '<path d="M350 184 L290 292 Q350 302 410 292Z" fill="#ED93B1" stroke="#D4537E" stroke-width="4" stroke-linejoin="round"/>' +
        '<path d="M300 284 Q312 296 325 286 Q337 298 350 288 Q363 298 375 286 Q388 296 400 284" fill="none" stroke="#F4C0D1" stroke-width="4"/>' +
        '<path d="M334 200 L292 228" stroke="#FBE6DA" stroke-width="12" stroke-linecap="round"/>' +
        '<path d="M366 200 L416 178" stroke="#FBE6DA" stroke-width="12" stroke-linecap="round"/>' +
        '<path d="M416 178 L452 100" stroke="#854F0B" stroke-width="6" stroke-linecap="round"/>' +
        star(456, 88, 20, '#EF9F27') +
        '<g class="mj-head">' +
          '<circle cx="350" cy="146" r="54" fill="#BA7517"/>' +
          both('<path d="M298 146 Q290 192 306 208 L320 192 Q308 170 312 146Z" fill="#BA7517"/>') +
          '<circle cx="350" cy="88" r="20" fill="#BA7517"/>' +
          '<path d="M324 106 L333 82 L342 98 L350 74 L358 98 L367 82 L376 106Z" fill="#FAC775" stroke="#BA7517" stroke-width="3" stroke-linejoin="round"/>' +
          '<circle cx="350" cy="94" r="5" fill="#D4537E"/>' +
          '<circle cx="350" cy="154" r="42" fill="#FBE6DA"/>' +
          '<path d="M308 142 Q320 110 350 112 Q380 110 392 142 Q372 126 350 130 Q328 126 308 142Z" fill="#BA7517"/>' +
          eye(334, 156, '#3C3489') + eye(366, 156, '#3C3489') + blush(172) +
          '<path d="M340 176 Q350 184 360 176" stroke="#993556" stroke-width="3.5" fill="none" stroke-linecap="round"/>' +
        '</g>' +
        '<g class="mj-quirk" fill="#7F77DD">' +
          '<circle cx="410" cy="132" r="7"/><rect x="414" y="104" width="3.5" height="28"/><path d="M414 104 q12 2 14 12 q-6 -5 -14 -5z"/>' +
          '<circle cx="438" cy="118" r="6"/><rect x="441" y="94" width="3" height="24"/>' +
        '</g>',
    },

    fox: {
      name: 'Luna', title: 'Luna the moon fox', ink: '#185FA5',
      art:
        '<g class="mj-tail"><path d="M318 276 Q220 292 168 238 Q128 194 150 128 Q170 92 196 112 Q176 160 214 204 Q252 240 320 236Z" fill="#378ADD" stroke="#185FA5" stroke-width="4" stroke-linejoin="round"/>' +
        '<path d="M150 128 Q170 92 196 112 Q184 132 186 150 Q160 152 150 128Z" fill="#FAEEDA"/></g>' +
        '<path d="M555 62 A43 43 0 1 0 598 122 A38 38 0 0 1 555 62Z" fill="#FAC775" stroke="#EF9F27" stroke-width="3" stroke-linejoin="round"/>' +
        star(536, 170, 9, '#FAC775') + star(578, 200, 6, '#FAC775') +
        both('<ellipse cx="292" cy="270" rx="30" ry="26" fill="#378ADD" stroke="#185FA5" stroke-width="4"/>' + star(290, 266, 7, '#FAEEDA')) +
        '<ellipse cx="350" cy="244" rx="64" ry="58" fill="#85B7EB" stroke="#185FA5" stroke-width="4"/>' +
        '<ellipse cx="350" cy="256" rx="34" ry="40" fill="#FAEEDA"/>' +
        both('<ellipse cx="322" cy="292" rx="18" ry="10" fill="#378ADD"/>') +
        '<g class="mj-head">' +
          both('<path d="M312 122 L286 32 L348 102Z" fill="#378ADD" stroke="#185FA5" stroke-width="4" stroke-linejoin="round"/>' +
               '<path d="M316 112 L296 56 L336 100Z" fill="#B5D4F4"/>') +
          star(350, 50, 16, '#FAC775') + star(326, 76, 6, '#FAC775') + star(374, 72, 7, '#FAC775') +
          '<circle cx="350" cy="150" r="50" fill="#85B7EB" stroke="#185FA5" stroke-width="4"/>' +
          both('<path d="M304 150 L270 176 L298 177 L282 198 L322 186Z" fill="#B5D4F4" stroke="#185FA5" stroke-width="3" stroke-linejoin="round"/>') +
          '<path d="M320 166 Q350 202 380 166 Q350 150 320 166Z" fill="#FAEEDA"/>' +
          '<ellipse cx="350" cy="168" rx="7" ry="5" fill="#0C447C"/>' +
          '<path d="M343 112 a9 9 0 1 0 14 11 a7 7 0 1 1 -14 -11z" fill="#FAC775"/>' +
          eye(330, 144, '#0C447C') + eye(370, 144, '#0C447C') + blush(160, 6) +
          '<path d="M343 180 Q350 186 357 180" stroke="#0C447C" stroke-width="3" fill="none" stroke-linecap="round"/>' +
        '</g>' +
        `<g class="mj-quirk">${star(214, 250, 9, '#FAC775')}${star(168, 212, 7, '#FAC775')}${star(250, 278, 6, '#FAEEDA')}</g>`,
    },

    golem: {
      name: 'Pebble', title: 'Pebble the jewel golem', ink: '#6F6D38',
      art:
        both('<path d="M246 140 L238 98 L252 80 L264 96 L264 140Z" fill="#AFA9EC" stroke="#534AB7" stroke-width="3" stroke-linejoin="round"/>' +
             '<path d="M262 140 L262 72 L276 54 L290 72 L286 140Z" fill="#7F77DD" stroke="#534AB7" stroke-width="3" stroke-linejoin="round"/>' +
             '<path d="M284 142 L290 102 L302 92 L308 142Z" fill="#CECBF6" stroke="#534AB7" stroke-width="3" stroke-linejoin="round"/>') +
        '<g class="mj-arm">' +
          '<path d="M302 150 Q246 140 214 182 L176 222 Q160 244 180 262 Q206 276 226 252 L268 206 Q300 196 306 176Z" fill="#DEDDC3" stroke="#8E8C70" stroke-width="4" stroke-linejoin="round"/>' +
          '<circle cx="188" cy="246" r="32" fill="#C9C7A6" stroke="#8E8C70" stroke-width="4"/>' +
          '<path d="M172 236 q8 -6 16 0 M186 252 q8 -6 16 0" stroke="#8E8C70" stroke-width="3" fill="none" stroke-linecap="round"/>' +
        '</g>' +
        '<g transform="matrix(-1 0 0 1 700 0)">' +
          '<path d="M302 150 Q246 140 214 182 L176 222 Q160 244 180 262 Q206 276 226 252 L268 206 Q300 196 306 176Z" fill="#DEDDC3" stroke="#8E8C70" stroke-width="4" stroke-linejoin="round"/>' +
          '<circle cx="188" cy="246" r="32" fill="#C9C7A6" stroke="#8E8C70" stroke-width="4"/>' +
        '</g>' +
        both('<rect x="258" y="244" width="54" height="52" rx="14" fill="#C9C7A6" stroke="#8E8C70" stroke-width="4"/>') +
        '<rect x="288" y="184" width="124" height="98" rx="26" fill="#DEDDC3" stroke="#8E8C70" stroke-width="4"/>' +
        '<g transform="translate(330 214)"><polygon points="2,13 38,13 38,17 2,17" fill="#AFA9EC"/><polygon points="2,13 12,3 16,13" fill="#AFA9EC"/>' +
        '<polygon points="28,3 38,13 24,13" fill="#7F77DD"/><polygon points="12,3 28,3 24,13 16,13" fill="#CECBF6"/>' +
        '<polygon points="2,17 14,17 20,38" fill="#7F77DD"/><polygon points="14,17 26,17 20,38" fill="#534AB7"/><polygon points="26,17 38,17 20,38" fill="#3C3489"/></g>' +
        '<g class="mj-head">' +
          both('<path d="M322 106 L327 82 L336 106Z" fill="#F4C0D1" stroke="#993556" stroke-width="3" stroke-linejoin="round"/>') +
          '<path d="M334 106 L340 66 L350 48 L360 66 L366 106Z" fill="#ED93B1" stroke="#993556" stroke-width="3" stroke-linejoin="round"/>' +
          '<rect x="304" y="102" width="92" height="90" rx="24" fill="#DEDDC3" stroke="#8E8C70" stroke-width="4"/>' +
          '<path d="M316 118 l10 8 l-4 11" stroke="#8E8C70" stroke-width="3" fill="none" stroke-linecap="round"/>' +
          '<path d="M322 132 h20 M358 132 h20" stroke="#8E8C70" stroke-width="5" stroke-linecap="round"/>' +
          '<circle cx="332" cy="148" r="10" fill="#EF9F27"/><circle cx="368" cy="148" r="10" fill="#EF9F27"/>' +
          '<circle cx="332" cy="148" r="4.5" fill="#633806"/><circle cx="368" cy="148" r="4.5" fill="#633806"/>' +
          '<circle cx="335" cy="144" r="2.4" fill="#fff"/><circle cx="371" cy="144" r="2.4" fill="#fff"/>' +
          blush(166, 6) +
          '<path d="M336 174 Q350 184 364 174" stroke="#6F6D38" stroke-width="4" fill="none" stroke-linecap="round"/>' +
        '</g>' +
        `<g class="mj-quirk">${star(186, 200, 11, '#FAC775')}${star(146, 230, 8, '#ED93B1')}${star(228, 214, 8, '#AFA9EC')}${star(160, 282, 7, '#FAC775')}</g>`,
    },
  };
  for (const c of Object.values(characters)) c.art += plate(c.name, c.ink);

  window.JEWELS = {
    /* tile order: 1–6 outer columns (glow and sparkles only), 7–14 shape hints,
       15–19 features, 20 the face and name in the middle */
    tiles: [
      { n: 1,  col: 1, row: 1, min: 1,  max: 5 },
      { n: 2,  col: 7, row: 1, min: 1,  max: 5 },
      { n: 3,  col: 1, row: 2, min: 1,  max: 5 },
      { n: 4,  col: 7, row: 2, min: 1,  max: 5 },
      { n: 5,  col: 1, row: 3, min: 1,  max: 5 },
      { n: 6,  col: 7, row: 3, min: 1,  max: 5 },
      { n: 7,  col: 2, row: 1, min: 3,  max: 10 },
      { n: 8,  col: 6, row: 1, min: 3,  max: 10 },
      { n: 9,  col: 2, row: 2, min: 3,  max: 10 },
      { n: 10, col: 6, row: 2, min: 3,  max: 10 },
      { n: 11, col: 2, row: 3, min: 3,  max: 10 },
      { n: 12, col: 6, row: 3, min: 3,  max: 10 },
      { n: 13, col: 3, row: 3, min: 3,  max: 10 },
      { n: 14, col: 5, row: 3, min: 3,  max: 10 },
      { n: 15, col: 3, row: 2, min: 8,  max: 15 },
      { n: 16, col: 5, row: 2, min: 8,  max: 15 },
      { n: 17, col: 3, row: 1, min: 8,  max: 15 },
      { n: 18, col: 5, row: 1, min: 8,  max: 15 },
      { n: 19, col: 4, row: 1, min: 8,  max: 15 },
      { n: 20, col: 4, row: 2, rows: 2, min: 16, max: 20 },
    ],
    grid: { cols: 7, rows: 3 },

    palettes: {
      purple: ['#AFA9EC', '#AFA9EC', '#7F77DD', '#CECBF6', '#7F77DD', '#534AB7', '#3C3489'],
      teal:   ['#5DCAA5', '#5DCAA5', '#1D9E75', '#9FE1CB', '#1D9E75', '#0F6E56', '#085041'],
      amber:  ['#EF9F27', '#EF9F27', '#BA7517', '#FAC775', '#BA7517', '#854F0B', '#633806'],
      blue:   ['#85B7EB', '#85B7EB', '#378ADD', '#B5D4F4', '#378ADD', '#185FA5', '#0C447C'],
      pink:   ['#ED93B1', '#ED93B1', '#D4537E', '#F4C0D1', '#D4537E', '#993556', '#72243E'],
    },
    sparkleColours: ['#FFFFFF', '#FAEEDA'],
    sparklesPerArray: [3, 5],

    themes: {
      jewels: {
        name: 'Jewels', noun: 'jewels', one: 'jewel',
        /* seven flat facets: band, crown left, crown right, table, pavilion left, centre, right */
        art: '<polygon points="2,13 38,13 38,17 2,17" fill="{0}"/>' +
             '<polygon points="2,13 12,3 16,13" fill="{1}"/>' +
             '<polygon points="28,3 38,13 24,13" fill="{2}"/>' +
             '<polygon points="12,3 28,3 24,13 16,13" fill="{3}"/>' +
             '<polygon points="2,17 14,17 20,38" fill="{4}"/>' +
             '<polygon points="14,17 26,17 20,38" fill="{5}"/>' +
             '<polygon points="26,17 38,17 20,38" fill="{6}"/>',
      },
      hearts: {
        name: 'Hearts', noun: 'hearts', one: 'heart',
        art: '<path d="M20 36 C6 26 2 18 2 12 C2 6 7 3 11.5 3 C15.5 3 18.5 5.5 20 9 C21.5 5.5 24.5 3 28.5 3 C33 3 38 6 38 12 C38 18 34 26 20 36Z" fill="{2}"/>' +
             '<path d="M20 36 C10 28.7 4.6 22 2.8 16 L20 21Z" fill="{1}"/>' +
             '<path d="M20 36 C30 28.7 35.4 22 37.2 16 L20 21Z" fill="{5}"/>' +
             '<ellipse cx="11" cy="10" rx="4.6" ry="3" transform="rotate(-30 11 10)" fill="{3}"/>',
      },
      flowers: {
        name: 'Flowers', noun: 'flowers', one: 'flower',
        art: '<circle cx="20" cy="8.5" r="8" fill="{1}"/><circle cx="31" cy="16.5" r="8" fill="{2}"/>' +
             '<circle cx="26.8" cy="29.5" r="8" fill="{1}"/><circle cx="13.2" cy="29.5" r="8" fill="{2}"/>' +
             '<circle cx="9" cy="16.5" r="8" fill="{1}"/>' +
             '<circle cx="20" cy="20" r="7" fill="{5}"/><circle cx="18" cy="18" r="2.2" fill="{3}"/>',
      },
    },

    background,
    characters,
    star,

    /* used only in test mode, so the game can be tried without a class list */
    testNames: ['Test Ava', 'Test Noah', 'Test Mia', 'Test Leo', 'Test Isla', 'Test Jack', 'Test Zara', 'Test Kai'],
  };
})();
