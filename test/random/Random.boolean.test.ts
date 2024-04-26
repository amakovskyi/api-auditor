import { Random } from '../../src';

describe('Random.boolean()', () => {

  test('Normal', () => {
    let trueCount = 0;
    let falseCount = 0;
    for (let i = 0; i < 1000; i++) {
      let bool = Random.boolean();
      expect(typeof bool).toEqual('boolean');
      if (bool) {
        trueCount++;
      } else {
        falseCount++;
      }
    }
    expect(trueCount + falseCount).toEqual(1000);
    expect(trueCount).toBeGreaterThan(450);
    expect(falseCount).toBeGreaterThan(450);
  });

  test('More true', () => {
    let trueCount = 0;
    let falseCount = 0;
    for (let i = 0; i < 1000; i++) {
      let bool = Random.boolean(0.25);
      expect(typeof bool).toEqual('boolean');
      if (bool) {
        trueCount++;
      } else {
        falseCount++;
      }
    }
    expect(trueCount + falseCount).toEqual(1000);
    expect(trueCount).toBeGreaterThan(700);
    expect(falseCount).toBeGreaterThan(200);
  });

  test('More false', () => {
    let trueCount = 0;
    let falseCount = 0;
    for (let i = 0; i < 1000; i++) {
      let bool = Random.boolean(0.75);
      expect(typeof bool).toEqual('boolean');
      if (bool) {
        trueCount++;
      } else {
        falseCount++;
      }
    }
    expect(trueCount + falseCount).toEqual(1000);
    expect(trueCount).toBeGreaterThan(200);
    expect(falseCount).toBeGreaterThan(700);
  });

});