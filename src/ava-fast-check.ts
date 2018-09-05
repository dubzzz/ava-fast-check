import test from 'ava';
import * as fc from 'fast-check';

// Pre-requisite: https://github.com/Microsoft/TypeScript/pull/26063
// Require TypeScript 3.1
type ArbitraryTuple<Ts> = { [P in keyof Ts]: fc.Arbitrary<Ts[P]> };

type Prop<Ts extends any[]> = (...args: Ts) => boolean | void | PromiseLike<boolean | void>;
type PromiseProp<Ts extends any[]> = (...args: Ts) => Promise<boolean | void>;

function wrapProp<Ts extends any[]>(prop: Prop<Ts>): PromiseProp<Ts> {
  return (...args: Ts) => Promise.resolve(prop(...args));
}

function testProp<Ts extends any[]>(label: string, arbitraries: ArbitraryTuple<Ts>, prop: Prop<Ts>): void {
  const promiseProp = wrapProp(prop);
  test(label, async t => {
    t.notThrows(fc.assert((fc.asyncProperty as any)(...arbitraries, promiseProp)));
  });
}

export default testProp;
