import {
  fullFixedDefinition,
  testDependentCoin,
  testDependentMultivariantCoin,
  testMultivariantCoin,
  testNormalCoin
} from './definitions/testDefinitions';
import { flipCoins, generateDependencyGraph, getCoin } from '../chest';
import { CoinType, VariantType } from '../types/coin';

describe('Chest Tests', () => {
  describe('generateDependencyGraph tests', () => {
    it('should generate a dependency graph properly', () => {
      expect(generateDependencyGraph(fullFixedDefinition).nodes).toEqual(
        new Map(
          Object.entries({
            dependent1: new Set(['dependent2']),
            dependent2: new Set(['normal2']),
            normal2: new Set(),
            v4: new Set(['dependent2'])
          })
        )
      );
    });
  });

  describe('getCoin tests', () => {
    it('should return a coin when found by name', () => {
      const coins = [testNormalCoin, testDependentCoin];
      expect(getCoin(coins, 'normal')).toEqual(testNormalCoin);
      expect(getCoin(coins, 'dependent')).toEqual(testDependentCoin);
    });

    it('should return a coin when a variant is found by name', () => {
      const coins = [testMultivariantCoin, testDependentMultivariantCoin];
      expect(getCoin(coins, 'variantA')).toEqual(testMultivariantCoin);
      expect(getCoin(coins, 'dependentVariant')).toEqual(testDependentMultivariantCoin);
    });

    it('should return null when no matching coin is found', () => {
      const coins = [testNormalCoin];
      expect(getCoin(coins, 'missing')).toBeNull();
    });
  });

  describe('flipCoins tests', () => {
    it('should flip coins properly to randomly select coins', () => {
      expect(flipCoins(fullFixedDefinition)).toEqual([
        {
          active: true,
          metadata: new Map(),
          name: 'normal1',
          probability: 100,
          type: CoinType['NORMAL']
        },
        {
          active: false,
          metadata: new Map(),
          name: 'normal2',
          probability: 0,
          type: CoinType['NORMAL']
        },
        {
          active: true,
          activeVariant: 'variant1',
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
          active: true,
          dependsOn: [
            {
              behavior: { behaviorToExpress: false, dependentBehaviorToExpressOn: true },
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
          active: true,
          dependsOn: [
            {
              behavior: { behaviorToExpress: true, dependentBehaviorToExpressOn: false },
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
          active: true,
          activeVariant: 'v5',
          metadata: new Map(),
          name: 'dependentMultivariant1',
          type: CoinType['DEPENDENTMULTIVARIANT'],
          variants: [
            {
              dependsOn: [
                {
                  behavior: { behaviorToExpress: true, dependentBehaviorToExpressOn: true },
                  name: 'dependent2',
                  priority: 1
                }
              ],
              name: 'v4',
              probability: 0,
              type: 'DEPENDENTVARIANT'
            },
            { name: 'v5', probability: 100, type: VariantType['VARIANT'] },
            { name: 'v6', probability: 0, type: VariantType['VARIANT'] }
          ]
        }
      ]);
    });
  });
});

/*
import Chest from '../chest';
import { circularDefinition, fixedDefinition } from '../definitions/definitions';
import { NORMAL, DEPENDENT, VARIANT, DEPENDENT_VARIANT } from '../coinTypes';

describe('Chest tests', () => {
  describe('Init tests', () => {
    it('defines a chest correctly and sets the coins correctly', () => {
      const chest = Chest(fixedDefinition);

      expect(chest.coins.length).toEqual(7);
    });

    it('throws an error when test sample has a test with an invalid type', () => {
      const invalidTypeDefinition = [
        {
          metadata: {
            persist: false
          },
          name: 'normal1',
          probability: 100,
          type: 'invalid'
        }
      ];
      expect(() => Chest(invalidTypeDefinition)).toThrow(
        new Error(
          `The type on the test with the following test definition ${JSON.stringify(
            invalidTypeDefinition[0]
          )} is invalid`
        )
      );
    });

    it('throws an error when tests have duplicate names', () => {
      const duplicateDefinition = [
        {
          dependsOn: [
            {
              active: true,
              behavior: true,
              name: 'normal2',
              priority: 2
            }
          ],
          name: 'normal1',
          probability: 100,
          type: 'dependent'
        },
        { name: 'normal1', probability: 0, type: 'normal' }
      ];

      const duplicateMultivariantDefinition = [
        {
          metadata: {},
          name: 'depMulti',
          type: 'dependentMultivariant',
          variants: [
            {
              dependsOn: [
                {
                  active: true,
                  behavior: true,
                  name: 'v1',
                  priority: 1
                }
              ],
              name: 'v3',
              probability: 100
            },
            { name: 'v5', probability: 0 },
            { name: 'v6', probability: 0 }
          ]
        },
        {
          metadata: {},
          name: 'multi',
          type: 'multivariant',
          variants: [
            { name: 'v1', probability: 100 },
            { name: 'v2', probability: 0 },
            { name: 'v3', probability: 0 }
          ]
        }
      ];

      expect(() => Chest(duplicateDefinition)).toThrow(
        new Error(
          'The name normal1 on the test with the following test definition {"name":"normal1","probability":0,"type":"normal"} is already in use'
        )
      );

      expect(() => Chest(duplicateMultivariantDefinition)).toThrow(
        new Error(
          'The name v3 on the test with the following test definition {"metadata":{},"name":"multi","type":"multivariant","variants":[{"name":"v1","probability":100},{"name":"v2","probability":0},{"name":"v3","probability":0}]} is already in use'
        )
      );
    });

    it('throws an error when a circular dependency is found', () => {
      expect(() => Chest(circularDefinition)).toThrow(
        new Error(
          'The depends1 test has a dependency or is dependent on a test with a circular dependency in its configuration.'
        )
      );
    });
  });

  describe('createNodeGraph tests', () => {
    it('sets up node graph correctly', () => {
      const chest = Chest(fixedDefinition);
      const nodes = {
        normal2: [],
        v4: ['depends2'],
        depends: ['depends2'],
        depends2: ['normal2'],
        depends3: ['depends']
      };

      expect(chest.createNodeGraph().nodes).toEqual(nodes);
    });
  });

  describe('getCoin tests', () => {
    it('gets a coin from the chest', () => {
      const chest = Chest(fixedDefinition);

      const normalCoin = chest.getCoin('normal1');
      const multiCoin = chest.getCoin('v1');
      const dependentCoin = chest.getCoin('depends');
      const dependentMultiCoin = chest.getCoin('v4');
      const fakeCoin = chest.getCoin('fake');

      expect(normalCoin.name).toEqual('normal1');
      expect(normalCoin.probability).toEqual(100);
      expect(normalCoin.type).toEqual(NORMAL);

      expect(multiCoin.name).toEqual('v1');
      expect(multiCoin.probability).toEqual(100);
      expect(multiCoin.type).toEqual(VARIANT);

      expect(dependentCoin.name).toEqual('depends');
      expect(dependentCoin.probability).toEqual(100);
      expect(dependentCoin.type).toEqual(DEPENDENT);

      expect(dependentMultiCoin.name).toEqual('v4');
      expect(dependentMultiCoin.probability).toEqual(100);
      expect(dependentMultiCoin.type).toEqual(DEPENDENT_VARIANT);

      expect(fakeCoin).toBeNull();
    });
  });

  describe('flipCoins tests', () => {
    // sample used in these tests is fixed to avoid the true random behavior
    it('flips the coins and returns a "random" sample', () => {
      const chest = Chest(fixedDefinition);

      expect(chest.flipCoins()).toEqual([
        'normal1',
        false,
        'v1',
        'depends',
        'depends2',
        'depends3',
        'v4'
      ]);
    });
  });

  describe('mixCoins tests', () => {
    // sample used in these tests is fixed to avoid the true random behavior
    it('mixes the coins and returns a "random" sample', () => {
      const chest = Chest(fixedDefinition);
      const mixed = chest.mixCoins();

      const isActive = Object.values(mixed)
        .map(coin =>
          coin.isMultivariant ? coin.variants.map(variant => variant.active) : coin.active
        )
        .flat();

      expect(isActive).toEqual([
        true,
        false,
        true,
        false,
        false,
        true,
        false,
        false,
        true,
        false,
        false
      ]);
    });
  });
});

*/
