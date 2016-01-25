import test from 'ava';
import get from '../';

test.cb('should not return content when no input provided', (t) => {
  const getContent = get('content');

  getContent.on('readable', function read() {
    if (this.read() !== null) t.fail();
  });

  getContent.on('end', () => {
    t.pass();
    t.end();
  });

  getContent.end();
});


test.cb('should return undefined if path cannot be resolved and no defaultValue specified', (t) => {
  const input = {
    content: 'The quick brown fox jumps over the lazy dog.',
  };
  const getNoMatch = get('nope');

  getNoMatch.on('readable', function read() {
    let chunk = null;
    while ((chunk = this.read()) !== null) {
      t.same(chunk, undefined);
    }
  });

  getNoMatch.on('end', () => {
    t.end();
  });

  getNoMatch.write(input);
  getNoMatch.end();
});


test.cb('should return defaultValue if path cannot be resolved and a defaultValue specified', (t) => {
  const input = {
    content: 'The quick brown fox jumps over the lazy dog.',
  };
  const getDefaultMatch = get('nope', 'NOPE');

  getDefaultMatch.on('readable', function read() {
    let chunk = null;
    while ((chunk = this.read()) !== null) {
      t.same(chunk, 'NOPE');
    }
  });

  getDefaultMatch.on('end', () => {
    t.end();
  });

  getDefaultMatch.write(input);
  getDefaultMatch.end();
});


test.cb('should return the value at the specified path', (t) => {
  const input = {
    content: 'The quick brown fox jumps over the lazy dog.',
  };
  const getContent = get('content');

  getContent.on('readable', function read() {
    let chunk = null;
    while ((chunk = this.read()) !== null) {
      t.same(chunk, input.content);
    }
  });

  getContent.on('end', () => {
    t.end();
  });

  getContent.write(input);
  getContent.end();
});


test.cb('should not return zero-byte string by default', (t) => {
  const input = [
    { content: 'The' },
    { notContent: 'BOOM!' },
    { content: 'quick' },
    { content: 'brown' },
    { content: 'fox' },
    { content: 'jumps' },
    { content: 'over' },
    { notContent: 'BOOM!' },
    { content: 'the' },
    { content: 'lazy' },
    { content: 'dog.' },
  ];
  const exptected = [
    'The',
    'quick',
    'brown',
    'fox',
    'jumps',
    'over',
    'the',
    'lazy',
    'dog.',
  ];
  const getContent = get('content', '');
  let index = 0;

  getContent.on('readable', function read() {
    let chunk = null;
    while ((chunk = this.read()) !== null) {
      t.same(chunk, exptected[index]);
      index += 1;
    }
  });

  getContent.on('end', () => {
    t.end();
  });

  input.forEach((chunk) => {
    getContent.write(chunk);
  });
  getContent.end();
});


test.cb('should return zero-byte string if excludeZBS is true', (t) => {
  const input = [
    { content: 'The' },
    { notContent: 'BOOM!' },
    { content: 'quick' },
    { content: 'brown' },
    { content: 'fox' },
    { content: 'jumps' },
    { content: 'over' },
    { notContent: 'BOOM!' },
    { content: 'the' },
    { content: 'lazy' },
    { content: 'dog.' },
  ];
  const exptected = [
    'The',
    '',
    'quick',
    'brown',
    'fox',
    'jumps',
    'over',
    '',
    'the',
    'lazy',
    'dog.',
  ];
  const getContent = get({ excludeZBS: false }, 'content', '');
  let index = 0;

  getContent.on('readable', function read() {
    let chunk = null;
    while ((chunk = this.read()) !== null) {
      t.same(chunk, exptected[index]);
      index += 1;
    }
  });

  getContent.on('end', () => {
    t.end();
  });

  input.forEach((chunk) => {
    getContent.write(chunk);
  });
  getContent.end();
});
