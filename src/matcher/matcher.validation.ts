import { ValueMatcher, valueMatcher } from './value.matcher';
import { MatcherUtils } from './matcher.utils';

/**
 * In comparison with strict equation this method validates that [data] contain all information as specified in [expected],
 * but [data] itself CAN contain other information which is not noticed in [expected] and that information will not cause
 * fail.
 */
export function validateMatch(data: any, match: any) {
  let dataAsExpected = ValueMatcher.copyWithExpectedMatch(data, match);
  if (!MatcherUtils.isFullyEquals(data, dataAsExpected)) {
    expect(data).toEqual(dataAsExpected);
  }
}

export function matchAll(matches: any[]) {
  return valueMatcher('matchAll', null, value => {
    for (let match of matches) {
      let matchResult = ValueMatcher.copyWithExpectedMatch(value, match);
      if (!MatcherUtils.isFullyEquals(value, matchResult)) {
        return ValueMatcher.value(matchResult);
      }
    }
    return ValueMatcher.success();
  });
}

export function matchAny(matches: any[]) {
  return valueMatcher('matchAny', null, value => {
    if (matches.length == 0) {
      return ValueMatcher.success();
    }
    for (let match of matches) {
      let matchResult = ValueMatcher.copyWithExpectedMatch(value, match);
      if (MatcherUtils.isFullyEquals(value, matchResult)) {
        return ValueMatcher.success();
      }
    }
    return ValueMatcher.error('No matches found');
  });
}


