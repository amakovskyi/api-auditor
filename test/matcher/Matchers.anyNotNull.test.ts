import { Matchers } from '../../src';
import { validateMatchFail } from '../test-utils/validateMatchFail';
import { validateMatchSuccessArray } from '../test-utils/validateMatchSuccess';

describe('Matchers.anyNotNull()', () => {

  test('Any values', () => {
    validateMatchSuccessArray({
      dataArray: [
        'string',
        123,
        true,
        { test: 1 },
        [1, 2, 3],
      ],
      matchers: [
        Matchers.anyNotNull(),
      ],
    });
  });

  test('FAIL: undefined', () => {
    validateMatchFail({
      data: undefined,
      match: Matchers.anyNotNull(),
      errorMatch: {
        matcher: 'Matchers.anyNotNull',
        message: 'Expected some value',
      },
    });
  });

  test('FAIL: null', () => {
    validateMatchFail({
      data: null,
      match: Matchers.anyNotNull(),
      errorMatch: {
        matcher: 'Matchers.anyNotNull',
        message: 'Expected value is not null',
      },
    });
  });

});