import { createSamplingPool, getDependent, getVariant, isDependent, isMultivariant } from './coin';
import newDependencyGraph from './dependencygraph';
import { createSample, pickSample, shuffle } from './stat';
import {
  Coin,
  CoinType,
  DependentCoin,
  DependentMultiVariantCoin,
  DependentVariant,
  MultiVariantCoin,
  VariantType
} from './types/coin';
import { DependencyGraph } from './types/dependencygraph';

export function generateDependencyGraph(coins: Array<Coin>): DependencyGraph<String> {
  const graph = newDependencyGraph();

  for (let coin of coins) {
    if (coin.type === CoinType.DEPENDENT) {
      graph.addNode(coin.name);
      (coin as DependentCoin).dependsOn.forEach(dependent => {
        graph.addNode(dependent.name);
        graph.addEdge(coin.name, dependent.name);
      });
    }

    if (coin.type == CoinType.DEPENDENTMULTIVARIANT) {
      (coin as DependentMultiVariantCoin).variants.forEach(variant => {
        if (variant.type == VariantType.DEPENDENTVARIANT) {
          graph.addNode(variant.name);
          (variant as DependentVariant).dependsOn.forEach(dependent => {
            graph.addNode(dependent.name);
            graph.addEdge(variant.name, dependent.name);
          });
        }
      });
    }
  }

  return graph;
}

export function getCoin(coins: Array<Coin>, coinName: String): Coin | null {
  for (let coin of coins) {
    if (coin.name === coinName) {
      return coin;
    }

    if (isMultivariant(coin)) {
      const castedCoin =
        coin.type === CoinType.MULTIVARIANT
          ? (coin as MultiVariantCoin)
          : (coin as DependentMultiVariantCoin);
      if (getVariant(castedCoin, coinName)) {
        return coin;
      }
    }
  }

  return null;
}

export function flipCoins(coins: Array<Coin>): Array<Coin> {
  return coins.map(coin => {
    const sample = pickSample(shuffle(createSample(createSamplingPool(coin), 100)));
    let finalCoin: Coin = { ...coin };

    if (isMultivariant(coin)) {
      const castedCoin =
        coin.type === CoinType.MULTIVARIANT
          ? (coin as MultiVariantCoin)
          : (coin as DependentMultiVariantCoin);

      const variant = getVariant(castedCoin, sample);
      if (variant) {
        castedCoin.active = true;
        castedCoin.activeVariant = variant.name;
        finalCoin = { ...castedCoin };
      }
    } else if (sample === coin.name) {
      finalCoin.active = true;
    } else {
      finalCoin.active = false;
    }

    return finalCoin;
  });
}

export function sortToPickingOrder(coins: Array<Coin>): Array<Coin> {
  return [...coins].sort((a, b) => {
    if (!isDependent(a) && isDependent(b)) {
      return -1;
    }

    if (isDependent(a) && !isDependent(b)) {
      return 1;
    }

    if (isDependent(a) && isDependent(b)) {
      if (getDependent(a as DependentCoin, b.name)) return 1;
      if (getDependent(b as DependentCoin, a.name)) return -1;
    }

    return 0;
  });
}
