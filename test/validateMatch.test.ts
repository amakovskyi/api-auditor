import { Matchers, validateMatch } from '../src';
import { validateMatchFail } from './test-utils/validateMatchFail';

describe('validateMatch', () => {

  test('Simple', () => {
    validateMatchFail({
      data: {
        value: 123,
      },
      match: {
        value: Matchers.anyString(),
      },
      errorMatch: {
        value: {
          matcher: 'anyString',
          message: '[string] value expected',
        },
      },
    });
  });

  test('Error', () => {
    validateMatch({
      data: 123,
    }, {
      data: Matchers.anyString(),
    });
  });

  test('Complex', () => {
    validateMatch({
      data: 'someString',
    }, {
      data: Matchers.anyBoolean(),
    });
  });

});