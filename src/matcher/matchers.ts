import { ValueMatcher, valueMatcher } from './value.matcher';
import { MatcherUtils } from './matcher.utils';
import { UuidUtils } from '../utils/uuid.utils';

export class Matchers {

  /**
   * Always successful match, including [null] and missing value [undefined]
   */
  static anything() {
    return valueMatcher('Matchers.anything', value => ValueMatcher.success());
  }

  /**
   * Strict equality to [other]
   * @param other
   */
  static equalsTo(other: any) {
    return valueMatcher('Matchers.equalsTo', value => {
      return ValueMatcher.value(other);
    });
  }

  /**
   * Value should be absent ([undefined])
   */
  static absent() {
    return valueMatcher('Matchers.absent', value => {
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
    return valueMatcher('Matchers.absentOrNull', value => {
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
    return valueMatcher('Matchers.anyDefined', value => {
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
    return valueMatcher('Matchers.anyNotNull', value => {
      if (typeof value == 'undefined') {
        return ValueMatcher.error('Expected some value');
      }
      if (value == null) {
        return ValueMatcher.error('Expected value is not null');
      }
      return ValueMatcher.success();
    });
  }

  static object(options?: {
    canBeNull?: boolean,
    match?: any
  }) {
    return valueMatcher('Matchers.object', value => {
      if (typeof value == 'undefined') {
        return ValueMatcher.error('expected [JsonObject] value', options);
      }
      if (value == null) {
        if (options?.canBeNull == true) {
          return ValueMatcher.success();
        } else {
          return ValueMatcher.error('value cannot be null', options);
        }
      }
      if (!MatcherUtils.isObject(value)) {
        return ValueMatcher.error('expected value of type [JsonObject]');
      }
      if (options?.match != null) {
        return ValueMatcher.value(ValueMatcher.copyWithExpectedMatch(value, options.match));
      }
      return ValueMatcher.success();
    });
  }

  static string(options?: { canBeNull?: boolean, canBeEmpty?: boolean }) {
    return valueMatcher('Matchers.string', (value) => {
      if (value == null) {
        if (options?.canBeNull == true) {
          return ValueMatcher.success();
        } else {
          return ValueMatcher.error('value cannot be [null]', options);
        }
      }
      if (typeof value != 'string') {
        return ValueMatcher.error('[string] value expected', options);
      }
      if (value == '' && options?.canBeEmpty != true) {
        return ValueMatcher.error('value cannot be empty', options);
      }
      return ValueMatcher.success();
    });
  }

  /**
   * Any UUID
   */
  static uuid(options?: {
    canBeNull?: boolean
  }) {
    return valueMatcher('Matchers.uuid', value => {
      if (value == null) {
        if (options?.canBeNull == true) {
          return ValueMatcher.success();
        } else {
          return ValueMatcher.error('value cannot be [null]', options);
        }
      }
      if (typeof value != 'string') {
        return ValueMatcher.error('[uuid] value expected', options);
      }
      if (!UuidUtils.isValidUuid(value)) {
        return ValueMatcher.error('[uuid] value expected', options);
      }
      return ValueMatcher.success();
    });
  }

  // DONE UNTIL HERE

  /**
   * Any DATE
   */
  static date(options?: {
    canBeNull?: boolean
  }) {
    return valueMatcher('Matchers.date', value => {
      if (value == null) {
        if (options?.canBeNull == true) {
          return ValueMatcher.success();
        } else {
          return ValueMatcher.error('value cannot be [null]', options);
        }
      }
      if (value instanceof Date) {
        return ValueMatcher.success();
      }
      if (typeof value != 'string') {
        return ValueMatcher.error('[Date] value or date [string] expected', options);
      }
      let date = Date.parse(value);
      if (!Number.isInteger(date)) {
        return ValueMatcher.error('[Date] value or date [string] expected', options);
      }
      return ValueMatcher.success();
    });
  }

  static number(options: {
    canBeNull?: boolean,
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
    return valueMatcher('Matchers.number', value => {
      if (value == null) {
        if (options?.canBeNull == true) {
          return ValueMatcher.success();
        } else {
          return ValueMatcher.error('value cannot be [null]', options);
        }
      }
      if (typeof value != 'number' || !isFinite(value)) {
        return ValueMatcher.error('[number] value expected', options);
      }
      if (options?.canBeNaN != true) {
        if (!isFinite(value)) {
          return ValueMatcher.error('value cannot be NaN', options);
        }
      }
      if (options?.shouldBeInteger == true) {
        if (!Number.isInteger(value)) {
          return ValueMatcher.error('value should be integer', options);
        }
      }
      if (options?.bounds != null) {
        if (options.bounds?.min != null && value < options.bounds?.min) {
          return ValueMatcher.error('value is out of bounds', options);
        }
        if (options.bounds?.max != null && value > options.bounds?.max) {
          return ValueMatcher.error('value is out of bounds', options);
        }
      }
      if (options?.near != null) {
        if (value < options.near.value - options.near.maxDifference) {
          return ValueMatcher.error('value is not near expected', options);
        }
        if (value > options.near.value + options.near.maxDifference) {
          return ValueMatcher.error('value is not near expected', options);
        }
      }
      return ValueMatcher.success();
    });
  }

  static boolean(options?: {
    canBeNull?: boolean
  }) {
    return valueMatcher('anyBoolean', value => {
      if (value == null) {
        if (options?.canBeNull == true) {
          return ValueMatcher.success();
        } else {
          return ValueMatcher.error('value cannot be [null]', options);
        }
      }
      if (typeof value !== 'boolean') {
        return ValueMatcher.error('[boolean] value expected]', options);
      }
      return ValueMatcher.success();
    });
  }

}