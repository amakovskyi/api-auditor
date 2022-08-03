import { customValueMatcher, ValueMatcher, valueMatcher } from './value.matcher';
import { MatcherUtils } from './matcher.utils';
import { UuidUtils } from '../utils/uuid.utils';

export class Matchers {

  /**
   * Always successful match, including [null] and missing value [undefined]
   */
  static anything() {
    return customValueMatcher('Matchers.anything', null, value => ValueMatcher.success());
  }

  /**
   * Strict equality to [other]
   * @param other
   */
  static equalsTo(other: any) {
    return customValueMatcher('Matchers.equalsTo', null, value => {
      return ValueMatcher.value(other);
    });
  }

  /**
   * Value should be absent ([undefined])
   */
  static absent() {
    return customValueMatcher('Matchers.absent', null, value => {
      if (typeof value == 'undefined') {
        return ValueMatcher.success();
      }
      return ValueMatcher.value(undefined);
    });
  }

  /**
   * Value should be absent ([undefined]) or [null]
   */
  static absentOrNull() {
    return customValueMatcher('Matchers.absentOrNull', null, value => {
      if (typeof value == 'undefined' || value == null) {
        return ValueMatcher.success();
      }
      return ValueMatcher.error('Expected no value or null');
    });
  }

  /**
   * Any value should be present, including [null]
   */
  static anyDefined() {
    return customValueMatcher('Matchers.anyDefined', null, value => {
      if (typeof value != 'undefined') {
        return ValueMatcher.success();
      }
      return ValueMatcher.error('Expected any defined value');
    });
  }

  /**
   * Value should present and be not [null]
   */
  static anyNotNull() {
    return customValueMatcher('Matchers.anyNotNull', null, value => {
      if (typeof value == 'undefined') {
        return ValueMatcher.error(ValueMatcher.VALUE_IS_REQUIRED);
      }
      if (value == null) {
        return ValueMatcher.error(ValueMatcher.VALUE_CANNOT_BE_NULL);
      }
      return ValueMatcher.success();
    });
  }

  static object(options?: {
    canBeNull?: boolean,
    optional?: boolean,
    match?: any
  }) {
    return valueMatcher('Matchers.object', options, value => {
      if (!MatcherUtils.isObject(value)) {
        return ValueMatcher.typeError('JsonObject');
      }
      if (options?.match != null) {
        return ValueMatcher.value(ValueMatcher.copyWithExpectedMatch(value, options.match));
      }
      return ValueMatcher.success();
    });
  }

  static string(options?: {
                  canBeNull?: boolean,
                  optional?: boolean,
                  canBeEmpty?: boolean
                },
  ) {
    return valueMatcher('Matchers.string', options, (value) => {
      if (typeof value != 'string') {
        return ValueMatcher.typeError('string');
      }
      if (value == '' && options?.canBeEmpty != true) {
        return ValueMatcher.error('Value cannot be empty');
      }
      return ValueMatcher.success();
    });
  }

  /**
   * Any UUID
   */
  static uuid(options?: {
    canBeNull?: boolean,
    optional?: boolean,
  }) {
    return valueMatcher('Matchers.uuid', options, value => {
      if (typeof value != 'string') {
        return ValueMatcher.typeError('uuid');
      }
      if (!UuidUtils.isValidUuid(value)) {
        return ValueMatcher.typeError('uuid');
      }
      return ValueMatcher.success();
    });
  }

  // DONE UNTIL HERE

  /**
   * Any DATE
   */
  static date(options?: {
    canBeNull?: boolean,
    optional?: boolean,
  }) {
    return valueMatcher('Matchers.date', options, value => {
      if (value instanceof Date) {
        return ValueMatcher.success();
      }
      if (typeof value != 'string') {
        return ValueMatcher.typeError('Date|string-date');
      }
      let date = Date.parse(value);
      if (!Number.isInteger(date)) {
        return ValueMatcher.typeError('Date|string-date');
      }
      return ValueMatcher.success();
    });
  }

  static number(options: {
    canBeNull?: boolean,
    optional?: boolean,
    shouldBeInteger?: boolean,
    bounds?: {
      min?: number,
      max?: number
    },
    near?: {
      value: number,
      maxDifference: number,
    }
    canBeNaN?: boolean
  }) {
    if (options.near != null && options.near.maxDifference < 0) {
      throw new Error('[options.near.maxDifference] cannot be negative');
    }
    return valueMatcher('Matchers.number', options, value => {
      if (typeof value != 'number') {
        return ValueMatcher.typeError('number');
      }
      if (options?.canBeNaN != true) {
        if (!isFinite(value)) {
          return ValueMatcher.error('Value cannot be NaN');
        }
      }
      if (options?.shouldBeInteger == true) {
        if (!Number.isInteger(value)) {
          return ValueMatcher.error('Value should be integer');
        }
      }
      if (options?.bounds != null) {
        if (options.bounds?.min != null && value < options.bounds?.min) {
          return ValueMatcher.error('Value is out of bounds');
        }
        if (options.bounds?.max != null && value > options.bounds?.max) {
          return ValueMatcher.error('Value is out of bounds');
        }
      }
      if (options?.near != null) {
        if (value < options.near.value - options.near.maxDifference) {
          return ValueMatcher.error('value is not near expected');
        }
        if (value > options.near.value + options.near.maxDifference) {
          return ValueMatcher.error('value is not near expected');
        }
      }
      return ValueMatcher.success();
    });
  }

  static boolean(options?: {
    canBeNull?: boolean,
    optional?: boolean,
  }) {
    return valueMatcher('anyBoolean', options, value => {
      if (typeof value != 'boolean') {
        return ValueMatcher.typeError('boolean');
      }
      return ValueMatcher.success();
    });
  }

}