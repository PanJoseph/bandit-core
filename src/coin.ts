import {
  Coin,
  CoinType,
  Dependent,
  DependentCoin,
  DependentMultiVariantCoin,
  DependentVariant,
  MultiVariantCoin,
  NormalCoin,
  Sample,
  Variant,
  VariantType
} from './types/coin';

export function isMultivariant(coin: Coin): boolean {
  return coin.type === CoinType.MULTIVARIANT || coin.type === CoinType.DEPENDENTMULTIVARIANT;
}

export function isDependent(coin: Coin): boolean {
  return coin.type === CoinType.DEPENDENT || coin.type === CoinType.DEPENDENTMULTIVARIANT;
}

export function createSamplingPool(coin: Coin): Array<Sample<String>> {
  if (isMultivariant(coin)) {
    const castedCoin =
      coin.type === CoinType.MULTIVARIANT
        ? (coin as MultiVariantCoin)
        : (coin as DependentMultiVariantCoin);

    return castedCoin.variants.map(variant => ({
      count: variant.probability,
      value: variant.name
    }));
  }

  const castedCoin = coin.type === CoinType.NORMAL ? (coin as NormalCoin) : (coin as DependentCoin);
  return [{ count: castedCoin.probability, value: coin.name }];
}

export function getDependent(coin: DependentCoin, dependentName: String): Dependent | null {
  return coin.dependsOn.find(dependent => dependent.name === dependentName) || null;
}

export function getDependentInVariant(
  coin: DependentMultiVariantCoin,
  dependentName: String
): Dependent | null {
  for (let variant of coin.variants) {
    if (variant.type === VariantType.DEPENDENTVARIANT) {
      const res = (variant as DependentVariant).dependsOn.find(
        dependent => dependent.name === dependentName
      );

      if (res) return res;
    }
  }

  return null;
}

export function getVariant(
  coin: MultiVariantCoin | DependentMultiVariantCoin,
  variantName: String
): Variant | null {
  return coin.variants.find(variant => variant.name === variantName) || null;
}
