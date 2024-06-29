import { Logger, validateMatch } from '../../src';

function doValidateMatch(params: {
  data: any,
  match: any
}) {
  try {
    validateMatch(params.data, params.match);
    Logger.log('OK');
  } catch (e) {
    Logger.log('----------------------------------------------------------');
    Logger.log('MATCH FAILED');
    Logger.log('DATA:');
    Logger.log('===');
    Logger.log(JSON.stringify(params.data, null, 2));
    Logger.log('===');
    Logger.log('MATCH:');
    Logger.log('===');
    Logger.log(JSON.stringify(params.match, null, 2));
    Logger.log('----------------------------------------------------------');
    throw e;
  }
}

export function validateMatchSuccess(params: {
  data: any,
  matchers: any[],
}) {
  Logger.log('VALIDATING MATCH');
  Logger.log(JSON.stringify(params, null, 2));
  for (let match of params.matchers) {
    Logger.log('VALIDATION: DIRECT');
    doValidateMatch({
      data: params.data,
      match: match,
    });
    Logger.log('VALIDATION: OBJECT');
    doValidateMatch({
      data: { value: params.data },
      match: { value: match },
    });
    Logger.log('VALIDATION: OBJECT WITH MANY ITEMS');
    doValidateMatch({
      data: { one: 1, value: params.data, two: 2 },
      match: { one: 1, value: match, two: 2 },
    });
    Logger.log('VALIDATION: ARRAY');
    doValidateMatch({
      data: [params.data],
      match: [match],
    });
    Logger.log('VALIDATION: ARRAY WITH MANY ITEMS');
    doValidateMatch({
      data: ['someValue', params.data, 'someOtherValue'],
      match: ['someValue', match, 'someOtherValue'],
    });
    Logger.log('VALIDATION: OBJECT IN ARRAY');
    doValidateMatch({
      data: [{ value: params.data }],
      match: [{ value: match }],
    });
    Logger.log('VALIDATION: ARRAY IN OBJECT');
    doValidateMatch({
      data: { value: [params.data] },
      match: { value: [match] },
    });
  }
}

export function validateMatchSuccessArray(params: {
  dataArray: any[],
  matchers: any[],
}) {
  for (let data of params.dataArray) {
    validateMatchSuccess({
      data: data,
      matchers: params.matchers,
    });
  }
}
