export class ArrayUtils {

  static contains<T>(array: T[], expected: T): boolean {
    for (let item of array) {
      if (item == expected) {
        return true;
      }
    }
    return false;
  }

}