import { Random } from '../../src';

const STRING_CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

describe('Random.string()', () => {

  test('Length', () => {
    for (let i = 0; i < 1000; i++) {
      let length = Random.intBetween(10, 20);
      let string = Random.string(length);
      expect(string.length).toEqual(length);
    }
  });

  test('Length + adder', () => {
    for (let i = 0; i < 1000; i++) {
      let length = Random.intBetween(10, 20);
      let lengthAdder = Random.intBetween(10, 20);
      let string = Random.string(length, lengthAdder);
      expect(typeof string).toEqual('string');
      expect(string.length).toBeGreaterThanOrEqual(length);
      expect(string.length).toBeLessThanOrEqual(length + lengthAdder);
    }
  });

  test('Type and content', () => {
    for (let i = 0; i < 50; i++) {
      let length = Random.intBetween(10, 100);
      let string = Random.string(length);
      expect(typeof string).toEqual('string');
      for (let char = 0; char < string.length; char++) {
        expect(STRING_CHARS.indexOf(string.substring(char, char + 1)) >= 0).toBeTruthy();
      }
    }
  });

});