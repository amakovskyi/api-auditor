import { ConsoleLogger, Matchers } from '../../src';
import { validateMatchResult } from '../test-utils/validateMatchResult';
import { ValueMatcher } from '../../src/matcher/value.matcher';

describe('ValueMatcher.copyWithExpectedMatch()', () => {

  test('String', () => {
    validateMatchResult({
      data: 'test',
      match: 'test',
      expectedResult: 'test',
    });
    validateMatchResult({
      data: 'test',
      match: Matchers.string(),
      expectedResult: 'test',
    });
    validateMatchResult({
      data: 123,
      match: Matchers.string(),
      expectedResult: {
        matcher: 'Matchers.anyString',
        message: '[string] value expected',
      },
    });
    validateMatchResult({
      data: '',
      match: Matchers.string(),
      expectedResult: {
        matcher: 'Matchers.anyString',
        message: 'value cannot be empty',
      },
    });
  });

  test('asdfsdaf', () => {
    let result = ValueMatcher.copyWithExpectedMatch('', Matchers.string());
    ConsoleLogger.log(JSON.stringify(result, null, 2));
  });

});