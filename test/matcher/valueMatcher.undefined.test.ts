import { Matchers } from '../../src';
import { doValidateMatchFail } from '../test-utils/validateMatchFail';
import { ValueMatcher } from '../../src/matcher/value.matcher';

describe('valueMatcher: using undefined same as missing value', () => {

  test('Undefined', () => {
    doValidateMatchFail({
      data: {
        value: undefined,
        otherValue: 'string',
      },
      match: {
        value: Matchers.string(),
        otherValue: Matchers.string(),
      },
      errorMatch: {
        value: {
          matcher: 'Matchers.string',
          message: ValueMatcher.VALUE_IS_REQUIRED,
        },
        otherValue: 'string',
      },
    });
  });

  test('Missing', () => {
    doValidateMatchFail({
      data: {
        // "value" is missing
        otherValue: 'string',
      },
      match: {
        value: Matchers.string(),
        otherValue: Matchers.string(),
      },
      errorMatch: {
        value: {
          matcher: 'Matchers.string',
          message: ValueMatcher.VALUE_IS_REQUIRED,
        },
        otherValue: 'string',
      },
    });
  });

});