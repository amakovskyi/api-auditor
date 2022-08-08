import { ArrayMatchers, ConsoleLogger, matchAll, Matchers, RandomArray, validateMatch } from '../../src';
import { generateRandomValueArray } from '../test-utils/generateRandomValue';

describe('RandomArray.mixedCopyOf()', () => {

  test('Validate', () => {
    for (let i = 1; i <= 500; i++) {
      ConsoleLogger.log(`TIER ${i}`);
      let source = generateRandomValueArray(10);
      validateMatch(source, ArrayMatchers.uniqueItems());

      let result = RandomArray.someItemsFrom(source, 4, 4);
      expect(source).not.toEqual(result);
      validateMatch(result.length, Matchers.number({ bounds: { min: 4, max: 8 } }));
      validateMatch(result, matchAll(
        ArrayMatchers.uniqueItems(),
        ArrayMatchers.containingOnly(source),
      ));
    }
  });

});