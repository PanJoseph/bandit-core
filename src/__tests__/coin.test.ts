import {
  createSamplingPool,
  getDependent,
  getDependentInVariant,
  getVariant,
  isDependent,
  isMultivariant
} from '../coin';
import {
  testNormalCoin,
  testDependentCoin,
  testMultivariantCoin,
  testDependentMultivariantCoin,
  testDependent,
  testVariantA,
  testDependentVariant,
  testVariantB
} from './definitions/testDefinitions';

describe('Coin Tests', () => {
  describe('isMultivariant Tests', () => {
    it('returns as expected for differing types', () => {
      expect(isMultivariant(testNormalCoin)).toBeFalsy();
      expect(isMultivariant(testDependentCoin)).toBeFalsy();
      expect(isMultivariant(testMultivariantCoin)).toBeTruthy();
      expect(isMultivariant(testDependentMultivariantCoin)).toBeTruthy();
    });
  });

  describe('isDependent Tests', () => {
    it('returns as expected for differing types', () => {
      expect(isDependent(testNormalCoin)).toBeFalsy();
      expect(isDependent(testDependentCoin)).toBeTruthy();
      expect(isDependent(testMultivariantCoin)).toBeFalsy();
      expect(isDependent(testDependentMultivariantCoin)).toBeTruthy();
    });
  });

  describe('createSamplingPool Tests', () => {
    it('returns as expected for coins without variants', () => {
      expect(createSamplingPool(testNormalCoin)).toEqual([
        {
          count: 10,
          value: 'normal'
        }
      ]);

      expect(createSamplingPool(testDependentCoin)).toEqual([
        {
          count: 10,
          value: 'dependent'
        }
      ]);
    });

    it('returns as expected for coins with variants', () => {
      expect(createSamplingPool(testMultivariantCoin)).toEqual([
        {
          count: 10,
          value: 'variantA'
        },
        {
          count: 50,
          value: 'variantB'
        }
      ]);

      expect(createSamplingPool(testDependentMultivariantCoin)).toEqual([
        {
          count: 10,
          value: 'variantA'
        },
        {
          count: 50,
          value: 'dependentVariant'
        }
      ]);
    });
  });

  describe('getDependent Tests', () => {
    it('returns correctly when dependent is present', () => {
      expect(getDependent(testDependentCoin, 'dependent')).toEqual(testDependent);
    });

    it('returns null when dependent is not found', () => {
      expect(getDependent(testDependentCoin, 'notfound')).toBeNull();
    });
  });

  describe('getDependentInVariant Tests', () => {
    it('returns correctly when dependent variant is present', () => {
      expect(getDependentInVariant(testDependentMultivariantCoin, 'dependent')).toEqual(
        testDependent
      );
    });

    it('returns null when dependent variant is not found', () => {
      expect(getDependentInVariant(testDependentMultivariantCoin, 'notfound')).toBeNull();
    });
  });

  describe('getVariant Tests', () => {
    it('returns correctly when a variant is present', () => {
      expect(getVariant(testMultivariantCoin, 'variantA')).toEqual(testVariantA);
      expect(getVariant(testDependentMultivariantCoin, 'dependentVariant')).toEqual(
        testDependentVariant
      );
    });
  });
});
