import { Matchers } from '../../src';
import { validateMatchFail } from '../test-utils/validateMatchFail';
import { validateMatchSuccess } from '../test-utils/validateMatchSuccess';

describe('Matchers.absent()', () => {

  test('No value', () => {
    validateMatchSuccess({
      data: undefined,
      matchers: [
        Matchers.absent(),
      ],
    });
    validateMatchSuccess({
      data: {
        other: 123,
      },
      matchers: [
        {
          some: Matchers.absent(),
        },
      ],
    });
  });

  test('FAIL: null', () => {
    validateMatchFail({
      data: null,
      matchers: Matchers.absent(),
      errorMatch: undefined,
    });
  });

  test('FAIL: value', () => {
    validateMatchFail({
      data: 'string',
      matchers: Matchers.absent(),
      errorMatch: undefined,
    });
    validateMatchFail({
      data: 123,
      matchers: Matchers.absent(),
      errorMatch: undefined,
    });
    validateMatchFail({
      data: false,
      matchers: Matchers.absent(),
      errorMatch: undefined,
    });
  });

  test('FAIL: object', () => {
    validateMatchFail({
      data: { test: 1 },
      matchers: Matchers.absent(),
      errorMatch: undefined,
    });
  });

  test('FAIL: array', () => {
    validateMatchFail({
      data: [1, 2, 3],
      matchers: Matchers.absent(),
      errorMatch: undefined,
    });
  });

});