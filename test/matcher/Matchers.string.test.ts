import { Matchers, Random } from '../../src';
import { validateMatchFail, validateMatchFailArray } from '../test-utils/validateMatchFail';
import { validateMatchSuccess, validateMatchSuccessArray } from '../test-utils/validateMatchSuccess';

describe('Matchers.string()', () => {

  test('Correct strings', () => {
    validateMatchSuccessArray({
      dataArray: [
        'someString',
        'test123',
        Random.string(12, 12),
      ],
      matchers: [
        Matchers.string(),
        Matchers.string({ canBeNull: true }),
        Matchers.string({ canBeEmpty: true }),
        Matchers.string({ canBeNull: true, canBeEmpty: true }),
        Matchers.string({ canBeNull: false }),
        Matchers.string({ canBeEmpty: false }),
        Matchers.string({ canBeNull: false, canBeEmpty: false }),
      ],
    });
  });

  test('Empty string', () => {
    validateMatchSuccess({
      data: '',
      matchers: [
        Matchers.string({ canBeEmpty: true }),
        Matchers.string({ canBeNull: true, canBeEmpty: true }),
      ],
    });
  });

  test('Null value', () => {
    validateMatchSuccess({
      data: null,
      matchers: [
        Matchers.string({ canBeNull: true }),
        Matchers.string({ canBeNull: true, canBeEmpty: true }),
      ],
    });
  });

  test('FAIL: [string] value expected', () => {
    validateMatchFailArray({
      dataArray: [
        { data: 123 },
        { data: true },
        { data: [1, 2, 3] },
        { data: { test: 'object' } },
      ],
      match: {
        data: Matchers.string(),
      },
      errorMatch: {
        data: {
          matcher: 'Matchers.string',
          message: '[string] value expected',
        },
      },
    });
  });

  test('FAIL: value cannot be [null]', () => {
    validateMatchFail({
      data: null,
      match: Matchers.string(),
      errorMatch: {
        matcher: 'Matchers.string',
        message: 'value cannot be [null]',
      },
    });
    validateMatchFail({
      data: null,
      match: Matchers.string({ canBeEmpty: true }),
      errorMatch: {
        matcher: 'Matchers.string',
        message: 'value cannot be [null]',
        options: { canBeEmpty: true },
      },
    });
  });

  test('FAIL: value cannot be empty', () => {
    validateMatchFail({
      data: '',
      match: Matchers.string(),
      errorMatch: {
        matcher: 'Matchers.string',
        message: 'value cannot be empty',
      },
    });
    validateMatchFail({
      data: '',
      match: Matchers.string({ canBeNull: true }),
      errorMatch: {
        matcher: 'Matchers.string',
        message: 'value cannot be empty',
        options: { canBeNull: true },
      },
    });
  });

});