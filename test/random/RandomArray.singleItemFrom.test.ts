import { ArrayMatchers, ConsoleLogger, RandomArray, validateMatch } from '../../src';
import { generateRandomValueArray } from '../test-utils/generateRandomValue';

describe('RandomArray.singleItemFrom()', () => {

  test('Validate', () => {
    for (let i = 1; i <= 100; i++) {
      ConsoleLogger.log(`TIER ${i}`);
      let source = generateRandomValueArray(20);
      validateMatch(source, ArrayMatchers.uniqueItems());

      let result = RandomArray.singleItemFrom(source);
      validateMatch(source, ArrayMatchers.containingAll([result]));
    }
  });

});