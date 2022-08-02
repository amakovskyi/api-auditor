import { Matchers } from '../../src';
import { validateMatchResult } from '../test-utils/validateMatchResult';

describe('ValueMatcher.copyWithExpectedMatch()', () => {

  test('String', () => {
    validateMatchResult({
      data: 'test',
      match: 'test',
      expectedResult: 'test',
    });
    validateMatchResult({
      data: 'test',
      match: Matchers.anyString(),
      expectedResult: 'test',
    });
    validateMatchResult({
      data: 123,
      match: Matchers.anyString(),
      expectedResult: {
        matcher: 'Matchers.anyString',
        message: '[string] value expected',
      },
    });
  });

});