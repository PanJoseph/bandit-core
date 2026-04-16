import { createSample } from '../stat';
import { Sample } from '../types/coin';

describe('The statistics helper functions', () => {
  describe('createSample tests', () => {
    it('creates samples correctly', () => {
      const values: Array<Sample<String>> = [
        { count: 10, value: 'first' },
        { count: 90, value: 'second' }
      ];

      const sample = createSample(values, 100);

      expect(sample.length).toEqual(100);
      expect(sample.filter(x => x === 'first').length).toEqual(10);
      expect(sample.filter(x => x === 'second').length).toEqual(90);
    });

    it('fills missing values in with false', () => {
      const values: Array<Sample<String>> = [
        { count: 10, value: 'first' },
        { count: 10, value: 'second' }
      ];

      const sample = createSample(values, 100);

      expect(sample.length).toEqual(100);
      expect(sample.filter(x => x === 'first').length).toEqual(10);
      expect(sample.filter(x => x === 'second').length).toEqual(10);
      expect(sample.filter(x => x === null).length).toEqual(80);
    });

    it('fills only up to the max size passed', () => {
      const values: Array<Sample<String>> = [
        { count: 100, value: 'first' },
        { count: 100, value: 'second' }
      ];

      const sample = createSample(values, 100);

      expect(sample.length).toEqual(100);
    });
  });
});
