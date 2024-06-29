import { ArrayMatchers, Logger, RandomArray, validateMatch } from '../../src';
import { generateRandomValueArray } from '../test-utils/generateRandomValue';

describe('RandomArray.singleItem()', () => {

  test('Validate', () => {
    for (let i = 1; i <= 100; i++) {
      Logger.log(`TIER ${i}`);
      let source = generateRandomValueArray(20);
      validateMatch(source, ArrayMatchers.uniqueItems());

      let result = RandomArray.singleItem(source);
      validateMatch(source, ArrayMatchers.containingAll([result]));
    }
  });

});