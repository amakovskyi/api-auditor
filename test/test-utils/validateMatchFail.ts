import { Logger, validateMatch } from '../../src';
import { ValueMatcher } from '../../src/matcher/value.matcher';
import { cloneWithMatcherOptions, ExpectedMatcherErrorPlace } from './cloneWithMatcherOptions';

export function expectMatcherError(message: string, expectedMatcher: ValueMatcher = null): any {
  return new ExpectedMatcherErrorPlace(message, expectedMatcher);
}

export function doValidateMatchFail(params: {
  data: any,
  match: any,
  errorMatch: any
}) {
  try {
    validateMatch(params.data, params.match);
    let matched = ValueMatcher.copyWithExpectedMatch(params.data, params.match);
    Logger.log('DATA');
    Logger.log(JSON.stringify(params.data, null, 2));
    Logger.log('MATCH');
    Logger.log(JSON.stringify(params.match, null, 2));
    Logger.log('EXPECTED ERROR MATCH');
    Logger.log(JSON.stringify(params.errorMatch, null, 2));
    Logger.log('REAL MATCH');
    Logger.log(JSON.stringify(matched, null, 2));
    throw new Error('Expected match failed');
  } catch (e) {
    if (e?.matcherResult?.message != null) {
      Logger.println();
      Logger.log('MATCH FAILED AS EXPECTED');
      Logger.log(e.matcherResult.message);
      Logger.println();

      let matchedWithError = ValueMatcher.copyWithExpectedMatch(params.data, params.match);
      try {
        expect(matchedWithError).toEqual(params.errorMatch);
      } catch (e) {
        Logger.log('DATA');
        if (typeof params.data == 'undefined') {
          Logger.log('undefined');
        } else {
          Logger.log(JSON.stringify(params.data, null, 2));
        }
        Logger.log('EXPECTED ERROR MATCH');
        Logger.log(JSON.stringify(params.errorMatch, null, 2));
        Logger.log('REAL ERROR MATCH');
        Logger.log(JSON.stringify(matchedWithError, null, 2));
        throw e;
      }
    } else {
      throw e;
    }
  }
}

export function validateMatchFailSingle(params: {
  data: any,
  matcher: ValueMatcher,
  errorMatch: any
}) {
  let errorMatchWithOptions = cloneWithMatcherOptions(params.errorMatch, params.matcher);
  Logger.log('ERROR VALIDATION: DIRECT');
  doValidateMatchFail({
    data: params.data,
    match: params.matcher,
    errorMatch: errorMatchWithOptions,
  });
  Logger.log('ERROR VALIDATION: OBJECT');
  doValidateMatchFail({
    data: { value: params.data },
    match: { value: params.matcher },
    errorMatch: { value: errorMatchWithOptions },
  });
  Logger.log('ERROR VALIDATION: OBJECT WITH MANY ITEMS');
  doValidateMatchFail({
    data: { one: 1, value: params.data, two: 2 },
    match: { one: 1, value: params.matcher, two: 2 },
    errorMatch: { one: 1, value: errorMatchWithOptions, two: 2 },
  });
  Logger.log('ERROR VALIDATION: ARRAY');
  doValidateMatchFail({
    data: [params.data],
    match: [params.matcher],
    errorMatch: [errorMatchWithOptions],
  });
  Logger.log('ERROR VALIDATION: ARRAY WITH MANY ITEMS');
  doValidateMatchFail({
    data: ['someValue', params.data, 'someOtherValue'],
    match: ['someValue', params.matcher, 'someOtherValue'],
    errorMatch: ['someValue', errorMatchWithOptions, 'someOtherValue'],
  });
  Logger.log('ERROR VALIDATION: OBJECT IN ARRAY');
  doValidateMatchFail({
    data: [{ value: params.data }],
    match: [{ value: params.matcher }],
    errorMatch: [{ value: errorMatchWithOptions }],
  });
  Logger.log('ERROR VALIDATION: ARRAY IN OBJECT');
  doValidateMatchFail({
    data: { value: [params.data] },
    match: { value: [params.matcher] },
    errorMatch: { value: [errorMatchWithOptions] },
  });
}

export function validateMatchFail(params: {
  data: any,
  matchers: ValueMatcher | ValueMatcher[],
  errorMatch: any | {
    matcher: string,
    message: string,
    options?: any
  }
}) {
  if (params.matchers instanceof ValueMatcher) {
    validateMatchFailSingle({
      data: params.data,
      matcher: params.matchers,
      errorMatch: params.errorMatch,
    });
  } else {
    for (let matcher of params.matchers) {
      validateMatchFailSingle({
        data: params.data,
        matcher: matcher,
        errorMatch: params.errorMatch,
      });
    }
  }
}

export function validateMatchFailArray(params: {
  dataArray: any[],
  matchers: ValueMatcher | ValueMatcher[],
  errorMatch: any
}) {
  for (let data of params.dataArray) {
    validateMatchFail({
      data,
      matchers: params.matchers,
      errorMatch: params.errorMatch,
    });
  }
}
