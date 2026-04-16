import { Coin } from './types/coin';
import { CurrencyConverter } from './types/currencyconverter';

/**
 * Taken from Redux https://github.com/reduxjs/redux/blob/master/src/compose.ts
 * Composes single-argument functions from right to left. The rightmost
 * function can take multiple arguments as it provides the signature for
 * the resulting composite function.
 *
 * @param {Array<Function>} funcs The functions to compose.
 * @returns {Function} A function obtained by composing the argument functions
 * from right to left. For example, compose(f, g, h) is identical to doing
 * (...args) => f(g(h(...args))).
 */

export function compose(...funcs: Array<Function>) {
  if (funcs.length === 0) {
    // infer the argument type so it is usable in inference down the line
    return <T>(arg: T) => arg;
  }

  if (funcs.length === 1) {
    return funcs[0];
  }

  return funcs.reduce((a, b) => (...args: any) => a(b(...args)));
}

/**
 * Applies a set of currency converters to an array of coins
 * @param {Array} coins Array of coins that should be transformed by the currency converters
 * @param {Array<CurrencyConverter>} converters array of functions to apply to each coin
 * @returns An array of coins with the currency converters applied to each coin
 */

export default function applyCurrencyConverters(
  coins: Array<Coin>,
  ...converters: Array<CurrencyConverter>
): Array<Coin> {
  const composedConverters = compose(...converters);

  return coins.map(coin => composedConverters(coin));
}
