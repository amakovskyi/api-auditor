import { ArrayMatchers, Matchers, ObjectMatchers } from '../../src';
import { expectMatcherError, validateMatchFail, validateMatchFailArray } from '../test-utils/validateMatchFail';
import { validateMatchSuccess, validateMatchSuccessArray } from '../test-utils/validateMatchSuccess';
import { ValueMatcher } from '../../src/matcher/value.matcher';

describe('ArrayMatchers.any()', () => {

  test('Any arrays', () => {
    validateMatchSuccessArray({
      dataArray: [
        [],
        [1, 2, 3, 4, 5],
        [{ text: 'text' }],
      ],
      matchers: [
        ArrayMatchers.any(),
        ArrayMatchers.any({ canBeNull: false }),
        ArrayMatchers.any({ canBeNull: true }),
      ],
    });
  });

  test('Null', () => {
    validateMatchSuccessArray({
      dataArray: [
        null,
        [],
        [1, 2, 3, 4, 5],
        [{ text: 'text' }],
      ],
      matchers: [
        ArrayMatchers.any({ canBeNull: true }),
      ],
    });
  });

  test('Optional', () => {
    validateMatchSuccessArray({
      dataArray: [
        undefined,
        [],
        [1, 2, 3, 4, 5],
        [{ text: 'text' }],
      ],
      matchers: [
        ArrayMatchers.any({ optional: true }),
      ],
    });
  });

  test('FAIL: requireNotEmpty', () => {
    validateMatchFail({
      data: [],
      matchers: [
        ArrayMatchers.any({ requireNotEmpty: true }),
        ArrayMatchers.any({ optional: true, requireNotEmpty: true }),
        ArrayMatchers.any({ canBeNull: true, requireNotEmpty: true }),
      ],
      errorMatch: expectMatcherError('[JsonArray] should be not empty'),
    });
  });

  test('FAIL: null', () => {
    validateMatchFail({
      data: null,
      matchers: [
        ArrayMatchers.any(),
        ArrayMatchers.any({ canBeNull: false }),
      ],
      errorMatch: expectMatcherError(ValueMatcher.VALUE_CANNOT_BE_NULL),
    });
  });

  test('FAIL: undefined', () => {
    validateMatchFail({
      data: undefined,
      matchers: [
        ArrayMatchers.any(),
        ArrayMatchers.any({ canBeNull: true }),
      ],
      errorMatch: expectMatcherError(ValueMatcher.VALUE_IS_REQUIRED),
    });
  });

  test('FAIL: Not an array', () => {
    validateMatchFailArray({
      dataArray: [
        'test',
        1,
        true,
        { test: 1 },
      ],
      matchers: [
        ArrayMatchers.any(),
        ArrayMatchers.any({ canBeNull: false }),
        ArrayMatchers.any({ canBeNull: true }),
        ArrayMatchers.any({ expectedLength: 10 }),
        ArrayMatchers.any({ canBeNull: false, expectedLength: 10 }),
        ArrayMatchers.any({ canBeNull: true, expectedLength: 10 }),
      ],
      errorMatch: expectMatcherError('Expected value of type [JsonArray]'),
    });
  });

  test('Expected number of items', () => {
    validateMatchSuccessArray({
      dataArray: [
        [1, 2, 3],
        ['one', 'two', 'three'],
        [[], [], []],
        [{}, {}, {}],
        [1, [], {}],
      ],
      matchers: [
        ArrayMatchers.any({ canBeNull: false, expectedLength: 3 }),
        ArrayMatchers.any({ canBeNull: true, expectedLength: 3 }),
        ArrayMatchers.any({ expectedLength: 3 }),
        ArrayMatchers.any({ optional: true, expectedLength: 3 }),
      ],
    });
  });

  test('FAIL: Expected number of items', () => {
    validateMatchFailArray({
      dataArray: [
        [],
        [1],
        [1, 2],
        [1, 2, 3, 4],
        [1, 2, 3, 4, 5],
        [1, 'two', ['three'], { index: 4 }],
      ],
      matchers: [
        ArrayMatchers.any({ canBeNull: false, expectedLength: 3 }),
        ArrayMatchers.any({ canBeNull: true, expectedLength: 3 }),
        ArrayMatchers.any({ expectedLength: 3 }),
        ArrayMatchers.any({ optional: true, expectedLength: 3 }),
      ],
      errorMatch: expectMatcherError('Expected [JsonArray] with length=3'),
    });
  });

  test('Item validation - Matchers.string())', () => {
    let itemMatch = Matchers.string();
    validateMatchSuccess({
      data: [
        'test',
        'string',
        'other',
      ],
      matchers: [
        ArrayMatchers.any({ canBeNull: false, itemMatch }),
        ArrayMatchers.any({ expectedLength: 3, itemMatch }),
        ArrayMatchers.any({ optional: false, itemMatch }),
      ],
    });
  });

  test('Item validation - Matchers.string(canBeNull: true))', () => {
    let itemMatch = Matchers.string({ canBeNull: true });
    validateMatchSuccess({
      data: [
        'test',
        null,
        'other',
      ],
      matchers: [
        ArrayMatchers.any({ canBeNull: false, itemMatch }),
        ArrayMatchers.any({ expectedLength: 3, itemMatch }),
        ArrayMatchers.any({ optional: false, itemMatch }),
      ],
    });
  });

  test('Item validation - ObjectMatchers.any())', () => {
    let itemMatch = ObjectMatchers.any({
      test: Matchers.anyDefined(),
    });
    validateMatchSuccess({
      data: [
        {
          test: 123,
        },
        {
          test: 'some string',
        },
        {
          test: null,
        },
      ],
      matchers: [
        ArrayMatchers.any({ canBeNull: false, itemMatch }),
        ArrayMatchers.any({ expectedLength: 3, itemMatch }),
        ArrayMatchers.any({ optional: false, itemMatch }),
      ],
    });
  });

  test('Item validation - ArrayMatchers.any({expectedLength: 3})', () => {
    let itemMatch = ArrayMatchers.any({ expectedLength: 3 });
    validateMatchSuccess({
      data: [
        [1, 2, 3],
        ['one', 'two', 'three'],
        [{ index: 1 }, { index: 2 }, { index: 3 }],
      ],
      matchers: [
        ArrayMatchers.any({ canBeNull: false, itemMatch }),
        ArrayMatchers.any({ expectedLength: 3, itemMatch }),
        ArrayMatchers.any({ optional: false, itemMatch }),
      ],
    });
  });

  test('FAIL: item validation - Matchers.string()', () => {
    validateMatchFail({
      data: [
        1,
        'test',
        { object: 1 },
      ],
      matchers: [
        ArrayMatchers.any({ itemMatch: Matchers.string() }),
        ArrayMatchers.any({ expectedLength: 3, itemMatch: Matchers.string() }),
        ArrayMatchers.any({ canBeNull: false, itemMatch: Matchers.string() }),
      ],
      errorMatch: [
        expectMatcherError('Expected value of type [string]', Matchers.string()),
        'test',
        expectMatcherError('Expected value of type [string]', Matchers.string()),
      ],
    });
  });

  test('FAIL: item validation - ObjectMatchers.any()', () => {
    validateMatchFail({
      data: [
        1,
        'test',
        { object: 1 },
      ],
      matchers: [
        ArrayMatchers.any({ itemMatch: ObjectMatchers.any() }),
        ArrayMatchers.any({ expectedLength: 3, itemMatch: ObjectMatchers.any() }),
        ArrayMatchers.any({ canBeNull: false, itemMatch: ObjectMatchers.any() }),
      ],
      errorMatch: [
        expectMatcherError('Expected value of type [JsonObject]', ObjectMatchers.any()),
        expectMatcherError('Expected value of type [JsonObject]', ObjectMatchers.any()),
        { object: 1 },
      ],
    });
  });

});