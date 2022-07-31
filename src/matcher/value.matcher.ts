/**
 *
 * @param name pretty name of matcher method
 * @param performTest function which tests provided [value] to match.
 *                    Should return value itself is match successful or error text of match is not successful.
 */
import { MatcherUtils } from './matcher.utils';

export function valueMatcher(
  name: string,
  performTest: (value: any) => any,
): ValueMatcher {
  return new ValueMatcher(name, performTest);
}

export class ValueMatcher {
  constructor(
    readonly name: string,
    readonly performTest: (value: any) => any,
  ) {
  }

  /**
   * Create a copy of [actual] but override all keys/values present in [expected]
   * @param actual
   * @param expected
   */
  static copyWithExpectedMatch(actual: any, expected: any): any {
    if (MatcherUtils.isArray(actual) && MatcherUtils.isArray(expected)) {
      // making copy with size of EXPECTED
      let result = [];
      for (let i = 0; i < expected.length; i++) {
        let actualItem = actual[i];
        let expectedItem = expected[i];
        result.push(ValueMatcher.copyWithExpectedMatch(actualItem, expectedItem));
      }
      return result;
    } else if (MatcherUtils.isObject(actual) && MatcherUtils.isObject(expected)) {
      let result = Object.assign({}, actual);
      Object.keys(expected).forEach(key => {
        const expectedValue = ValueMatcher.copyWithExpectedMatch(actual[key], expected[key]);
        if (typeof expectedValue != 'undefined') {
          result[key] = expectedValue;
        } else {
          delete result[key];
        }
      });
      return result;
    } else if (expected instanceof ValueMatcher) {
      return expected.performTest(actual);
    } else {
      if (expected instanceof Date) {
        return expected.toISOString();
      }
      return expected;
    }
  }
}

