import { Matchers, Random } from '../../src';
import { expectMatcherError, validateMatchFail, validateMatchFailArray } from '../test-utils/validateMatchFail';
import { validateMatchSuccess, validateMatchSuccessArray } from '../test-utils/validateMatchSuccess';
import { ValueMatcher } from '../../src/matcher/value.matcher';

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
        123,
        true,
        [1, 2, 3],
        {},
      ],
      matchers: Matchers.string(),
      errorMatch: expectMatcherError('Expected value of type [string]'),
    });
  });

  test('FAIL: value cannot be [null]', () => {
    validateMatchFail({
      data: null,
      matchers: [
        Matchers.string(),
        Matchers.string({ canBeEmpty: true }),
        Matchers.string({ canBeEmpty: false }),
        Matchers.string({ canBeEmpty: true, canBeNull: false }),
        Matchers.string({ canBeEmpty: false, canBeNull: false }),
      ],
      errorMatch: expectMatcherError(ValueMatcher.VALUE_CANNOT_BE_NULL),
    });
  });

  test('FAIL: value cannot be empty', () => {
    validateMatchFail({
      data: '',
      matchers: [
        Matchers.string(),
        Matchers.string({ canBeNull: true }),
        Matchers.string({ canBeNull: false }),
        Matchers.string({ canBeEmpty: false }),
        Matchers.string({ canBeEmpty: false, canBeNull: true }),
        Matchers.string({ canBeEmpty: false, canBeNull: false }),
      ],
      errorMatch: expectMatcherError('Value cannot be empty'),
    });
  });

});