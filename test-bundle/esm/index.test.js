import { testProp, fc } from 'ava-fast-check';

console.log({
  testProp,
  fc,
  string: fc.string
});

console.log({
  typeof_string: typeof fc.string,
  ctor_string: fc.string__proto__.constructor.name
});

// for all a, b, c strings
// b is a substring of a + b + c
testProp('should detect the substring', [fc.string(), fc.string(), fc.string()], (t, a, b, c) => {
  t.true((a + b + c).includes(b));
});
