import test, { ExecutionContext, Implementation, ImplementationResult, TryResult } from 'ava';
import * as fc from 'fast-check';

// Pre-requisite: https://github.com/Microsoft/TypeScript/pull/26063
// Require TypeScript 3.1
type ArbitraryTuple<Ts extends [any] | any[]> = { [P in keyof Ts]: fc.Arbitrary<Ts[P]> };

type Prop<Ts extends [any] | any[]> = (t: ExecutionContext, ...args: Ts) => ImplementationResult;

function wrapProp<Ts extends [any] | any[]>(
  arbitraries: ArbitraryTuple<Ts>,
  prop: Prop<Ts>,
  params?: fc.Parameters<Ts>
): Implementation {
  return async t => {
    let failingTry: undefined | TryResult;

    try {
      await fc.assert(
        (fc.asyncProperty as any)(...(arbitraries as any), async (...args: Ts) => {
          const tryResult = await t.try(tt => prop(tt, ...args));

          if (tryResult.passed) {
            tryResult.commit();
            return true;
          }

          failingTry = tryResult;
          return false;
        }),
        params
      );
    } catch (error) {
      t.log(error.message);
      (failingTry?.commit ?? t.fail)();
    }

    t.pass();
  };
}

function internalTestProp<Ts extends [any] | any[]>(
  testFn: (label: string, exec: Implementation) => void,
  label: string,
  arbitraries: ArbitraryTuple<Ts>,
  prop: Prop<Ts>,
  params?: fc.Parameters<Ts>
): void {
  const customParams: fc.Parameters<Ts> = params || {};
  if (customParams.seed === undefined) customParams.seed = Date.now();

  testFn(`${label} (with seed=${customParams.seed})`, wrapProp(arbitraries, prop, params));
}

export function testProp<Ts extends [any] | any[]>(
  label: string,
  arbitraries: ArbitraryTuple<Ts>,
  prop: Prop<Ts>,
  params?: fc.Parameters<Ts>
): void {
  internalTestProp(test, label, arbitraries, prop, params);
}

export namespace testProp {
  export const only = <Ts extends [any] | any[]>(
    label: string,
    arbitraries: ArbitraryTuple<Ts>,
    prop: Prop<Ts>,
    params?: fc.Parameters<Ts>
  ): void => internalTestProp(test.only, label, arbitraries, prop, params);
  export const failing = <Ts extends [any] | any[]>(
    label: string,
    arbitraries: ArbitraryTuple<Ts>,
    prop: Prop<Ts>,
    params?: fc.Parameters<Ts>
  ): void => internalTestProp(test.failing, label, arbitraries, prop, params);
  export const skip = <Ts extends [any] | any[]>(
    label: string,
    arbitraries: ArbitraryTuple<Ts>,
    prop: Prop<Ts>,
    params?: fc.Parameters<Ts>
  ): void => internalTestProp(test.skip, label, arbitraries, prop, params);
  export const serial = <Ts extends [any] | any[]>(
    label: string,
    arbitraries: ArbitraryTuple<Ts>,
    prop: Prop<Ts>,
    params?: fc.Parameters<Ts>
  ): void => internalTestProp(test.serial, label, arbitraries, prop, params);
}

export { test, fc };
