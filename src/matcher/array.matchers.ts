import { valueMatcher, ValueMatcher } from './value.matcher';
import { MatcherUtils } from './matcher.utils';
import { matchAll } from './matcher.validation';
import { isDeepStrictEqual } from 'util';

export class ArrayMatchers {

  /**
   * Any JsonArray
   */
  static any(expectedLength: number | null = null) {
    return valueMatcher('anyArray', value => {
      if (!MatcherUtils.isArray(value)) {
        return '[expected JsonArray]';
      }
      if (expectedLength != null && value.length != expectedLength) {
        return '[expected JsonArray with length ' + expectedLength + ']';
      }
      return value;
    });
  }

  /**
   * Expect value is array with unique items
   */
  static uniqueItems(): ValueMatcher {
    return valueMatcher('uniqueItems', (value) => {
      if (!MatcherUtils.isArray(value)) {
        return '[expected JsonArray]';
      }
      let nonUniqueItems = new Set<any>();
      value.forEach((item, index) => {
        if (index != value.indexOf(item)) {
          nonUniqueItems.add(item);
        }
      });
      if (nonUniqueItems.size > 0) {
        let data = {
          allItems: value,
          duplicatedItems: [...nonUniqueItems],
        };
        throw new Error(`Items is not unique: ` + JSON.stringify(data, null, 2));
      }
    });
  }

  /**
   * Expect value is any array which is not containing [args]
   */
  static anyArrayNotContaining(args: any[]) {
    return valueMatcher('anyArrayNotContaining', value => {
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
    return valueMatcher('arrayWithAllItemsMatch', value => {
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
    return valueMatcher('anyArrayContaining', value => {
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
    return valueMatcher('anyArrayContainingSome', value => {
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

  static arrayContainingOnly(args: any[]) {
    return matchAll(
      ArrayMatchers.any(args.length),
      ArrayMatchers.anyArrayContaining(...args),
    );
  }

}