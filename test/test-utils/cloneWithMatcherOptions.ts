import { MatcherUtils } from '../../src/matcher/matcher.utils';
import { ValueMatcher } from '../../src/matcher/value.matcher';

export class ExpectedMatcherErrorPlace {
  constructor(readonly message: string,
              readonly expectedMatcher: ValueMatcher) {
  }
}

export function cloneWithMatcherOptions(data: any, valueMatcher: ValueMatcher): any {
  if (data == null) {
    return data;
  }
  if (data instanceof ExpectedMatcherErrorPlace) {
    let matcher = data.expectedMatcher ?? valueMatcher;
    let result: any = {
      matcher: matcher.name,
      message: data.message,
    };
    if (matcher.options != null) {
      result.options = matcher.options;
    }
    return result;
  }
  if (MatcherUtils.isArray(data)) {
    let result = [];
    for (let item of data) {
      result.push(cloneWithMatcherOptions(item, valueMatcher));
    }
    return result;
  }
  if (MatcherUtils.isObject(data)) {
    let result: any = {};
    for (let key of Object.keys(data)) {
      let value = data[key];
      result[key] = cloneWithMatcherOptions(value, valueMatcher);
    }
    return result;
  }
  return data;
}