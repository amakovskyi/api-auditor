import { Matchers, Random } from '../../src';
import { validateMatchFail, validateMatchFailArray } from '../test-utils/validateMatchFail';
import { validateMatchSuccess, validateMatchSuccessArray } from '../test-utils/validateMatchSuccess';

describe('Matchers.uuid()', () => {

  test('Correct uuids', () => {
    validateMatchSuccessArray({
      dataArray: [
        Random.uuid(),
        Random.uuid(),
        Random.uuid(),
        Random.uuid(),
        Random.uuid(),
      ],
      matchers: [
        Matchers.uuid(),
        Matchers.uuid({ canBeNull: false }),
        Matchers.uuid({ canBeNull: true }),
      ],
    });
  });

  test('Null value', () => {
    validateMatchSuccess({
      data: null,
      matchers: [
        Matchers.uuid({ canBeNull: true }),
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
        data: Matchers.string(),
      },
      errorMatch: {
        data: {
          matcher: 'Matchers.string',
          message: '[string] value expected',
        },
      },
    });
  });

  test('FAIL: some not-uuid strings and other values', () => {
    validateMatchFailArray({
      dataArray: [
        '',
        'test',
        '123',
        'random',
        123,
        true,
        [1, 2, 3],
        { test: 1 },
      ],
      match: Matchers.uuid(),
      errorMatch: {
        matcher: 'Matchers.uuid',
        message: '[uuid] value expected',
      },
    });
  });

  test('FAIL: value cannot be [null]', () => {
    validateMatchFail({
      data: null,
      match: Matchers.uuid(),
      errorMatch: {
        matcher: 'Matchers.uuid',
        message: 'value cannot be [null]',
      },
    });
  });

});