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
            if (MatcherUtils.isFullyEquals(item, seekItem)) {
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

  static withItems(expectedMatches: any[], options?: {
    canBeNull?: boolean,
    optional?: boolean,
    onlySpecifiedItems?: boolean,
    allowDuplicateMatch?: boolean,
  }) {
    return valueMatcher('ArrayMatchers.withItems', options, value => {
      if (!MatcherUtils.isArray(value)) {
        return ValueMatcher.typeError('JsonArray');
      }
      let result: any[] = [];
      let notFoundMatches: any[] = [...expectedMatches];
      for (let itemIndex = 0; itemIndex < value.length; itemIndex++) {
        let item = value[itemIndex];
        let resultItem: any = item;
        let hasMatchInExpected = false;
        let matchedWithDuplication: any = null;
        for (let expectedMatchIndex = 0; expectedMatchIndex < expectedMatches.length; expectedMatchIndex++) {
          let expectedMatch = expectedMatches[expectedMatchIndex];
          let match = ValueMatcher.copyWithExpectedMatch(item, expectedMatch);
          if (MatcherUtils.isFullyEquals(item, match)) {
            hasMatchInExpected = true;
            let indexOfFound = notFoundMatches.indexOf(expectedMatch);
            if (indexOfFound >= 0) {
              notFoundMatches.splice(indexOfFound, 1);
            }
            if (options?.allowDuplicateMatch != true) {
              for (let seekDuplicateItemIndex = 0; seekDuplicateItemIndex < value.length; seekDuplicateItemIndex++) {
                if (itemIndex != seekDuplicateItemIndex) {
                  let seekDuplicateItem = value[seekDuplicateItemIndex];
                  let matchDuplication = ValueMatcher.copyWithExpectedMatch(seekDuplicateItem, expectedMatch);
                  if (MatcherUtils.isFullyEquals(seekDuplicateItem, matchDuplication)) {
                    matchedWithDuplication = expectedMatch;
                  }
                }
              }
            }
          }
        }
        if (hasMatchInExpected) {
          if (matchedWithDuplication != null) {
            resultItem = new FailedMatch('ArrayMatchers.anyArrayContaining', 'Item matches multiple times with duplications', options);
            resultItem.item = item;
            resultItem.match = matchedWithDuplication;
          }
        } else {
          if (options?.onlySpecifiedItems == true) {
            resultItem = new FailedMatch('ArrayMatchers.anyArrayContaining', 'Item does not match any of specified items', options);
            resultItem.item = item;
          }
        }
        result.push(resultItem);
      }
      for (let notFound of notFoundMatches) {
        let resultItem: any = new FailedMatch('ArrayMatchers.anyArrayContaining', 'Item match not found');
        resultItem.matchNotFound = notFound;
        result.push(resultItem);
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

}