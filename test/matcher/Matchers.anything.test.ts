import { Matchers, Random } from '../../src';
import { validateMatchSuccessArray } from '../test-utils/validateMatchSuccess';

describe('Matchers.anything()', () => {

  test('All is acceptable', () => {
    validateMatchSuccessArray({
      dataArray: [
        null,
        undefined,
        '',
        'someString',
        'test123',
        Random.string(12, 12),
        -100,
        999,
        new Date(),
        NaN,
        {},
        [],
      ],
      matchers: [
        Matchers.anything(),
      ],
    });
  });

});