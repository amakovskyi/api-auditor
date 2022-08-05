import { FailedMatch, valueMatcher, ValueMatcher } from './value.matcher';
import { MatcherUtils } from './matcher.utils';

export class ArrayMatchers {

  /**
   * Validates is value is an array
   * @param options
   * @param options.requireNotEmpty is require from array to be not empty
   * @param options.expectedLength require array with specific size
   * @param options.itemMatch require all array items to match [itemMatch]
   */
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
  }): ValueMatcher {
    return valueMatcher('ArrayMatchers.uniqueItems', options, (value) => {
      if (!MatcherUtils.isArray(value)) {
        return ValueMatcher.typeError('JsonArray');
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

  /**
   * Validates is value is an array which contains items from witch exists matches for all of [expectedMatches]
   * @param expectedMatches
   * @param options
   * @param options.allowDuplicateMatch array can contain items which matches several of [expectedMatches] (if not set to TRUE - matches should be distinctive)
   */
  static containingAll(expectedMatches: any[], options?: {
    canBeNull?: boolean,
    optional?: boolean,
    allowDuplicateMatch?: boolean,
  }) {
    return valueMatcher('ArrayMatchers.containingAll', options, value => {
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
            resultItem = new FailedMatch('ArrayMatchers.containingAll', 'Item matches multiple times with duplications', options);
            resultItem.item = item;
            resultItem.match = matchedWithDuplication;
          }
        }
        result.push(resultItem);
      }
      for (let notFound of notFoundMatches) {
        let resultItem: any = new FailedMatch('ArrayMatchers.containingAll', 'Item match not found');
        resultItem.matchNotFound = notFound;
        result.push(resultItem);
      }
      return ValueMatcher.value(result);
    });
  }

  /**
   * Validates is value is an array which contains at least one item which match any of [expectedAnyMatches]
   * @param expectedAnyMatches
   * @param options
   */
  static containingAny(expectedAnyMatches: any[], options?: {
    canBeNull?: boolean,
    optional?: boolean,
  }) {
    return valueMatcher('ArrayMatchers.containingAny', options, value => {
      if (!MatcherUtils.isArray(value)) {
        return ValueMatcher.typeError('JsonArray');
      }
      for (let item of value) {
        for (let match of expectedAnyMatches) {
          let matchResult = ValueMatcher.copyWithExpectedMatch(item, match);
          if (MatcherUtils.isFullyEquals(item, matchResult)) {
            return ValueMatcher.success();
          }
        }
      }
      return ValueMatcher.error('No items found matching expected');
    });
  }

  /**
   * Validates is value is an array which contains only items from witch exists matches for all of [expectedMatches]
   * @param expectedMatches
   * @param options
   * @param options.allowDuplicateMatch array can contain items which matches several of [expectedMatches] (if not set to TRUE - matches should be distinctive)
   * @param options.requireAll require from value to have matches for all of [expectedMatches]
   */
  static containingOnly(expectedMatches: any[], options?: {
    canBeNull?: boolean,
    optional?: boolean,
    allowDuplicateMatch?: boolean,
    requireAll?: boolean,
  }) {
    return valueMatcher('ArrayMatchers.containingOnly', options, value => {
      if (!MatcherUtils.isArray(value)) {
        return ValueMatcher.typeError('JsonArray');
      }
      let result: any[] = [];
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
            resultItem = new FailedMatch('ArrayMatchers.containingOnly', 'Item matches multiple times with duplications', options);
            resultItem.item = item;
            resultItem.match = matchedWithDuplication;
          }
        } else {
          resultItem = new FailedMatch('ArrayMatchers.containingOnly', 'Item does not match any of specified matches', options);
          resultItem.item = item;
        }
        result.push(resultItem);
      }
      return ValueMatcher.value(result);
    });
  }

  /**
   * Validates is value is an array which contains no items which match any of [expectedNoMatches]
   * @param expectedNoMatches
   * @param options
   */
  static notContaining(expectedNoMatches: any[], options?: {
    canBeNull?: boolean,
    optional?: boolean,
  }) {
    return valueMatcher('ArrayMatchers.notContaining', options, value => {
      if (!MatcherUtils.isArray(value)) {
        return ValueMatcher.typeError('JsonArray');
      }
      let result: any[] = [];
      for (let item of value) {
        let foundMatches: boolean = false;
        for (let match of expectedNoMatches) {
          let matchResult = ValueMatcher.copyWithExpectedMatch(item, match);
          if (MatcherUtils.isFullyEquals(item, matchResult)) {
            foundMatches = true;
            let failedMatchItem: any = new FailedMatch('ArrayMatchers.notContaining', 'Item match found');
            failedMatchItem.item = item;
            failedMatchItem.match = match;
            result.push(failedMatchItem);
          }
        }
        if (!foundMatches) {
          result.push(item);
        }
      }
      return ValueMatcher.value(result);
    });
  }

}