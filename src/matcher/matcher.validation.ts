import { isDeepStrictEqual } from 'util';
import { ValueMatcher, valueMatcher } from './value.matcher';

/**
 * In comparison with strict equation this method validates that [data] contain all information as specified in [expected],
 * but [data] itself CAN contain other information which is not noticed in [expected] and that information will not cause
 * fail.
 */
export function validateMatch(data: any, match: any) {
  let dataAsExpected = ValueMatcher.copyWithExpectedMatch(data, match);
  expect(data).toEqual(dataAsExpected);
}

export function matchAll(matchesArray: any[]) {
  return valueMatcher('matchAll', null, value => {
    for (let match of matchesArray) {
      if (match instanceof ValueMatcher) {
        let expectationResponse = match.testValue(value);
        if (!isDeepStrictEqual(value, expectationResponse)) {
          throw new Error('TODO');
          // return ValueMatcher.error();
        }
      } else {
        let result = ValueMatcher.copyWithExpectedMatch(value, match);
        if (!isDeepStrictEqual(value, result)) {
          return ValueMatcher.value(result);
        }
      }
    }
    return ValueMatcher.success();
  });
}

export function matchAny(...matchesArray: any) {
  return valueMatcher('matchAny', null, value => {
    for (let match of matchesArray) {
      if (match instanceof ValueMatcher) {
        let expectationResponse = match.testValue(value);
        if (isDeepStrictEqual(value, expectationResponse)) {
          return value;
        }
      } else {
        let result = ValueMatcher.copyWithExpectedMatch(value, match);
        if (isDeepStrictEqual(value, result)) {
          return value;
        }
      }
    }
    return {
      error: 'No matches found in array with expected items',
      expected: matchesArray,
    };
  });
}


