import { FailedMatch, valueMatcher, ValueMatcher } from './value.matcher';
import { MatcherUtils } from './matcher.utils';
import { isDeepStrictEqual } from 'util';

export class ArrayMatchers {

  static any(options?: {
    canBeNull?: boolean,
    optional?: boolean,
    requireNotEmpty?: boolean,
    expectedLength?: number,
    itemMatch?: any
  }) {
    return valueMatcher('ArrayMatchers.any', options, value => {
      if (!MatcherUtils.isArray(value)) {
        return ValueMatcher.typeError('JsonArray');
      }
      if (options?.requireNotEmpty == true && value.length == 0) {
        return ValueMatcher.error('[JsonArray] should be not empty');
      }
      if (options?.expectedLength != null) {
        if (options.expectedLength != value.length) {
          return ValueMatcher.error(`Expected [JsonArray] with length=${options.expectedLength}`);
        }
      }
      if (typeof options?.itemMatch != 'undefined') {
        let resultValue = [];
        for (let item of value) {
          resultValue.push(ValueMatcher.copyWithExpectedMatch(item, options.itemMatch));
        }
        return ValueMatcher.value(resultValue);
      }
      return ValueMatcher.success();
    });
  }

  static uniqueItems(options?: {
    canBeNull?: boolean,
    optional?: boolean,
    requireNotEmpty?: boolean,
  }): ValueMatcher {
    return valueMatcher('ArrayMatchers.uniqueItems', options, (value) => {
      if (!MatcherUtils.isArray(value)) {
        return ValueMatcher.typeError('JsonArray');
      }
      if (options?.requireNotEmpty == true && value.length == 0) {
        return ValueMatcher.error('[JsonArray] should be not empty');
      }
      let result: any[] = [];
      for (let itemIndex = 0; itemIndex < value.length; itemIndex++) {
        let isDuplicated = false;
        let item = value[itemIndex];
        for (let seekDuplicateIndex = 0; seekDuplicateIndex < value.length; seekDuplicateIndex++) {
          if (seekDuplicateIndex != itemIndex) {
            let seekItem = value[seekDuplicateIndex];
            if (typeof item == 'undefined' && typeof seekItem == 'undefined') {
              isDuplicated = true;
            } else if (MatcherUtils.isStrictNull(item) && MatcherUtils.isStrictNull(seekItem)) {
              isDuplicated = true;
            } else if (isDeepStrictEqual(value[itemIndex], value[seekDuplicateIndex])) {
              isDuplicated = true;
            }
          }
        }
        if (isDuplicated) {
          let resultItem: any = new FailedMatch('ArrayMatchers.uniqueItems', 'Item is duplicated');
          resultItem.item = item;
          result.push(resultItem);
        } else {
          result.push(item);
        }
      }
      return ValueMatcher.value(result);
    });
  }

  // DONE UNTIL HERE

  /**
   * Expect value is any array which is not containing [args]
   */
  static anyArrayNotContaining(args: any[]) {
    return valueMatcher('anyArrayNotContaining', null, value => {
      if (!MatcherUtils.isArray(value)) {
        return '[expected JsonArray]';
      }
      let argsMatched: any[] = [];
      let argsNotMatched: any[] = [];
      for (let expectedItem of args) {
        let isMatched = false;
        for (let actualItem of value) {
          let expectedMatch = ValueMatcher.copyWithExpectedMatch(actualItem, expectedItem);
          if (isDeepStrictEqual(expectedMatch, actualItem)) {
            isMatched = true;
          }
        }
        if (isMatched) {
          argsMatched.push(expectedItem);
        } else {
          argsNotMatched.push(expectedItem);
        }
      }
      if (argsMatched.length > 0) {
        return {
          error: 'Some of not expected items found in the array',
          actual: value,
          expectedAndMatched: argsNotMatched,
          notMatchedButExpected: argsMatched,
        };
      }
      return value;
    });
  }

  /**
   * Expect value is any where all items match [match]
   */
  static arrayWithAllItemsMatch(match: any) {
    return valueMatcher('arrayWithAllItemsMatch', null, value => {
      if (!MatcherUtils.isArray(value)) {
        return '[expected JsonArray]';
      }
      let expected: any[] = [];
      for (let i = 0; i < value.length; i++) {
        let expectedMatch = ValueMatcher.copyWithExpectedMatch(value[i], match);
        expected.push(expectedMatch);
      }
      return expected;
    });
  }

  /**
   * Expect value is any where all [args] match at least one item
   */
  static anyArrayContaining(...args: any) {
    return valueMatcher('anyArrayContaining', null, value => {
      if (!MatcherUtils.isArray(value)) {
        return '[expected JsonArray]';
      }
      let argsMatched: any[] = [];
      let argsNotMatched: any[] = [];
      for (let expectedItem of args) {
        let isMatched = false;
        for (let actualItem of value) {
          let expectedMatch = ValueMatcher.copyWithExpectedMatch(actualItem, expectedItem);
          if (isDeepStrictEqual(expectedMatch, actualItem)) {
            isMatched = true;
          }
        }
        if (isMatched) {
          argsMatched.push(expectedItem);
        } else {
          argsNotMatched.push(expectedItem);
        }
      }
      if (argsNotMatched.length > 0) {
        return {
          error: 'Not all expected items found in array',
          actual: value,
          expectedAndMatched: argsMatched,
          notMatchedButExpected: argsNotMatched,
        };
      }
      return value;
    });
  }

  /**
   * Expect value is any where at least one of [args] match at least one item
   */
  static anyArrayContainingSome(...args: any) {
    return valueMatcher('anyArrayContainingSome', null, value => {
      if (!MatcherUtils.isArray(value)) {
        return '[expected JsonArray]';
      }
      let argsMatched: any[] = [];
      let argsNotMatched: any[] = [];
      let isMatched = false;
      for (let expectedItem of args) {
        for (let actualItem of value) {
          let expectedMatch = ValueMatcher.copyWithExpectedMatch(actualItem, expectedItem);
          if (isDeepStrictEqual(expectedMatch, actualItem)) {
            isMatched = true;
          }
        }
        if (isMatched) {
          argsMatched.push(expectedItem);
        } else {
          argsNotMatched.push(expectedItem);
        }
      }

      if (!argsMatched.length) {
        return {
          error: 'No matches found in array with expected items',
          actual: value,
          expectedAndMatched: argsMatched,
          notMatchedButExpected: argsNotMatched,
        };
      }
      return value;
    });
  }

  static withItems(args: any[]) {
    // return matchAll(
    //   ArrayMatchers.any({ expectedLength: args.length }),
    //   ArrayMatchers.anyArrayContaining(...args),
    // );
    throw new Error('TODO');
  }

}