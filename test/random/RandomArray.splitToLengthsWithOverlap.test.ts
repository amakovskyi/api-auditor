import { ArrayMatchers, ConsoleLogger, matchAll, Random, RandomArray, validateMatch } from '../../src';
import { generateRandomValueArray } from '../test-utils/generateRandomValue';

describe('RandomArray.splitToLengthsWithOverlap()', () => {

  test('Validate', () => {
    for (let i = 1; i <= 50; i++) {
      ConsoleLogger.log(`TIER ${i}`);
      let source = generateRandomValueArray(25);
      validateMatch(source, ArrayMatchers.uniqueItems());

      let resultCount = Random.intBetween(3, 7);
      let sizes: number[] = [];
      for (let i = 0; i < resultCount; i++) {
        sizes.push(Random.intBetween(3, 7));
      }
      let result = RandomArray.splitToLengthsWithOverlap(source, sizes);
      validateMatch(result, ArrayMatchers.any({ expectedLength: resultCount }));
      let sumItems: any[] = [];
      for (let i = 0; i < sizes.length; i++) {
        let subResult = result[i];
        sumItems.push(...subResult);
        validateMatch(subResult, matchAll(
          ArrayMatchers.any({ expectedLength: sizes[i] }),
          ArrayMatchers.uniqueItems(),
          ArrayMatchers.containingOnly(source),
        ));
      }
      validateMatch(sumItems, matchAll(
        ArrayMatchers.containingOnly(source, { allowDuplicateMatch: true }),
      ));
    }
  });

});