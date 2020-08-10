# Property based testing for AVA based on [fast-check](https://github.com/dubzzz/fast-check/)

[![Build Status](https://travis-ci.com/dubzzz/ava-fast-check.svg?branch=master)](https://travis-ci.com/dubzzz/ava-fast-check)
[![npm version](https://badge.fury.io/js/ava-fast-check.svg)](https://badge.fury.io/js/ava-fast-check)

Bring the power of property based testing framework fast-check into ava.
`ava-fast-check` simplifies the integration of fast-check into ava testing framework.

## Getting started

Install `ava-fast-check` and its peer dependencies:

```bash
npm install --save-dev ava fast-check ava-fast-check
```

## Example

```javascript
import { testProp, fc } from 'ava-fast-check';

// for all a, b, c strings
// b is a substring of a + b + c
testProp('should detect the substring', [fc.string(), fc.string(), fc.string()], (t, a, b, c) => {
  t.true((a + b + c).includes(b));
});
```

The property is passed [`ava`'s `t` argument](https://github.com/avajs/ava/blob/master/docs/02-execution-context.md#execution-context-t-argument) for its first parameter, and the value of each arbitrary for the current test case for the rest of the parameters.

`ava-fast-check` supports all of [`ava`'s assertions](https://github.com/avajs/ava/blob/master/docs/03-assertions.md#assertions) and like `ava`, supports synchronous and asynchronous functions, including promises, observables, and callbacks. See [`ava`'s documentation](https://github.com/avajs/ava/blob/master/docs/01-writing-tests.md#declaring-test) for more information.

## Advanced

If you want to forward custom parameters to fast-check, `testProp` accepts an optional `fc.Parameters` ([more](https://github.com/dubzzz/fast-check/blob/master/documentation/Runners.md#runners)).

`ava-fast-check` also comes with `.only`, `.skip` and `.failing` from `ava`.

```javascript
import { testProp, fc } from 'ava-fast-check';

testProp('should replay the test for the seed 4242', [fc.nat(), fc.nat()], (t, a, b) => {
  t.is(a + b, b + a);
}, { seed: 4242 });

testProp.failing('should be skipped', [fc.fullUnicodeString()], (t, text) => {
  t.is([...text].length, text.length);
});
```

## Minimal requirements

| ava-fast-check | ava                   | fast-check           |
|----------------|-----------------------|----------------------|
| ^3.0.0         | >=3.9.0<sup>(1)</sup> | ^2.0.0<sup>(2)</sup> |
| ^2.0.0         | >=3.9.0<sup>(1)</sup> | ^1.0.0               |
| ^1.0.0         | >=0.1.0<sup>(3)</sup> | ^2.0.0               |

- (1) `ava@>=3.9.0` for [`t.try`](https://github.com/avajs/ava/blob/master/docs/03-assertions.md#trytitle-implementation--macro--macro-args) support
- (2) `fast-check@^2.0.0` for hybrid module support: `commonjs` and `esm` together
- (3) `ava@>=0.1.0` for its Promise support
