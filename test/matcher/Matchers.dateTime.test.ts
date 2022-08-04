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
        Matchers.dateTime(),
        Matchers.dateTime({ canBeNull: false }),
        Matchers.dateTime({ canBeNull: true }),
        Matchers.dateTime({ optional: false }),
        Matchers.dateTime({ optional: true }),
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
        Matchers.dateTime({ canBeNull: true }),
        Matchers.dateTime({ canBeNull: true, optional: false }),
        Matchers.dateTime({ canBeNull: true, optional: true }),
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
        Matchers.dateTime({ optional: true }),
        Matchers.dateTime({ optional: true, canBeNull: false }),
        Matchers.dateTime({ optional: true, canBeNull: true }),
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
        Matchers.dateTime(),
        Matchers.dateTime({ canBeNull: false }),
        Matchers.dateTime({ canBeNull: true }),
        Matchers.dateTime({ optional: false }),
        Matchers.dateTime({ optional: true }),
      ],
      errorMatch: expectMatcherError('Expected value of type [Date|string-ISO-date]'),
    });
  });

  test('FAIL: undefined', () => {
    validateMatchFail({
      data: undefined,
      matchers: Matchers.dateTime(),
      errorMatch: expectMatcherError(ValueMatcher.VALUE_IS_REQUIRED),
    });
  });

  test('FAIL: null', () => {
    validateMatchFail({
      data: null,
      matchers: Matchers.dateTime(),
      errorMatch: expectMatcherError(ValueMatcher.VALUE_CANNOT_BE_NULL),
    });
  });

});