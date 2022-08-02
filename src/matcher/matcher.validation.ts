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

export function matchAll(...matchesArray: any) {
  return valueMatcher('matchAll', value => {
    for (let match of matchesArray) {
      if (match instanceof ValueMatcher) {
        let expectationResponse = match.testValue(value);
        if (!isDeepStrictEqual(value, expectationResponse)) {
          return expectationResponse;
        }
      } else {
        let result = ValueMatcher.copyWithExpectedMatch(value, match);
        if (!isDeepStrictEqual(value, result)) {
          return result;
        }
      }
    }
    return value;
  });
}

export function matchAny(...matchesArray: any) {
  return valueMatcher('matchAny', value => {
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


