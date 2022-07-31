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

class MatchSuccess {
}

class MatchError {
  constructor(
    readonly message: string,
    readonly options: any[],
  ) {
  }
}

export class ValueMatcher {
  constructor(
    private readonly name: string,
    private readonly performTest: (value: any) => any,
  ) {
  }

  static hasOption<T>(options: T[], expectedOption: T): boolean {
    return options.indexOf(expectedOption) > 0;
  }

  static noOption<T>(options: T[], expectedOption: T): boolean {
    return !ValueMatcher.hasOption(options, expectedOption);
  }

  static success(): MatchSuccess {
    return new MatchSuccess();
  }

  static error(message: string, options?: any[]): MatchError {
    return new MatchError(message, options);
  }

  testValue(value: any): any {
    let matchResult = this.performTest(value);
    if (matchResult instanceof MatchSuccess) {
      return value;
    }
    if (matchResult instanceof MatchError) {
      let resultObject: any = {
        matcher: this.name,
        message: matchResult.message,
      };
      if (matchResult.options != null && matchResult.options.length > 0) {
        resultObject.options = matchResult.options;
      }
      return resultObject;
    }
    throw new Error('Unknown result from matcher [' + this.name + ']. Should be ValueMatcher.success() or ValueMatcher.error()');
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
      return expected.testValue(actual);
    } else {
      if (expected instanceof Date) {
        return expected.toISOString();
      }
      return expected;
    }
  }
}

