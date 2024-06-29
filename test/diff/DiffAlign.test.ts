import { DiffAlign } from '../../src/diff/DiffAlign';

describe('DiffAlign.ts', () => {

  function validate(left: any, right: any, rightAligned: any) {
    const [s1, s2] = DiffAlign.format(left, right);
    expect(s1).toEqual(JSON.stringify(left, null, 2));
    expect(s2).toEqual(JSON.stringify(rightAligned, null, 2));
  }

  test('Example test', () => {
    const left = {
      'One': 1,
      'Two': 2,
      'Three': 3,
    };
    const right = {
      'Two': 2,
      'One': 1,
      'Four': 3,
    };
    const rightAligned = {
      'One': 1,
      'Two': 2,
      'Four': 3,
    };
    validate(left, right, rightAligned);
  });

  // Basic tests for objects
  test('Objects with different ordering', () => {
    const left = { 'B': 2, 'A': 1 };
    const right = { 'A': 1, 'B': 2 }; // Same data, different keys order
    const rightAligned = { 'B': 2, 'A': 1 };
    validate(left, right, rightAligned);
  });

  test('Objects with extra keys in right', () => {
    const left = { 'A': 1, 'B': 2 };
    const right = { 'A': 1, 'B': 2, 'C': 3 };
    const rightAligned = { 'A': 1, 'B': 2, 'C': 3 };
    validate(left, right, rightAligned);
  });

  test('Objects with missing keys in right', () => {
    const left = { 'A': 1, 'B': 2, 'C': 3 };
    const right = { 'A': 1, 'B': 2 };
    const rightAligned = { 'A': 1, 'B': 2 };
    validate(left, right, rightAligned);
  });

  // Tests for nested objects
  test('Nested objects', () => {
    const left = { 'A': { 'X': 1, 'Y': 2 }, 'B': 2 };
    const right = { 'B': 2, 'A': { 'Y': 2, 'X': 1 } };
    const rightAligned = { 'A': { 'X': 1, 'Y': 2 }, 'B': 2 };
    validate(left, right, rightAligned);
  });

  // Tests for arrays
  test('Simple arrays', () => {
    const left = [1, 2, 3];
    const right = [3, 2, 1];
    const rightAligned = [3, 2, 1]; // arrays are not realigned as order of items in array matter unlike order of keys in an object
    validate(left, right, rightAligned);
  });

  test('Arrays with extra elements in right', () => {
    const left = [1, 2];
    const right = [1, 2, 3];
    const rightAligned = [1, 2, 3];
    validate(left, right, rightAligned);
  });

  test('Arrays with missing elements in right', () => {
    const left = [1, 2, 3];
    const right = [1, 2];
    const rightAligned = [1, 2];
    validate(left, right, rightAligned);
  });

  // Tests for nested arrays
  test('Nested arrays', () => {
    const left = [1, [2, 3], 4];
    const right = [4, [3, 2], 1];
    const rightAligned = [4, [3, 2], 1];
    validate(left, right, rightAligned);
  });

  // Test for mixed data types
  test('Mixed data types', () => {
    const left = { 'A': 1, 'B': [2, 3], 'C': { 'X': 4 } };
    const right = { 'C': { 'X': 4 }, 'A': 1, 'B': [2, 3] };
    const rightAligned = { 'A': 1, 'B': [2, 3], 'C': { 'X': 4 } };
    validate(left, right, rightAligned);
  });

  // Tests for primitives
  test('Primitive values', () => {
    const left = 10;
    const right = 'hello';
    const rightAligned = 'hello';
    validate(left, right, rightAligned);
  });

});