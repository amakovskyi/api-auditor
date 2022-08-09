import { ArrayMatchers, Matchers, ObjectMatchers } from '../../src';
import { validateMatchSuccessArray } from '../test-utils/validateMatchSuccess';
import { expectMatcherError, validateMatchFail } from '../test-utils/validateMatchFail';

describe('ObjectMatchers.only()', () => {

  test('Some objects', () => {
    validateMatchSuccessArray({
      dataArray: [
        {},
        { test: 1 },
        { arraysSome: [1, 2, 3] },
        { value: 'string' },
        { other: 'some' },
        { arraysSome: [2, 3, 4], other: true },
        { test: 3, other: null },
      ],
      matchers: [
        ObjectMatchers.only({
          test: Matchers.number(),
          arraysSome: ArrayMatchers.any(),
          value: Matchers.string(),
          other: Matchers.anyDefined(),
        }),
        ObjectMatchers.only({
          test: Matchers.number(),
          arraysSome: ArrayMatchers.any(),
          value: Matchers.string(),
          other: Matchers.anyDefined(),
        }, { canBeNull: false }),
        ObjectMatchers.only({
          test: Matchers.number(),
          arraysSome: ArrayMatchers.any(),
          value: Matchers.string(),
          other: Matchers.anyDefined(),
        }, { canBeNull: true }),
      ],
    });
  });

  test('Fail when match wrong: 1', () => {
    validateMatchFail({
      data: {
        test: 1,
      },
      matchers: [
        ObjectMatchers.only({
          test: Matchers.string(),
        }),
      ],
      errorMatch: {
        test: {
          matcher: 'Matchers.string',
          message: 'Expected value of type [string]',
        },
      },
    });
  });

  test('Fail when match wrong: 2', () => {
    validateMatchFail({
      data: {
        test: 1,
      },
      matchers: [
        ObjectMatchers.only({
          test: 3,
        }),
      ],
      errorMatch: {
        test: 3,
      },
    });
  });

  test('Fail when unexpected field: 1', () => {
    validateMatchFail({
      data: {
        some: 1,
      },
      matchers: [
        ObjectMatchers.only({
          other: Matchers.anything(),
        }),
      ],
      errorMatch: {},
    });
  });

  test('Fail when unexpected field: 2', () => {
    validateMatchFail({
      data: {
        some: 1,
      },
      matchers: [
        ObjectMatchers.only({
          other: Matchers.anything(),
        }),
      ],
      errorMatch: {},
    });
  });

});