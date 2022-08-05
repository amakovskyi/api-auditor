import { ArrayMatchers, Matchers, Random } from '../../src';
import { expectMatcherError, validateMatchFail } from '../test-utils/validateMatchFail';
import { validateMatchSuccess } from '../test-utils/validateMatchSuccess';
import { ValueMatcher } from '../../src/matcher/value.matcher';

describe('ArrayMatchers.containingAll()', () => {

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
        ArrayMatchers.containingAll([
          undefined,
          null,
          1,
          'one',
          [1, 2, 3],
          { test: 1, other: 'two' },
        ]),
        ArrayMatchers.containingAll([
          ArrayMatchers.any({ expectedLength: 3 }),
          Matchers.number({ bounds: { min: 0, max: 2 } }),
          { value: Matchers.string() },
          999,
        ]),
        ArrayMatchers.containingAll([
          Matchers.uuid(),
          Matchers.dateTime(),
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
        ArrayMatchers.containingAll([
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

  test('null', () => {
    validateMatchSuccess({
      data: null,
      matchers: [
        ArrayMatchers.containingAll([1, 2, 3], {
          canBeNull: true,
        }),
      ],
    });
  });

  test('undefined', () => {
    validateMatchSuccess({
      data: undefined,
      matchers: [
        ArrayMatchers.containingAll([1, 2, 3], {
          optional: true,
        }),
      ],
    });
  });

  test('FAIL: null', () => {
    validateMatchFail({
      data: null,
      matchers: [
        ArrayMatchers.containingAll([1, 2, 3], { optional: true }),
        ArrayMatchers.containingAll([1, 2, 3], { allowDuplicateMatch: true }),
      ],
      errorMatch: expectMatcherError(ValueMatcher.VALUE_CANNOT_BE_NULL),
    });
  });

  test('FAIL: undefined', () => {
    validateMatchFail({
      data: undefined,
      matchers: [
        ArrayMatchers.containingAll([1, 2, 3], { canBeNull: true }),
        ArrayMatchers.containingAll([1, 2, 3], { allowDuplicateMatch: true }),
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
        ArrayMatchers.containingAll([
          1,
          2,
          3,
        ]),
      ],
      errorMatch: [
        1,
        2,
        {
          matcher: 'ArrayMatchers.containingAll',
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
        ArrayMatchers.containingAll([
          [1],
          [2],
          [3],
        ]),
      ],
      errorMatch: [
        [1],
        [2],
        {
          matcher: 'ArrayMatchers.containingAll',
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
        ArrayMatchers.containingAll([
          { val: 'one' },
          { val: 'two' },
          { val: 'three' },
        ]),
      ],
      errorMatch: [
        { val: 'one' },
        { val: 'two' },
        {
          matcher: 'ArrayMatchers.containingAll',
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
        ArrayMatchers.containingAll([
          Matchers.number(),
          Matchers.boolean(),
          missingMatch,
        ]),
      ],
      errorMatch: [
        1,
        true,
        {
          matcher: 'ArrayMatchers.containingAll',
          message: 'Item match not found',
          matchNotFound: missingMatch,
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
        ArrayMatchers.containingAll([
          duplicateMatch,
        ]),
      ],
      errorMatch: [
        {
          matcher: 'ArrayMatchers.containingAll',
          message: 'Item matches multiple times with duplications',
          item: 1,
          match: duplicateMatch,

        },
        {
          matcher: 'ArrayMatchers.containingAll',
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
        ArrayMatchers.containingAll([
          { index: 1 },
        ], {
          allowDuplicateMatch: false,
        }),
      ],
      errorMatch: [
        {
          matcher: 'ArrayMatchers.containingAll',
          message: 'Item matches multiple times with duplications',
          item: { obj: 'test', index: 1 },
          match: { index: 1 },
          options: { allowDuplicateMatch: false },
        },
        {
          matcher: 'ArrayMatchers.containingAll',
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