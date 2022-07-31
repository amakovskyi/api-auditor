import { Matchers, validateMatch } from '../../src';

describe('validateMatch', () => {

  test('Simple', () => {
    validateMatch({
      data: 'someString',
    }, {
      data: Matchers.anyString(),
    });
  });

  test('Error', () => {
    validateMatch({
      data: 123,
    }, {
      data: Matchers.anyString(),
    });
  });

  test('Complex', () => {
    validateMatch({
      data: 'someString',
    }, {
      data: Matchers.anyBoolean(),
    });
  });

});