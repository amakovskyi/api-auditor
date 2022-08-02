import { Matchers } from '../../src';
import { validateMatchFail } from '../test-utils/validateMatchFail';
import { validateMatchSuccessArray } from '../test-utils/validateMatchSuccess';

describe('Matchers.anyDefined()', () => {

  test('Any values', () => {
    validateMatchSuccessArray({
      dataArray: [
        null,
        'string',
        123,
        true,
        { test: 1 },
        [1, 2, 3],
      ],
      matchers: [
        Matchers.anyDefined(),
      ],
    });
  });

  test('FAIL: undefined', () => {
    validateMatchFail({
      data: undefined,
      match: Matchers.anyDefined(),
      errorMatch: {
        matcher: 'Matchers.anyDefined',
        message: 'Expected any defined value',
      },
    });
  });

});