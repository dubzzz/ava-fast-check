# Property based testing for AVA based on [fast-check](https://github.com/dubzzz/fast-check/)

[![Build Status](https://travis-ci.org/dubzzz/ava-fast-check.svg?branch=master)](https://travis-ci.org/dubzzz/ava-fast-check)
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
// b is a sustring of a + b + c
testProp('should detect the substring', [fc.string(), fc.string(), fc.string()], (a, b, c) => {
  return (a + b + c).includes(b);
});
```

Please note that the properties accepted by `ava-fast-check` as input can either be synchronous or asynchronous (even just `PromiseLike` instances).

## Advanced

If you want to forward custom parameters to fast-check, `testProp` accepts an optional `fc.Parameters` ([more](https://github.com/dubzzz/fast-check/blob/master/documentation/Runners.md#runners)).

`ava-fast-check` also comes with `.only`, `.skip` and `.failing` from ava.

```javascript
import { testProp, fc } from 'ava-fast-check';

testProp('should replay the test for the seed 4242', [fc.nat(), fc.nat()], (a, b) => {
  return a + b === b + a;
}, { seed: 4242 });

testProp.failing('should be skipped', [fc.fullUnicodeString()], text => {
  return text.length === [...text].length;
});
```

## Minimal requirements

- `ava >=0.1.0` for its Promise support
- `fast-check ^1.0.0`
