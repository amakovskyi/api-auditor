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
    readonly options?: any,
  ) {
  }
}

class MathValue {
  constructor(
    readonly value: any,
  ) {
  }
}

export class FailedMatch {
  constructor(
    readonly matcher: string,
    readonly message: string,
    readonly options?: any,
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

  static error(message: string, options?: any): MatchError {
    return new MatchError(message, options);
  }

  static value(value: any): MathValue {
    return new MathValue(value);
  }

  testValue(value: any): any {
    let matchResult = this.performTest(value);
    if (matchResult instanceof MatchSuccess) {
      return value;
    }
    if (matchResult instanceof MatchError) {
      if (matchResult.options == null) {
        return new FailedMatch(
          this.name,
          matchResult.message,
        );
      } else {
        return new FailedMatch(
          this.name,
          matchResult.message,
          matchResult.options,
        );
      }
    }
    if (matchResult instanceof MathValue) {
      return matchResult.value;
    }
    throw new Error('Unknown result from matcher [' + this.name + ']. Should be ValueMatcher.success() or ValueMatcher.error()');
  }

  /**
   * Create a copy of [actual] but override all keys/values present in [expected]
   * @param data
   * @param match
   */
  static copyWithExpectedMatch(data: any, match: any): any {
    if (MatcherUtils.isArray(data) && MatcherUtils.isArray(match)) {
      // making copy with size of EXPECTED
      let result = [];
      for (let i = 0; i < match.length; i++) {
        let actualItem = data[i];
        let expectedItem = match[i];
        result.push(ValueMatcher.copyWithExpectedMatch(actualItem, expectedItem));
      }
      return result;
    } else if (MatcherUtils.isObject(data) && MatcherUtils.isObject(match)) {
      let result = Object.assign({}, data);
      Object.keys(match).forEach(key => {
        const expectedValue = ValueMatcher.copyWithExpectedMatch(data[key], match[key]);
        if (typeof expectedValue != 'undefined') {
          result[key] = expectedValue;
        } else {
          delete result[key];
        }
      });
      return result;
    } else if (match instanceof ValueMatcher) {
      return match.testValue(data);
    } else {
      if (match instanceof Date) {
        return match.toISOString();
      }
      return match;
    }
  }
}

