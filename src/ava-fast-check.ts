import test, {
  ExecutionContext,
  Implementation,
  ImplementationResult,
  TestInterface,
  TryResult
} from 'ava';
import * as fc from 'fast-check';

export { fc, test };

type NonEmptyArray<A> = A[] & {0: A};

// Pre-requisite: https://github.com/Microsoft/TypeScript/pull/26063
// Require TypeScript 3.1
type ArbitraryTuple<Ts extends NonEmptyArray<any>> = { [P in keyof Ts]: fc.Arbitrary<Ts[P]> };

type Prop<Ts extends NonEmptyArray<any>, Context = unknown> = (
  t: ExecutionContext<Context>,
  ...args: Ts
) => ImplementationResult;

type PropertyTest<Context> = <Ts extends NonEmptyArray<any>>(
  label: string,
  arbitraries: ArbitraryTuple<Ts>,
  prop: Prop<Ts, Context>,
  params?: fc.Parameters<Ts>
) => void;

type AvaModifierWhitelist =
  | 'only'
  | 'failing'
  | 'skip'
  | 'serial'

export type PropertyTestInterface<Context> = PropertyTest<Context> & {
  [Modifier in AvaModifierWhitelist]: PropertyTest<Context>;
}

function wrapProp<Ts extends NonEmptyArray<any>, Context>(
  arbitraries: ArbitraryTuple<Ts>,
  prop: Prop<Ts, Context>,
  params?: fc.Parameters<Ts>
): Implementation<Context> {
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

function internalTestProp<Ts extends NonEmptyArray<any>, Context>(
  testFn: (label: string, exec: Implementation<Context>) => void,
  label: string,
  arbitraries: ArbitraryTuple<Ts>,
  prop: Prop<Ts, Context>,
  params?: fc.Parameters<Ts>
): void {
  const customParams: fc.Parameters<Ts> = params || {};
  if (customParams.seed === undefined) customParams.seed = Date.now();

  testFn(`${label} (with seed=${customParams.seed})`, wrapProp(arbitraries, prop, params));
}

function exposeModifier<T extends Extract<keyof TestInterface, AvaModifierWhitelist>, Context>(
  modifier: T
): PropertyTest<Context> {
  return (label, arbitraries, prop, params) =>
    internalTestProp((test as TestInterface<Context>)[modifier], label, arbitraries, prop, params);
}

export const testProp: PropertyTestInterface<unknown> = Object.assign(
  function testProp<Ts extends NonEmptyArray<any>, Context>(
    label: string,
    arbitraries: ArbitraryTuple<Ts>,
    prop: Prop<Ts, Context>,
    params?: fc.Parameters<Ts>
  ): void {
    internalTestProp(test as TestInterface<Context>, label, arbitraries, prop, params);
  },
  {
    only: exposeModifier('only'),
    failing: exposeModifier('failing'),
    skip: exposeModifier('skip'),
    serial: exposeModifier('serial')
  }
)
