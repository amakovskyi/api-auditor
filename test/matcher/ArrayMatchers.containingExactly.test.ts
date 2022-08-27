import { ArrayMatchers, Matchers, ObjectMatchers, Random } from '../../src';
import { expectMatcherError, validateMatchFail } from '../test-utils/validateMatchFail';
import { validateMatchSuccess } from '../test-utils/validateMatchSuccess';
import { ValueMatcher } from '../../src/matcher/value.matcher';

describe('ArrayMatchers.containingExactly()', () => {

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
        ArrayMatchers.containingExactly([
          'one',
          Matchers.uuid(),
          Matchers.boolean(),
          123,
          999,
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
        ArrayMatchers.containingExactly([
          { value: 1 },
          { value: 2 },
          { value: 3 },
        ]),
        ArrayMatchers.containingExactly([
          { value: Matchers.number(), test: 'string' },
          { value: Matchers.number(), test: 'boolean' },
          { value: Matchers.number(), test: 'date' },
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
        ArrayMatchers.containingExactly([
          [1, 2],
          [3, 4, 5],
          [6, 7, 8, 9],
        ]),
        ArrayMatchers.containingExactly([
          ArrayMatchers.any({ expectedLength: 2, itemMatch: Matchers.number() }),
          ArrayMatchers.any({ expectedLength: 3, itemMatch: Matchers.number() }),
          ArrayMatchers.any({ expectedLength: 4, itemMatch: Matchers.number() }),
        ]),
        ArrayMatchers.containingExactly([
          ArrayMatchers.containingAll([1]),
          ArrayMatchers.containingAll([5]),
          ArrayMatchers.containingAll([9]),
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
        ArrayMatchers.containingExactly([
          Matchers.string(),
          Matchers.uuid(),
          Matchers.boolean(),
          Matchers.number(),
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
        ArrayMatchers.containingExactly([
            Matchers.string(),
            Matchers.uuid(),
            Matchers.boolean(),
            Matchers.number(),
          ], {
            allowDuplicateMatch: true,
          },
        ),
        ArrayMatchers.containingExactly([
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

  test('null', () => {
    validateMatchSuccess({
      data: null,
      matchers: [
        ArrayMatchers.containingExactly([1, 2, 3], {
          canBeNull: true,
        }),
      ],
    });
  });

  test('undefined', () => {
    validateMatchSuccess({
      data: undefined,
      matchers: [
        ArrayMatchers.containingExactly([1, 2, 3], {
          optional: true,
        }),
      ],
    });
  });

  test('FAIL: null', () => {
    validateMatchFail({
      data: null,
      matchers: [
        ArrayMatchers.containingExactly([1, 2, 3], { optional: true }),
        ArrayMatchers.containingExactly([1, 2, 3], { allowDuplicateMatch: true }),
      ],
      errorMatch: expectMatcherError(ValueMatcher.VALUE_CANNOT_BE_NULL),
    });
  });

  test('FAIL: undefined', () => {
    validateMatchFail({
      data: undefined,
      matchers: [
        ArrayMatchers.containingExactly([1, 2, 3], { canBeNull: true }),
        ArrayMatchers.containingExactly([1, 2, 3], { allowDuplicateMatch: true }),
      ],
      errorMatch: expectMatcherError(ValueMatcher.VALUE_IS_REQUIRED),
    });
  });

  test('FAIL: not all items', () => {
    validateMatchFail({
      data: [
        1, 3,
      ],
      matchers: [
        ArrayMatchers.containingExactly([
            1,
            2,
            3,
          ],
        ),
      ],
      errorMatch: [
        1,
        3,
        {
          matcher: 'ArrayMatchers.containingExactly',
          message: 'Item is required but not found',
          item: 2,
        },
      ],
    });
  });


  test('FAIL: extra item 1', () => {
    validateMatchFail({
      data: [
        1,
        2,
        3,
      ],
      matchers: [
        ArrayMatchers.containingExactly([
          1,
          2,
        ]),
      ],
      errorMatch: [
        1,
        2,
        {
          matcher: 'ArrayMatchers.containingExactly',
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
        ArrayMatchers.containingExactly([
          [1],
          [2],
        ]),
      ],
      errorMatch: [
        [1],
        [2],
        {
          matcher: 'ArrayMatchers.containingExactly',
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
        ArrayMatchers.containingExactly([
          { val: 'one' },
          { val: 'two' },
        ]),
      ],
      errorMatch: [
        { val: 'one' },
        { val: 'two' },
        {
          matcher: 'ArrayMatchers.containingExactly',
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
        ArrayMatchers.containingExactly([
          Matchers.number(),
          Matchers.boolean(),
        ]),
      ],
      errorMatch: [
        1,
        true,
        {
          matcher: 'ArrayMatchers.containingExactly',
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
        ArrayMatchers.containingExactly([
          duplicateMatch,
          true,
        ]),
      ],
      errorMatch: [
        {
          matcher: 'ArrayMatchers.containingExactly',
          message: 'Item matches multiple times with duplications',
          item: 1,
          match: duplicateMatch,

        },
        {
          matcher: 'ArrayMatchers.containingExactly',
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
        ArrayMatchers.containingExactly([
          { index: 1 },
          true,
        ], {
          allowDuplicateMatch: false,
        }),
      ],
      errorMatch: [
        {
          matcher: 'ArrayMatchers.containingExactly',
          message: 'Item matches multiple times with duplications',
          item: { obj: 'test', index: 1 },
          match: { index: 1 },
          options: { allowDuplicateMatch: false },
        },
        {
          matcher: 'ArrayMatchers.containingExactly',
          message: 'Item matches multiple times with duplications',
          item: { obj: 'other', index: 1 },
          match: { index: 1 },
          options: { allowDuplicateMatch: false },
        },
        true,
      ],
    });
  });

});