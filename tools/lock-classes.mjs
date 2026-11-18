// Locks the class lists so they can live on the public website without anyone reading them.
//   node tools/lock-classes.mjs <classes.json> <passcode>
// classes.json looks like {"classes":[{"name":"1E","students":["Ava","Ben"]}]}.
// Writes classes.locked.js (AES-GCM, key from the passcode via PBKDF2-SHA256).
// Never commit the plain classes.json: it holds children's names.
import { readFileSync, writeFileSync } from 'node:fs';
import { webcrypto as crypto } from 'node:crypto';

const [file, pass] = process.argv.slice(2);
if (!file || !pass) { console.error('usage: node tools/lock-classes.mjs <classes.json> <passcode>'); process.exit(1); }
const plain = readFileSync(file, 'utf8');
JSON.parse(plain); // make sure it's valid before locking

const iter = 600000;
const salt = crypto.getRandomValues(new Uint8Array(16));
const iv = crypto.getRandomValues(new Uint8Array(12));
const base = await crypto.subtle.importKey('raw', new TextEncoder().encode(pass.normalize('NFC').trim().toLowerCase()), 'PBKDF2', false, ['deriveKey']);
const key = await crypto.subtle.deriveKey({ name: 'PBKDF2', salt, iterations: iter, hash: 'SHA-256' }, base,
  { name: 'AES-GCM', length: 256 }, false, ['encrypt']);
const data = new Uint8Array(await crypto.subtle.encrypt({ name: 'AES-GCM', iv }, key, new TextEncoder().encode(plain)));
const b64 = u => Buffer.from(u).toString('base64');
const box = { v: 1, iter, salt: b64(salt), iv: b64(iv), data: b64(data), locked: new Date().toISOString().slice(0, 10) };
writeFileSync(new URL('../classes.locked.js', import.meta.url),
  `/* Class lists, locked with a passcode. Unreadable without it. Made by tools/lock-classes.mjs */\nwindow.LOCKED_CLASSES = ${JSON.stringify(box)};\n`);
console.log('wrote classes.locked.js');
