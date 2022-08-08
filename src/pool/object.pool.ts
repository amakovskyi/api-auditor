import { RandomArray } from '../random/random.array';

export abstract class ObjectPool<T> {

  private readonly arrayOfItems: T[] = [];

  protected constructor(private readonly initCount: number) {
  }

  private async requireItems(count: number) {
    let minRequiredCount = Math.max(count, this.initCount);
    let needToInitialize = minRequiredCount - this.arrayOfItems.length;
    if (needToInitialize > 0) {
      let newItems = await this.initItems(needToInitialize, this.arrayOfItems);
      this.arrayOfItems.push(...newItems);
    }
  }

  abstract initItems(countToInitialize: number, existingItems: T[]): Promise<T[]>

  /**
   * Get single random item from pool
   */
  async get(): Promise<T> {
    await this.requireItems(1);
    let [result] = RandomArray.someItemsFrom(this.arrayOfItems, 1);
    return result;
  }

  /**
   * Get array of random items in the pool
   * @param count
   * @param randomCountAdder
   */
  async getArray(count: number, randomCountAdder: number = 0): Promise<T[]> {
    await this.requireItems(count);
    return RandomArray.someItemsFrom(this.arrayOfItems, count, randomCountAdder);
  }

  /**
   * Get random arrays from pool with specified sizes with no items overlap
   * @param counts
   */
  async getArraysDistinctive(counts: number[]): Promise<T[][]> {
    let total = 0;
    for (let count of counts) {
      total += count;
    }
    await this.requireItems(total);
    return RandomArray.splitToLengths(this.arrayOfItems, counts);
  }

  /**
   * Get random arrays from pool with specified sizes with possibility of items overlap
   * @param counts
   */
  async getArraysWithOverlap(counts: number[]): Promise<T[][]> {
    let total = 0;
    for (let count of counts) {
      total = Math.max(total, count);
    }
    return RandomArray.splitToLengthsWithOverlap(this.arrayOfItems, counts);
  }

}