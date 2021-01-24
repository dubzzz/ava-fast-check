import test, {
  AfterInterface,
  BeforeInterface,
  ExecutionContext,
  Implementation,
  ImplementationResult,
  TestInterface,
  TryResult,
} from 'ava';
import * as fc from 'fast-check';

export { fc, test };

type NonEmptyArray<A> = A[] & { 0: A };

type ArbitraryTuple<Ts extends NonEmptyArray<any>> = {
  [P in keyof Ts]: fc.Arbitrary<Ts[P]>;
};

type Prop<Context, Ts extends NonEmptyArray<any>> = (t: ExecutionContext<Context>, ...args: Ts) => ImplementationResult;

type PropertyTest<Context> = <Ts extends NonEmptyArray<any>>(
  label: string,
  arbitraries: ArbitraryTuple<Ts>,
  prop: Prop<Context, Ts>,
  params?: fc.Parameters<Ts>
) => void;

type AvaModifierWhitelist = 'only' | 'failing' | 'skip' | 'serial';

export type PropertyTestInterface<Context> = PropertyTest<Context> &
  { [Modifier in AvaModifierWhitelist]: PropertyTest<Context> } & {
    before: BeforeInterface<Context>;
    after: AfterInterface<Context>;
  };

function wrapProp<Context, Ts extends NonEmptyArray<any>>(
  arbitraries: ArbitraryTuple<Ts>,
  prop: Prop<Context, Ts>,
  params?: fc.Parameters<Ts>
): Implementation<Context> {
  return async (t) => {
    let failingTry: undefined | TryResult;

    try {
      await fc.assert(
        (fc.asyncProperty as any)(...(arbitraries as any), async (...args: Ts) => {
          const tryResult = await t.try((tt) => prop(tt, ...args));

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

function internalTestProp<Context, Ts extends NonEmptyArray<any>>(
  testFn: (label: string, exec: Implementation<Context>) => void,
  label: string,
  arbitraries: ArbitraryTuple<Ts>,
  prop: Prop<Context, Ts>,
  params?: fc.Parameters<Ts>
): void {
  const customParams: fc.Parameters<Ts> = params || {};
  if (customParams.seed === undefined) customParams.seed = Date.now();

  testFn(`${label} (with seed=${customParams.seed})`, wrapProp(arbitraries, prop, params));
}

function exposeModifier<Context, T extends Extract<keyof TestInterface, AvaModifierWhitelist>>(
  modifier: T
): PropertyTest<Context> {
  return (label, arbitraries, prop, params) =>
    internalTestProp((test as TestInterface<Context>)[modifier], label, arbitraries, prop, params);
}

export const testProp: PropertyTestInterface<unknown> = Object.assign(
  function testProp<Context, Ts extends NonEmptyArray<any>>(
    label: string,
    arbitraries: ArbitraryTuple<Ts>,
    prop: Prop<Context, Ts>,
    params?: fc.Parameters<Ts>
  ): void {
    internalTestProp(test as TestInterface<Context>, label, arbitraries, prop, params);
  },
  {
    only: exposeModifier('only'),
    failing: exposeModifier('failing'),
    skip: exposeModifier('skip'),
    serial: exposeModifier('serial'),
    before: test.before,
    after: test.after,
  }
);
