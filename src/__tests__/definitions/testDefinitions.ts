import {
  Coin,
  CoinType,
  Dependent,
  DependentCoin,
  DependentMultiVariantCoin,
  DependentVariant,
  MultiVariantCoin,
  NormalCoin,
  Variant,
  VariantType
} from '../../types/coin';

export const testDependent: Dependent = {
  behavior: {
    dependentBehaviorToExpressOn: true,
    behaviorToExpress: false
  },
  name: 'dependent',
  priority: 1
};

export const testVariantA: Variant = {
  name: 'variantA',
  probability: 10,
  type: VariantType['VARIANT']
};

export const testVariantB: Variant = {
  name: 'variantB',
  probability: 50,
  type: VariantType['VARIANT']
};

export const testDependentVariant: DependentVariant = {
  dependsOn: [testDependent],
  name: 'dependentVariant',
  probability: 50,
  type: VariantType['DEPENDENTVARIANT']
};

export const testNormalCoin: NormalCoin = {
  metadata: new Map(),
  name: 'normal',
  probability: 10,
  type: CoinType['NORMAL']
};

export const testDependentCoin: DependentCoin = {
  dependsOn: [testDependent],
  metadata: new Map(),
  name: 'dependent',
  probability: 10,
  type: CoinType['DEPENDENT']
};

export const testMultivariantCoin: MultiVariantCoin = {
  metadata: new Map(),
  name: 'multivariant',
  type: CoinType['MULTIVARIANT'],
  variants: [testVariantA, testVariantB]
};

export const testDependentMultivariantCoin: DependentMultiVariantCoin = {
  metadata: new Map(),
  name: 'dependentmultivariant',
  type: CoinType['DEPENDENTMULTIVARIANT'],
  variants: [testVariantA, testDependentVariant]
};

export const circularDefinition: Array<
  NormalCoin | DependentCoin | MultiVariantCoin | DependentMultiVariantCoin
> = [
  {
    dependsOn: [
      {
        behavior: {
          dependentBehaviorToExpressOn: true,
          behaviorToExpress: true
        },
        name: 'dependent2',
        priority: 1
      }
    ],
    metadata: new Map(),
    name: 'dependent1',
    probability: 100,
    type: CoinType['DEPENDENT']
  },
  {
    dependsOn: [
      {
        behavior: {
          dependentBehaviorToExpressOn: true,
          behaviorToExpress: true
        },
        name: 'dependent1',
        priority: 1
      }
    ],
    metadata: new Map(),
    name: 'dependent2',
    probability: 100,
    type: CoinType['DEPENDENT']
  }
];

export const fullFixedDefinition: Array<
  NormalCoin | DependentCoin | MultiVariantCoin | DependentMultiVariantCoin
> = [
  {
    metadata: new Map(),
    name: 'normal1',
    probability: 100,
    type: CoinType['NORMAL']
  },
  {
    metadata: new Map(),
    name: 'normal2',
    probability: 0,
    type: CoinType['NORMAL']
  },
  {
    metadata: new Map(),
    name: 'multi',
    type: CoinType['MULTIVARIANT'],
    variants: [
      { name: 'variant1', probability: 100, type: VariantType['VARIANT'] },
      { name: 'variant2', probability: 0, type: VariantType['VARIANT'] },
      { name: 'variant3', probability: 0, type: VariantType['VARIANT'] }
    ]
  },
  {
    dependsOn: [
      {
        behavior: {
          dependentBehaviorToExpressOn: true,
          behaviorToExpress: false
        },
        name: 'dependent2',
        priority: 1
      }
    ],
    metadata: new Map(),
    name: 'dependent1',
    probability: 100,
    type: CoinType['DEPENDENT']
  },
  {
    dependsOn: [
      {
        behavior: {
          dependentBehaviorToExpressOn: false,
          behaviorToExpress: true
        },
        name: 'normal2',
        priority: 1
      }
    ],
    metadata: new Map(),
    name: 'dependent2',
    probability: 100,
    type: CoinType['DEPENDENT']
  },
  {
    metadata: new Map(),
    name: 'dependentMultivariant1',
    type: CoinType['DEPENDENTMULTIVARIANT'],
    variants: [
      {
        dependsOn: [
          {
            behavior: {
              dependentBehaviorToExpressOn: true,
              behaviorToExpress: true
            },
            name: 'dependent2',
            priority: 1
          }
        ],
        name: 'v4',
        probability: 0,
        type: VariantType['DEPENDENTVARIANT']
      },
      { name: 'v5', probability: 100, type: VariantType['VARIANT'] },
      { name: 'v6', probability: 0, type: VariantType['VARIANT'] }
    ]
  }
];

export const varyingDefinition: Array<
  NormalCoin | DependentCoin | MultiVariantCoin | DependentMultiVariantCoin
> = [
  {
    metadata: new Map(),
    name: 'normal1',
    probability: 75,
    type: CoinType['NORMAL']
  },
  {
    metadata: new Map(),
    name: 'multi',
    type: CoinType['MULTIVARIANT'],
    variants: [
      { name: 'variant1', probability: 10, type: VariantType['VARIANT'] },
      { name: 'variant2', probability: 30, type: VariantType['VARIANT'] },
      { name: 'variant3', probability: 40, type: VariantType['VARIANT'] }
    ]
  },
  {
    dependsOn: [
      {
        behavior: {
          dependentBehaviorToExpressOn: true,
          behaviorToExpress: true
        },
        name: 'variant1',
        priority: 1
      },
      {
        behavior: {
          dependentBehaviorToExpressOn: false,
          behaviorToExpress: false
        },
        name: 'variant2',
        priority: 2
      }
    ],
    metadata: new Map(),
    name: 'depends',
    probability: 90,
    type: CoinType['DEPENDENT']
  }
];
