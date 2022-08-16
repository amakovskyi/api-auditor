import { UuidUtils } from '../utils/uuid.utils';

const STRING_CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
const MAX_WORD_LENGTH = 16;

export class Random {

  static int(maxInclusive: number): number {
    return Math.floor(Math.random() * (maxInclusive + 1));
  }

  static intBetween(minInclusive: number, maxInclusive: number): number {
    return minInclusive + Random.int(maxInclusive - minInclusive);
  }

  static string(length: number, randomLengthAdder: number = 0): string {
    let expectedResultLength = length + Random.int(randomLengthAdder);
    let result = '';
    while (result.length < expectedResultLength) {
      result += STRING_CHARS.charAt(Random.int(STRING_CHARS.length - 1));
    }
    return result;
  }

  static text(length: number = 64, randomLengthAdder: number = 64): string {
    let expectedResultLength = length + Random.int(randomLengthAdder);
    let result = '';
    while (result.length < expectedResultLength) {
      let nextWordMaxLength = Math.min(expectedResultLength - result.length, MAX_WORD_LENGTH);
      result += Random.string(Random.intBetween(1, nextWordMaxLength));
      if (result.length < expectedResultLength - 1) {
        result += ' ';
      }
    }
    return result;
  }

  static uuid(): string {
    return UuidUtils.generate();
  }

  static boolean(trueThreshold: number = 0.5): boolean {
    if (trueThreshold < 0) {
      trueThreshold = 0;
    }
    if (trueThreshold > 1) {
      trueThreshold = 1;
    }
    return Math.random() > trueThreshold;
  }

}