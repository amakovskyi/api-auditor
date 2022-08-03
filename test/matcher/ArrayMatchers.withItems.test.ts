import { ArrayMatchers, Matchers, Random } from '../../src';
import { expectMatcherError, validateMatchFail } from '../test-utils/validateMatchFail';
import { validateMatchSuccess } from '../test-utils/validateMatchSuccess';
import { ValueMatcher } from '../../src/matcher/value.matcher';

describe('ArrayMatchers.withItems()', () => {

  test('Some array', () => {
    validateMatchSuccess({
      data: [
        undefined,
        null,
        1,
        'one',
        true,
        false,
        [1, 2, 3],
        { test: 1, other: 'two' },
        'other',
        999,
        'test',
        [4, 5],
        { value: 'other' },
        Random.uuid(),
        new Date(),
      ],
      matchers: [
        ArrayMatchers.withItems([
          undefined,
          null,
          1,
          'one',
          [1, 2, 3],
          { test: 1, other: 'two' },
        ]),
        ArrayMatchers.withItems([
          ArrayMatchers.any({ expectedLength: 3 }),
          Matchers.number({ bounds: { min: 0, max: 2 } }),
          { value: Matchers.string() },
          999,
        ]),
        ArrayMatchers.withItems([
          Matchers.uuid(),
          Matchers.date(),
          { test: Matchers.anyDefined() },
          true,
        ]),
      ],
    });
  });

  test('allowDuplicateMatch', () => {
    validateMatchSuccess({
      data: [
        1,
        123,
        'one',
        'other',
        999,
        true,
        false,
        Random.uuid(),
        Random.uuid(),
        Random.uuid(),
      ],
      matchers: [
        ArrayMatchers.withItems([
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

  test('onlySpecifiedItems', () => {
    validateMatchSuccess({
      data: [
        123,
        999,
        'one',
        true,
        Random.uuid(),
      ],
      matchers: [
        ArrayMatchers.withItems([
          'one',
          Matchers.uuid(),
          Matchers.boolean(),
          123,
          999,
        ], {
          onlySpecifiedItems: true,
        }),
      ],
    });
  });

  test('allowDuplicateMatch & onlySpecifiedItems', () => {
    validateMatchSuccess({
      data: [
        1,
        123,
        'one',
        'other',
        999,
        true,
        false,
        Random.uuid(),
        Random.uuid(),
        Random.uuid(),
      ],
      matchers: [
        ArrayMatchers.withItems([
          'one',
          'other',
          Matchers.uuid(),
          Matchers.boolean(),
          1,
          123,
          999,
        ], {
          allowDuplicateMatch: true,
          onlySpecifiedItems: true,
        }),
      ],
    });
  });

  test('null', () => {
    validateMatchSuccess({
      data: null,
      matchers: [
        ArrayMatchers.withItems([1, 2, 3], {
          canBeNull: true,
        }),
      ],
    });
  });

  test('undefined', () => {
    validateMatchSuccess({
      data: undefined,
      matchers: [
        ArrayMatchers.withItems([1, 2, 3], {
          optional: true,
        }),
      ],
    });
  });

  test('FAIL: null', () => {
    validateMatchFail({
      data: null,
      matchers: [
        ArrayMatchers.withItems([1, 2, 3], { optional: true }),
        ArrayMatchers.withItems([1, 2, 3], { allowDuplicateMatch: true }),
      ],
      errorMatch: expectMatcherError(ValueMatcher.VALUE_CANNOT_BE_NULL),
    });
  });

  test('FAIL: undefined', () => {
    validateMatchFail({
      data: undefined,
      matchers: [
        ArrayMatchers.withItems([1, 2, 3], { canBeNull: true }),
        ArrayMatchers.withItems([1, 2, 3], { allowDuplicateMatch: true }),
      ],
      errorMatch: expectMatcherError(ValueMatcher.VALUE_IS_REQUIRED),
    });
  });

  test('FAIL: items not found 1', () => {
    validateMatchFail({
      data: [
        1,
        2,
      ],
      matchers: [
        ArrayMatchers.withItems([
          1,
          2,
          3,
        ]),
      ],
      errorMatch: [
        1,
        2,
        {
          matcher: 'ArrayMatchers.anyArrayContaining',
          message: 'Item match not found',
          matchNotFound: 3,
        },
      ],
    });
  });

  test('FAIL: items not found 2', () => {
    validateMatchFail({
      data: [
        [1],
        [2],
      ],
      matchers: [
        ArrayMatchers.withItems([
          [1],
          [2],
          [3],
        ]),
      ],
      errorMatch: [
        [1],
        [2],
        {
          matcher: 'ArrayMatchers.anyArrayContaining',
          message: 'Item match not found',
          matchNotFound: [3],
        },
      ],
    });
  });

  test('FAIL: items not found 3', () => {
    validateMatchFail({
      data: [
        { val: 'one' },
        { val: 'two' },
      ],
      matchers: [
        ArrayMatchers.withItems([
          { val: 'one' },
          { val: 'two' },
          { val: 'three' },
        ]),
      ],
      errorMatch: [
        { val: 'one' },
        { val: 'two' },
        {
          matcher: 'ArrayMatchers.anyArrayContaining',
          message: 'Item match not found',
          matchNotFound: { val: 'three' },
        },
      ],
    });
  });

  test('FAIL: items not found 4', () => {
    let missingMatch = Matchers.string();
    validateMatchFail({
      data: [
        1,
        true,
      ],
      matchers: [
        ArrayMatchers.withItems([
          Matchers.number(),
          Matchers.boolean(),
          missingMatch,
        ]),
      ],
      errorMatch: [
        1,
        true,
        {
          matcher: 'ArrayMatchers.anyArrayContaining',
          message: 'Item match not found',
          matchNotFound: missingMatch,
        },
      ],
    });
  });

  test('FAIL: onlySpecifiedItems 1', () => {
    validateMatchFail({
      data: [
        1,
        2,
        3,
      ],
      matchers: [
        ArrayMatchers.withItems([
          1,
          2,
        ], {
          onlySpecifiedItems: true,
        }),
      ],
      errorMatch: [
        1,
        2,
        {
          matcher: 'ArrayMatchers.anyArrayContaining',
          message: 'Item does not match any of specified items',
          item: 3,
          options: {
            onlySpecifiedItems: true,
          },
        },
      ],
    });
  });

  test('FAIL: onlySpecifiedItems 2', () => {
    validateMatchFail({
      data: [
        [1],
        [2],
        [3],
      ],
      matchers: [
        ArrayMatchers.withItems([
          [1],
          [2],
        ], {
          onlySpecifiedItems: true,
        }),
      ],
      errorMatch: [
        [1],
        [2],
        {
          matcher: 'ArrayMatchers.anyArrayContaining',
          message: 'Item does not match any of specified items',
          item: [3],
          options: {
            onlySpecifiedItems: true,
          },
        },
      ],
    });
  });

  test('FAIL: onlySpecifiedItems 3', () => {
    validateMatchFail({
      data: [
        { val: 1 },
        { val: 2 },
        { val: 3 },
      ],
      matchers: [
        ArrayMatchers.withItems([
          { val: 1 },
          { val: 2 },
        ], {
          onlySpecifiedItems: true,
        }),
      ],
      errorMatch: [
        { val: 1 },
        { val: 2 },
        {
          matcher: 'ArrayMatchers.anyArrayContaining',
          message: 'Item does not match any of specified items',
          item: { val: 3 },
          options: {
            onlySpecifiedItems: true,
          },
        },
      ],
    });
  });

  test('FAIL: onlySpecifiedItems 4', () => {
    validateMatchFail({
      data: [
        1,
        'two',
        true,
      ],
      matchers: [
        ArrayMatchers.withItems([
          Matchers.number(),
          Matchers.string(),
        ], {
          onlySpecifiedItems: true,
        }),
      ],
      errorMatch: [
        1,
        'two',
        {
          matcher: 'ArrayMatchers.anyArrayContaining',
          message: 'Item does not match any of specified items',
          item: true,
          options: {
            onlySpecifiedItems: true,
          },
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
        ArrayMatchers.withItems([
          duplicateMatch,
        ]),
      ],
      errorMatch: [
        {
          matcher: 'ArrayMatchers.anyArrayContaining',
          message: 'Item matches multiple times with duplications',
          item: 1,
          match: duplicateMatch,

        },
        {
          matcher: 'ArrayMatchers.anyArrayContaining',
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
        ArrayMatchers.withItems([
          { index: 1 },
        ], {
          allowDuplicateMatch: false,
        }),
      ],
      errorMatch: [
        {
          matcher: 'ArrayMatchers.anyArrayContaining',
          message: 'Item matches multiple times with duplications',
          item: { obj: 'test', index: 1 },
          match: { index: 1 },
          options: { allowDuplicateMatch: false },
        },
        {
          matcher: 'ArrayMatchers.anyArrayContaining',
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