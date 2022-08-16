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

  static boolean(options?: {
    canBeNull?: boolean,
    optional?: boolean,
  }) {
    return valueMatcher('Matchers.boolean', options, value => {
      if (typeof value != 'boolean') {
        return ValueMatcher.typeError('boolean');
      }
      return ValueMatcher.success();
    });
  }

  static dateTime(options?: {
    canBeNull?: boolean,
    optional?: boolean,
  }) {
    return valueMatcher('Matchers.dateTime', options, value => {
      if (value instanceof Date) {
        return ValueMatcher.success();
      }
      if (typeof value != 'string') {
        return ValueMatcher.typeError('Date|string-ISO-date');
      }
      let date = Date.parse(value);
      if (!Number.isInteger(date)) {
        return ValueMatcher.typeError('Date|string-ISO-date');
      }
      let isoFormat = new Date(date).toISOString();
      if (isoFormat != value) {
        return ValueMatcher.typeError('Date|string-ISO-date');
      }
      return ValueMatcher.success();
    });
  }

  static dateTimeApprox(dateTime: Date, diff: {
    seconds?: number,
    minutes?: number,
    hours?: number,
    days?: number,
  }) {
    let options = { dateTime, near: diff };
    let diffMilliseconds = 0;
    if (diff?.seconds != null) diffMilliseconds += (diff.seconds * 1000);
    if (diff?.minutes != null) diffMilliseconds += (diff.minutes * 60_000);
    if (diff?.hours != null) diffMilliseconds += (diff.hours * 3600_000);
    if (diff?.days != null) diffMilliseconds += (diff.days * 86_400_000);
    if (diffMilliseconds < 0) {
      throw new Error('Total diff cannot be lesser than 0')
    }
    return customValueMatcher('Matchers.dateTime', options, value => {
      if (typeof value == 'undefined') {
        return ValueMatcher.error(ValueMatcher.VALUE_IS_REQUIRED);
      } else if (value == null) {
        return ValueMatcher.error(ValueMatcher.VALUE_CANNOT_BE_NULL);
      }
      let dateTimeValue: Date = null;
      if (value instanceof Date) {
        dateTimeValue = value;
      } else {
        if (typeof value != 'string') {
          return ValueMatcher.typeError('Date|string-ISO-date');
        }
        let date = Date.parse(value);
        if (!Number.isInteger(date)) {
          return ValueMatcher.typeError('Date|string-ISO-date');
        } else {
          dateTimeValue = new Date(date);
        }
        let isoFormat = new Date(date).toISOString();
        if (isoFormat != value) {
          return ValueMatcher.typeError('Date|string-ISO-date');
        }
      }
      let timestamp = dateTimeValue.getTime();
      if (Math.abs(timestamp - dateTime.getTime()) > diffMilliseconds) {
        return ValueMatcher.error('Date time is not near expected');
      }
      return ValueMatcher.success();
    });
  }

  static number(options?: {
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
    if (options?.near != null && options.near.maxDifference < 0) {
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
          return ValueMatcher.error('Value should be an integer');
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
          return ValueMatcher.error('Value is not near expected');
        }
        if (value > options.near.value + options.near.maxDifference) {
          return ValueMatcher.error('Value is not near expected');
        }
      }
      return ValueMatcher.success();
    });
  }

}