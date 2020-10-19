# Property based testing for AVA based on [fast-check](https://github.com/dubzzz/fast-check/)

[![Build Status](https://travis-ci.com/dubzzz/ava-fast-check.svg?branch=master)](https://travis-ci.com/dubzzz/ava-fast-check)
[![npm version](https://badge.fury.io/js/ava-fast-check.svg)](https://badge.fury.io/js/ava-fast-check)

Bring the power of property based testing framework fast-check into AVA.
`ava-fast-check` simplifies the integration of fast-check into AVA testing framework.

## Getting Started

Install `ava-fast-check` and its peer dependencies:

```bash
npm install --save-dev ava fast-check ava-fast-check
```

## Example

```typescript
import { testProp, fc } from 'ava-fast-check';

// for all a, b, c strings
// b is a substring of a + b + c
testProp('should detect the substring', [fc.string(), fc.string(), fc.string()], (t, a, b, c) => {
  t.true((a + b + c).includes(b));
});
```

The property is passed [AVA's `t` argument](https://github.com/avajs/ava/blob/master/docs/02-execution-context.md#execution-context-t-argument) for its first parameter, and the value of each arbitrary for the current test case for the rest of the parameters.

`ava-fast-check` supports all of [AVA's assertions](https://github.com/avajs/ava/blob/master/docs/03-assertions.md#assertions) and like AVA, supports synchronous and asynchronous functions, including promises, observables, and callbacks. See [AVA's documentation](https://github.com/avajs/ava/blob/master/docs/01-writing-tests.md#declaring-test) for more information.

## Advanced

### `fast-check` Parameters

`testProp` accepts an optional `fc.Parameters` for forwarding custom parameters to `fast-check` ([more](https://github.com/dubzzz/fast-check/blob/master/documentation/Runners.md#runners)).

### AVA Modifiers

`ava-fast-check` also comes with [`.only`], [`.serial`] [`.skip`], and [`.failing`] modifiers from AVA.

```typescript
import { testProp, fc } from 'ava-fast-check';

testProp('should replay the test for the seed 4242', [fc.nat(), fc.nat()], (t, a, b) => {
  t.is(a + b, b + a);
}, { seed: 4242 });

testProp.skip('should be skipped', [fc.fullUnicodeString()], (t, text) => {
  t.is([...text].length, text.length);
});
```

[`.only`]: https://github.com/avajs/ava/blob/master/docs/01-writing-tests.md#running-specific-tests
[`.serial`]: https://github.com/avajs/ava/blob/master/docs/01-writing-tests.md#running-tests-serially
[`.skip`]: https://github.com/avajs/ava/blob/master/docs/01-writing-tests.md#skipping-tests
[`.failing`]: https://github.com/avajs/ava/blob/master/docs/01-writing-tests.md#failing-tests

### AVA `before`/`after` Hooks

`ava-fast-check` exposes AVA's `before`/`after` [hooks]:

```typescript
import { testProp, fc } from 'ava-fast-check';

testProp.before(t => {
  connectToDatabase();
});

testProp(
  // ... omitted for brevity
);

testProp.after(t => {
  closeDatabaseConnection();
});
```

[hooks]: https://github.com/avajs/ava/blob/master/docs/01-writing-tests.md#before--after-hooks

### AVA Execution Context

`ava-fast-check` mirror's AVA's procedure for customizing the test [execution context]:

```typescript
import { fc, testProp as anyTestProp, PropertyTestInterface } from '../src/ava-fast-check';

type TestContext = {
  state: string
};

const testProp = anyTestProp as PropertyTestInterface<TestContext>;

testProp(
  'should reach terminal state',
  [fc.string()],
  (t, received) => {
    // here t is typed as ExecutionContext<TestContext>
    console.log(t.context.state); // logs 'uninitialized'
    // ... omitted for brevity
  }
);
```

[execution context]: https://github.com/avajs/ava/blob/master/docs/02-execution-context.md

## Minimal requirements

| ava-fast-check | AVA                   | fast-check           |
|----------------|-----------------------|----------------------|
| ^3.0.0         | >=3.9.0<sup>(1)</sup> | ^2.0.0<sup>(2)</sup> |
| ^2.0.0         | >=3.9.0<sup>(1)</sup> | ^1.0.0               |
| ^1.0.0         | >=0.1.0<sup>(3)</sup> | ^2.0.0               |

- (1) `ava@>=3.9.0` for [`t.try`](https://github.com/avajs/ava/blob/master/docs/03-assertions.md#trytitle-implementation--macro--macro-args) support
- (2) `fast-check@^2.0.0` for hybrid module support: `commonjs` and `esm` together
- (3) `ava@>=0.1.0` for its Promise support
