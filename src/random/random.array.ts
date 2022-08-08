import { Random } from './random';

export class RandomArray {

  /**
   * Get random single item from array
   * @param source
   */
  static singleItemFrom<T>(source: T[]): T {
    return source[Random.int(source.length - 1)];
  }

  /**
   * Make randomly mixed copy of [source] array
   * @param source
   */
  static mixedCopyOf<T>(source: T[]): T[] {
    let copy: T[] = [...source];
    let result: T[] = [];
    while (copy.length > 0) {
      let [item] = copy.splice(Random.int(copy.length - 1), 1);
      result.push(item);
    }
    return result;
  }

  static someItemsFrom<T>(source: T[], length: number, randomLengthAdder: number = 0): T[] {
    let mixedCopy = RandomArray.mixedCopyOf(source);
    let resultCount = Math.min(mixedCopy.length, length + Random.int(randomLengthAdder));
    return mixedCopy.splice(0, resultCount);
  }

  /**
   * Randomly distinctive splits [source] to [resultArraysCount] not empty arrays with random number of items in each
   * @param source array to split to
   * @param resultArraysCount result number of arrays
   * @param equally if TRUE then splits array equally or near equally, if FALSE then splits to an arrays with random number of items, but no less than 1
   */
  static splitAll<T>(source: T[], resultArraysCount: number, equally: boolean = false): T[][] {
    if (source.length < resultArraysCount) {
      throw new Error('[source] size is lesser than [resultArraysCount]');
    }
    let mixedCopy = RandomArray.mixedCopyOf(source);
    let resultArrays: T[][] = [];
    for (let i = 0; i < resultArraysCount; i++) {
      resultArrays.push(mixedCopy.splice(0, 1));
    }
    let arrayIndex = 0;
    while (mixedCopy.length > 0) {
      let target: any[];
      if (equally) {
        target = resultArrays[arrayIndex++ % resultArrays.length];
      } else {
        target = RandomArray.singleItemFrom(resultArrays);
      }
      target.push(...mixedCopy.splice(0, 1));
    }
    return RandomArray.mixedCopyOf(resultArrays);
  }

  static splitToLengths<T>(source: T[], lengths: number[]): T[][] {
    let total = 0;
    for (let count of lengths) {
      total += count;
    }
    if (source.length < total) {
      throw new Error('[source] size is lesser than sum of [counts]');
    }
    let mixedCopy = RandomArray.mixedCopyOf(source);
    let result: T[][] = [];
    for (let count of lengths) {
      result.push(mixedCopy.splice(0, count));
    }
    return result;
  }

  static splitToLengthsWithOverlap<T>(source: T[], lengths: number[]): T[][] {
    let total = 0;
    for (let count of lengths) {
      total = Math.max(total, count);
    }
    if (source.length < total) {
      throw new Error('[source] size is lesser than max of [counts]');
    }
    let result: T[][] = [];
    for (let count of lengths) {
      result.push(RandomArray.someItemsFrom(source, count));
    }
    return result;
  }

}