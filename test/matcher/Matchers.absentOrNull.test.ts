import { Matchers } from '../../src';
import { validateMatchFail } from '../test-utils/validateMatchFail';
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
      match: Matchers.absentOrNull(),
      errorMatch: {
        matcher: 'Matchers.absentOrNull',
        message: 'Expected no value or null',
      },
    });
    validateMatchFail({
      data: 123,
      match: Matchers.absentOrNull(),
      errorMatch: {
        matcher: 'Matchers.absentOrNull',
        message: 'Expected no value or null',
      },
    });
    validateMatchFail({
      data: false,
      match: Matchers.absentOrNull(),
      errorMatch: {
        matcher: 'Matchers.absentOrNull',
        message: 'Expected no value or null',
      },
    });
  });

  test('FAIL: object', () => {
    validateMatchFail({
      data: { test: 1 },
      match: Matchers.absentOrNull(),
      errorMatch: {
        matcher: 'Matchers.absentOrNull',
        message: 'Expected no value or null',
      },
    });
  });

  test('FAIL: array', () => {
    validateMatchFail({
      data: [1, 2, 3],
      match: Matchers.absentOrNull(),
      errorMatch: {
        matcher: 'Matchers.absentOrNull',
        message: 'Expected no value or null',
      },
    });
  });

});