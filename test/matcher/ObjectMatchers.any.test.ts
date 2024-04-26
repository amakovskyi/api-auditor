import { Matchers, ObjectMatchers } from '../../src';
import { expectMatcherError, validateMatchFail, validateMatchFailArray } from '../test-utils/validateMatchFail';
import { validateMatchSuccessArray } from '../test-utils/validateMatchSuccess';
import { ValueMatcher } from '../../src/matcher/value.matcher';

describe('ObjectMatchers.any()', () => {

  test('Some objects', () => {
    validateMatchSuccessArray({
      dataArray: [
        {},
        { test: 1 },
        { arraysSome: [1, 2, 3] },
      ],
      matchers: [
        ObjectMatchers.any(),
        ObjectMatchers.any(null, { canBeNull: false }),
        ObjectMatchers.any(null, { canBeNull: true }),
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
        ObjectMatchers.any(null, { canBeNull: true }),
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
        ObjectMatchers.any(null, { optional: true }),
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
        ObjectMatchers.any({
          stringVal: Matchers.string(),
          otherVal: Matchers.anyNotNull(),
        }),
      ],
    });
  });

  test('FAIL: undefined', () => {
    validateMatchFail({
      data: undefined,
      matchers: [
        ObjectMatchers.any(),
        ObjectMatchers.any(null, { canBeNull: false }),
        ObjectMatchers.any(null, { canBeNull: true }),
      ],
      errorMatch: expectMatcherError(ValueMatcher.VALUE_IS_REQUIRED),
    });
  });

  test('FAIL: null', () => {
    validateMatchFail({
      data: null,
      matchers: [
        ObjectMatchers.any(),
        ObjectMatchers.any(null, { canBeNull: false }),
        ObjectMatchers.any(null, { optional: false }),
        ObjectMatchers.any(null, { optional: true }),
        ObjectMatchers.any(null, { optional: false, canBeNull: false }),
        ObjectMatchers.any(null, { optional: true, canBeNull: false }),
        ObjectMatchers.any({ test: 1 }),
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
        ObjectMatchers.any(),
        ObjectMatchers.any(null, { canBeNull: false }),
        ObjectMatchers.any(null, { canBeNull: true }),
        ObjectMatchers.any(null, { optional: false }),
        ObjectMatchers.any(null, { optional: true }),
        ObjectMatchers.any(null,  { optional: false, canBeNull: false }),
        ObjectMatchers.any(null, { optional: true, canBeNull: false }),
        ObjectMatchers.any(null, { optional: false, canBeNull: true }),
        ObjectMatchers.any(null, { optional: true, canBeNull: true }),
        ObjectMatchers.any({ test: 1 } ),
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
      matchers: ObjectMatchers.any({
        stringVal: Matchers.string(),
        otherVal: Matchers.anyNotNull(),
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