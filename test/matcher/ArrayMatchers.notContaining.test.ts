import { ArrayMatchers, Matchers, ObjectMatchers, Random } from '../../src';
import { validateMatchFail } from '../test-utils/validateMatchFail';
import { validateMatchSuccess } from '../test-utils/validateMatchSuccess';

describe('ArrayMatchers.notContaining()', () => {

  test('Some numbers', () => {
    validateMatchSuccess({
      data: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
      matchers: [
        ArrayMatchers.notContaining([
          0, 100, 999,
        ]),
        ArrayMatchers.notContaining([
          'one', 'two', ' three',
        ]),
        ArrayMatchers.notContaining([
          Matchers.string(),
          ObjectMatchers.any(),
          Matchers.boolean(),
          [1, 2, 3],
          { test: 1 },
        ]),
      ],
    });
  });

  test('Some strings', () => {
    validateMatchSuccess({
      data: ['one', 'two', 'three'],
      matchers: [
        ArrayMatchers.notContaining([
          'alpha', 'beta', 'gamma',
        ]),
        ArrayMatchers.notContaining([
          1, 2, 3, true, false,
        ]),
        ArrayMatchers.notContaining([
          Matchers.number(),
          ObjectMatchers.any(),
          Matchers.boolean(),
          [1, 2, 3],
          { test: 1 },
        ]),
      ],
    });
  });

  test('Some primitive mix', () => {
    validateMatchSuccess({
      data: [undefined, null, 'one', 2, true],
      matchers: [
        ArrayMatchers.notContaining([
          'alpha', 'beta', 'gamma',
        ]),
        ArrayMatchers.notContaining([
          10, 22, 30, false,
        ]),
        ArrayMatchers.notContaining([
          '100500',
          [1, 2, 3],
          ArrayMatchers.any(),
          ObjectMatchers.any(),
          { test: 1 },
        ]),
      ],
    });
  });

  test('Null and undefined', () => {
    validateMatchSuccess({
      data: ['one', 2, true],
      matchers: [
        ArrayMatchers.notContaining([
          undefined, null,
        ]),
      ],
    });
  });

  test('Objects', () => {
    validateMatchSuccess({
      data: [
        { test: 1 },
        { test: 2 },
        { test: 3 },
        { value: 'some' },
      ],
      matchers: [
        ArrayMatchers.notContaining([
          null,
          undefined,
          1,
          true,
          'String',
          [1, 2, 3],
          { test: 0 },
          { test: Matchers.string() },
          { value: 'other' },
          { value: Matchers.number() },
          ArrayMatchers.any(),
        ]),
      ],
    });
  });

  test('Arrays', () => {
    validateMatchSuccess({
      data: [
        [1, 2, 3],
        ['one', ' two'],
        [true, false, { test: 1 }],
      ],
      matchers: [
        ArrayMatchers.notContaining([
          null,
          undefined,
          1,
          true,
          'String',
          { test: 0 },
          { test: Matchers.string() },
          { value: 'other' },
          { value: Matchers.number() },
          ObjectMatchers.any(),
          ArrayMatchers.any({ expectedLength: 5 }),
        ]),
      ],
    });
  });

  test('FAIL: undefined & null', () => {
    validateMatchFail({
      data: [
        undefined,
        1,
        2,
        null,
      ],
      matchers: [
        ArrayMatchers.notContaining([
          null,
          undefined,
          99,
        ]),
      ],
      errorMatch: [
        {
          matcher: 'ArrayMatchers.notContaining',
          message: 'Item match found',
          item: undefined,
          match: undefined,
        },
        1,
        2,
        {
          matcher: 'ArrayMatchers.notContaining',
          message: 'Item match found',
          item: null,
          match: null,
        },
      ],
    });
  });

  test('FAIL: primitives', () => {
    validateMatchFail({
      data: [
        123,
        true,
        'string',
        888,
        false,
        'other',
      ],
      matchers: [
        ArrayMatchers.notContaining([
          123,
          'string',
          false,
        ]),
      ],
      errorMatch: [
        {
          matcher: 'ArrayMatchers.notContaining',
          message: 'Item match found',
          item: 123,
          match: 123,
        },
        true,
        {
          matcher: 'ArrayMatchers.notContaining',
          message: 'Item match found',
          item: 'string',
          match: 'string',
        },
        888,
        {
          matcher: 'ArrayMatchers.notContaining',
          message: 'Item match found',
          item: false,
          match: false,
        },
        'other',
      ],
    });
  });

  test('FAIL: primitive matchers', () => {
    let numberMatcher = Matchers.number({ bounds: { min: 500 } });
    let uuid = Random.uuid();
    let uuidMatcher = Matchers.uuid();
    validateMatchFail({
      data: [
        123,
        true,
        uuid,
        888,
        false,
        'other',
      ],
      matchers: [
        ArrayMatchers.notContaining([
          numberMatcher,
          uuidMatcher,
        ]),
      ],
      errorMatch: [
        123,
        true,
        {
          matcher: 'ArrayMatchers.notContaining',
          message: 'Item match found',
          item: uuid,
          match: uuidMatcher,
        },
        {
          matcher: 'ArrayMatchers.notContaining',
          message: 'Item match found',
          item: 888,
          match: numberMatcher,
        },
        false,
        'other',
      ],
    });
  });

  test('FAIL: objects', () => {
    let countMatch = Matchers.number({ near: { value: 11, maxDifference: 1 } });
    validateMatchFail({
      data: [
        { value: 'test' },
        { value: 'other' },
        { test: 'some' },
        { test: 'another' },
        { count: 11.11 },
        { count: 999 },
      ],
      matchers: [
        ArrayMatchers.notContaining([
          { value: 'test' },
          { test: 'another' },
          { count: countMatch },
        ]),
      ],
      errorMatch: [
        {
          matcher: 'ArrayMatchers.notContaining',
          message: 'Item match found',
          item: { value: 'test' },
          match: { value: 'test' },
        },
        { value: 'other' },
        { test: 'some' },
        {
          matcher: 'ArrayMatchers.notContaining',
          message: 'Item match found',
          item: { test: 'another' },
          match: { test: 'another' },
        },
        {
          matcher: 'ArrayMatchers.notContaining',
          message: 'Item match found',
          item: { count: 11.11 },
          match: { count: countMatch },
        },
        { count: 999 },
      ],
    });
  });

  test('FAIL: arrays', () => {
    let objectsArrayMatch = ArrayMatchers.any({ itemMatch: ObjectMatchers.any() });
    let arrayWithLength5Match = ArrayMatchers.any({ expectedLength: 5 });
    validateMatchFail({
      data: [
        [1, 2, 3],
        [1, 2, 3, 4, 5],
        ['one', 'two', 'three'],
        [true, false],
        [{ index: 1 }, { index: 2 }],
      ],
      matchers: [
        ArrayMatchers.notContaining([
          [true, false],
          objectsArrayMatch,
          arrayWithLength5Match,
        ]),
      ],
      errorMatch: [
        [1, 2, 3],
        {
          matcher: 'ArrayMatchers.notContaining',
          message: 'Item match found',
          item: [1, 2, 3, 4, 5],
          match: arrayWithLength5Match,
        },
        ['one', 'two', 'three'],
        {
          matcher: 'ArrayMatchers.notContaining',
          message: 'Item match found',
          item: [true, false],
          match: [true, false],
        },
        {
          matcher: 'ArrayMatchers.notContaining',
          message: 'Item match found',
          item: [{ index: 1 }, { index: 2 }],
          match: objectsArrayMatch,
        },
      ],
    });
  });

  test('FAIL: multiple matches per object', () => {
    let stringMatch = Matchers.string();
    let uuidMatch = Matchers.uuid();
    let uuid = Random.uuid();
    validateMatchFail({
      data: [
        1,
        uuid,
        true,
      ],
      matchers: [
        ArrayMatchers.notContaining([
          stringMatch,
          uuidMatch,
        ]),
      ],
      errorMatch: [
        1,
        {
          matcher: 'ArrayMatchers.notContaining',
          message: 'Item match found',
          item: uuid,
          match: stringMatch,
        },
        {
          matcher: 'ArrayMatchers.notContaining',
          message: 'Item match found',
          item: uuid,
          match: uuidMatch,
        },
        true,
      ],
    });
  });

});