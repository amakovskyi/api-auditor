import { ValueMatcher, valueMatcher } from './value.matcher';
import { MatcherUtils } from './matcher.utils';

export class ObjectMatchers {

  static any(
    match: any = null,
    options?: {
      canBeNull?: boolean,
      optional?: boolean,
    },
  ) {
    if (match != null && !MatcherUtils.isObject(match)) {
      throw new Error('[match] should be a [JsonObject]');
    }
    return valueMatcher('Matchers.object', options, value => {
      if (!MatcherUtils.isObject(value)) {
        return ValueMatcher.typeError('JsonObject');
      }
      if (match != null) {
        return ValueMatcher.value(ValueMatcher.copyWithExpectedMatch(value, match));
      }
      return ValueMatcher.success();
    });
  }

  static only(
    match: any,
    options?: {
      canBeNull?: boolean,
      optional?: boolean,
    },
  ) {
    if (!MatcherUtils.isObject(match)) {
      throw new Error('[match] should be a [JsonObject]');
    }
    return valueMatcher('Matchers.object', options, value => {
      if (!MatcherUtils.isObject(value)) {
        return ValueMatcher.typeError('JsonObject');
      }
      let result: any = {};
      for (let key of Object.keys(match)) {
        if (key in value) {
          let valueValue = value[key];
          let matchValue = match[key];
          result[key] = ValueMatcher.copyWithExpectedMatch(valueValue, matchValue);
        }
      }
      return ValueMatcher.value(result);
    });
  }

  static exactly(
    match: any,
    options?: {
      canBeNull?: boolean,
      optional?: boolean,
    },
  ) {
    if (!MatcherUtils.isObject(match)) {
      throw new Error('[match] should be a [JsonObject]');
    }
    return valueMatcher('Matchers.object', options, value => {
      if (!MatcherUtils.isObject(value)) {
        return ValueMatcher.typeError('JsonObject');
      }
      let result: any = {};
      for (let key of Object.keys(match)) {
        let valueValue = value[key];
        let matchValue = match[key];
        result[key] = ValueMatcher.copyWithExpectedMatch(valueValue, matchValue);
      }
      return ValueMatcher.value(result);
    });
  }

}