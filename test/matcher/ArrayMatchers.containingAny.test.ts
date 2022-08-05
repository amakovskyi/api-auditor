import { ArrayMatchers, Matchers, Random } from '../../src';
import { expectMatcherError, validateMatchFail } from '../test-utils/validateMatchFail';
import { validateMatchSuccess } from '../test-utils/validateMatchSuccess';

describe('ArrayMatchers.containingAny()', () => {

  test('Some array', () => {
    validateMatchSuccess({
      data: [
        undefined,
        null,
        1,
        'one',
        true,
        false,
        [1, 2, 3],
        { test: 1, other: 'two' },
        'other',
        999,
        'test',
        [4, 5],
        { value: 'other' },
        Random.uuid(),
        new Date(),
      ],
      matchers: [
        ArrayMatchers.containingAny([undefined]),
        ArrayMatchers.containingAny([null]),
        ArrayMatchers.containingAny([Matchers.number()]),
        ArrayMatchers.containingAny([Matchers.string()]),
        ArrayMatchers.containingAny([Matchers.object()]),
        ArrayMatchers.containingAny([ArrayMatchers.any({ expectedLength: 2 })]),
        ArrayMatchers.containingAny(['one', 'super']),
        ArrayMatchers.containingAny([1, 2, 3, 4, 5]),
        ArrayMatchers.containingAny([{ value: Matchers.string() }]),
      ],
    });
  });

  test('FAIL: general', () => {
    validateMatchFail({
      data: [
        1,
        'one',
        true,
        false,
        [1, 2, 3],
        { test: 1, other: 'two' },
        'other',
        999,
        'test',
        [4, 5],
        { value: 'other' },
        Random.uuid(),
        new Date(),
      ],
      matchers: [
        ArrayMatchers.containingAny([undefined]),
        ArrayMatchers.containingAny([null]),
        ArrayMatchers.containingAny([Matchers.number({ bounds: { min: 99999 } })]),
        ArrayMatchers.containingAny(['super', 'else']),
        ArrayMatchers.containingAny([ArrayMatchers.any({ expectedLength: 10 })]),
        ArrayMatchers.containingAny([333, 444, 555]),
        ArrayMatchers.containingAny([{ value: Matchers.number() }]),
      ],
      errorMatch: expectMatcherError('No items found matching expected'),
    });
  });

  test('FAIL: object', () => {
    validateMatchFail({
      data: [
        { value: 1 },
        { value: true },
        { other: [1] },
      ],
      matchers: [
        ArrayMatchers.containingAny([
          { value: 999 },
          { value: Matchers.string() },
          { other: Matchers.object() },
          { other: [2] },
        ]),
      ],
      errorMatch: expectMatcherError('No items found matching expected'),
    });
  });

  test('FAIL: array', () => {
    validateMatchFail({
      data: [
        [1, 2, 3],
        ['one', 'two', 'three'],
        [true, false, 'not-a-boolean'],
      ],
      matchers: [
        ArrayMatchers.containingAny([
          [1, 2],
          ['two', 'three'],
          ArrayMatchers.any({ itemMatch: Matchers.boolean() }),
          ArrayMatchers.any({ expectedLength: 5 }),
        ]),
      ],
      errorMatch: expectMatcherError('No items found matching expected'),
    });
  });

});