import { Matchers } from '../../src';
import { expectMatcherError, validateMatchFail, validateMatchFailArray } from '../test-utils/validateMatchFail';
import { validateMatchSuccessArray } from '../test-utils/validateMatchSuccess';
import { ValueMatcher } from '../../src/matcher/value.matcher';

describe('Matchers.number()', () => {

  test('Finite number', () => {
    validateMatchSuccessArray({
      dataArray: [
        1,
        -1,
        999.123,
        -999.123,
      ],
      matchers: [
        Matchers.number(),
        Matchers.number({ canBeNull: false }),
        Matchers.number({ canBeNull: true }),
        Matchers.number({ optional: false }),
        Matchers.number({ optional: true }),
      ],
    });
  });

  test('Null', () => {
    validateMatchSuccessArray({
      dataArray: [
        null,
        1,
        -1,
        999.123,
        -999.123,
      ],
      matchers: [
        Matchers.number({ canBeNull: true }),
        Matchers.number({ canBeNull: true, optional: false }),
        Matchers.number({ canBeNull: true, optional: true }),
      ],
    });
  });

  test('Optional ', () => {
    validateMatchSuccessArray({
      dataArray: [
        undefined,
        1,
        -1,
        999.123,
        -999.123,
      ],
      matchers: [
        Matchers.number({ optional: true }),
        Matchers.number({ optional: true, canBeNull: false }),
        Matchers.number({ optional: true, canBeNull: true }),
      ],
    });
  });

  test('FAIL: wrong type', () => {
    validateMatchFailArray({
      dataArray: [
        true,
        '',
        'test',
        '123',
        'random',
        [1, 2, 3],
        { test: 1 },
      ],
      matchers: [
        Matchers.number(),
        Matchers.number({ canBeNull: false }),
        Matchers.number({ canBeNull: true }),
        Matchers.number({ optional: false }),
        Matchers.number({ optional: true }),
      ],
      errorMatch: expectMatcherError('Expected value of type [number]'),
    });
  });

  test('FAIL: undefined', () => {
    validateMatchFail({
      data: undefined,
      matchers: Matchers.number(),
      errorMatch: expectMatcherError(ValueMatcher.VALUE_IS_REQUIRED),
    });
  });

  test('FAIL: null', () => {
    validateMatchFail({
      data: null,
      matchers: Matchers.number(),
      errorMatch: expectMatcherError(ValueMatcher.VALUE_CANNOT_BE_NULL),
    });
  });

  test('canBeNaN', () => {
    validateMatchSuccessArray({
      dataArray: [
        NaN,
        -NaN,
        999,
        -48723164,
        123.289,
      ],
      matchers: [
        Matchers.number({ canBeNaN: true }),
        Matchers.number({ canBeNaN: true, optional: true }),
        Matchers.number({ canBeNaN: true, shouldBeInteger: false }),
      ],
    });
  });

  test('FAIL: canBeNaN', () => {
    validateMatchFailArray({
      dataArray: [
        NaN,
        -NaN,
      ],
      matchers: [
        Matchers.number(),
        Matchers.number({ canBeNaN: false }),
        Matchers.number({ canBeNaN: false, optional: true }),
        Matchers.number({ canBeNaN: false, shouldBeInteger: false }),
      ],
      errorMatch: expectMatcherError('Value cannot be NaN'),
    });
  });

  test('shouldBeInteger', () => {
    validateMatchSuccessArray({
      dataArray: [
        1,
        2,
        999,
        12348723164,
        -12384632174,
      ],
      matchers: [
        Matchers.number({ shouldBeInteger: true }),
        Matchers.number({ shouldBeInteger: true, optional: true }),
        Matchers.number({ shouldBeInteger: true, canBeNaN: true }),
      ],
    });
  });

  test('FAIL: shouldBeInteger', () => {
    validateMatchFailArray({
      dataArray: [
        1.34,
        2.12,
        999.9874,
        12348723164.23,
        -12384632174.23423,
      ],
      matchers: [
        Matchers.number({ shouldBeInteger: true }),
        Matchers.number({ shouldBeInteger: true, optional: true }),
        Matchers.number({ shouldBeInteger: true, canBeNaN: true }),
      ],
      errorMatch: expectMatcherError('Value should be an integer'),
    });
  });

  test('bounds', () => {
    validateMatchSuccessArray({
      dataArray: [
        -1000,
        -999,
        0,
        3456,
        8888,
      ],
      matchers: [
        Matchers.number({ bounds: { min: -1000 } }),
        Matchers.number({ bounds: { max: 8888 } }),
        Matchers.number({ bounds: { min: -1000, max: 8888 } }),
        Matchers.number({ bounds: { min: -1000, max: 8888 }, shouldBeInteger: true }),
        Matchers.number({ bounds: { min: -1000, max: 8888 }, shouldBeInteger: true, optional: true }),
        Matchers.number({ bounds: { min: -1000, max: 8888 }, shouldBeInteger: true, canBeNaN: true }),
      ],
    });
  });

  test('FAIL: bounds - min&max', () => {
    validateMatchFailArray({
      dataArray: [
        -8888,
        -1001,
        8889,
        99999,
      ],
      matchers: [
        Matchers.number({ bounds: { min: -1000, max: 8888 } }),
        Matchers.number({ bounds: { min: -1000, max: 8888 }, shouldBeInteger: true }),
        Matchers.number({ bounds: { min: -1000, max: 8888 }, shouldBeInteger: true, optional: true }),
        Matchers.number({ bounds: { min: -1000, max: 8888 }, shouldBeInteger: true, canBeNaN: true }),
      ],
      errorMatch: expectMatcherError('Value is out of bounds'),
    });
  });

  test('FAIL: bounds - min', () => {
    validateMatchFailArray({
      dataArray: [
        -8888,
        -1001,
      ],
      matchers: [
        Matchers.number({ bounds: { min: -1000 } }),
        Matchers.number({ bounds: { min: -1000 }, shouldBeInteger: true }),
        Matchers.number({ bounds: { min: -1000 }, shouldBeInteger: true, optional: true }),
        Matchers.number({ bounds: { min: -1000 }, shouldBeInteger: true, canBeNaN: true }),
      ],
      errorMatch: expectMatcherError('Value is out of bounds'),
    });
  });

  test('FAIL: bounds - max', () => {
    validateMatchFailArray({
      dataArray: [
        8889,
        99999,
      ],
      matchers: [
        Matchers.number({ bounds: { max: 8888 } }),
        Matchers.number({ bounds: { max: 8888 }, shouldBeInteger: true }),
        Matchers.number({ bounds: { max: 8888 }, shouldBeInteger: true, optional: true }),
        Matchers.number({ bounds: { max: 8888 }, shouldBeInteger: true, canBeNaN: true }),
      ],
      errorMatch: expectMatcherError('Value is out of bounds'),
    });
  });

  test('near', () => {
    validateMatchSuccessArray({
      dataArray: [
        10,
        10.1,
        10.5,
        9.5,
      ],
      matchers: [
        Matchers.number({ near: { value: 10, maxDifference: 0.5 } }),
        Matchers.number({ near: { value: 10, maxDifference: 0.5 }, shouldBeInteger: false }),
        Matchers.number({ near: { value: 10, maxDifference: 0.5 }, optional: true }),
        Matchers.number({ near: { value: 10, maxDifference: 0.5 }, canBeNaN: true }),
      ],
    });
  });

  test('FAIL: near', () => {
    validateMatchFailArray({
      dataArray: [
        9,
        9.4,
        10.51,
        10.5000001,
      ],
      matchers: [
        Matchers.number({ near: { value: 10, maxDifference: 0.5 } }),
        Matchers.number({ near: { value: 10, maxDifference: 0.5 }, shouldBeInteger: false }),
        Matchers.number({ near: { value: 10, maxDifference: 0.5 }, optional: true }),
        Matchers.number({ near: { value: 10, maxDifference: 0.5 }, canBeNaN: true }),
      ],
      errorMatch: expectMatcherError('Value is not near expected'),
    });
  });

});
