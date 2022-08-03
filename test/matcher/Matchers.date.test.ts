import { Matchers } from '../../src';
import { expectMatcherError, validateMatchFail, validateMatchFailArray } from '../test-utils/validateMatchFail';
import { validateMatchSuccessArray } from '../test-utils/validateMatchSuccess';
import { ValueMatcher } from '../../src/matcher/value.matcher';

describe('Matchers.date()', () => {

  test('Date', () => {
    validateMatchSuccessArray({
      dataArray: [
        new Date(),
        new Date().toISOString(),
      ],
      matchers: [
        Matchers.date(),
        Matchers.date({ canBeNull: false }),
        Matchers.date({ canBeNull: true }),
        Matchers.date({ optional: false }),
        Matchers.date({ optional: true }),
      ],
    });
  });

  test('Null', () => {
    validateMatchSuccessArray({
      dataArray: [
        null,
        new Date(),
        new Date().toISOString(),
      ],
      matchers: [
        Matchers.date({ canBeNull: true }),
        Matchers.date({ canBeNull: true, optional: false }),
        Matchers.date({ canBeNull: true, optional: true }),
      ],
    });
  });

  test('Optional ', () => {
    validateMatchSuccessArray({
      dataArray: [
        undefined,
        new Date(),
        new Date().toISOString(),
      ],
      matchers: [
        Matchers.date({ optional: true }),
        Matchers.date({ optional: true, canBeNull: false }),
        Matchers.date({ optional: true, canBeNull: true }),
      ],
    });
  });

  test('FAIL: wrong type', () => {
    validateMatchFailArray({
      dataArray: [
        true,
        '',
        'test',
        '123',
        'random',
        123,
        [1, 2, 3],
        { test: 1 },
      ],
      matchers: [
        Matchers.date(),
        Matchers.date({ canBeNull: false }),
        Matchers.date({ canBeNull: true }),
        Matchers.date({ optional: false }),
        Matchers.date({ optional: true }),
      ],
      errorMatch: expectMatcherError('Expected value of type [Date|string-ISO-date]'),
    });
  });

  test('FAIL: undefined', () => {
    validateMatchFail({
      data: undefined,
      matchers: Matchers.date(),
      errorMatch: expectMatcherError(ValueMatcher.VALUE_IS_REQUIRED),
    });
  });

  test('FAIL: null', () => {
    validateMatchFail({
      data: null,
      matchers: Matchers.date(),
      errorMatch: expectMatcherError(ValueMatcher.VALUE_CANNOT_BE_NULL),
    });
  });

});