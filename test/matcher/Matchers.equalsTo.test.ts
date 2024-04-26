import { Matchers } from '../../src';
import { validateMatchFail } from '../test-utils/validateMatchFail';
import { validateMatchSuccess } from '../test-utils/validateMatchSuccess';

describe('Matchers.equalsTo()', () => {

  test('null', () => {
    validateMatchSuccess({
      data: null,
      matchers: [
        Matchers.equalsTo(null),
      ],
    });
  });

  test('some string', () => {
    validateMatchSuccess({
      data: 'someString',
      matchers: [
        Matchers.equalsTo('someString'),
      ],
    });
  });

  test('some number', () => {
    validateMatchSuccess({
      data: 999,
      matchers: [
        Matchers.equalsTo(999),
      ],
    });
  });

  test('FAIL: null to value', () => {
    validateMatchFail({
      data: null,
      matchers: Matchers.equalsTo('value'),
      errorMatch: 'value',
    });
    validateMatchFail({
      data: null,
      matchers: Matchers.equalsTo({ test: 'value' }),
      errorMatch: { test: 'value' },
    });
    validateMatchFail({
      data: null,
      matchers: Matchers.equalsTo([1, 2, 3]),
      errorMatch: [1, 2, 3],
    });
  });

  test('FAIL: value to null', () => {
    validateMatchFail({
      data: 'value',
      matchers: Matchers.equalsTo(null),
      errorMatch: null,
    });
  });

  test('FAIL: different strings', () => {
    validateMatchFail({
      data: 'one',
      matchers: Matchers.equalsTo('other'),
      errorMatch: 'other',
    });
  });

  test('FAIL: different numbers', () => {
    validateMatchFail({
      data: 12345,
      matchers: Matchers.equalsTo(999),
      errorMatch: 999,
    });
  });

  test('FAIL: different booleans', () => {
    validateMatchFail({
      data: true,
      matchers: Matchers.equalsTo(false),
      errorMatch: false,
    });
  });

  test('FAIL: different objects', () => {
    validateMatchFail({
      data: { test: '123' },
      matchers: Matchers.equalsTo({ some: 'other' }),
      errorMatch: { some: 'other' },
    });
  });

  test('FAIL: different arrays', () => {
    validateMatchFail({
      data: [1, 2, 3],
      matchers: Matchers.equalsTo([4, 5, 6]),
      errorMatch: [4, 5, 6],
    });
    validateMatchFail({
      data: [{ test: '123' }],
      matchers: Matchers.equalsTo([{ some: 'other' }]),
      errorMatch: [{ some: 'other' }],
    });
  });

  test('FAIL: value to object', () => {
    validateMatchFail({
      data: 1,
      matchers: Matchers.equalsTo({ value: 1 }),
      errorMatch: { value: 1 },
    });
  });

  test('FAIL: value to array', () => {
    validateMatchFail({
      data: 1,
      matchers: Matchers.equalsTo([1]),
      errorMatch: [1],
    });
  });

  test('FAIL: object to value', () => {
    validateMatchFail({
      data: { test: 1 },
      matchers: Matchers.equalsTo(1),
      errorMatch: 1,
    });
  });

  test('FAIL: array to value', () => {
    validateMatchFail({
      data: [1],
      matchers: Matchers.equalsTo(1),
      errorMatch: 1,
    });
  });

  test('FAIL: object to array', () => {
    validateMatchFail({
      data: { test: 1 },
      matchers: Matchers.equalsTo([1, 2, 3]),
      errorMatch: [1, 2, 3],
    });
  });

  test('FAIL: array to object', () => {
    validateMatchFail({
      data: [1, 2, 3],
      matchers: Matchers.equalsTo({ test: 1 }),
      errorMatch: { test: 1 },
    });
  });

});