import { ValueMatcher } from './value.matcher';
import { isDeepStrictEqual } from 'util';

export class MatcherUtils {

  static isArray(value: any): boolean {
    return Array.isArray(value);
  }

  static isObject(value: any): boolean {
    return !(value instanceof ValueMatcher) && Object(value) === value && !Array.isArray(value);
  }

  static isStrictNull(value: any): boolean {
    return value == null && typeof value != 'undefined';
  }

  static isFullyEquals(left: any, right: any): boolean {
    if (typeof left == 'undefined' && typeof right == 'undefined') {
      return true;
    }
    if (MatcherUtils.isStrictNull(left) && MatcherUtils.isStrictNull(right)) {
      return true;
    }
    if (isDeepStrictEqual(left, right)) {
      return true;
    }
    return false;
  }

}