import test, { GenericTest, Context } from 'ava';
import * as fc from 'fast-check';

// Pre-requisite: https://github.com/Microsoft/TypeScript/pull/26063
// Require TypeScript 3.1
type ArbitraryTuple<Ts> = { [P in keyof Ts]: fc.Arbitrary<Ts[P]> };

type Prop<Ts extends any[]> = (...args: Ts) => boolean | void | PromiseLike<boolean | void>;
type PromiseProp<Ts extends any[]> = (...args: Ts) => Promise<boolean | void>;

function wrapProp<Ts extends any[]>(prop: Prop<Ts>): PromiseProp<Ts> {
  return (...args: Ts) => Promise.resolve(prop(...args));
}

function internalTestProp<Ts extends any[]>(
  testFn: (label: string, exec: GenericTest<Context<any>>) => void,
  label: string,
  arbitraries: ArbitraryTuple<Ts>,
  prop: Prop<Ts>,
  params?: fc.Parameters<Ts>
): void {
  const customParams: fc.Parameters<Ts> = params || {};
  if (customParams.seed === undefined) customParams.seed = Date.now();

  const promiseProp = wrapProp(prop);
  testFn(`${label} (with seed=${customParams.seed})`, async t => {
    await fc.assert((fc.asyncProperty as any)(...arbitraries, promiseProp), params);
    t.pass();
  });
}

export function testProp<Ts extends any[]>(
  label: string,
  arbitraries: ArbitraryTuple<Ts>,
  prop: Prop<Ts>,
  params?: fc.Parameters<Ts>
): void {
  internalTestProp(test, label, arbitraries, prop, params);
}

export namespace testProp {
  export const only = <Ts extends any[]>(
    label: string,
    arbitraries: ArbitraryTuple<Ts>,
    prop: Prop<Ts>,
    params?: fc.Parameters<Ts>
  ): void => internalTestProp(test.only, label, arbitraries, prop, params);
  export const failing = <Ts extends any[]>(
    label: string,
    arbitraries: ArbitraryTuple<Ts>,
    prop: Prop<Ts>,
    params?: fc.Parameters<Ts>
  ): void => internalTestProp(test.failing, label, arbitraries, prop, params);
  export const skip = <Ts extends any[]>(
    label: string,
    arbitraries: ArbitraryTuple<Ts>,
    prop: Prop<Ts>,
    params?: fc.Parameters<Ts>
  ): void => internalTestProp(test.skip, label, arbitraries, prop, params);
  export const serial = <Ts extends any[]>(
    label: string,
    arbitraries: ArbitraryTuple<Ts>,
    prop: Prop<Ts>,
    params?: fc.Parameters<Ts>
  ): void => internalTestProp(test.serial, label, arbitraries, prop, params);
}

export { test, fc };
