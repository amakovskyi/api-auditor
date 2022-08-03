import { Matchers } from '../../src';
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

});