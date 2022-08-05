import { Matchers, Random, validateMatch } from '../../src';

describe('Random.int()', () => {

  test('Max 10', () => {
    for (let i = 0; i < 1000; i++) {
      validateMatch(
        Random.int(10),
        Matchers.number({
            bounds: { min: 0, max: 10 },
            shouldBeInteger: true,
          },
        ),
      );
    }
  });

  test('Max 999', () => {
    for (let i = 0; i < 1000; i++) {
      validateMatch(
        Random.int(999),
        Matchers.number({
            bounds: { min: 0, max: 999 },
            shouldBeInteger: true,
          },
        ),
      );
    }
  });

  test('Max 33', () => {
    for (let i = 0; i < 1000; i++) {
      validateMatch(
        Random.int(33),
        Matchers.number({
            bounds: { min: 0, max: 33 },
            shouldBeInteger: true,
          },
        ),
      );
    }
  });

});