import { Matchers, Random } from '../../src';
import { validateMatchFailArray } from '../test-utils/validateMatchFail';
import { validateMatchSuccessArray } from '../test-utils/validateMatchSuccess';

describe('Matchers.anyString()', () => {

  test('Correct strings', () => {
    validateMatchSuccessArray({
      dataArray: [
        'someString',
        'test123',
        Random.string(12, 12),
      ],
      matchers: [
        Matchers.anyString(),
        Matchers.anyString({ canBeNull: true }),
        Matchers.anyString({ canBeEmpty: true }),
        Matchers.anyString({ canBeNull: true, canBeEmpty: true }),
        Matchers.anyString({ canBeNull: false }),
        Matchers.anyString({ canBeEmpty: false }),
        Matchers.anyString({ canBeNull: false, canBeEmpty: false }),
      ],
    });
  });

  test('FAIL: [string] value expected', () => {
    validateMatchFailArray({
      dataArray: [
        { data: 123 },
        { data: true },
        { data: [1, 2, 3] },
        { data: { test: 'object' } },
      ],
      match: {
        data: Matchers.anyString(),
      },
      errorMatch: {
        data: {
          matcher: 'Matchers.anyString',
          message: '[string] value expected',
        },
      },
    });
  });

});