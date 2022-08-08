/**
 *
 * @param name pretty name of matcher method
 * @param performTest function which tests provided [value] to match.
 *                    Should return value itself is match successful or error text of match is not successful.
 */
import { MatcherUtils } from './matcher.utils';

export function valueMatcher(
  name: string,
  options: {
    canBeNull?: boolean,
    optional?: boolean
  },
  performTest: (value: any) => any,
): ValueMatcher {
  return new ValueMatcher(name, false, options, performTest);
}

export function customValueMatcher(
  name: string,
  options: any,
  performTest: (value: any) => any,
): ValueMatcher {
  return new ValueMatcher(name, true, options, performTest);
}

class MatchSuccess {
}

class MatchError {
  constructor(
    readonly message: string,
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
    readonly name: string,
    readonly custom: boolean,
    readonly options: {
      canBeNull?: boolean,
      optional?: boolean,
    },
    readonly performTest: (value: any) => any,
  ) {
  }

  static VALUE_IS_REQUIRED = 'Value is required';
  static VALUE_CANNOT_BE_NULL = 'Value cannot be [null]';

  static success(): MatchSuccess {
    return new MatchSuccess();
  }

  static error(message: string): MatchError {
    return new MatchError(message);
  }

  static typeError(expectedType: string): MatchError {
    return new MatchError(`Expected value of type [${expectedType}]`);
  }

  static value(value: any): MathValue {
    return new MathValue(value);
  }

  testValue(value: any): any {
    let matchResult: any = null;
    if (!this.custom) {
      // STANDARD CHECKS
      if (typeof value == 'undefined') {
        if (this.options?.optional == true) {
          matchResult = ValueMatcher.success();
        } else {
          matchResult = ValueMatcher.error(ValueMatcher.VALUE_IS_REQUIRED);
        }
      } else if (value == null) {
        if (this.options?.canBeNull == true) {
          matchResult = ValueMatcher.success();
        } else {
          matchResult = ValueMatcher.error(ValueMatcher.VALUE_CANNOT_BE_NULL);
        }
      }
    }
    // EXACT MATCHER CHECK IF STANDARD CHECKS HAS NOT RESULT
    if (matchResult == null) {
      matchResult = this.performTest(value);
    }
    // VALIDATE MATCH RESULT
    if (matchResult == null) {
      throw new Error(`Result from matcher [${this.name}] is null. Value = ${JSON.stringify(value)}.`);
    }
    if (matchResult instanceof MatchSuccess) {
      return value;
    }
    if (matchResult instanceof MatchError) {
      if (this.options == null) {
        return new FailedMatch(
          this.name,
          matchResult.message,
        );
      } else {
        return new FailedMatch(
          this.name,
          matchResult.message,
          this.options,
        );
      }
    }
    if (matchResult instanceof MathValue) {
      return matchResult.value;
    }
    throw new Error(`Unknown from matcher [${this.name}] is null. Value = ${JSON.stringify(value)}; result=${JSON.stringify(matchResult)}.`);
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

