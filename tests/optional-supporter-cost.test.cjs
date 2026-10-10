const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const code = fs.readFileSync(path.join(__dirname, '../app.js'), 'utf8');

test('AUD prices and unknown costs are not treated as free, including optional-supporter wording', () => {
  const ctx = vm.createContext({ fieldText: (value) => String(value || '').trim() });
  vm.runInContext(code.slice(code.indexOf('  function costKind('), code.indexOf('  function costShort(')), ctx);
  const events = require('../data/events.json').events;
  const paid = events.find((event) => event.id === 'maccabi-u12-wed-2026-10-14');
  const unknown = events.find((event) => event.id === 'nswjbd-kristallnacht-2026-11-09');
  assert(paid);
  assert(unknown);
  assert.equal(ctx.matchesCost(paid, 'paid'), true);
  assert.equal(ctx.matchesCost(paid, 'free'), false);
  assert.equal(ctx.matchesCost(unknown, 'unknown'), true);
  assert.equal(ctx.matchesCost(unknown, 'free'), false);
  assert.equal(ctx.costKind('Unknown'), 'unknown');
  assert.equal(ctx.costKind('Free'), 'free');
  assert.equal(ctx.costKind('Free; optional Chai supporter tickets A$5'), 'free');
  assert.equal(ctx.costKind('A$10 per session'), 'paid');
  assert.equal(ctx.costKind('A$49–A$199 plus A$8.95 booking fee'), 'paid');
  assert.equal(ctx.costKind('Service free; dinner A$18'), 'paid');
});
