import { ConsoleLogger, validateMatch } from '../../src';

function doValidateMatch(params: {
  data: any,
  match: any
}) {
  try {
    validateMatch(params.data, params.match);
    ConsoleLogger.log('OK');
  } catch (e) {
    ConsoleLogger.log('----------------------------------------------------------');
    ConsoleLogger.log('MATCH FAILED');
    ConsoleLogger.log('DATA:');
    ConsoleLogger.log('===');
    ConsoleLogger.log(JSON.stringify(params.data, null, 2));
    ConsoleLogger.log('===');
    ConsoleLogger.log('MATCH:');
    ConsoleLogger.log('===');
    ConsoleLogger.log(JSON.stringify(params.match, null, 2));
    ConsoleLogger.log('----------------------------------------------------------');
    throw e;
  }
}

export function validateMatchSuccess(params: {
  data: any,
  matchers: any,
}) {
  ConsoleLogger.log('VALIDATING MATCH');
  ConsoleLogger.log(JSON.stringify(params, null, 2));
  for (let match of params.matchers) {
    ConsoleLogger.log('VALIDATION: DIRECT');
    doValidateMatch({
      data: params.data,
      match: match,
    });
    ConsoleLogger.log('VALIDATION: OBJECT');
    doValidateMatch({
      data: { value: params.data },
      match: { value: match },
    });
    ConsoleLogger.log('VALIDATION: OBJECT WITH MANY ITEMS');
    doValidateMatch({
      data: { one: 1, value: params.data, two: 2 },
      match: { one: 1, value: match, two: 2 },
    });
    ConsoleLogger.log('VALIDATION: ARRAY');
    doValidateMatch({
      data: [params.data],
      match: [match],
    });
    ConsoleLogger.log('VALIDATION: ARRAY WITH MANY ITEMS');
    doValidateMatch({
      data: ['someValue', params.data, 'someOtherValue'],
      match: ['someValue', match, 'someOtherValue'],
    });
    ConsoleLogger.log('VALIDATION: OBJECT IN ARRAY');
    doValidateMatch({
      data: [{ value: params.data }],
      match: [{ value: match }],
    });
    ConsoleLogger.log('VALIDATION: ARRAY IN OBJECT');
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
