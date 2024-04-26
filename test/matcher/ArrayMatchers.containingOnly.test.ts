import { ArrayMatchers, Matchers, ObjectMatchers, Random } from '../../src';
import { expectMatcherError, validateMatchFail } from '../test-utils/validateMatchFail';
import { validateMatchSuccess } from '../test-utils/validateMatchSuccess';
import { ValueMatcher } from '../../src/matcher/value.matcher';

describe('ArrayMatchers.containingOnly()', () => {

  test('SUCCESS', () => {
    validateMatchSuccess({
      data: [
        123,
        999,
        'one',
        true,
        Random.uuid(),
      ],
      matchers: [
        ArrayMatchers.containingOnly([
          'one',
          Matchers.uuid(),
          Matchers.boolean(),
          123,
          999,
          'some',
          'other',
        ]),
      ],
    });
  });

  test('SUCCESS: objects', () => {
    validateMatchSuccess({
      data: [
        { value: 1, test: 'string' },
        { value: 2, test: 'boolean' },
        { value: 3, test: 'date' },
      ],
      matchers: [
        ArrayMatchers.containingOnly([
          { value: 1 },
          { value: 2 },
          { value: 3 },
          { value: 4 },
          { value: 5 },
        ]),
        ArrayMatchers.containingOnly([
          { value: Matchers.number(), test: 'string' },
          { value: Matchers.number(), test: 'boolean' },
          { value: Matchers.number(), test: 'date' },
          { value: Matchers.number(), test: 'some' },
          { value: Matchers.number(), test: 'other' },
        ]),
      ],
    });
  });

  test('SUCCESS: arrays', () => {
    validateMatchSuccess({
      data: [
        [1, 2],
        [3, 4, 5],
        [6, 7, 8, 9],
      ],
      matchers: [
        ArrayMatchers.containingOnly([
          [1, 2],
          [3, 4, 5],
          [6, 7, 8, 9],
        ]),
        ArrayMatchers.containingOnly([
          ArrayMatchers.any({ expectedLength: 2, itemMatch: Matchers.number() }),
          ArrayMatchers.any({ expectedLength: 3, itemMatch: Matchers.number() }),
          ArrayMatchers.any({ expectedLength: 4, itemMatch: Matchers.number() }),
          ArrayMatchers.any({ expectedLength: 5, itemMatch: Matchers.number() }),
          ArrayMatchers.any({ expectedLength: 6, itemMatch: Matchers.number() }),
        ]),
        ArrayMatchers.containingOnly([
          ArrayMatchers.containingAll([1]),
          ArrayMatchers.containingAll([5]),
          ArrayMatchers.containingAll([9]),
          ArrayMatchers.containingAll([12]),
          ArrayMatchers.containingAll([15]),
        ]),
      ],
    });
  });

  test('allowDuplicateMatch 1', () => {
    validateMatchSuccess({
      data: [
        1,
        123,
        999,
        'one',
        'other',
        true,
        false,
        Random.uuid(),
        Random.uuid(),
        Random.uuid(),
      ],
      matchers: [
        ArrayMatchers.containingOnly([
          Matchers.string(),
          Matchers.uuid(),
          Matchers.boolean(),
          Matchers.number(),
          ObjectMatchers.any(),
          12345678,
        ], {
          allowDuplicateMatch: true,
        }),
      ],
    });
  });

  test('allowDuplicateMatch 2', () => {
    validateMatchSuccess({
      data: [
        123,
        'other',
        true,
        Random.uuid(),
      ],
      matchers: [
        ArrayMatchers.containingOnly([
            Matchers.string(),
            Matchers.uuid(),
            Matchers.boolean(),
            Matchers.number(),
          ], {
            allowDuplicateMatch: true,
          },
        ),
        ArrayMatchers.containingOnly([
            123,
            'other',
            true,
            Matchers.uuid(),
          ], {
            allowDuplicateMatch: true,
          },
        ),
      ],
    });
  });

  test('requireAll', () => {
    validateMatchSuccess({
      data: [
        1, 2, 3,
      ],
      matchers: [
        ArrayMatchers.containingOnly([
            1,
            2,
            3,
          ], {
            requireAll: true,
          },
        ),
      ],
    });
  });

  test('null', () => {
    validateMatchSuccess({
      data: null,
      matchers: [
        ArrayMatchers.containingOnly([1, 2, 3], {
          canBeNull: true,
        }),
      ],
    });
  });

  test('undefined', () => {
    validateMatchSuccess({
      data: undefined,
      matchers: [
        ArrayMatchers.containingOnly([1, 2, 3], {
          optional: true,
        }),
      ],
    });
  });

  test('FAIL: null', () => {
    validateMatchFail({
      data: null,
      matchers: [
        ArrayMatchers.containingOnly([1, 2, 3], { optional: true }),
        ArrayMatchers.containingOnly([1, 2, 3], { allowDuplicateMatch: true }),
      ],
      errorMatch: expectMatcherError(ValueMatcher.VALUE_CANNOT_BE_NULL),
    });
  });

  test('FAIL: undefined', () => {
    validateMatchFail({
      data: undefined,
      matchers: [
        ArrayMatchers.containingOnly([1, 2, 3], { canBeNull: true }),
        ArrayMatchers.containingOnly([1, 2, 3], { allowDuplicateMatch: true }),
      ],
      errorMatch: expectMatcherError(ValueMatcher.VALUE_IS_REQUIRED),
    });
  });

  test('FAIL: extra item', () => {
    validateMatchFail({
      data: [
        1,
        2,
        3,
      ],
      matchers: [
        ArrayMatchers.containingOnly([
          1,
          2,
        ]),
      ],
      errorMatch: [
        1,
        2,
        {
          matcher: 'ArrayMatchers.containingOnly',
          message: 'Item does not match any of specified matches',
          item: 3,
        },
      ],
    });
  });

  test('FAIL: extra item 2', () => {
    validateMatchFail({
      data: [
        [1],
        [2],
        [3],
      ],
      matchers: [
        ArrayMatchers.containingOnly([
          [1],
          [2],
        ]),
      ],
      errorMatch: [
        [1],
        [2],
        {
          matcher: 'ArrayMatchers.containingOnly',
          message: 'Item does not match any of specified matches',
          item: [3],
        },
      ],
    });
  });

  test('FAIL: extra item 3', () => {
    validateMatchFail({
      data: [
        { val: 'one' },
        { val: 'two' },
        { val: 'three' },
      ],
      matchers: [
        ArrayMatchers.containingOnly([
          { val: 'one' },
          { val: 'two' },
        ]),
      ],
      errorMatch: [
        { val: 'one' },
        { val: 'two' },
        {
          matcher: 'ArrayMatchers.containingOnly',
          message: 'Item does not match any of specified matches',
          item: { val: 'three' },
        },
      ],
    });
  });

  test('FAIL: extra item 4', () => {
    validateMatchFail({
      data: [
        1,
        true,
        'string',
      ],
      matchers: [
        ArrayMatchers.containingOnly([
          Matchers.number(),
          Matchers.boolean(),
        ]),
      ],
      errorMatch: [
        1,
        true,
        {
          matcher: 'ArrayMatchers.containingOnly',
          message: 'Item does not match any of specified matches',
          item: 'string',
        },
      ],
    });
  });

  test('FAIL: NOT allowDuplicateMatch 1', () => {
    let duplicateMatch = Matchers.number();
    validateMatchFail({
      data: [
        1,
        2,
        true,
      ],
      matchers: [
        ArrayMatchers.containingOnly([
          duplicateMatch,
          true,
        ]),
      ],
      errorMatch: [
        {
          matcher: 'ArrayMatchers.containingOnly',
          message: 'Item matches multiple times with duplications',
          item: 1,
          match: duplicateMatch,

        },
        {
          matcher: 'ArrayMatchers.containingOnly',
          message: 'Item matches multiple times with duplications',
          item: 2,
          match: duplicateMatch,
        },
        true,
      ],
    });
  });

  test('FAIL: NOT allowDuplicateMatch 2', () => {
    validateMatchFail({
      data: [
        { obj: 'test', index: 1 },
        { obj: 'other', index: 1 },
        true,
      ],
      matchers: [
        ArrayMatchers.containingOnly([
          { index: 1 },
          true,
        ], {
          allowDuplicateMatch: false,
        }),
      ],
      errorMatch: [
        {
          matcher: 'ArrayMatchers.containingOnly',
          message: 'Item matches multiple times with duplications',
          item: { obj: 'test', index: 1 },
          match: { index: 1 },
          options: { allowDuplicateMatch: false },
        },
        {
          matcher: 'ArrayMatchers.containingOnly',
          message: 'Item matches multiple times with duplications',
          item: { obj: 'other', index: 1 },
          match: { index: 1 },
          options: { allowDuplicateMatch: false },
        },
        true,
      ],
    });
  });

  test('FAIL: requireAll', () => {
    validateMatchFail({
      data: [
        1, 3,
      ],
      matchers: [
        ArrayMatchers.containingOnly([
            1,
            2,
            3,
          ], {
            requireAll: true,
          },
        ),
      ],
      errorMatch: [
        1,
        3,
        {
          matcher: 'ArrayMatchers.containingOnly',
          message: 'Item is required but not found',
          item: 2,
          options: { requireAll: true },
        },
      ],
    });
  });

});