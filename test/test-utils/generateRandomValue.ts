import { Random } from '../../src';

function generateRandomPrimitive(type: number) {
  if (type == 0) {
    return Random.int(999999999);
  }
  if (type == 1) {
    return Random.uuid();
  }
  if (type == 2) {
    return Random.string(32, 32);
  }
  if (type == 3) {
    return Random.text(64, 128);
  }
  throw new Error('Undefined');
}

export function generateRandomValue() {
  let type = Random.int(5);
  if (type >= 0 && type <= 3) {
    return generateRandomPrimitive(type);
  }
  if (type == 4) {
    let object: any = {};
    let fields = Random.intBetween(3, 7);
    for (let fieldIndex = 0; fieldIndex < fields; fieldIndex++) {
      let key = Random.string(16, 8);
      object[key] = generateRandomPrimitive(Random.int(3));
    }
    return object;
  }
  if (type == 5) {
    let array: any[] = [];
    let items = Random.intBetween(3, 7);
    for (let itemIndex = 0; itemIndex < items; itemIndex++) {
      array.push(generateRandomPrimitive(Random.int(3)));
    }
    return array;
  }
  throw new Error('Undefined');
}

export function generateRandomValueArray(sizeMin: number, sizeMax: number = sizeMin): any[] {
  let count = Random.intBetween(sizeMin, sizeMax);
  let result: any[] = [];
  for (let i = 0; i < count; i++) {
    result.push(generateRandomValue());
  }
  return result;
}