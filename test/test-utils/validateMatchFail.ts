import { ConsoleLogger, validateMatch } from '../../src';
import { ValueMatcher } from '../../src/matcher/value.matcher';

function doValidateMatchFail(params: {
  data: any,
  match: any,
  errorMatch: any
}) {
  try {
    validateMatch(params.data, params.match);
    let matched = ValueMatcher.copyWithExpectedMatch(params.data, params.match);
    ConsoleLogger.log('DATA');
    ConsoleLogger.log(JSON.stringify(params.data, null, 2));
    ConsoleLogger.log('EXPECTED ERROR MATCH');
    ConsoleLogger.log(JSON.stringify(params.errorMatch, null, 2));
    ConsoleLogger.log('REAL MATCH');
    ConsoleLogger.log(JSON.stringify(matched, null, 2));
    throw new Error('Expected match failed');
  } catch (e) {
    if (e?.matcherResult?.message != null) {
      ConsoleLogger.println();
      ConsoleLogger.log('MATCH FAILED AS EXPECTED');
      ConsoleLogger.log(e.matcherResult.message);
      ConsoleLogger.println();

      let matchedWithError = ValueMatcher.copyWithExpectedMatch(params.data, params.match);
      try {
        expect(matchedWithError).toEqual(params.errorMatch);
      } catch (e) {
        ConsoleLogger.log('DATA');
        ConsoleLogger.log(JSON.stringify(params.data, null, 2));
        ConsoleLogger.log('EXPECTED ERROR MATCH');
        ConsoleLogger.log(JSON.stringify(params.errorMatch, null, 2));
        ConsoleLogger.log('REAL ERROR MATCH');
        ConsoleLogger.log(JSON.stringify(matchedWithError, null, 2));
        throw e;
      }
    } else {
      throw e;
    }
  }
}

export function validateMatchFail(params: {
  data: any,
  match: any,
  errorMatch: any
}) {
  ConsoleLogger.log('ERROR VALIDATION: DIRECT');
  doValidateMatchFail({
    data: params.data,
    match: params.match,
    errorMatch: params.errorMatch,
  });
  ConsoleLogger.log('ERROR VALIDATION: OBJECT');
  doValidateMatchFail({
    data: { value: params.data },
    match: { value: params.match },
    errorMatch: { value: params.errorMatch },
  });
  ConsoleLogger.log('ERROR VALIDATION: OBJECT WITH MANY ITEMS');
  doValidateMatchFail({
    data: { one: 1, value: params.data, two: 2 },
    match: { one: 1, value: params.match, two: 2 },
    errorMatch: { one: 1, value: params.errorMatch, two: 2 },
  });
  ConsoleLogger.log('ERROR VALIDATION: ARRAY');
  doValidateMatchFail({
    data: [params.data],
    match: [params.match],
    errorMatch: [params.errorMatch],
  });
  ConsoleLogger.log('ERROR VALIDATION: ARRAY WITH MANY ITEMS');
  doValidateMatchFail({
    data: ['someValue', params.data, 'someOtherValue'],
    match: ['someValue', params.match, 'someOtherValue'],
    errorMatch: ['someValue', params.errorMatch, 'someOtherValue'],
  });
  ConsoleLogger.log('ERROR VALIDATION: OBJECT IN ARRAY');
  doValidateMatchFail({
    data: [{ value: params.data }],
    match: [{ value: params.match }],
    errorMatch: [{ value: params.errorMatch }],
  });
  ConsoleLogger.log('ERROR VALIDATION: ARRAY IN OBJECT');
  doValidateMatchFail({
    data: { value: [params.data] },
    match: { value: [params.match] },
    errorMatch: { value: [params.errorMatch] },
  });
}

export function validateMatchFailArray(params: {
  dataArray: any[],
  match: any,
  errorMatch: any
}) {
  for (let data of params.dataArray) {
    validateMatchFail({
      data,
      match: params.match,
      errorMatch: params.errorMatch,
    });
  }
}
