import { ValueMatcher } from './value.matcher';

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

}