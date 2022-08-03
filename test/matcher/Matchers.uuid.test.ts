import { Matchers, Random } from '../../src';
import { expectMatcherError, validateMatchFail, validateMatchFailArray } from '../test-utils/validateMatchFail';
import { validateMatchSuccess, validateMatchSuccessArray } from '../test-utils/validateMatchSuccess';
import { ValueMatcher } from '../../src/matcher/value.matcher';

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
      matchers: [
        Matchers.uuid(),
        Matchers.uuid({ canBeNull: false }),
        Matchers.uuid({ canBeNull: true }),
        Matchers.uuid({ optional: false }),
        Matchers.uuid({ optional: true }),
      ],
      errorMatch: expectMatcherError('Expected value of type [uuid]'),
    });
  });

  test('FAIL: value cannot be [null]', () => {
    validateMatchFail({
      data: null,
      matchers: Matchers.uuid(),
      errorMatch: expectMatcherError(ValueMatcher.VALUE_CANNOT_BE_NULL),
    });
  });

});