import { Matchers } from '../../src';
import { expectMatcherError, validateMatchFail } from '../test-utils/validateMatchFail';
import { validateMatchSuccessArray } from '../test-utils/validateMatchSuccess';

describe('Matchers.absentOrNull()', () => {

  test('No value or null value', () => {
    validateMatchSuccessArray({
      dataArray: [
        undefined,
        null,
      ],
      matchers: [
        Matchers.absentOrNull(),
      ],
    });
    validateMatchSuccessArray({
      dataArray: [
        { other: 123 },
        { some: null, other: 123 },
      ],
      matchers: [
        {
          some: Matchers.absentOrNull(),
        },
      ],
    });
  });

  test('FAIL: value', () => {
    validateMatchFail({
      data: 'string',
      matchers: Matchers.absentOrNull(),
      errorMatch: expectMatcherError('Expected no value or null'),
    });
    validateMatchFail({
      data: 123,
      matchers: Matchers.absentOrNull(),
      errorMatch: expectMatcherError('Expected no value or null'),
    });
    validateMatchFail({
      data: false,
      matchers: Matchers.absentOrNull(),
      errorMatch: expectMatcherError('Expected no value or null'),
    });
  });

  test('FAIL: object', () => {
    validateMatchFail({
      data: { test: 1 },
      matchers: Matchers.absentOrNull(),
      errorMatch: expectMatcherError('Expected no value or null'),
    });
  });

  test('FAIL: array', () => {
    validateMatchFail({
      data: [1, 2, 3],
      matchers: Matchers.absentOrNull(),
      errorMatch: expectMatcherError('Expected no value or null'),
    });
  });

});