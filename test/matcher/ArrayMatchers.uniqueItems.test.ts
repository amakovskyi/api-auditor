import { ArrayMatchers } from '../../src';
import { expectMatcherError, validateMatchFail, validateMatchFailArray } from '../test-utils/validateMatchFail';
import { validateMatchSuccessArray } from '../test-utils/validateMatchSuccess';
import { ValueMatcher } from '../../src/matcher/value.matcher';

describe('ArrayMatchers.uniqueItems()', () => {

  test('Success', () => {
    validateMatchSuccessArray({
      dataArray: [
        [],
        [1, 2, 3, 4, 5],
        ['one', 'two', 'three', 'four', ' five'],
        [[], {}, undefined, null],
        [[1], [1, 2], [1, 2, 3]],
        [{ test: 1 }, { test: 2 }, { test: 3 }],
      ],
      matchers: [
        ArrayMatchers.uniqueItems(),
        ArrayMatchers.uniqueItems({ requireNotEmpty: false }),
        ArrayMatchers.uniqueItems({ canBeNull: true }),
        ArrayMatchers.uniqueItems({ canBeNull: true, optional: true }),
      ],
    });
  });

  test('Null', () => {
    validateMatchSuccessArray({
      dataArray: [
        null,
        [],
        [1, 2, 3, 4, 5],
        ['one', 'two', 'three', 'four', ' five'],
        [[], {}, undefined, null],
        [[1], [1, 2], [1, 2, 3]],
        [{ test: 1 }, { test: 2 }, { test: 3 }],
      ],
      matchers: [
        ArrayMatchers.uniqueItems({ canBeNull: true }),
        ArrayMatchers.uniqueItems({ canBeNull: true, optional: true }),
        ArrayMatchers.uniqueItems({ canBeNull: true, requireNotEmpty: false }),
      ],
    });
  });

  test('Undefined', () => {
    validateMatchSuccessArray({
      dataArray: [
        undefined,
        [],
        [1, 2, 3, 4, 5],
        ['one', 'two', 'three', 'four', ' five'],
        [[], {}, undefined, null],
        [[1], [1, 2], [1, 2, 3]],
        [{ test: 1 }, { test: 2 }, { test: 3 }],
      ],
      matchers: [
        ArrayMatchers.uniqueItems({ optional: true }),
        ArrayMatchers.uniqueItems({ optional: true, canBeNull: true }),
        ArrayMatchers.uniqueItems({ optional: true, requireNotEmpty: false }),
      ],
    });
  });

  test('FAIL: requireNotEmpty', () => {
    validateMatchFail({
      data: [],
      matchers: [
        ArrayMatchers.uniqueItems({ requireNotEmpty: true }),
        ArrayMatchers.uniqueItems({ optional: true, requireNotEmpty: true }),
        ArrayMatchers.uniqueItems({ canBeNull: true, requireNotEmpty: true }),
      ],
      errorMatch: expectMatcherError('[JsonArray] should be not empty'),
    });
  });

  test('FAIL: Null', () => {
    validateMatchFail({
      data: null,
      matchers: [
        ArrayMatchers.uniqueItems(),
        ArrayMatchers.uniqueItems({ canBeNull: false }),
        ArrayMatchers.uniqueItems({ requireNotEmpty: true }),
        ArrayMatchers.uniqueItems({ optional: true }),
      ],
      errorMatch: expectMatcherError(ValueMatcher.VALUE_CANNOT_BE_NULL),
    });
  });

  test('FAIL: Undefined', () => {
    validateMatchFail({
      data: undefined,
      matchers: [
        ArrayMatchers.uniqueItems(),
        ArrayMatchers.uniqueItems({ optional: false }),
        ArrayMatchers.uniqueItems({ requireNotEmpty: true }),
        ArrayMatchers.uniqueItems({ canBeNull: true }),
      ],
      errorMatch: expectMatcherError(ValueMatcher.VALUE_IS_REQUIRED),
    });
  });

  test('FAIL: not an array', () => {
    validateMatchFailArray({
      dataArray: [
        1,
        'test',
        true,
        { test: 1 },
      ],
      matchers: [
        ArrayMatchers.uniqueItems(),
        ArrayMatchers.uniqueItems({ requireNotEmpty: true }),
        ArrayMatchers.uniqueItems({ optional: true }),
      ],
      errorMatch: expectMatcherError('Expected value of type [JsonArray]'),
    });
  });

  test('FAIL: duplicate undefined', () => {
    validateMatchFail({
      data: [
        1,
        2,
        undefined,
        4,
        undefined,
      ],
      matchers: [
        ArrayMatchers.uniqueItems(),
      ],
      errorMatch: [
        1,
        2,
        {
          matcher: 'ArrayMatchers.uniqueItems',
          message: 'Item is duplicated',
          item: undefined,
        },
        4,
        {
          matcher: 'ArrayMatchers.uniqueItems',
          message: 'Item is duplicated',
          item: undefined,
        },
      ],
    });
  });

  test('FAIL: duplicate nulls', () => {
    validateMatchFail({
      data: [
        1,
        2,
        null,
        4,
        null,
      ],
      matchers: [
        ArrayMatchers.uniqueItems(),
      ],
      errorMatch: [
        1,
        2,
        {
          matcher: 'ArrayMatchers.uniqueItems',
          message: 'Item is duplicated',
          item: null,
        },
        4,
        {
          matcher: 'ArrayMatchers.uniqueItems',
          message: 'Item is duplicated',
          item: null,
        },
      ],
    });
  });

  test('FAIL: duplicate strings', () => {
    validateMatchFail({
      data: [
        'one',
        'two',
        'string',
        'four',
        'string',
      ],
      matchers: [
        ArrayMatchers.uniqueItems(),
      ],
      errorMatch: [
        'one',
        'two',
        {
          matcher: 'ArrayMatchers.uniqueItems',
          message: 'Item is duplicated',
          item: 'string',
        },
        'four',
        {
          matcher: 'ArrayMatchers.uniqueItems',
          message: 'Item is duplicated',
          item: 'string',
        },
      ],
    });
  });

  test('FAIL: duplicate booleans', () => {
    validateMatchFail({
      data: [
        false,
        true,
        false,
      ],
      matchers: [
        ArrayMatchers.uniqueItems(),
      ],
      errorMatch: [
        {
          matcher: 'ArrayMatchers.uniqueItems',
          message: 'Item is duplicated',
          item: false,
        },
        true,
        {
          matcher: 'ArrayMatchers.uniqueItems',
          message: 'Item is duplicated',
          item: false,
        },
      ],
    });
  });

  test('FAIL: duplicate objects', () => {
    validateMatchFail({
      data: [
        { test: 1 },
        { test: 2 },
        { test: 'duplicate' },
        { test: 4 },
        { test: 'duplicate' },
      ],
      matchers: [
        ArrayMatchers.uniqueItems(),
      ],
      errorMatch: [
        { test: 1 },
        { test: 2 },
        {
          matcher: 'ArrayMatchers.uniqueItems',
          message: 'Item is duplicated',
          item: { test: 'duplicate' },
        },
        { test: 4 },
        {
          matcher: 'ArrayMatchers.uniqueItems',
          message: 'Item is duplicated',
          item: { test: 'duplicate' },
        },
      ],
    });
  });

  test('FAIL: duplicate arrays', () => {
    validateMatchFail({
      data: [
        [1, 2],
        [3, 4],
        [5, 6, 7],
        [8, 7],
        [5, 6, 7],
      ],
      matchers: [
        ArrayMatchers.uniqueItems(),
      ],
      errorMatch: [
        [1, 2],
        [3, 4],
        {
          matcher: 'ArrayMatchers.uniqueItems',
          message: 'Item is duplicated',
          item: [5, 6, 7],
        },
        [8, 7],
        {
          matcher: 'ArrayMatchers.uniqueItems',
          message: 'Item is duplicated',
          item: [5, 6, 7],
        },
      ],
    });
  });

  test('FAIL: Multi duplication', () => {
    validateMatchFail({
      data: [
        1,
        2, // duplicate
        3,
        'one',
        ['duplicate'], // duplicate
        true, // duplicate
        'two', // duplicate
        { test: 1 },
        { test: 'duplicate' }, // duplicate
        [1, 2, 3],
        ['duplicate'], // duplicate
        2, // duplicate
        false,
        { test: 'duplicate' }, // duplicate
        true, // duplicate
        'two', // duplicate
      ],
      matchers: [
        ArrayMatchers.uniqueItems(),
      ],
      errorMatch: [
        1,
        {
          matcher: 'ArrayMatchers.uniqueItems',
          message: 'Item is duplicated',
          item: 2,
        },
        3,
        'one',
        {
          matcher: 'ArrayMatchers.uniqueItems',
          message: 'Item is duplicated',
          item: ['duplicate'],
        },
        {
          matcher: 'ArrayMatchers.uniqueItems',
          message: 'Item is duplicated',
          item: true,
        },
        {
          matcher: 'ArrayMatchers.uniqueItems',
          message: 'Item is duplicated',
          item: 'two',
        },
        { test: 1 },
        {
          matcher: 'ArrayMatchers.uniqueItems',
          message: 'Item is duplicated',
          item: { test: 'duplicate' },
        },
        [1, 2, 3],
        {
          matcher: 'ArrayMatchers.uniqueItems',
          message: 'Item is duplicated',
          item: ['duplicate'],
        },
        {
          matcher: 'ArrayMatchers.uniqueItems',
          message: 'Item is duplicated',
          item: 2,
        },
        false,
        {
          matcher: 'ArrayMatchers.uniqueItems',
          message: 'Item is duplicated',
          item: { test: 'duplicate' },
        },
        {
          matcher: 'ArrayMatchers.uniqueItems',
          message: 'Item is duplicated',
          item: true,
        },
        {
          matcher: 'ArrayMatchers.uniqueItems',
          message: 'Item is duplicated',
          item: 'two',
        },
      ],
    });
  });

});