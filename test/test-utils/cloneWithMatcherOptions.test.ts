import { customValueMatcher } from '../../src';
import { cloneWithMatcherOptions, ExpectedMatcherErrorPlace } from './cloneWithMatcherOptions';

describe('cloneWithMatcherOptions()', () => {

  test('No options', () => {
    let result = cloneWithMatcherOptions(
      new ExpectedMatcherErrorPlace('test_error_text', null),
      customValueMatcher('test_matcher_name', null, () => null),
    );
    expect(result).toEqual(
      {
        matcher: 'test_matcher_name',
        message: 'test_error_text',
      },
    );
  });

  test('Other matcher', () => {
    let result = cloneWithMatcherOptions(
      new ExpectedMatcherErrorPlace('test_error_text', customValueMatcher('custom_name', 'custom_options', () => null)),
      customValueMatcher('test_matcher_name', null, () => null),
    );
    expect(result).toEqual(
      {
        matcher: 'custom_name',
        message: 'test_error_text',
        options: 'custom_options',
      },
    );
  });

  test('Direct', () => {
    let result = cloneWithMatcherOptions(
      new ExpectedMatcherErrorPlace('test_error_text', null),
      customValueMatcher('test_matcher_name', 'test_options', () => null),
    );
    expect(result).toEqual(
      {
        matcher: 'test_matcher_name',
        message: 'test_error_text',
        options: 'test_options',
      },
    );
  });

  test('Object', () => {
    let result = cloneWithMatcherOptions(
      {
        test: 1,
        other: 1,
        error: new ExpectedMatcherErrorPlace('test_error_text', null),
      },
      customValueMatcher('test_matcher_name', 'test_options', () => null),
    );
    expect(result).toEqual(
      {
        test: 1,
        other: 1,
        error: {
          matcher: 'test_matcher_name',
          message: 'test_error_text',
          options: 'test_options',
        },
      },
    );
  });

  test('Array item', () => {
    let result = cloneWithMatcherOptions(
      [
        1,
        new ExpectedMatcherErrorPlace('test_error_text', null),
        3,
      ],
      customValueMatcher('test_matcher_name', 'test_options', () => null),
    );
    expect(result).toEqual(
      [
        1,
        {
          matcher: 'test_matcher_name',
          message: 'test_error_text',
          options: 'test_options',
        },
        3,
      ],
    );
  });

  test('Array item inside object', () => {
    let result = cloneWithMatcherOptions(
      {
        some: 'test',
        arr: [
          1,
          new ExpectedMatcherErrorPlace('test_error_text', null),
          3,
        ],
      },
      customValueMatcher('test_matcher_name', 'test_options', () => null),
    );
    expect(result).toEqual(
      {
        some: 'test',
        arr: [
          1,
          {
            matcher: 'test_matcher_name',
            message: 'test_error_text',
            options: 'test_options',
          },
          3,
        ],
      },
    );
  });

  test('Object inside array item', () => {
    let result = cloneWithMatcherOptions(
      [
        1,
        {
          test: 123,
          item: new ExpectedMatcherErrorPlace('test_error_text', null),
        },
        3,
      ],
      customValueMatcher('test_matcher_name', 'test_options', () => null),
    );
    expect(result).toEqual(
      [
        1,
        {
          test: 123,
          item: {
            matcher: 'test_matcher_name',
            message: 'test_error_text',
            options: 'test_options',
          },
        },
        3,
      ],
    );
  });

});