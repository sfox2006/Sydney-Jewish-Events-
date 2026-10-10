const test = require('node:test');
const assert = require('node:assert/strict');
const data = require('../data/events.json');

test('reviewed Sydney events are deduplicated and preserve unknown event facts', () => {
  assert.equal(new Set(data.events.map((event) => event.id)).size, data.events.length);
  assert.equal(data.timezone, 'Australia/Sydney');

  const commemoration = data.events.filter((event) => event.id === 'nswjbd-kristallnacht-2026-11-09');
  assert.equal(commemoration.length, 1);
  assert.equal(commemoration[0].cost, 'Unknown');
  assert.equal(commemoration[0].address, '');
  assert.equal(commemoration[0].maps_url, '');

  const service = data.events.find((event) => event.id === 'great-shabbat-shacharit-2026-10-17');
  assert(service);
  assert.equal(service.org, 'The Great Synagogue');
  assert(!service.end);
  assert.match(service.address, /Elizabeth Street/);
  assert.equal(service.tags.free_food, false);
  assert.equal(service.tags.free_drinks, false);
  assert.match(service.description, /End time is not stated/);

  const masterclass = data.events.find((event) => event.id === 'maccabi-u12-wed-2026-10-14');
  assert(masterclass);
  assert.match(masterclass.cost, /A\$10/);
  assert.equal(masterclass.tags.free_entry, false);
  assert.equal(masterclass.tags.free_drinks, false);

  const concert = data.events.find((event) => event.id === 'shir-unbreakable-2026-10-25');
  assert(concert);
  assert.equal(concert.format, 'in_person');
  assert.match(concert.address, /Bennelong Point/);
  assert.match(concert.cost, /A\$49/);

  const blob = JSON.stringify(data);
  assert.doesNotMatch(blob, /Washington|America\/New_York|GatherDC|Sixth & I/);
});
