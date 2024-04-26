import { Matchers, Random } from '../../src';
import { expectMatcherError, validateMatchFail, validateMatchFailArray } from '../test-utils/validateMatchFail';
import { validateMatchSuccessArray } from '../test-utils/validateMatchSuccess';
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

  test('Null', () => {
    validateMatchSuccessArray({
      dataArray: [
        null,
        Random.uuid(),
        Random.uuid(),
      ],
      matchers: [
        Matchers.uuid({ canBeNull: true }),
        Matchers.uuid({ canBeNull: true, optional: true }),
      ],
    });
  });

  test('Optional ', () => {
    validateMatchSuccessArray({
      dataArray: [
        undefined,
        Random.uuid(),
        Random.uuid(),
      ],
      matchers: [
        Matchers.uuid({ optional: true }),
        Matchers.uuid({ optional: true, canBeNull: true }),
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

  test('FAIL: undefined', () => {
    validateMatchFail({
      data: undefined,
      matchers: Matchers.uuid(),
      errorMatch: expectMatcherError(ValueMatcher.VALUE_IS_REQUIRED),
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