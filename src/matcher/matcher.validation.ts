import { ValueMatcher, valueMatcher } from './value.matcher';
import { MatcherUtils } from './matcher.utils';

/**
 * In comparison with strict equation this method validates that [data] contain all information as specified in [expected],
 * but [data] itself CAN contain other information which is not noticed in [expected] and that information will not cause
 * fail.
 */
export function validateMatch(data: any, expectedMatch: any) {
  let dataAsExpected = ValueMatcher.copyWithExpectedMatch(data, expectedMatch);
  if (!MatcherUtils.isFullyEquals(data, dataAsExpected)) {
    expect(data).toEqual(dataAsExpected);
  }
}

export function matchAll(expectedMatches: any[]) {
  return valueMatcher('matchAll', null, value => {
    for (let match of expectedMatches) {
      let matchResult = ValueMatcher.copyWithExpectedMatch(value, match);
      if (!MatcherUtils.isFullyEquals(value, matchResult)) {
        return ValueMatcher.value(matchResult);
      }
    }
    return ValueMatcher.success();
  });
}

export function matchAny(expectedMatches: any[]) {
  return valueMatcher('matchAny', null, value => {
    if (expectedMatches.length == 0) {
      return ValueMatcher.success();
    }
    for (let match of expectedMatches) {
      let matchResult = ValueMatcher.copyWithExpectedMatch(value, match);
      if (MatcherUtils.isFullyEquals(value, matchResult)) {
        return ValueMatcher.success();
      }
    }
    return ValueMatcher.error('No matches found');
  });
}


