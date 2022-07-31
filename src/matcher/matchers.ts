import { ValueMatcher, valueMatcher } from './value.matcher';
import { MatcherUtils } from './matcher.utils';
import { UuidUtils } from '../utils/uuid.utils';

export declare type StringMatcherOptions = 'can-be-empty' | 'can-be-null'

export class Matchers {

  /**
   * Strict equality
   * @param other
   */
  static equalsTo(other: any) {
    return valueMatcher('equalsTo', value => {
      return other;
    });
  }

  /**
   * Expect that value is NOT PRESENT
   */
  static valueAbsent() {
    return valueMatcher('undefined', value => {
      if (typeof value != 'undefined') {
        return '[expected not present]';
      }
      return value;
    });
  }

  /**
   * Any JsonObject
   */
  static anyObject(canBeNull: boolean = false, expected: any = null) {
    return valueMatcher('anyObject', value => {
      if (typeof value != 'undefined' && value == null && canBeNull) {
        return null;
      }
      if (!MatcherUtils.isObject(value)) {
        return '[expected JsonObject]';
      }
      if (expected != null) {
        return ValueMatcher.copyWithExpectedMatch(value, expected);
      }
      return value;
    });
  }

  /**
   * Any UUID
   */
  static anyUuid(canBeNull: boolean = false) {
    return valueMatcher('anyUuid', value => {
      if (canBeNull && value === null) {
        return value;
      }
      if (typeof value != 'string') {
        return '[UUID value expected]';
      }
      if (!UuidUtils.isValidUuid(value)) {
        return '[UUID value expected]';
      }
      return value;
    });
  }

  /**
   * Any DATE
   */
  static anyDate(canBeNull: boolean = false) {
    return valueMatcher('anyDate', value => {
      if (canBeNull && typeof value != 'undefined' && value == null) {
        return value;
      }
      if (value instanceof Date) {
        return value;
      }
      if (typeof value != 'string') {
        return '[date value expected]';
      }
      let date = Date.parse(value);
      if (!Number.isInteger(date)) {
        return '[date value expected]';
      }
      return value;
    });
  }

  /**
   * Any number (not NaN)
   */
  static anyNumber(canBeNull: boolean = false) {
    return valueMatcher('anyNumber', value => {
      if (canBeNull && typeof value != 'undefined' && value == null) {
        return value;
      }
      if (typeof value !== 'number' || !isFinite(value)) {
        return '[number value expected]';
      }
      return value;
    });
  }

  /**
   * Any boolean
   */
  static anyBoolean(canBeNull: boolean = false) {
    return valueMatcher('anyBoolean', value => {
      if (canBeNull && typeof value != 'undefined' && value == null) {
        return value;
      }
      if (typeof value !== 'boolean') {
        return '[boolean value expected]';
      }

      return value;
    });
  }

  /**
   * Any NOT NULL and NOT UNDEFINED
   */
  static anyValue() {
    return valueMatcher('anyValue', value => {
      if (value == null) {
        return '[expected some not null value]';
      }
      return value;
    });
  }

  /**
   * Any value or NULL
   */
  static anyDefined() {
    return valueMatcher('anyDefined', value => {
      if (typeof value == 'undefined') {
        return '[expected some defined value]';
      }
      return value;
    });
  }

  /**
   * Any not empty string
   */
  static anyString(...options: StringMatcherOptions[]) {
    return valueMatcher('anyString', (value) => {
      if (value == null && ValueMatcher.noOption(options, 'can-be-null')) {
        return ValueMatcher.error('value cannot be [null]', options);
      }
      if (typeof value != 'string') {
        return ValueMatcher.error('[string] value expected');
      }
      if (value.length == 0 && ValueMatcher.noOption(options, 'can-be-null')) {
        return ValueMatcher.error('value cannot be empty', options);
      }
      return ValueMatcher.success();
    });
  }

  /**
   * Any integer (not NaN)
   */
  static anyInteger() {
    return valueMatcher('anyInteger', value => {
      if (typeof value !== 'number' || !isFinite(value)) {
        return '[integer number value expected]';
      }
      if (!Number.isInteger(value)) {
        return '[integer number value expected]';
      }
      return value;
    });
  }

}