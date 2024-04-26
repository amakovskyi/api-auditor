import { Matchers, Random, validateMatch } from '../../src';

describe('Random.intBetween()', () => {

  test('10 to 40', () => {
    for (let i = 0; i < 1000; i++) {
      validateMatch(
        Random.intBetween(10, 40),
        Matchers.number({
            bounds: { min: 10, max: 40 },
            shouldBeInteger: true,
          },
        ),
      );
    }
  });

  test('-50 to 50', () => {
    for (let i = 0; i < 1000; i++) {
      validateMatch(
        Random.intBetween(-50, 50),
        Matchers.number({
            bounds: { min: -50, max: 50 },
            shouldBeInteger: true,
          },
        ),
      );
    }
  });

  test('999 to 1035', () => {
    for (let i = 0; i < 1000; i++) {
      validateMatch(
        Random.intBetween(999, 1035),
        Matchers.number({
            bounds: { min: 999, max: 1035 },
            shouldBeInteger: true,
          },
        ),
      );
    }
  });

});