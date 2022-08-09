import { ArrayMatchers, Matchers, ObjectMatchers } from '../../src';
import { validateMatchSuccessArray } from '../test-utils/validateMatchSuccess';
import { expectMatcherError, validateMatchFail } from '../test-utils/validateMatchFail';

describe('ObjectMatchers.exactly()', () => {

  test('Some objects', () => {
    validateMatchSuccessArray({
      dataArray: [
        {
          test: 1,
          arraysSome: [1, 2, 3],
          value: 'string',
          other: 12345,
        },
        {
          test: 999,
          arraysSome: ['one', 'two'],
          value: 'other string',
          other: true,
        },
      ],
      matchers: [
        ObjectMatchers.exactly({
          test: Matchers.number(),
          arraysSome: ArrayMatchers.any(),
          value: Matchers.string(),
          other: Matchers.anyDefined(),
        }),
        ObjectMatchers.exactly({
          test: Matchers.number(),
          arraysSome: ArrayMatchers.any(),
          value: Matchers.string(),
          other: Matchers.anyDefined(),
        }, { canBeNull: false }),
        ObjectMatchers.exactly({
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
        ObjectMatchers.exactly({
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
        ObjectMatchers.exactly({
          test: 3,
        }),
      ],
      errorMatch: {
        test: 3,
      },
    });
  });

  test('Fail when unexpected field', () => {
    validateMatchFail({
      data: {
        some: 1,
        other: 'other',
      },
      matchers: [
        ObjectMatchers.exactly({
          other: Matchers.anything(),
        }),
      ],
      errorMatch: {
        other: 'other',
      },
    });
  });

  test('Fail when missing field', () => {
    validateMatchFail({
      data: {
        some: 1,
      },
      matchers: [
        ObjectMatchers.exactly({
          some: Matchers.number(),
          other: 'string',
        }),
      ],
      errorMatch: {
        some: 1,
        other: 'string',
      },
    });
  });

});