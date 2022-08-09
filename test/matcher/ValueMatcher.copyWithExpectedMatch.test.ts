import { ArrayMatchers, Matchers } from '../../src';
import { validateMatchResult } from '../test-utils/validateMatchResult';

describe('ValueMatcher.copyWithExpectedMatch()', () => {

  test('string -> string', () => {
    validateMatchResult({
      data: 'test',
      match: 'test',
      expectedResult: 'test',
    });
  });

  test('string -> Matchers.string()', () => {
    validateMatchResult({
      data: 'test',
      match: Matchers.string(),
      expectedResult: 'test',
    });
  });

  test('number -> Matchers.string()', () => {
    validateMatchResult({
      data: 123,
      match: Matchers.string(),
      expectedResult: {
        matcher: 'Matchers.string',
        message: 'Expected value of type [string]',
      },
    });
  });

  test('empty string -> Matchers.string()', () => {
    validateMatchResult({
      data: '',
      match: Matchers.string(),
      expectedResult: {
        matcher: 'Matchers.string',
        message: 'Value cannot be empty',
      },
    });
  });

  test('object -> object: 1', () => {
    validateMatchResult({
      data: {
        one: 1,
        two: 2,
      },
      match: {
        one: Matchers.number(),
      },
      expectedResult: {
        one: 1,
        two: 2,
      },
    });
  });

  test('object -> object: 2', () => {
    validateMatchResult({
      data: {
        one: 1,
        two: 2,
      },
      match: {
        one: 3,
      },
      expectedResult: {
        one: 3,
        two: 2,
      },
    });
  });

  test('array -> array: 1', () => {
    validateMatchResult({
      data: [1, 2, 3],
      match: [1, 2, 3],
      expectedResult: [1, 2, 3],
    });
  });

  test('array -> array: 2', () => {
    validateMatchResult({
      data: [1, 2, 3],
      match: ArrayMatchers.any({ expectedLength: 3 }),
      expectedResult: [1, 2, 3],
    });
  });

  test('array -> array: 3', () => {
    validateMatchResult({
      data: [1, 2, 3],
      match: [1, 2, 4],
      expectedResult: [1, 2, 4],
    });
  });

  test('array -> array: 4', () => {
    validateMatchResult({
      data: [1, 2, 3],
      match: [1, 2, 3, 4],
      expectedResult: [1, 2, 3, 4],
    });
  });

  test('array -> ArrayMatchers.any()', () => {
    validateMatchResult({
      data: [1, 2, 3],
      match: ArrayMatchers.any(),
      expectedResult: [1, 2, 3],
    });
  });

  test('number -> Matcher.number()', () => {
    validateMatchResult({
      data: 1,
      match: Matchers.number(),
      expectedResult: 1,
    });
  });

});