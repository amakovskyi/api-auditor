import { Matchers } from '../../src';
import { expectMatcherError, validateMatchFail, validateMatchFailArray } from '../test-utils/validateMatchFail';
import { validateMatchSuccessArray } from '../test-utils/validateMatchSuccess';
import { ValueMatcher } from '../../src/matcher/value.matcher';

describe('Matchers.boolean()', () => {

  test('Boolean', () => {
    validateMatchSuccessArray({
      dataArray: [
        true,
        false,
      ],
      matchers: [
        Matchers.boolean(),
        Matchers.boolean({ canBeNull: false }),
        Matchers.boolean({ canBeNull: true }),
        Matchers.boolean({ optional: false }),
        Matchers.boolean({ optional: true }),
      ],
    });
  });

  test('Null', () => {
    validateMatchSuccessArray({
      dataArray: [
        null,
        true,
        false,
      ],
      matchers: [
        Matchers.boolean({ canBeNull: true }),
        Matchers.boolean({ canBeNull: true, optional: false }),
        Matchers.boolean({ canBeNull: true, optional: true }),
      ],
    });
  });

  test('Optional ', () => {
    validateMatchSuccessArray({
      dataArray: [
        undefined,
        true,
        false,
      ],
      matchers: [
        Matchers.boolean({ optional: true }),
        Matchers.boolean({ optional: true, canBeNull: false }),
        Matchers.boolean({ optional: true, canBeNull: true }),
      ],
    });
  });

  test('FAIL: wrong type', () => {
    validateMatchFailArray({
      dataArray: [
        '',
        'test',
        '123',
        'random',
        123,
        [1, 2, 3],
        { test: 1 },
      ],
      matchers: [
        Matchers.boolean(),
        Matchers.boolean({ canBeNull: false }),
        Matchers.boolean({ canBeNull: true }),
        Matchers.boolean({ optional: false }),
        Matchers.boolean({ optional: true }),
      ],
      errorMatch: expectMatcherError('Expected value of type [boolean]'),
    });
  });

  test('FAIL: undefined', () => {
    validateMatchFail({
      data: undefined,
      matchers: Matchers.boolean(),
      errorMatch: expectMatcherError(ValueMatcher.VALUE_IS_REQUIRED),
    });
  });

  test('FAIL: value cannot be [null]', () => {
    validateMatchFail({
      data: null,
      matchers: Matchers.boolean(),
      errorMatch: expectMatcherError(ValueMatcher.VALUE_CANNOT_BE_NULL),
    });
  });

});