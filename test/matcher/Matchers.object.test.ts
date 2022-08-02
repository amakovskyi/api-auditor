import { Matchers } from '../../src';
import { validateMatchFail, validateMatchFailArray } from '../test-utils/validateMatchFail';
import { validateMatchSuccessArray } from '../test-utils/validateMatchSuccess';

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
      match: Matchers.object(),
      errorMatch: {
        matcher: 'Matchers.object',
        message: 'expected [JsonObject] value',
      },
    });
    validateMatchFail({
      data: undefined,
      match: Matchers.object({ canBeNull: false }),
      errorMatch: {
        matcher: 'Matchers.object',
        message: 'expected [JsonObject] value',
        options: { canBeNull: false },
      },
    });
    validateMatchFail({
      data: undefined,
      match: Matchers.object({ canBeNull: true }),
      errorMatch: {
        matcher: 'Matchers.object',
        message: 'expected [JsonObject] value',
        options: { canBeNull: true },
      },
    });
  });

  test('FAIL: null', () => {
    validateMatchFail({
      data: null,
      match: Matchers.object(),
      errorMatch: {
        matcher: 'Matchers.object',
        message: 'value cannot be null',
      },
    });
    validateMatchFail({
      data: null,
      match: Matchers.object({ canBeNull: false }),
      errorMatch: {
        matcher: 'Matchers.object',
        message: 'value cannot be null',
        options: { canBeNull: false },
      },
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
      match: Matchers.object(),
      errorMatch: {
        matcher: 'Matchers.object',
        message: 'expected value of type [JsonObject]',
      },
    });
  });

  test('FAIL: Some objects with match', () => {
    validateMatchFail({
      data: {
        stringVal: 123,
        otherVal: '123',
      },
      match: Matchers.object({
        match: {
          stringVal: Matchers.string(),
          otherVal: Matchers.anyNotNull(),
        },
      }),
      errorMatch: {
        stringVal: {
          matcher: 'Matchers.string',
          message: '[string] value expected',
        },
        otherVal: '123',
      },
    });
  });

});