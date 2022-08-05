import { ArrayMatchers, matchAny, Matchers, Random } from '../../src';
import { validateMatchFail } from '../test-utils/validateMatchFail';
import { validateMatchSuccess, validateMatchSuccessArray } from '../test-utils/validateMatchSuccess';

describe('matchAny()', () => {

  test('SUCCESS 1', () => {
    validateMatchSuccessArray({
      dataArray: [
        [],
        [1, 2, 3, 4, 5],
        [{ text: 'text' }],
      ],
      matchers: [
        matchAny(Matchers.string(), ArrayMatchers.any(), 999),
      ],
    });
  });

  test('SUCCESS 2', () => {
    validateMatchSuccess({
      data: Random.uuid(),
      matchers: [
        matchAny(Matchers.number(), Matchers.uuid(), { test: 1 }),
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
        matchAny({ test: 111 }, { value: '2' }, { state: false }),
        matchAny({ test: Matchers.dateTime() }, { value: Matchers.string() }, { state: Matchers.uuid() }),
      ],
    });
  });

  test('FAIL', () => {
    validateMatchFail({
      data: 123,
      matchers: [
        matchAny(999, Matchers.number({ bounds: { max: 100 } }), Matchers.string(), Matchers.boolean()),
      ],
      errorMatch: {
        matcher: 'matchAny',
        message: 'No matches found',
      },
    });
  });

});