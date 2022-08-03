import { Matchers } from '../../src';
import { expectMatcherError, validateMatchFail } from '../test-utils/validateMatchFail';
import { validateMatchSuccessArray } from '../test-utils/validateMatchSuccess';
import { ValueMatcher } from '../../src/matcher/value.matcher';

describe('Matchers.anyNotNull()', () => {

  test('Any values', () => {
    validateMatchSuccessArray({
      dataArray: [
        'string',
        123,
        true,
        { test: 1 },
        [1, 2, 3],
      ],
      matchers: [
        Matchers.anyNotNull(),
      ],
    });
  });

  test('FAIL: undefined', () => {
    validateMatchFail({
      data: undefined,
      matchers: Matchers.anyNotNull(),
      errorMatch: expectMatcherError(ValueMatcher.VALUE_IS_REQUIRED),
    });
  });

  test('FAIL: null', () => {
    validateMatchFail({
      data: null,
      matchers: Matchers.anyNotNull(),
      errorMatch: expectMatcherError(ValueMatcher.VALUE_CANNOT_BE_NULL),
    });
  });

});