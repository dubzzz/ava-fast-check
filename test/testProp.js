import { testProp, fc } from '../lib/ava-fast-check';

const delay = duration =>
  new Promise(resolve => {
    setTimeout(() => resolve(), duration);
  });

// testProp

testProp('should pass on truthy synchronous property', [fc.string(), fc.string(), fc.string()], (a, b, c) => {
  return `${a}${b}${c}`.includes(b);
});
testProp('should pass on truthy asynchronous property', [fc.nat(), fc.string()], async (a, b) => {
  await delay(0);
  return typeof a === 'number' && typeof b === 'string';
});
testProp('should fail on falsy synchronous property', [fc.boolean()], a => a);
testProp('should fail on falsy asynchronous property', [fc.nat()], async a => {
  await delay(0);
  return typeof a === 'string';
});

// testProp.failing

testProp.failing('should pass as the property fails', [fc.boolean()], a => a);
testProp.failing('should fail as the property passes', [fc.boolean()], a => a || !a);

// testProp.skip

testProp.skip('should never be executed', [fc.boolean()], a => a);
