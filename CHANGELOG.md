# 2.0.0

- Better typings
- Support AVA's assertion methods - thanks to [@TomerAberbach](https://github.com/TomerAberbach)

Changes:

- Property receives [`ava`'s `t` argument](https://github.com/avajs/ava/blob/main/docs/02-execution-context.md#execution-context-t-argument) for its first parameter

```diff
--- testProp('should detect the substring', [fc.string(), fc.string(), fc.string()], (a, b, c) => {
+++ testProp('should detect the substring', [fc.string(), fc.string(), fc.string()], (t, a, b, c) => {
---   return (a + b + c).includes(b);
+++   t.true((a + b + c).includes(b));
    });
```

- Requirements: `ava >=3.9.0`

[[Code](https://github.com/dubzzz/ava-fast-check/tree/v1.1.1)][[Diff](https://github.com/dubzzz/ava-fast-check/compare/v1.1.3...v1.2.0)]

# 1.1.3 - _never published_

- Only publish `lib/`
- Publish typings

[[Code](https://github.com/dubzzz/ava-fast-check/tree/v1.1.3)][[Diff](https://github.com/dubzzz/ava-fast-check/compare/v1.1.2...v1.1.3)]

# 1.1.2

- Seed was wrongly reported on test execution

[[Code](https://github.com/dubzzz/ava-fast-check/tree/v1.1.2)][[Diff](https://github.com/dubzzz/ava-fast-check/compare/v1.1.1...v1.1.2)]

# 1.1.1

- Fix typo in the README - thanks to [@willheslam](https://github.com/willheslam)

[[Code](https://github.com/dubzzz/ava-fast-check/tree/v1.1.1)][[Diff](https://github.com/dubzzz/ava-fast-check/compare/v1.1.0...v1.1.1)]

# 1.1.0

- Add support for `test.serial` - thanks to [@CodeLenny](https://github.com/CodeLenny)

[[Code](https://github.com/dubzzz/ava-fast-check/tree/v1.1.0)][[Diff](https://github.com/dubzzz/ava-fast-check/compare/v1.0.1...v1.1.0)]

# 1.0.1

- Remove unneeded dependency to `ts-node`

[[Code](https://github.com/dubzzz/ava-fast-check/tree/v1.0.1)][[Diff](https://github.com/dubzzz/ava-fast-check/compare/v1.0.0...v1.0.1)]

# 1.0.0

First version of the library!

[[Code](https://github.com/dubzzz/ava-fast-check/tree/v1.0.0)]
