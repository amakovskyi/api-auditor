import { Random } from '../../src';

const TEXT_CHARS = ' ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

describe('Random.text()', () => {

  test('Length', () => {
    for (let i = 0; i < 1000; i++) {
      let length = Random.intBetween(100, 200);
      let string = Random.text(length);
      expect(typeof string).toEqual('string');
      expect(string.length).toBeGreaterThanOrEqual(length);
      expect(string.length).toBeLessThanOrEqual(length + 64);
    }
  });

  test('Length + adder', () => {
    for (let i = 0; i < 1000; i++) {
      let length = Random.intBetween(100, 200);
      let lengthAdder = Random.intBetween(100, 200);
      let string = Random.text(length, lengthAdder);
      expect(typeof string).toEqual('string');
      expect(string.length).toBeGreaterThanOrEqual(length);
      expect(string.length).toBeLessThanOrEqual(length + lengthAdder);
    }
  });

  test('Type and content', () => {
    for (let i = 0; i < 50; i++) {
      let length = Random.intBetween(100, 200);
      let lengthAdder = Random.intBetween(100, 200);
      let string = Random.text(length, lengthAdder);
      expect(typeof string).toEqual('string');
      for (let char = 0; char < string.length; char++) {
        expect(TEXT_CHARS.indexOf(string.substring(char, char + 1)) >= 0).toBeTruthy();
      }
    }
  });

});