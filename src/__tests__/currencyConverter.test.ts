import { Coin, DependentCoin, MultiVariantCoin, NormalCoin } from '../types/coin';
import applyCurrencyConverters from '../currencyConverter';
import {
  testNormalCoin,
  testDependentCoin,
  testMultivariantCoin,
  testDependentMultivariantCoin
} from './definitions/testDefinitions';

const applyA = (coin: Coin) => {
  coin.metadata?.set('first', 'first');

  return coin;
};

const applyB = (coin: Coin) => {
  coin.metadata?.set('second', 'second');

  return coin;
};

const applyC = (coin: Coin) => {
  if (coin.metadata?.get('value')) {
    coin.metadata?.set('value', coin.metadata?.get('value') * 3);
  }

  return coin;
};

const applyD = (coin: Coin) => {
  coin.metadata?.set('first', 'appliedLast');

  return coin;
};

let coins: Array<Coin>;

describe('applyCurrencyConverter tests', () => {
  beforeEach(() => {
    coins = [
      testNormalCoin,
      testDependentCoin,
      testMultivariantCoin,
      testDependentMultivariantCoin
    ];
  });

  it('returns the coins if no converters are passed', () => {
    expect(applyCurrencyConverters(coins)).toEqual(coins);
  });

  it('returns the coins if an empty array of converters are passed', () => {
    expect(applyCurrencyConverters(coins, ...[])).toEqual(coins);
  });

  it('applies one function passed to a set of coins and returns the result', () => {
    const convertedCoins = applyCurrencyConverters(coins, applyA);

    for (let coin of convertedCoins) {
      expect(coin.metadata?.get('first')).toEqual('first');
    }
  });

  it('applies multiple functions ', () => {
    coins[0].metadata?.set('value', 10);
    coins[1].metadata?.set('value', 20);
    const convertedCoins = applyCurrencyConverters(coins, applyA, applyB, applyC);

    for (let coin of convertedCoins) {
      expect(coin.metadata?.get('first')).toEqual('first');
      expect(coin.metadata?.get('second')).toEqual('second');

      if (coin.name === 'normal') {
        expect(coin.metadata?.get('value')).toEqual(30);
      }

      if (coin.name === 'dependent') {
        expect(coin.metadata?.get('value')).toEqual(60);
      }
    }
  });

  it('applies functions in backwards order of converters passed', () => {
    coins[0].metadata?.set('value', 10);
    coins[1].metadata?.set('value', 20);
    const convertedCoins = applyCurrencyConverters(coins, applyD, applyB, applyC, applyA);

    for (let coin of convertedCoins) {
      expect(coin.metadata?.get('first')).toEqual('appliedLast');
      expect(coin.metadata?.get('second')).toEqual('second');

      if (coin.name === 'normal') {
        expect(coin.metadata?.get('value')).toEqual(30);
      }

      if (coin.name === 'dependent') {
        expect(coin.metadata?.get('value')).toEqual(60);
      }
    }
  });
});
