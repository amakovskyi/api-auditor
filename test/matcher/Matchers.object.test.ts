import { Matchers } from '../../src';
import { expectMatcherError, validateMatchFail, validateMatchFailArray } from '../test-utils/validateMatchFail';
import { validateMatchSuccessArray } from '../test-utils/validateMatchSuccess';
import { ValueMatcher } from '../../src/matcher/value.matcher';

describe('Matchers.object()', () => {

  test('Some objects', () => {
    validateMatchSuccessArray({
      dataArray: [
        {},
        { test: 1 },
        { arraysSome: [1, 2, 3] },
      ],
      matchers: [
        Matchers.object(),
        Matchers.object({ canBeNull: false }),
        Matchers.object({ canBeNull: true }),
      ],
    });
  });

  test('Some objects or null', () => {
    validateMatchSuccessArray({
      dataArray: [
        null,
        {},
        { test: 1 },
        { arraysSome: [1, 2, 3] },
      ],
      matchers: [
        Matchers.object({ canBeNull: true }),
      ],
    });
  });

  test('Optional', () => {
    validateMatchSuccessArray({
      dataArray: [
        undefined,
        {},
        { test: 1 },
        { arraysSome: [1, 2, 3] },
      ],
      matchers: [
        Matchers.object({ optional: true }),
      ],
    });
  });

  test('Some objects with match', () => {
    validateMatchSuccessArray({
      dataArray: [
        { stringVal: '123', otherVal: '123' },
        { stringVal: 'str', otherVal: 999 },
        { stringVal: 'str', otherVal: [1, 2, 3] },
        { stringVal: 'str', otherVal: { test: 1 } },
        { stringVal: 'str', otherVal: { test: 1 }, somethingElse: 1 },
      ],
      matchers: [
        Matchers.object({
          match: {
            stringVal: Matchers.string(),
            otherVal: Matchers.anyNotNull(),
          },
        }),
      ],
    });
  });

  test('FAIL: undefined', () => {
    validateMatchFail({
      data: undefined,
      matchers: [
        Matchers.object(),
        Matchers.object({ canBeNull: false }),
        Matchers.object({ canBeNull: true }),
      ],
      errorMatch: expectMatcherError(ValueMatcher.VALUE_IS_REQUIRED),
    });
  });

  test('FAIL: null', () => {
    validateMatchFail({
      data: null,
      matchers: [
        Matchers.object(),
        Matchers.object({ canBeNull: false }),
        Matchers.object({ optional: false }),
        Matchers.object({ optional: true }),
        Matchers.object({ optional: false, canBeNull: false }),
        Matchers.object({ optional: true, canBeNull: false }),
        Matchers.object({ match: { test: 1 } }),
      ],
      errorMatch: expectMatcherError(ValueMatcher.VALUE_CANNOT_BE_NULL),
    });
  });

  test('FAIL: some values', () => {
    validateMatchFailArray({
      dataArray: [
        'string',
        123,
        true,
        [1, 2, 3],
      ],
      matchers: [
        Matchers.object(),
        Matchers.object({ canBeNull: false }),
        Matchers.object({ canBeNull: true }),
        Matchers.object({ optional: false }),
        Matchers.object({ optional: true }),
        Matchers.object({ optional: false, canBeNull: false }),
        Matchers.object({ optional: true, canBeNull: false }),
        Matchers.object({ optional: false, canBeNull: true }),
        Matchers.object({ optional: true, canBeNull: true }),
        Matchers.object({ match: { test: 1 } }),
      ],
      errorMatch: expectMatcherError('Expected value of type [JsonObject]'),
    });
  });

  test('FAIL: Some objects with match', () => {
    validateMatchFail({
      data: {
        stringVal: 123,
        otherVal: '123',
      },
      matchers: Matchers.object({
        match: {
          stringVal: Matchers.string(),
          otherVal: Matchers.anyNotNull(),
        },
      }),
      errorMatch: {
        stringVal: {
          matcher: 'Matchers.string',
          message: 'Expected value of type [string]',
        },
        otherVal: '123',
      },
    });
  });

});