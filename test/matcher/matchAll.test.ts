import { ArrayMatchers, matchAll, Matchers, Random } from '../../src';
import { validateMatchFail } from '../test-utils/validateMatchFail';
import { validateMatchSuccess, validateMatchSuccessArray } from '../test-utils/validateMatchSuccess';

describe('matchAll()', () => {

  test('SUCCESS 1', () => {
    validateMatchSuccessArray({
      dataArray: [
        [],
        [1, 2, 3, 4, 5],
        [{ text: 'text' }],
      ],
      matchers: [
        matchAll(Matchers.anyDefined(), ArrayMatchers.any()),
      ],
    });
  });

  test('SUCCESS 2', () => {
    validateMatchSuccess({
      data: Random.uuid(),
      matchers: [
        matchAll(Matchers.string(), Matchers.uuid()),
      ],
    });
  });

  test('SUCCESS 3', () => {
    validateMatchSuccess({
      data: {
        test: 1,
        value: '2',
        state: true,
      },
      matchers: [
        matchAll({ test: 1 }, { value: '2' }, { state: true }),
        matchAll({ test: Matchers.number() }, { value: Matchers.string() }, { state: Matchers.boolean() }),
      ],
    });
  });

  test('FAIL', () => {
    validateMatchFail({
      data: 123,
      matchers: [
        matchAll(123, Matchers.number(), Matchers.string(), Matchers.boolean()),
      ],
      errorMatch: {
        matcher: 'Matchers.string',
        message: 'Expected value of type [string]',
      },
    });
  });

});