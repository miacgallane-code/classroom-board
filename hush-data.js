/* Hush Bush scenes and animals. Original artwork for the Classroom Board.
   Each animal is drawn in a 60×60 box with its feet (or bottom) at the bottom edge.
   Slots say where animals can appear, as % of the scene: x = centre, y = bottom, s = scale. */
(() => {
  const e = (x, y, r = 1.8) => `<circle cx="${x}" cy="${y}" r="${r}" fill="#34333b"/><circle cx="${(x - r * .35).toFixed(2)}" cy="${(y - r * .35).toFixed(2)}" r="${(r * .35).toFixed(2)}" fill="#fff"/>`;
  const b = (x, y) => `<ellipse cx="${x}" cy="${y}" rx="2.6" ry="1.6" fill="#d7b6c2" opacity=".9"/>`;
  const star = (cx, cy, R, r) => 'M' + Array.from({ length: 10 }, (_, i) => {
    const a = (-90 + i * 36) * Math.PI / 180, d = i % 2 ? r : R;
    return `${(cx + d * Math.cos(a)).toFixed(1)} ${(cy + d * Math.sin(a)).toFixed(1)}`;
  }).join('L') + 'Z';
  const water = (y = 52) => `<rect x="0" y="${y}" width="60" height="${60 - y}" fill="#a3bfc7" opacity=".65"/><path d="M4 ${y + 2}q6-2 12 0t12 0 12 0 12 0" stroke="#e6f0f2" stroke-width="1.6" fill="none" stroke-linecap="round"/>`;

  /* ======================= BUSH ======================= */
  const bush = {
    card: '#eef4f5', name: 'Bush', title: 'the bush friends', hazeText: 'Shh… they’re hiding', haze: 'rgba(236, 234, 224, .74)', hazeInk: '#6f6d38', tone: 'pistachio',
    slots: {
      g0: { type: 'ground', x: 28, y: 90, s: .91 }, g1: { type: 'ground', x: 46, y: 77.6, s: .78 }, g2: { type: 'ground', x: 61, y: 84, s: .85 },
      g3: { type: 'ground', x: 37, y: 98, s: 1 }, g4: { type: 'ground', x: 21, y: 97, s: .99 }, g5: { type: 'ground', x: 50, y: 98, s: 1 },
      w0: { type: 'water', x: 76, y: 89 }, w1: { type: 'water', x: 89, y: 90 },
      t0: { type: 'tree', x: 27.5, y: 42 }, t1: { type: 'tree', x: 7.5, y: 52.5 },
      k0: { type: 'trunk', x: 14.3, y: 70 },
      a0: { type: 'air', x: 42, y: 36 }, a1: { type: 'air', x: 64, y: 26 }, a2: { type: 'air', x: 88, y: 58 },
    },
    bg: `<defs><linearGradient id="hb-sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#eef4f5"/><stop offset="1" stop-color="#ffffff"/></linearGradient></defs>
  <rect width="400" height="225" fill="url(#hb-sky)"/>
  <circle cx="332" cy="44" r="22" fill="#f1e5ea"/><circle cx="332" cy="44" r="14" fill="#e8d0d9"/>
  <g fill="#fff" stroke="#e4e4ea" stroke-width="1.4"><path d="M118 52q6-14 20-8 8-10 20 0 12 0 10 10h-50z"/><path d="M228 32q5-10 15-6 7-8 16 0 9 0 8 8h-39z"/></g>
  <path d="M0 140q60-28 130-12t130-8 140 8v97H0z" fill="#e5dde5"/>
  <path d="M0 158q80-22 170-8t160-4 70 4v75H0z" fill="#ecefdd"/>
  <path d="M0 172q100-12 210-2t190-2v57H0z" fill="#c8d29d"/>
  <path d="M0 205q120-9 240-1t160-2v23H0z" fill="#bcc78f"/>
  <ellipse cx="324" cy="197" rx="58" ry="15" fill="#a3bfc7"/><ellipse cx="314" cy="193" rx="34" ry="5.5" fill="#c3d6db"/>
  <ellipse cx="290" cy="201" rx="7" ry="2.6" fill="#b9c58a"/><ellipse cx="358" cy="195" rx="6" ry="2.2" fill="#b9c58a"/>
  <rect x="150" y="174.5" width="70" height="16" rx="8" fill="#deddc3"/><ellipse cx="219" cy="182.5" rx="5.5" ry="8" fill="#ece9d6" stroke="#cfcdb0" stroke-width="1.2"/>
  <path d="M48 182q6-60 2-122h14q-2 60 6 122z" fill="#e7e2d6"/>
  <path d="M60 104q30-12 68-10v5q-36-1-66 13zM52 124q-18-10-40-8v5q22-1 40 11z" fill="#e7e2d6"/>
  <path d="M55 150q2-30 0-60M60 170q-1-20 1-40" stroke="#d6d0c0" stroke-width="1.4" fill="none" stroke-linecap="round"/>
  <g fill="#c8d29d"><ellipse cx="56" cy="44" rx="44" ry="26"/><ellipse cx="100" cy="62" rx="30" ry="15"/><ellipse cx="20" cy="68" rx="26" ry="13"/></g>
  <g fill="#b9c58a"><ellipse cx="40" cy="36" rx="16" ry="8"/><ellipse cx="78" cy="50" rx="14" ry="7"/><ellipse cx="108" cy="66" rx="12" ry="5"/><ellipse cx="18" cy="72" rx="12" ry="5"/></g>
  <g stroke="#9aab5f" stroke-width="1.6" stroke-linecap="round" fill="none"><path d="M100 196l3-8 2 8M136 210l2-7 3 7M232 200l3-8 2 8M258 214l2-6 3 6M30 214l2-7 3 7M378 214l2-7 3 7"/></g>
  <g><circle cx="122" cy="186" r="2.2" fill="#d7b6c2"/><circle cx="246" cy="190" r="2.2" fill="#b69fb4"/><circle cx="198" cy="212" r="2.2" fill="#d7b6c2"/><circle cx="84" cy="206" r="2.2" fill="#b69fb4"/></g>`,
    critters: {
      wren: { name: 'Fairy-wren', size: 7, weight: 10, spots: ['tree', 'ground'], art:
        `<path d="M21 41 10 18q4-3 7 2l9 16z" fill="#426a75"/><ellipse cx="30" cy="43" rx="12" ry="9" fill="#a3bfc7"/><ellipse cx="31" cy="47" rx="8" ry="4.5" fill="#f3f3ea"/><circle cx="39" cy="33" r="7.5" fill="#7fa4ae"/><path d="m45.5 33 5 1.2-5 1.6z" fill="#34333b"/>${e(41, 32)}${b(40, 36.5)}<path d="M28 51v6M33 51v6" stroke="#6f6d78" stroke-width="1.4" stroke-linecap="round"/>` },
      butterfly: { name: 'Butterfly', size: 6, weight: 10, spots: ['air'], art:
        `<g class="hb-wings"><path d="M30 30C20 14 6 18 10 30c2 6 12 6 20 2zM30 30c10-16 24-12 20 0-2 6-12 6-20 2z" fill="#b69fb4"/><path d="M30 33c-8 3-16 11-10 15 5 2 9-6 10-12zM30 33c8 3 16 11 10 15-5 2-9-6-10-12z" fill="#d7b6c2"/></g><rect x="28.6" y="24" width="2.8" height="22" rx="1.4" fill="#34333b"/><path d="M29 25q-3-7-6-9M31 25q3-7 6-9" stroke="#34333b" stroke-width="1" fill="none" stroke-linecap="round"/>` },
      frog: { name: 'Frog', size: 7.5, weight: 9, spots: ['water'], art:
        `<ellipse cx="30" cy="55" rx="22" ry="4.5" fill="#b9c58a"/><ellipse cx="30" cy="45" rx="14" ry="10" fill="#c8d29d"/><circle cx="23" cy="35" r="5.5" fill="#c8d29d"/><circle cx="37" cy="35" r="5.5" fill="#c8d29d"/>${e(23, 35, 2.2)}${e(37, 35, 2.2)}<ellipse cx="30" cy="49" rx="8" ry="4.5" fill="#ecefdd"/><path d="M24 44q6 4 12 0" stroke="#616d2c" stroke-width="1.4" fill="none" stroke-linecap="round"/>${b(20, 43)}${b(40, 43)}` },
      snail: { name: 'Snail', size: 6, weight: 8, spots: ['ground'], art:
        `<path d="M8 57q0-6 8-6h28q6 0 6-6l2-6q3-2 4 2l-1 10q-1 6-9 6z" fill="#deddc3"/><circle cx="28" cy="40" r="13" fill="#d7b6c2"/><path d="M28 40m0-1a3 3 0 1 1-3 3 6 6 0 1 1 6 6 9 9 0 1 1-9-9" fill="none" stroke="#9c4e6a" stroke-width="1.6" stroke-linecap="round" opacity=".55"/><path d="m52 40 2-9m1 9 3-8" stroke="#b5b38f" stroke-width="1.4" stroke-linecap="round"/><circle cx="54" cy="31" r="1.6" fill="#34333b"/><circle cx="58" cy="32" r="1.6" fill="#34333b"/>` },
      echidna: { name: 'Echidna', size: 9.5, weight: 7, spots: ['ground'], art:
        `<g stroke="#6f6d38" stroke-width="1.7" stroke-linecap="round"><path d="m12 46-6-4m8-3-5-6m9 0-3-7m9-1v-7m7 7 2-7m5 9 5-5m-2 9 6-3m-31 18-6-1m10-12-5-5m13 1-2-6m9 2 2-6"/></g><path d="M8 57q0-25 22-27 18 0 22 16l6 4q0 3-4 3l-4 4z" fill="#deddc3"/><g stroke="#6f6d38" stroke-width="1.5" stroke-linecap="round" opacity=".7"><path d="m16 44-3-3m8-2-2-4m7 1v-4m6 4 1-4m5 7 3-3"/></g><ellipse cx="46" cy="48" rx="7" ry="6" fill="#ece9d6"/>${e(46, 46, 1.7)}<path d="M51 49h6" stroke="#b5b38f" stroke-width="2.4" stroke-linecap="round"/><ellipse cx="18" cy="57" rx="4" ry="2" fill="#b5b38f"/><ellipse cx="40" cy="57" rx="4" ry="2" fill="#b5b38f"/>` },
      wombat: { name: 'Wombat', size: 12, weight: 7, spots: ['ground'], art:
        `<path d="M6 57Q4 31 28 29q22 0 26 17 2 11-6 11z" fill="#cdbfae"/><path d="m38 31 2-7 5 6zm7 3 5-5 2 7z" fill="#cdbfae"/><ellipse cx="53" cy="45" rx="4" ry="3.2" fill="#6f6362"/>${e(46, 40)}${b(47, 47)}<rect x="12" y="53" width="9" height="5" rx="2.5" fill="#b5a796"/><rect x="38" y="53" width="9" height="5" rx="2.5" fill="#b5a796"/>` },
      kookaburra: { name: 'Kookaburra', size: 9, weight: 7, spots: ['tree'], art:
        `<path d="m20 52-6 8 10-2z" fill="#8fa9b1"/><ellipse cx="28" cy="41" rx="12" ry="14" fill="#ece9d6"/><path d="M16 33q-4 16 6 24l8-2q0-14-6-22z" fill="#a3bfc7"/><circle cx="32" cy="24" r="10" fill="#ece9d6"/><path d="M23 21q7-7 17-1v4q-8-4-17 1z" fill="#cdbfae"/><path d="M31 27h10" stroke="#8a7f6e" stroke-width="2.2" stroke-linecap="round"/><path d="m40 24 14 3-14 3z" fill="#6f6d78"/>${e(36, 24, 2)}<path d="M26 55v3m5-3v3" stroke="#9a98a3" stroke-width="1.6" stroke-linecap="round"/>` },
      galah: { name: 'Galah', size: 8.5, weight: 7, spots: ['tree', 'ground'], art:
        `<path d="M14 30q-6 16 4 26h12q-2-16-8-26z" fill="#c9c7cf"/><ellipse cx="30" cy="41" rx="11" ry="14" fill="#d7b6c2"/><circle cx="34" cy="25" r="9" fill="#d7b6c2"/><path d="M27 21q6-7 14-1-7-1-14 3z" fill="#f1e5ea"/><path d="M41 26q6 1 3 6-3-2-4-3z" fill="#ece9d6"/>${e(37, 24)}<path d="M27 55v3m6-3v3" stroke="#9a98a3" stroke-width="1.6" stroke-linecap="round"/>` },
      koala: { name: 'Koala', size: 10, weight: 6, spots: ['trunk'], art:
        `<circle cx="16" cy="18" r="8" fill="#c9c7cf"/><circle cx="44" cy="18" r="8" fill="#c9c7cf"/><circle cx="16" cy="18" r="4.5" fill="#f1e5ea"/><circle cx="44" cy="18" r="4.5" fill="#f1e5ea"/><ellipse cx="30" cy="45" rx="13" ry="13" fill="#c9c7cf"/><ellipse cx="30" cy="48" rx="7" ry="7" fill="#ebebef"/><circle cx="30" cy="27" r="12" fill="#c9c7cf"/><ellipse cx="30" cy="30" rx="3.6" ry="4.6" fill="#5a5862"/>${e(24, 25, 1.7)}${e(36, 25, 1.7)}${b(22, 31)}${b(38, 31)}<path d="M18 41q-4 6 2 10m22-10q4 6-2 10" stroke="#b3b1ba" stroke-width="4" stroke-linecap="round" fill="none"/>` },
      kangaroo: { name: 'Kangaroo', size: 13, weight: 5, spots: ['ground'], art:
        `<path d="M14 53Q2 56 2 58h16z" fill="#cdb7aa"/><path d="M12 57q-2-22 14-26 10-2 12 8 2 12-4 18z" fill="#d9c4b7"/><ellipse cx="28" cy="45" rx="6" ry="9" fill="#ece0d6"/><ellipse cx="28" cy="57" rx="12" ry="2.6" fill="#cdb7aa"/><ellipse cx="35" cy="30" rx="5.5" ry="7" fill="#d9c4b7"/><path d="m33 18-2-12 6 8zm5-1 1-12 3 10z" fill="#cdb7aa"/><ellipse cx="38" cy="22" rx="7" ry="6.5" fill="#d9c4b7"/><ellipse cx="45" cy="25" rx="5" ry="3.5" fill="#d9c4b7"/><circle cx="49.5" cy="24.5" r="1.4" fill="#5a5862"/>${e(40, 20, 1.6)}<path d="M36 39q6 4 4 8" stroke="#cdb7aa" stroke-width="3" stroke-linecap="round" fill="none"/>` },
      quokka: { name: 'Quokka', size: 8, weight: 6, spots: ['ground'], art:
        `<ellipse cx="30" cy="47" rx="13" ry="11" fill="#cdbfa8"/><circle cx="20" cy="22" r="5" fill="#cdbfa8"/><circle cx="40" cy="22" r="5" fill="#cdbfa8"/><circle cx="20" cy="22" r="2.4" fill="#f1e5ea"/><circle cx="40" cy="22" r="2.4" fill="#f1e5ea"/><circle cx="30" cy="31" r="11" fill="#d6c9b4"/><ellipse cx="30" cy="34" rx="2.6" ry="2" fill="#5a5862"/><path d="M26 37q4 4 8 0" stroke="#5a5862" stroke-width="1.3" fill="none" stroke-linecap="round"/>${e(25, 29, 1.7)}${e(35, 29, 1.7)}${b(22, 35)}${b(38, 35)}<circle cx="25" cy="47" r="2.6" fill="#bfae95"/><circle cx="35" cy="47" r="2.6" fill="#bfae95"/>` },
      platypus: { name: 'Platypus', size: 12, weight: 1.6, spots: ['water'], art:
        `<ellipse cx="8" cy="51" rx="7" ry="4" fill="#9d879b"/><ellipse cx="26" cy="49" rx="18" ry="8" fill="#b69fb4"/><path d="M42 46q14-2 15 3-1 4-15 3z" fill="#765673"/>${e(38, 45, 1.7)}${water()}` },
      lyrebird: { name: 'Lyrebird', size: 13, weight: 1.6, spots: ['ground'], art:
        `<g fill="none" stroke-linecap="round" stroke-width="3"><path d="M24 50Q2 40 4 18" stroke="#deddc3"/><path d="M24 50Q6 30 14 8" stroke="#b69fb4"/><path d="M24 50Q14 24 26 6" stroke="#deddc3"/><path d="M24 50q0-24 12-40" stroke="#b69fb4"/></g><circle cx="4" cy="17" r="2.6" fill="#deddc3"/><circle cx="14" cy="7" r="2.6" fill="#b69fb4"/><circle cx="26" cy="5" r="2.6" fill="#deddc3"/><circle cx="36" cy="9" r="2.6" fill="#b69fb4"/><ellipse cx="34" cy="47" rx="10" ry="8" fill="#b0a7a3"/><circle cx="43" cy="37" r="5.5" fill="#b0a7a3"/><path d="m48 37 5 1-5 2z" fill="#5a5862"/>${e(44.5, 36, 1.4)}<path d="M32 54v4m5-4v4" stroke="#8b8488" stroke-width="1.6" stroke-linecap="round"/>` },
      possum: { name: 'Possum', size: 9.5, weight: 1.8, spots: ['tree'], art:
        `<path d="M40 50q12 6 10 10-4 2-4-2" stroke="#b3b1ba" stroke-width="3" fill="none" stroke-linecap="round"/><ellipse cx="30" cy="47" rx="12" ry="10" fill="#b3b1ba"/><ellipse cx="19" cy="22" rx="4.5" ry="6.5" fill="#b3b1ba"/><ellipse cx="41" cy="22" rx="4.5" ry="6.5" fill="#b3b1ba"/><ellipse cx="19" cy="23" rx="2.2" ry="3.8" fill="#f1e5ea"/><ellipse cx="41" cy="23" rx="2.2" ry="3.8" fill="#f1e5ea"/><circle cx="30" cy="31" r="10.5" fill="#c9c7cf"/><path d="M30 21v7" stroke="#a09eaa" stroke-width="2" stroke-linecap="round"/>${e(25.5, 30, 3)}${e(34.5, 30, 3)}<path d="M28.6 36h2.8L30 37.8z" fill="#9c4e6a"/>` },
    },
  };

  /* ======================= REEF ======================= */
  const reef = {
    card: '#dfe9eb', name: 'Reef', title: 'the reef friends', hazeText: 'Shh… the water’s gone murky', haze: 'rgba(150, 178, 172, .78)', hazeInk: '#ffffff', tone: 'blue',
    slots: {
      s0: { type: 'sand', x: 26, y: 94, s: .95 }, s1: { type: 'sand', x: 47, y: 90, s: .88 }, s2: { type: 'sand', x: 62, y: 96, s: 1 },
      s3: { type: 'sand', x: 79, y: 92, s: .92 }, s4: { type: 'sand', x: 38, y: 99, s: 1 },
      m0: { type: 'swim', x: 22, y: 48 }, m1: { type: 'swim', x: 45, y: 38 }, m2: { type: 'swim', x: 68, y: 50 },
      m3: { type: 'swim', x: 85, y: 32 }, m4: { type: 'swim', x: 55, y: 66 }, m5: { type: 'swim', x: 32, y: 70 },
      r0: { type: 'rock', x: 12.5, y: 73 }, r1: { type: 'rock', x: 93, y: 70 },
    },
    bg: `<defs><linearGradient id="rf-w" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#e6f0f2"/><stop offset=".6" stop-color="#c3d6db"/><stop offset="1" stop-color="#a3bfc7"/></linearGradient></defs>
  <rect width="400" height="225" fill="url(#rf-w)"/>
  <g fill="#fff" opacity=".35"><path d="M60 0h30L40 225H20z"/><path d="M190 0h22l-30 225h-24z"/><path d="M300 0h26l-10 225h-26z"/></g>
  <path d="M0 8q25-6 50 0t50 0 50 0 50 0 50 0 50 0 50 0 50 0" stroke="#fff" stroke-width="3" fill="none" opacity=".8"/>
  <g fill="none" stroke="#fff" stroke-width="1.2" opacity=".8"><circle cx="150" cy="60" r="3"/><circle cx="156" cy="44" r="2"/><circle cx="148" cy="30" r="2.6"/><circle cx="262" cy="90" r="2.4"/><circle cx="268" cy="72" r="1.8"/><circle cx="360" cy="110" r="2.4"/></g>
  <path d="M0 175q40-30 90-20t70 10 80-14 90 8 70 6v60H0z" fill="#b69fb4" opacity=".3"/>
  <path d="M0 190q100-14 200-4t200-2v41H0z" fill="#f3f3ea"/>
  <path d="M0 208q120-8 240 0t160-3v20H0z" fill="#e8e6d2"/>
  <path d="M10 197q8-36 46-34 34 2 38 34z" fill="#c9b8c7"/>
  <g fill="#b69fb4" opacity=".55"><circle cx="40" cy="180" r="4"/><circle cx="62" cy="186" r="3"/><circle cx="30" cy="190" r="2.6"/></g>
  <g stroke="#d7b6c2" stroke-width="7" stroke-linecap="round" fill="none"><path d="M124 198v-30m0 10-14-14m14 6 14-16m-14 26 10-6"/></g>
  <path d="M332 197q-30-40 0-72 30 32 0 72z" fill="#b69fb4" opacity=".75"/><path d="M332 196v-64m0 18-12-10m12 26 12-12m-12 30-10-8" stroke="#e5dde5" stroke-width="1.6" fill="none" stroke-linecap="round"/>
  <g stroke="#b9c58a" stroke-width="5" stroke-linecap="round" fill="none"><path d="M240 200q-8-20 0-40t0-40"/><path d="M252 200q8-16 0-32t2-30"/><path d="M186 202q-6-14 0-28"/></g>
  <ellipse cx="292" cy="197" rx="20" ry="12" fill="#c8d29d"/><path d="M276 196q4-6 8 0t8 0 8 0" stroke="#9aab5f" stroke-width="1.4" fill="none"/>
  <path d="M352 201q4-40 30-44 18 0 18 44z" fill="#c9b8c7"/>`,
    critters: {
      clownfish: { name: 'Clownfish', size: 7, weight: 10, spots: ['swim'], art:
        `<path d="M14 30 4 22v16z" fill="#cf9478"/><path d="M26 20q6-8 14 0z" fill="#cf9478"/><ellipse cx="32" cy="30" rx="18" ry="11" fill="#e8b296"/><path d="M24 20q-3 10 0 20M38 19.5q3 10.5 0 21" stroke="#fff" stroke-width="4" fill="none"/>${e(44, 27, 2)}${b(43, 33)}<path d="M46 34q2 1.4 4-.6" stroke="#9c4e6a" stroke-width="1.2" fill="none" stroke-linecap="round"/>` },
      angelfish: { name: 'Angelfish', size: 7, weight: 9, spots: ['swim'], art:
        `<path d="M16 30 5 21v18z" fill="#b69fb4"/><path d="M31 12 49 30 31 48 15 30z" fill="#d6cad5"/><path d="M25 18v24M33 14v32" stroke="#b69fb4" stroke-width="3"/><path d="M31 12q-2-6 4-9M31 48q-2 6 4 9" stroke="#b69fb4" stroke-width="2" fill="none" stroke-linecap="round"/>${e(41, 27)}` },
      seahorse: { name: 'Seahorse', size: 6.5, weight: 8, spots: ['swim', 'rock'], art:
        `<path d="M35 12q9 2 7 10l-2 4q8 6 4 15-4 8-10 8-6 0-6 5t6 5" stroke="#e2d9a6" stroke-width="8" fill="none" stroke-linecap="round"/><path d="M40 15l12 3" stroke="#e2d9a6" stroke-width="5" stroke-linecap="round"/><path d="M33 8l2 4 3-4" stroke="#c8be86" stroke-width="2" fill="none" stroke-linecap="round"/><path d="M30 30q-8 1-6 9" stroke="#c8d29d" stroke-width="3" fill="none" stroke-linecap="round"/>${e(38, 15, 1.7)}` },
      crab: { name: 'Crab', size: 7, weight: 9, spots: ['sand', 'rock'], art:
        `<path d="M18 50l-6 6M22 52l-4 6M42 50l6 6M38 52l4 6M20 42 12 38M40 42l8-4" stroke="#c48f86" stroke-width="2" stroke-linecap="round"/><circle cx="11" cy="35" r="5" fill="#d7a9a0"/><circle cx="49" cy="35" r="5" fill="#d7a9a0"/><path d="M8 32l4 3M52 32l-4 3" stroke="#f1e5ea" stroke-width="1.4"/><ellipse cx="30" cy="46" rx="14" ry="9" fill="#d7a9a0"/><path d="M25 38v-6M35 38v-6" stroke="#c48f86" stroke-width="2"/>${e(25, 31, 2.2)}${e(35, 31, 2.2)}<path d="M26 47q4 3 8 0" stroke="#9c4e6a" stroke-width="1.3" fill="none" stroke-linecap="round"/>${b(21, 46)}${b(39, 46)}` },
      starfish: { name: 'Sea star', size: 6, weight: 9, spots: ['sand', 'rock'], art:
        `<path d="${star(30, 41, 17, 7.5)}" fill="#d7b6c2" stroke="#d7b6c2" stroke-width="4" stroke-linejoin="round"/><g fill="#f1e5ea"><circle cx="30" cy="30" r="1.2"/><circle cx="42" cy="38" r="1.2"/><circle cx="18" cy="38" r="1.2"/><circle cx="37" cy="52" r="1.2"/><circle cx="23" cy="52" r="1.2"/></g>${e(27, 40, 1.5)}${e(33, 40, 1.5)}<path d="M28 44q2 1.6 4 0" stroke="#9c4e6a" stroke-width="1.2" fill="none" stroke-linecap="round"/>` },
      jellyfish: { name: 'Jellyfish', size: 6.5, weight: 8, spots: ['swim'], art:
        `<path d="M20 32q-3 8 0 14t0 12M28 32q3 8 0 14M34 32q-3 8 0 16M40 32q3 8 0 12" stroke="#b69fb4" stroke-width="1.6" fill="none" stroke-linecap="round"/><path d="M14 30q0-16 16-16t16 16q-4 3-8 0-4 3-8 0-4 3-8 0-4 3-8 0z" fill="#ece5ec" stroke="#b69fb4" stroke-width="1.2"/>${e(25, 24, 1.6)}${e(35, 24, 1.6)}${b(22, 28)}${b(38, 28)}` },
      pufferfish: { name: 'Pufferfish', size: 6.5, weight: 6, spots: ['swim'], art:
        `<path d="M17 32 8 26v12z" fill="#cfcdb0"/><g stroke="#b5b38f" stroke-width="1.6" stroke-linecap="round"><path d="M30 16v-4M40 19l3-3M44 30h4M40 42l3 3M30 46v4M20 42l-3 3M20 19l-3-3"/></g><circle cx="30" cy="31" r="14" fill="#e3dfb8"/><ellipse cx="30" cy="38" rx="9" ry="6" fill="#f3f3ea"/><g fill="#c8be86"><circle cx="24" cy="24" r="1.4"/><circle cx="30" cy="21" r="1.4"/><circle cx="22" cy="31" r="1.4"/></g>${e(36, 27, 2.2)}<circle cx="44" cy="32" r="1.8" fill="#9c4e6a"/>${b(36, 34)}` },
      turtle: { name: 'Sea turtle', size: 11, weight: 5, spots: ['swim'], art:
        `<path d="M36 40q8 10 14 8-4-8-10-10zM34 22q8-10 14-8-4 8-10 10zM20 40q-6 8-12 6 4-6 8-8zM20 24q-6-8-12-6 4 6 8 8z" fill="#c8d29d"/><circle cx="49" cy="31" r="6" fill="#c8d29d"/><ellipse cx="30" cy="32" rx="16" ry="11" fill="#b9c58a"/><path d="M22 28l8-4 8 4v8l-8 4-8-4z" fill="none" stroke="#9aab5f" stroke-width="1.4"/><path d="M22 28l-6-2m6 10-6 2m22-10 6-2m-6 10 6 2" stroke="#9aab5f" stroke-width="1.4"/>${e(51, 30, 1.6)}<path d="M50 34q2 1 4-.4" stroke="#616d2c" stroke-width="1.1" fill="none" stroke-linecap="round"/>` },
      octopus: { name: 'Octopus', size: 9, weight: 5, spots: ['sand', 'rock'], art:
        `<g stroke="#d7b6c2" stroke-width="5" fill="none" stroke-linecap="round"><path d="M18 34q-6 10-2 18 4 4 6 0"/><path d="M25 35q-2 12 2 20"/><path d="M35 35q2 12-2 20"/><path d="M42 34q6 10 2 18-4 4-6 0"/></g><path d="M16 35q0-23 14-23t14 23z" fill="#d7b6c2"/><g fill="#f1e5ea"><circle cx="26" cy="16" r="1.6"/><circle cx="34" cy="17" r="1.2"/></g>${e(24, 27, 2.2)}${e(36, 27, 2.2)}${b(20, 32)}${b(40, 32)}<path d="M28 31q2 1.6 4 0" stroke="#9c4e6a" stroke-width="1.2" fill="none" stroke-linecap="round"/>` },
      ray: { name: 'Stingray', size: 12, weight: 4, spots: ['sand'], art:
        `<path d="M30 46q2 8 14 12" stroke="#b3b1ba" stroke-width="2" fill="none" stroke-linecap="round"/><path d="M30 33Q6 30 4 43q14 6 26 4 12 2 26-4-2-13-26-10z" fill="#c9c7cf"/><g fill="#ebebef"><circle cx="18" cy="41" r="1.6"/><circle cx="42" cy="41" r="1.6"/><circle cx="30" cy="44" r="1.4"/></g>${e(25, 38, 1.5)}${e(35, 38, 1.5)}` },
      dugong: { name: 'Dugong', size: 14, weight: 1.5, spots: ['swim'], art:
        `<path d="M10 36 1 27v19z" fill="#b3b1ba"/><path d="M8 37q4-15 26-15 18 0 22 12 2 8-6 10-20 4-36 0-4 0-6-7z" fill="#c9c7cf"/><ellipse cx="52" cy="38" rx="6" ry="5" fill="#d6d4db"/><path d="M34 42q2 8-6 10 0-6 2-10z" fill="#b3b1ba"/>${e(46, 32, 1.6)}${b(48, 38)}<path d="M51 41q2 1 4 0" stroke="#8b8994" stroke-width="1.1" fill="none" stroke-linecap="round"/>` },
      whaleshark: { name: 'Whale shark', size: 18, weight: 1.2, spots: ['swim'], art:
        `<path d="M13 30 2 18v26z" fill="#6b919b"/><path d="M30 19l6-11 4 12z" fill="#6b919b"/><path d="M4 32l8-6q18-10 38-4 8 4 6 12-6 8-26 8-16-2-18-6z" fill="#7fa4ae"/><path d="M20 38q16 4 34-2" stroke="#e6f0f2" stroke-width="4" fill="none" stroke-linecap="round"/><g fill="#e6f0f2"><circle cx="22" cy="28" r="1.4"/><circle cx="28" cy="24" r="1.4"/><circle cx="34" cy="28" r="1.4"/><circle cx="40" cy="24" r="1.4"/><circle cx="18" cy="33" r="1.2"/><circle cx="30" cy="32" r="1.2"/></g><path d="M49 34h7" stroke="#426a75" stroke-width="1.6" stroke-linecap="round"/>${e(48, 28, 1.5)}` },
    },
  };

  /* ======================= OUTBACK NIGHT ======================= */
  const night = {
    card: '#4f5a74', name: 'Outback night', title: 'the night friends', hazeText: 'Shh… the clouds are rolling in', haze: 'rgba(70, 80, 104, .82)', hazeInk: '#f3f3ea', tone: 'mauve',
    slots: {
      g0: { type: 'ground', x: 30, y: 92, s: .95 }, g1: { type: 'ground', x: 48, y: 84, s: .85 }, g2: { type: 'ground', x: 63, y: 93, s: .95 },
      g3: { type: 'ground', x: 80, y: 88, s: .9 }, g4: { type: 'ground', x: 42, y: 99, s: 1 },
      t0: { type: 'tree', x: 23, y: 48 },
      a0: { type: 'air', x: 40, y: 26 }, a1: { type: 'air', x: 62, y: 36 }, a2: { type: 'air', x: 52, y: 15 }, a3: { type: 'air', x: 84, y: 50 },
    },
    bg: `<defs><linearGradient id="nt-s" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#3f4a62"/><stop offset="1" stop-color="#857f9e"/></linearGradient></defs>
  <rect width="400" height="225" fill="url(#nt-s)"/>
  <g fill="#fff"><circle cx="30" cy="20" r="1.2"/><circle cx="90" cy="14" r="1"/><circle cx="130" cy="40" r="1.4"/><circle cx="170" cy="12" r="1"/><circle cx="210" cy="34" r="1.2"/><circle cx="250" cy="18" r="1.4"/><circle cx="280" cy="60" r="1"/><circle cx="370" cy="20" r="1.2"/><circle cx="385" cy="70" r="1"/><circle cx="230" cy="80" r="1"/><circle cx="150" cy="90" r="1"/><circle cx="110" cy="70" r="1"/><circle cx="350" cy="95" r="1"/></g>
  <g fill="#f1e5ea" opacity=".8"><circle cx="190" cy="56" r="1.6"/><circle cx="60" cy="40" r="1.4"/><circle cx="300" cy="28" r="1.6"/></g>
  <circle cx="322" cy="46" r="30" fill="#f3f3ea" opacity=".12"/><circle cx="322" cy="46" r="18" fill="#f3f3ea"/><circle cx="316" cy="41" r="3" fill="#e5e3cc"/><circle cx="327" cy="52" r="4" fill="#e5e3cc"/><circle cx="328" cy="39" r="2" fill="#e5e3cc"/>
  <path d="M0 160q40-6 70-30 20-14 40 0 20 20 60 24 50 4 80-20 30-20 60 0 40 22 90 24v67H0z" fill="#7d6a7c"/>
  <path d="M206 152q6-26 30-28h52q22 2 30 28z" fill="#9b7f83"/>
  <path d="M0 172q100-10 200-2t200-4v59H0z" fill="#a58c88"/>
  <path d="M0 200q130-8 260 0t140-2v27H0z" fill="#957c79"/>
  <path d="M38 184q6-62 0-112h12q-4 62 8 112z" fill="#ebebef"/><path d="M48 110q24-14 56-12v5q-30 0-54 15z" fill="#ebebef"/>
  <g fill="#6c7a69"><ellipse cx="48" cy="60" rx="38" ry="22"/><ellipse cx="92" cy="80" rx="22" ry="12"/></g><g fill="#7d8b78"><ellipse cx="36" cy="52" rx="14" ry="7"/><ellipse cx="70" cy="66" rx="12" ry="6"/></g>
  <g fill="#8a8f6a"><ellipse cx="150" cy="192" rx="18" ry="8"/><ellipse cx="300" cy="186" rx="16" ry="7"/><ellipse cx="372" cy="204" rx="20" ry="8"/></g>
  <g stroke="#a8ad85" stroke-width="1.4" stroke-linecap="round"><path d="M142 188l-3-6M150 186v-7M158 188l3-6M294 182l-2-6M300 180v-6M306 182l2-6"/></g>`,
    critters: {
      bilby: { name: 'Bilby', size: 8.5, weight: 9, spots: ['ground'], art:
        `<path d="M12 52q-7 2-9-4" stroke="#34333b" stroke-width="3" fill="none" stroke-linecap="round"/><path d="M3 48q-2-3 1-5" stroke="#fff" stroke-width="3" stroke-linecap="round"/><ellipse cx="26" cy="47" rx="15" ry="10" fill="#c9c7cf"/><ellipse cx="34" cy="21" rx="4.5" ry="12" fill="#c9c7cf" transform="rotate(-12 34 21)"/><ellipse cx="43" cy="22" rx="4.5" ry="12" fill="#c9c7cf" transform="rotate(14 43 22)"/><ellipse cx="34" cy="22" rx="2.2" ry="8" fill="#e8cfd8" transform="rotate(-12 34 22)"/><ellipse cx="43" cy="23" rx="2.2" ry="8" fill="#e8cfd8" transform="rotate(14 43 23)"/><ellipse cx="40" cy="37" rx="9" ry="8" fill="#d6d4db"/><path d="M46 36q8 2 10 4-2 2-10 2z" fill="#d6d4db"/><circle cx="56" cy="40" r="1.6" fill="#9c4e6a"/>${e(42, 35, 1.7)}${b(44, 41)}<ellipse cx="20" cy="57" rx="5" ry="1.8" fill="#b3b1ba"/><ellipse cx="34" cy="57" rx="5" ry="1.8" fill="#b3b1ba"/>` },
      owl: { name: 'Boobook owl', size: 8, weight: 8, spots: ['tree'], art:
        `<path d="M19 22l2-6 4 5M41 22l-2-6-4 5" fill="#b0a199"/><ellipse cx="30" cy="40" rx="13" ry="16" fill="#b0a199"/><ellipse cx="30" cy="46" rx="8" ry="10" fill="#e6ddd6"/><g fill="#b0a199"><circle cx="27" cy="44" r="1.2"/><circle cx="33" cy="47" r="1.2"/><circle cx="29" cy="51" r="1.2"/></g><circle cx="24" cy="31" r="7" fill="#ece4de"/><circle cx="36" cy="31" r="7" fill="#ece4de"/><circle cx="24" cy="31" r="4" fill="#e2d9a6"/><circle cx="36" cy="31" r="4" fill="#e2d9a6"/>${e(24, 31, 2.4)}${e(36, 31, 2.4)}<path d="M28.5 35h3L30 38z" fill="#5a5862"/><path d="M26 56v3m8-3v3" stroke="#8b8488" stroke-width="1.8" stroke-linecap="round"/>` },
      glider: { name: 'Sugar glider', size: 9, weight: 7, spots: ['air', 'tree'], art:
        `<path d="M30 44q2 10-4 14" stroke="#8b8994" stroke-width="3" fill="none" stroke-linecap="round"/><path d="M30 22q-20 4-26 18 10-2 14 4 6-4 12-2 6-2 12 2 4-6 14-4-6-14-26-18z" fill="#c9c7cf"/><circle cx="23" cy="17" r="3.4" fill="#c9c7cf"/><circle cx="37" cy="17" r="3.4" fill="#c9c7cf"/><circle cx="30" cy="24" r="8" fill="#d6d4db"/><path d="M30 16v8" stroke="#8b8994" stroke-width="2" stroke-linecap="round"/>${e(26.5, 24, 2.4)}${e(33.5, 24, 2.4)}<circle cx="30" cy="28.5" r="1.2" fill="#9c4e6a"/>` },
      flyingfox: { name: 'Flying fox', size: 10, weight: 7, spots: ['air'], art:
        `<g class="hb-wings"><path d="M30 26q-10-8-26-2 4 4 2 10 6-2 8 4 6-4 10 0 4-4 6-4zM30 26q10-8 26-2-4 4-2 10-6-2-8 4-6-4-10 0 4-4-6-4z" fill="#7a6e80"/></g><ellipse cx="30" cy="31" rx="6" ry="8" fill="#8a6f68"/><path d="M26 18l1-4 3 3M34 18l-1-4-3 3" fill="#a07f73"/><circle cx="30" cy="22" r="6" fill="#a07f73"/>${e(27.5, 22, 1.5)}${e(32.5, 22, 1.5)}<circle cx="30" cy="25" r="1" fill="#34333b"/>` },
      moth: { name: 'Bogong moth', size: 5.5, weight: 9, spots: ['air'], art:
        `<g class="hb-wings"><path d="M30 30Q14 18 10 30q2 8 20 4zM30 30q16-12 20 0-2 8-20 4z" fill="#deddc3"/><path d="M30 33q-12 2-14 10 6 4 14-6zM30 33q12 2 14 10-6 4-14-6z" fill="#cfcdb0"/></g><ellipse cx="30" cy="34" rx="2.6" ry="9" fill="#a8a585"/><path d="M29 26q-4-6-8-6M31 26q4-6 8-6" stroke="#a8a585" stroke-width="1.2" fill="none" stroke-linecap="round"/>` },
      dingo: { name: 'Dingo', size: 12, weight: 5, spots: ['ground'], art:
        `<path d="M12 38q-8-4-6-12" stroke="#d9b9a0" stroke-width="5" fill="none" stroke-linecap="round"/><path d="M6 27q-1-3 1-5" stroke="#f3f3ea" stroke-width="4" stroke-linecap="round"/><path d="M16 46v10M24 46v10M36 46v10M42 46v10" stroke="#d9b9a0" stroke-width="4" stroke-linecap="round"/><path d="M16 57h1M36 57h1" stroke="#f3f3ea" stroke-width="4" stroke-linecap="round"/><path d="M10 40q2-10 16-10h14q8 0 10 8l-2 6q-4 4-14 4H18q-8 0-8-8z" fill="#d9b9a0"/><path d="M40 24l1-9 5 6zM47 22l4-8 2 9z" fill="#d9b9a0"/><circle cx="46" cy="30" r="8" fill="#d9b9a0"/><ellipse cx="53" cy="33" rx="5" ry="3.5" fill="#efe0d2"/><path d="M40 36q4 8 0 10" stroke="#efe0d2" stroke-width="4" fill="none" stroke-linecap="round"/><circle cx="57.5" cy="32" r="1.5" fill="#34333b"/>${e(47, 28, 1.6)}` },
      quoll: { name: 'Spotted quoll', size: 8.5, weight: 6, spots: ['ground', 'tree'], art:
        `<path d="M13 46q-10 2-10 10" stroke="#a8887c" stroke-width="4" fill="none" stroke-linecap="round"/><ellipse cx="28" cy="47" rx="15" ry="9" fill="#a8887c"/><g fill="#f3f3ea"><circle cx="20" cy="44" r="1.8"/><circle cx="27" cy="41" r="1.6"/><circle cx="33" cy="45" r="1.8"/><circle cx="24" cy="50" r="1.4"/><circle cx="16" cy="49" r="1.2"/></g><circle cx="38" cy="33" r="2.8" fill="#a8887c"/><circle cx="45" cy="33" r="2.8" fill="#a8887c"/><circle cx="42" cy="40" r="7" fill="#a8887c"/><path d="M47 39q6 2 8 4-2 1-8 2z" fill="#a8887c"/><circle cx="55" cy="43" r="1.3" fill="#d7b6c2"/>${e(44, 39, 1.6)}` },
      thornydevil: { name: 'Thorny devil', size: 7, weight: 6, spots: ['ground'], art:
        `<path d="M15 49Q4 51 2 57" stroke="#d9b9a0" stroke-width="4" fill="none" stroke-linecap="round"/><path d="M20 52l-4 5M38 52l4 5M22 44l-5-4M38 44l5-4" stroke="#c9a68c" stroke-width="2.2" stroke-linecap="round"/><ellipse cx="30" cy="48" rx="15" ry="7" fill="#d9b9a0"/><path d="M20 43l2-5 2 5zM27 42l2-5 2 5zM34 42l2-5 2 5zM40 43l2-5 2 5z" fill="#a8887c"/><path d="M18 49q12-4 24 0" stroke="#c48f86" stroke-width="2" fill="none" opacity=".6"/><ellipse cx="46" cy="46" rx="6" ry="5" fill="#d9b9a0"/>${e(48, 44, 1.4)}` },
      hoppingmouse: { name: 'Hopping mouse', size: 5.5, weight: 7, spots: ['ground'], art:
        `<path d="M18 48q-12-2-14-12" stroke="#d9c4b7" stroke-width="1.6" fill="none" stroke-linecap="round"/><circle cx="4" cy="35" r="2.2" fill="#a8887c"/><ellipse cx="28" cy="55" rx="7" ry="2.2" fill="#c7b0a2"/><ellipse cx="28" cy="46" rx="10" ry="8" fill="#d9c4b7"/><ellipse cx="35" cy="31" rx="3.5" ry="5.5" fill="#d9c4b7"/><ellipse cx="41" cy="31" rx="3.5" ry="5.5" fill="#d9c4b7"/><ellipse cx="35" cy="31" rx="1.8" ry="3.4" fill="#e8cfd8"/><ellipse cx="41" cy="31" rx="1.8" ry="3.4" fill="#e8cfd8"/><circle cx="38" cy="40" r="6.5" fill="#d9c4b7"/><circle cx="44" cy="41" r="1.3" fill="#d7b6c2"/>${e(39, 39, 1.7)}` },
      nightparrot: { name: 'Night parrot', size: 8, weight: 1.5, spots: ['ground'], art:
        `<path d="M18 46l-12 4 12 2z" fill="#9aab5f"/><ellipse cx="30" cy="44" rx="13" ry="11" fill="#b9c58a"/><circle cx="38" cy="32" r="8" fill="#c8d29d"/><g fill="#7f8c4a" opacity=".6"><circle cx="24" cy="40" r="1.2"/><circle cx="30" cy="38" r="1.2"/><circle cx="27" cy="46" r="1.2"/><circle cx="34" cy="44" r="1.2"/><circle cx="36" cy="28" r="1"/></g><path d="M45 32q4 1 2 5-2-1-3-2z" fill="#a8a585"/>${e(40, 31, 1.8)}<path d="M28 55v3m6-3v3" stroke="#8b8488" stroke-width="1.6" stroke-linecap="round"/>` },
      shootingstar: { name: 'Shooting star', size: 14, weight: 1.3, spots: ['air'], art:
        `<path d="M2 54 44 21l2 5z" fill="#f3f3ea" opacity=".5"/><path d="M8 54 44 25" stroke="#f1e5ea" stroke-width="1.4" opacity=".6"/><path d="${star(46, 21, 10, 4.4)}" fill="#f3f3ea" stroke="#f3f3ea" stroke-width="2" stroke-linejoin="round"/>${e(43.5, 20, 1.2)}${e(48.5, 20, 1.2)}${b(42, 24)}${b(50, 24)}` },
    },
  };

  /* ======================= ANTARCTICA ======================= */
  const snow = {
    card: '#dfe9eb', name: 'Antarctica', title: 'the icy friends', hazeText: 'Shh… a blizzard’s coming', haze: 'rgba(255, 255, 255, .84)', hazeInk: '#426a75', tone: 'blue',
    slots: {
      i0: { type: 'ice', x: 9, y: 72, s: .9 }, i1: { type: 'ice', x: 21, y: 72.5, s: .92 }, i2: { type: 'ice', x: 34, y: 72, s: .9 },
      i3: { type: 'ice', x: 71, y: 78.5, s: .85 }, i4: { type: 'ice', x: 82, y: 78.5, s: .85 },
      w0: { type: 'sea', x: 52, y: 93 }, w1: { type: 'sea', x: 68, y: 99 }, w2: { type: 'sea', x: 90, y: 97 },
      a0: { type: 'air', x: 40, y: 26 }, a1: { type: 'air', x: 66, y: 18 }, a2: { type: 'air', x: 88, y: 38 },
    },
    bg: `<defs><linearGradient id="sn-s" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#e3edf0"/><stop offset="1" stop-color="#ffffff"/></linearGradient></defs>
  <rect width="400" height="225" fill="url(#sn-s)"/>
  <circle cx="70" cy="40" r="16" fill="#f3f3ea"/>
  <path d="M0 146l40-30 30 20 40-40 50 50 40-24 60 34 50-30 50 26 40-10v104H0z" fill="#dfe9eb"/>
  <rect y="150" width="400" height="75" fill="#a3bfc7"/>
  <path d="M200 152l20-36 18 14 16-22 24 44z" fill="#f4f8f9" stroke="#d3e1e5" stroke-width="1.5"/>
  <g stroke="#c3d6db" stroke-width="2" stroke-linecap="round" fill="none"><path d="M196 172q10-3 20 0M230 200q12-3 24 0M120 214q10-3 20 0M300 214q12-3 24 0M370 168q8-2 16 0"/></g>
  <path d="M0 162h170q14 0 16 10l4 22q0 6-8 6H0z" fill="#fff" stroke="#dfe9eb" stroke-width="2"/><path d="M0 186h182l4 8q0 6-8 6H0z" fill="#e6f0f2"/>
  <path d="M262 177h88q10 0 12 8l2 8q0 4-6 4H256q-6 0-4-6z" fill="#fff" stroke="#dfe9eb" stroke-width="2"/><path d="M256 189h108v4q0 4-6 4H256q-6 0-4-6z" fill="#e6f0f2"/>
  <g fill="#fff"><circle cx="120" cy="30" r="1.6"/><circle cx="180" cy="60" r="1.4"/><circle cx="250" cy="24" r="1.6"/><circle cx="320" cy="70" r="1.4"/><circle cx="380" cy="30" r="1.6"/></g>`,
    critters: {
      emperor: { name: 'Emperor penguin', size: 9, weight: 9, spots: ['ice'], art:
        `<ellipse cx="25" cy="57" rx="4" ry="1.6" fill="#d7a9a0"/><ellipse cx="35" cy="57" rx="4" ry="1.6" fill="#d7a9a0"/><path d="M17 34q-6 10-2 16 4-6 4-12zM43 34q6 10 2 16-4-6-4-12z" fill="#5d6070"/><ellipse cx="30" cy="38" rx="13" ry="19" fill="#5d6070"/><ellipse cx="30" cy="42" rx="9" ry="15" fill="#fff"/><circle cx="30" cy="20" r="9" fill="#5d6070"/><ellipse cx="24" cy="25" rx="3" ry="4" fill="#e2d9a6"/><ellipse cx="36" cy="25" rx="3" ry="4" fill="#e2d9a6"/><path d="M28 24l2 5 2-5z" fill="#d7a9a0"/>${e(26.5, 19, 1.6)}${e(33.5, 19, 1.6)}` },
      chick: { name: 'Penguin chick', size: 6.5, weight: 9, spots: ['ice'], art:
        `<path d="M18 40q-4 6-1 10M42 40q4 6 1 10" stroke="#b3b1ba" stroke-width="4" fill="none" stroke-linecap="round"/><circle cx="30" cy="45" r="13" fill="#c9c7cf"/><circle cx="30" cy="28" r="9" fill="#c9c7cf"/><path d="M23 29q0-6 7-6t7 6q0 6-7 6t-7-6z" fill="#fff"/><path d="M21 27q2-9 9-9t9 9q-4-4-9-4t-9 4z" fill="#5d6070"/><path d="M29 31l1 2.6 1-2.6z" fill="#5d6070"/>${e(27, 28, 1.5)}${e(33, 28, 1.5)}${b(25, 32)}${b(35, 32)}` },
      adelie: { name: 'Adelie penguin', size: 8, weight: 8, spots: ['ice'], art:
        `<path d="M26 56l-3 2h6M33 56l-3 2h6" stroke="#d7a9a0" stroke-width="2" stroke-linecap="round"/><path d="M20 34q-4 10 0 14 2-6 2-12z" fill="#4b4d5b"/><ellipse cx="28" cy="40" rx="11" ry="16" fill="#5d6070"/><ellipse cx="32" cy="42" rx="7" ry="13" fill="#fff"/><circle cx="32" cy="22" r="8" fill="#5d6070"/><circle cx="35" cy="21" r="3" fill="#fff"/>${e(35, 21, 1.5)}<path d="M39 23l6 1-6 2z" fill="#d7a9a0"/>` },
      seal: { name: 'Weddell seal', size: 12, weight: 7, spots: ['ice'], art:
        `<path d="M5 52q-5-6 0-11 2 5 3 9z" fill="#7d8596"/><path d="M4 53q2-15 20-17 18-2 26 4 6 6 4 13z" fill="#8f97a8"/><g fill="#a9b0bd"><ellipse cx="18" cy="44" rx="2.4" ry="1.4"/><ellipse cx="28" cy="40" rx="2" ry="1.2"/><ellipse cx="24" cy="48" rx="2" ry="1.2"/></g><path d="M36 50q-2 6 4 7" stroke="#7d8596" stroke-width="3" fill="none" stroke-linecap="round"/><circle cx="47" cy="41" r="8.5" fill="#9aa2b2"/><ellipse cx="54" cy="44" rx="2" ry="1.4" fill="#34333b"/>${e(48, 38, 2)}${b(50, 45)}<path d="M51 47q2 1.4 4 0" stroke="#5d6070" stroke-width="1.1" fill="none" stroke-linecap="round"/>` },
      leopardseal: { name: 'Leopard seal', size: 13, weight: 4, spots: ['sea'], art:
        `<path d="M6 52q10-15 28-15 16 0 22 10" fill="#b3b8c4"/><g fill="#8f97a8"><ellipse cx="18" cy="46" rx="2" ry="1.2"/><ellipse cx="26" cy="42" rx="2" ry="1.2"/><ellipse cx="32" cy="46" rx="1.6" ry="1"/></g><ellipse cx="50" cy="44" rx="9" ry="7" fill="#b3b8c4"/><path d="M45 47q6 4 11-1" stroke="#5d6070" stroke-width="1.4" fill="none" stroke-linecap="round"/>${e(50, 41, 1.7)}${water(50)}` },
      albatross: { name: 'Albatross', size: 14, weight: 6, spots: ['air'], art:
        `<g class="hb-wings"><path d="M30 30Q14 22 0 26q14 2 22 8zM30 30q16-8 30-4-14 2-22 8z" fill="#fff" stroke="#c9c7cf" stroke-width="1"/><path d="M1 26q8 0 12 2M59 26q-8 0-12 2" stroke="#5d6070" stroke-width="2" stroke-linecap="round"/></g><ellipse cx="30" cy="32" rx="9" ry="4.5" fill="#fff" stroke="#d9d9e0"/><circle cx="38" cy="30" r="3.6" fill="#fff" stroke="#d9d9e0"/><path d="M41 30l6 1-6 1.4z" fill="#e2c3a8"/>${e(39, 29, 1)}` },
      petrel: { name: 'Snow petrel', size: 7, weight: 8, spots: ['air'], art:
        `<g class="hb-wings"><path d="M30 30Q18 20 8 26q10 2 16 8zM30 30q12-10 22-4-10 2-16 8z" fill="#fff" stroke="#c9c7cf"/></g><ellipse cx="30" cy="32" rx="7" ry="4.5" fill="#fff" stroke="#d9d9e0"/><circle cx="36" cy="29" r="4" fill="#fff" stroke="#d9d9e0"/><path d="M39.5 29l4 1-4 1.2z" fill="#34333b"/>${e(37, 28, 1.3)}` },
      krill: { name: 'Krill', size: 6, weight: 8, spots: ['sea'], art:
        `<g fill="#e8cfd8" stroke="#d7a9a0" stroke-width="1"><path d="M8 40q4-8 14-6 2 4-2 6-6 2-12 0z"/><path d="M30 32q4-8 14-6 2 4-2 6-6 2-12 0z"/><path d="M26 48q4-8 14-6 2 4-2 6-6 2-12 0z"/></g><g fill="#34333b"><circle cx="20" cy="36" r="1"/><circle cx="42" cy="28" r="1"/><circle cx="38" cy="44" r="1"/></g>${water(54)}` },
      orca: { name: 'Orca', size: 16, weight: 1.4, spots: ['sea'], art:
        `<path d="M26 38l4-17 6 16z" fill="#3f4250"/><path d="M4 51q14-16 34-14 14 1 18 11z" fill="#3f4250"/><ellipse cx="44" cy="42" rx="4" ry="2" fill="#fff"/><path d="M16 49q20-4 38-2" stroke="#fff" stroke-width="2.4" fill="none" stroke-linecap="round"/>${e(48, 45, 1.2)}${water(50)}` },
      humpback: { name: 'Humpback whale', size: 16, weight: 1.3, spots: ['sea'], art:
        `<path d="M30 52q-2-16 0-24" stroke="#5d6a7c" stroke-width="7" stroke-linecap="round"/><path d="M30 28Q16 14 4 18q8 7 26 12 18-5 26-12-12-4-26 10z" fill="#5d6a7c"/><g fill="#e6f0f2"><circle cx="16" cy="20" r="1.4"/><circle cx="44" cy="20" r="1.4"/><circle cx="8" cy="10" r="1.6"/><circle cx="52" cy="8" r="1.4"/><circle cx="22" cy="6" r="1.2"/></g>${water(50)}` },
    },
  };

  /* ======================= DINOSAUR VALLEY ======================= */
  const dino = {
    card: '#f1ece0', name: 'Dinosaur valley', title: 'the dinosaurs', hazeText: 'Shh… the volcano’s rumbling', haze: 'rgba(182, 159, 180, .74)', hazeInk: '#ffffff', tone: 'rose',
    slots: {
      g0: { type: 'ground', x: 33, y: 88, s: .9 }, g1: { type: 'ground', x: 50, y: 81, s: .8 }, g2: { type: 'ground', x: 64, y: 93, s: .95 },
      g3: { type: 'ground', x: 80, y: 86, s: .85 }, g4: { type: 'ground', x: 45, y: 99, s: 1 },
      w0: { type: 'lake', x: 13, y: 90 },
      a0: { type: 'air', x: 30, y: 26 }, a1: { type: 'air', x: 52, y: 16 }, a2: { type: 'air', x: 14, y: 44 },
    },
    bg: `<defs><linearGradient id="dn-s" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#f1ece0"/><stop offset="1" stop-color="#ffffff"/></linearGradient></defs>
  <rect width="400" height="225" fill="url(#dn-s)"/>
  <g fill="#ece5ec"><circle cx="300" cy="72" r="10"/><circle cx="312" cy="56" r="13"/><circle cx="298" cy="40" r="11"/><circle cx="314" cy="26" r="9"/></g>
  <path d="M248 152l36-64h28l36 64z" fill="#b69fb4"/><path d="M284 88q14 7 28 0" stroke="#d7b6c2" stroke-width="4" stroke-linecap="round"/><path d="M290 92l-6 18M300 93l4 14" stroke="#d7b6c2" stroke-width="2.4" stroke-linecap="round" opacity=".7"/>
  <path d="M0 150q60-24 120-10t110-2 170 4v83H0z" fill="#e5dde5"/>
  <path d="M0 168q100-14 200-4t200-4v65H0z" fill="#c8d29d"/>
  <path d="M0 204q120-8 240 0t160-2v23H0z" fill="#b9c58a"/>
  <ellipse cx="66" cy="197" rx="56" ry="13" fill="#a3bfc7"/><ellipse cx="58" cy="193" rx="32" ry="5" fill="#c3d6db"/>
  <path d="M357 192q-4-42 4-82" stroke="#cdbfae" stroke-width="8" fill="none" stroke-linecap="round"/><path d="M354 180h8M354 166h8M355 152h8M356 138h8" stroke="#b5a796" stroke-width="1.6"/>
  <g fill="#9aab5f"><path d="M361 110q-30-6-44 10 22-4 44-6z"/><path d="M361 110q30-6 44 10-22-4-44-6z"/><path d="M361 110q-14-24-36-24 18 10 34 26z"/><path d="M361 110q14-24 36-24-18 10-34 26z"/></g>
  <g stroke="#9aab5f" stroke-width="2" fill="none" stroke-linecap="round"><path d="M150 194q-2-16 10-22M150 194q2-14 16-16M150 194q-6-12-18-12M250 200q-2-14 8-18M250 200q4-12 14-12M250 200q-6-10-14-10"/></g>
  <g fill="#deddc3"><ellipse cx="200" cy="192" rx="12" ry="6"/><ellipse cx="214" cy="194" rx="7" ry="4"/></g>`,
    critters: {
      triceratops: { name: 'Triceratops', size: 13, weight: 8, spots: ['ground'], art:
        `<path d="M10 42 0 48l10 2z" fill="#e0c4ce"/><rect x="12" y="47" width="7" height="11" rx="3" fill="#cfa9b8"/><rect x="22" y="48" width="7" height="10" rx="3" fill="#cfa9b8"/><rect x="32" y="47" width="7" height="11" rx="3" fill="#cfa9b8"/><ellipse cx="26" cy="42" rx="17" ry="11" fill="#e0c4ce"/><circle cx="42" cy="32" r="11" fill="#cfa9b8"/><g fill="#d7b6c2"><circle cx="36" cy="24" r="1.6"/><circle cx="42" cy="22" r="1.6"/><circle cx="48" cy="24" r="1.6"/></g><path d="M44 30l4-10 1 10zM50 31l6-8-2 10z" fill="#f3f3ea"/><ellipse cx="47" cy="39" rx="9" ry="7" fill="#e0c4ce"/><path d="M54 37l4-4v6z" fill="#f3f3ea"/>${e(48, 37, 1.6)}${b(50, 42)}` },
      stegosaurus: { name: 'Stegosaurus', size: 14, weight: 8, spots: ['ground'], art:
        `<path d="M8 47 1 42M8 47 2 50" stroke="#e5dde5" stroke-width="2.4" stroke-linecap="round"/><path d="M14 34l3-10 5 8zM22 28l4-11 5 10zM31 26l5-11 4 11zM40 28l6-9 2 11z" fill="#d7b6c2"/><rect x="14" y="46" width="6" height="12" rx="3" fill="#a48ea2"/><rect x="38" y="46" width="6" height="12" rx="3" fill="#a48ea2"/><path d="M6 49q6-21 26-21t24 18z" fill="#b69fb4"/><ellipse cx="54" cy="45" rx="6" ry="4.5" fill="#b69fb4"/>${e(55, 44, 1.3)}` },
      brachiosaurus: { name: 'Brachiosaurus', size: 20, weight: 5, spots: ['ground'], art:
        `<path d="M10 44Q2 46 0 54" stroke="#a3bfc7" stroke-width="5" fill="none" stroke-linecap="round"/><rect x="14" y="46" width="6" height="12" rx="3" fill="#8fadb6"/><rect x="28" y="46" width="6" height="12" rx="3" fill="#8fadb6"/><ellipse cx="24" cy="44" rx="14" ry="9" fill="#a3bfc7"/><path d="M32 40q8-14 10-30" stroke="#a3bfc7" stroke-width="7" fill="none" stroke-linecap="round"/><ellipse cx="45" cy="9" rx="6.5" ry="4.5" fill="#a3bfc7"/><g fill="#c3d6db"><circle cx="20" cy="40" r="1.6"/><circle cx="26" cy="38" r="1.4"/><circle cx="30" cy="44" r="1.4"/></g>${e(46, 8, 1.3)}${b(48, 11)}` },
      pterosaur: { name: 'Pterosaur', size: 11, weight: 7, spots: ['air'], art:
        `<g class="hb-wings"><path d="M30 30 4 22l8 12zM30 30l26-8-8 12z" fill="#d7b6c2"/></g><ellipse cx="30" cy="32" rx="6" ry="4" fill="#c9a9b4"/><path d="M33 27l-6-6 4 8z" fill="#b69fb4"/><path d="M34 28l14 2-12 3z" fill="#c9a9b4"/>${e(36, 29, 1.2)}` },
      raptor: { name: 'Feathered raptor', size: 9, weight: 7, spots: ['ground'], art:
        `<path d="M26 44l-2 8 4 4M32 44l2 8 4 4" stroke="#b5b38f" stroke-width="2.4" fill="none" stroke-linecap="round"/><path d="M18 36 2 30l4 6-4 4z" fill="#cfcdb0"/><ellipse cx="28" cy="38" rx="11" ry="8" fill="#deddc3"/><path d="M34 34q4-10 10-12" stroke="#deddc3" stroke-width="6" stroke-linecap="round"/><path d="M42 18l-2-5 4 3zM46 17l1-5 2 5z" fill="#d7b6c2"/><ellipse cx="46" cy="22" rx="6" ry="4.5" fill="#deddc3"/><path d="M34 40q5 4 2 8" stroke="#d7b6c2" stroke-width="3" fill="none" stroke-linecap="round"/>${e(47, 21, 1.4)}` },
      ankylosaurus: { name: 'Ankylosaurus', size: 13, weight: 6, spots: ['ground'], art:
        `<path d="M8 48 1 46" stroke="#cdbfae" stroke-width="4" stroke-linecap="round"/><circle cx="3" cy="45" r="4" fill="#b5a796"/><rect x="14" y="46" width="6" height="10" rx="3" fill="#b5a796"/><rect x="40" y="46" width="6" height="10" rx="3" fill="#b5a796"/><path d="M8 51q2-19 24-19t24 19z" fill="#cdbfae"/><g fill="#b5a796"><circle cx="18" cy="43" r="2.6"/><circle cx="28" cy="38" r="2.6"/><circle cx="38" cy="38" r="2.6"/><circle cx="46" cy="44" r="2.6"/><circle cx="24" cy="47" r="2.6"/><circle cx="36" cy="47" r="2.6"/></g><ellipse cx="56" cy="47" rx="5" ry="4" fill="#cdbfae"/>${e(57, 46, 1.2)}` },
      parasaurolophus: { name: 'Parasaurolophus', size: 13, weight: 6, spots: ['ground', 'lake'], art:
        `<path d="M12 40Q2 44 0 52" stroke="#d9c4b7" stroke-width="5" fill="none" stroke-linecap="round"/><rect x="18" y="46" width="6" height="12" rx="3" fill="#c7b0a2"/><rect x="28" y="46" width="6" height="12" rx="3" fill="#c7b0a2"/><ellipse cx="26" cy="40" rx="14" ry="10" fill="#d9c4b7"/><path d="M36 34q6-10 10-12" stroke="#d9c4b7" stroke-width="7" stroke-linecap="round"/><path d="M44 19q-8-8-15-6" stroke="#d7b6c2" stroke-width="3.6" fill="none" stroke-linecap="round"/><ellipse cx="48" cy="22" rx="7" ry="5" fill="#d9c4b7"/><ellipse cx="55" cy="24" rx="4" ry="2.4" fill="#ece0d6"/>${e(49, 21, 1.3)}` },
      egg: { name: 'Hatching egg', size: 6, weight: 8, spots: ['ground'], art:
        `<path d="M22 24q8-9 16 0z" fill="#f3f3ea" stroke="#deddc3" stroke-width="1.4"/><ellipse cx="30" cy="31" rx="7.5" ry="6" fill="#c8d29d"/>${e(27.5, 30, 1.4)}${e(32.5, 30, 1.4)}${b(26, 34)}${b(34, 34)}<path d="M17 38q0 20 13 20t13-20l-5 3-4-4-4 4-4-4-4 4z" fill="#f3f3ea" stroke="#deddc3" stroke-width="1.4"/><g fill="#d7b6c2" opacity=".6"><circle cx="24" cy="48" r="1.6"/><circle cx="34" cy="51" r="1.4"/></g>` },
      dragonfly: { name: 'Giant dragonfly', size: 9, weight: 8, spots: ['air'], art:
        `<g class="hb-wings" opacity=".85"><ellipse cx="19" cy="26" rx="12" ry="3.5" fill="#e6f0f2" stroke="#a3bfc7"/><ellipse cx="41" cy="26" rx="12" ry="3.5" fill="#e6f0f2" stroke="#a3bfc7"/><ellipse cx="20" cy="32" rx="10" ry="3" fill="#e6f0f2" stroke="#a3bfc7"/><ellipse cx="40" cy="32" rx="10" ry="3" fill="#e6f0f2" stroke="#a3bfc7"/></g><rect x="28.5" y="22" width="3" height="30" rx="1.5" fill="#7fa4ae"/><circle cx="30" cy="20" r="4" fill="#7fa4ae"/>${e(28.4, 19.4, 1.2)}${e(31.6, 19.4, 1.2)}` },
      muttaburrasaurus: { name: 'Muttaburrasaurus', size: 14, weight: 4, spots: ['ground'], art:
        `<path d="M12 40Q2 46 0 54" stroke="#dccaa5" stroke-width="6" fill="none" stroke-linecap="round"/><rect x="18" y="44" width="7" height="14" rx="3.5" fill="#c9b48a"/><rect x="29" y="44" width="7" height="14" rx="3.5" fill="#c9b48a"/><ellipse cx="26" cy="38" rx="14" ry="10" fill="#dccaa5"/><path d="M20 32q6-3 12 0M18 40q8-3 16 0" stroke="#b59e72" stroke-width="1.6" fill="none" opacity=".7"/><path d="M36 34q4-6 6-8" stroke="#dccaa5" stroke-width="8" stroke-linecap="round"/><ellipse cx="46" cy="24" rx="8" ry="6" fill="#dccaa5"/><circle cx="50" cy="19" r="3.4" fill="#e8dcc0"/><path d="M38 36q4 2 4 6" stroke="#c9b48a" stroke-width="2.6" fill="none" stroke-linecap="round"/>${e(47, 23, 1.4)}${b(48, 27)}` },
      trex: { name: 'Tyrannosaurus', size: 15, weight: 1.4, spots: ['ground'], art:
        `<path d="M12 34Q2 34 0 42" stroke="#c48f86" stroke-width="6" stroke-linecap="round" fill="none"/><path d="M22 44v12M30 44v12" stroke="#b07c74" stroke-width="5" stroke-linecap="round"/><path d="M19 57h6M27 57h6" stroke="#b07c74" stroke-width="2.4" stroke-linecap="round"/><ellipse cx="26" cy="36" rx="14" ry="10" fill="#c48f86"/><path d="M36 21h16q6 0 6 6v4q0 4-6 4H38q-4 0-4-4z" fill="#c48f86"/><path d="M42 35l1.4 2 1.4-2 1.4 2 1.4-2 1.4 2 1.4-2" stroke="#fff" stroke-width="1" fill="none"/><path d="M37 40l4 2" stroke="#c48f86" stroke-width="2.4" stroke-linecap="round"/>${e(44, 25, 1.6)}${b(46, 30)}` },
    },
  };

  window.HUSH = {
    goals: { silent: 32, whisper: 48, partner: 64 },
    scenes: { bush, reef, night, snow, dino },
  };
})();
