import { ArrayMatchers, ConsoleLogger, matchAll, RandomArray, validateMatch } from '../../src';
import { generateRandomValueArray } from '../test-utils/generateRandomValue';

describe('RandomArray.mixedCopyOf()', () => {

  test('Validate', () => {
    for (let i = 1; i <= 50; i++) {
      ConsoleLogger.log(`TIER ${i}`);
      let source = generateRandomValueArray(50);
      validateMatch(source, ArrayMatchers.uniqueItems());

      let result = RandomArray.mixedCopyOf(source);
      expect(source).not.toEqual(result);
      validateMatch(result, matchAll(
        ArrayMatchers.any({ expectedLength: source.length }),
        ArrayMatchers.uniqueItems(),
        ArrayMatchers.containingAll(source),
      ));
    }
  });

});