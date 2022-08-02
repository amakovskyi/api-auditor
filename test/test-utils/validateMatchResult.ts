import { ValueMatcher } from '../../src/matcher/value.matcher';

export function validateMatchResult(params: {
  data: any,
  match: any,
  expectedResult: any
}) {
  let result = ValueMatcher.copyWithExpectedMatch(params.data, params.match);
  expect(result).toEqual(params.expectedResult);
}