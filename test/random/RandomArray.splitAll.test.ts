import { ArrayMatchers, ConsoleLogger, matchAll, Matchers, Random, RandomArray, validateMatch } from '../../src';
import { generateRandomValueArray } from '../test-utils/generateRandomValue';

describe('RandomArray.splitAll()', () => {

  test('Validate', () => {
    for (let i = 1; i <= 100; i++) {
      ConsoleLogger.log(`TIER ${i}`);
      let source = generateRandomValueArray(27);
      validateMatch(source, ArrayMatchers.uniqueItems());

      let equally = Random.boolean();
      let resultCount = Random.intBetween(3, 5);
      let result = RandomArray.splitAll(source, resultCount, equally);
      validateMatch(result, ArrayMatchers.any({ expectedLength: resultCount }));
      let sumItems: any[] = [];
      for (let subResult of result) {
        sumItems.push(...subResult);
        if (equally) {
          validateMatch(subResult.length, Matchers.number({
            shouldBeInteger: true,
            bounds: {
              min: Math.floor(source.length / resultCount),
              max: Math.ceil(source.length / resultCount),
            },
          }));
        } else {
          validateMatch(subResult.length, Matchers.number({
            shouldBeInteger: true,
            bounds: {
              min: 1,
              max: source.length - resultCount + 1,
            },
          }));
        }
        validateMatch(subResult, matchAll(
          ArrayMatchers.uniqueItems(),
          ArrayMatchers.containingOnly(source),
        ));
      }
      validateMatch(sumItems, matchAll(
        ArrayMatchers.any({ expectedLength: source.length }),
        ArrayMatchers.uniqueItems(),
        ArrayMatchers.containingAll(source),
      ));
    }
  });

});