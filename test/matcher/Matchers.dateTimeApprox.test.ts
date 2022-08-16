import { Matchers } from '../../src';
import { expectMatcherError, validateMatchFail, validateMatchFailArray } from '../test-utils/validateMatchFail';
import { validateMatchSuccessArray } from '../test-utils/validateMatchSuccess';
import { ValueMatcher } from '../../src/matcher/value.matcher';

describe('Matchers.dateTimeApprox()', () => {

  let second = 1000;
  let minute = 60 * second;
  let hour = 60 * minute;
  let day = 24 * hour;

  test('Date: no approx', () => {
    let timestamp = new Date();
    validateMatchSuccessArray({
      dataArray: [
        new Date(timestamp.getTime()),
        timestamp.toISOString(),
      ],
      matchers: [
        Matchers.dateTimeApprox(
          new Date(timestamp.getTime()),
          {},
        ),
      ],
    });
  });

  test('Date: approx seconds', () => {
    let timestamp = new Date();
    validateMatchSuccessArray({
      dataArray: [
        new Date(timestamp.getTime()),
        timestamp.toISOString(),
      ],
      matchers: [
        Matchers.dateTimeApprox(
          new Date(timestamp.getTime()),
          {
            seconds: 1,
          },
        ),
        Matchers.dateTimeApprox(
          new Date(timestamp.getTime() - (5 * second)),
          {
            seconds: 5,
          },
        ),
        Matchers.dateTimeApprox(
          new Date(timestamp.getTime() + (5 * second)),
          {
            seconds: 5,
          },
        ),
        Matchers.dateTimeApprox(
          new Date(timestamp.getTime()),
          {
            seconds: 300,
          },
        ),
        Matchers.dateTimeApprox(
          new Date(timestamp.getTime() - (300 * second)),
          {
            seconds: 300,
          },
        ),
        Matchers.dateTimeApprox(
          new Date(timestamp.getTime() + (300 * second)),
          {
            seconds: 300,
          },
        ),
      ],
    });
  });

  test('Date: approx minutes', () => {
    let timestamp = new Date();
    validateMatchSuccessArray({
      dataArray: [
        new Date(timestamp.getTime()),
        timestamp.toISOString(),
      ],
      matchers: [
        Matchers.dateTimeApprox(
          new Date(timestamp.getTime()),
          {
            minutes: 1,
          },
        ),
        Matchers.dateTimeApprox(
          new Date(timestamp.getTime() - (5 * minute)),
          {
            minutes: 5,
          },
        ),
        Matchers.dateTimeApprox(
          new Date(timestamp.getTime() + (5 * minute)),
          {
            minutes: 5,
          },
        ),
        Matchers.dateTimeApprox(
          new Date(timestamp.getTime()),
          {
            minutes: 300,
          },
        ),
        Matchers.dateTimeApprox(
          new Date(timestamp.getTime() - (300 * minute)),
          {
            minutes: 300,
          },
        ),
        Matchers.dateTimeApprox(
          new Date(timestamp.getTime() + (300 * minute)),
          {
            minutes: 300,
          },
        ),
      ],
    });
  });

  test('Date: approx minutes', () => {
    let timestamp = new Date();
    validateMatchSuccessArray({
      dataArray: [
        new Date(timestamp.getTime()),
        timestamp.toISOString(),
      ],
      matchers: [
        Matchers.dateTimeApprox(
          new Date(timestamp.getTime()),
          {
            hours: 1,
          },
        ),
        Matchers.dateTimeApprox(
          new Date(timestamp.getTime() - (5 * hour)),
          {
            hours: 5,
          },
        ),
        Matchers.dateTimeApprox(
          new Date(timestamp.getTime() + (5 * hour)),
          {
            hours: 5,
          },
        ),
        Matchers.dateTimeApprox(
          new Date(timestamp.getTime()),
          {
            hours: 300,
          },
        ),
        Matchers.dateTimeApprox(
          new Date(timestamp.getTime() - (300 * hour)),
          {
            hours: 300,
          },
        ),
        Matchers.dateTimeApprox(
          new Date(timestamp.getTime() + (300 * hour)),
          {
            hours: 300,
          },
        ),
      ],
    });
  });

  test('Date: approx minutes', () => {
    let timestamp = new Date();
    validateMatchSuccessArray({
      dataArray: [
        new Date(timestamp.getTime()),
        timestamp.toISOString(),
      ],
      matchers: [
        Matchers.dateTimeApprox(
          new Date(timestamp.getTime()),
          {
            days: 1,
          },
        ),
        Matchers.dateTimeApprox(
          new Date(timestamp.getTime() - (5 * day)),
          {
            days: 5,
          },
        ),
        Matchers.dateTimeApprox(
          new Date(timestamp.getTime() + (5 * day)),
          {
            days: 5,
          },
        ),
        Matchers.dateTimeApprox(
          new Date(timestamp.getTime()),
          {
            days: 300,
          },
        ),
        Matchers.dateTimeApprox(
          new Date(timestamp.getTime() - (300 * day)),
          {
            days: 300,
          },
        ),
        Matchers.dateTimeApprox(
          new Date(timestamp.getTime() + (300 * day)),
          {
            days: 300,
          },
        ),
      ],
    });
  });

  test('Date: approx mix', () => {
    let timestamp = new Date();
    validateMatchSuccessArray({
      dataArray: [
        new Date(timestamp.getTime()),
        timestamp.toISOString(),
      ],
      matchers: [
        Matchers.dateTimeApprox(
          new Date(timestamp.getTime()),
          {
            days: 3,
            hours: 5,
            minutes: 12,
            seconds: 21,
          },
        ),
        Matchers.dateTimeApprox(
          new Date(timestamp.getTime() - (3 * day) - (5 * hour) - (12 * minute) - (21 * second)),
          {
            days: 3,
            hours: 5,
            minutes: 12,
            seconds: 21,
          },
        ),
        Matchers.dateTimeApprox(
          new Date(timestamp.getTime() + (3 * day) + (5 * hour) + (12 * minute) + (21 * second)),
          {
            days: 3,
            hours: 5,
            minutes: 12,
            seconds: 21,
          },
        ),
      ],
    });
  });


  test('FAIL: Date: no approx', () => {
    let timestamp = new Date();
    validateMatchFailArray({
      dataArray: [
        new Date(timestamp.getTime()),
        timestamp.toISOString(),
      ],
      matchers: [
        Matchers.dateTimeApprox(
          new Date(timestamp.getTime() - 1),
          {},
        ),
        Matchers.dateTimeApprox(
          new Date(timestamp.getTime() + 1),
          {},
        ),
      ],
      errorMatch: expectMatcherError('Date time is not near expected'),
    });
  });

  test('FAIL: Date: approx seconds', () => {
    let timestamp = new Date();
    validateMatchFailArray({
      dataArray: [
        new Date(timestamp.getTime()),
        timestamp.toISOString(),
      ],
      matchers: [
        Matchers.dateTimeApprox(
          new Date(timestamp.getTime() - (5 * second) - second),
          {
            seconds: 5,
          },
        ),
        Matchers.dateTimeApprox(
          new Date(timestamp.getTime() + (5 * second) + second),
          {
            seconds: 5,
          },
        ),
        Matchers.dateTimeApprox(
          new Date(timestamp.getTime() - (300 * second) - second),
          {
            seconds: 300,
          },
        ),
        Matchers.dateTimeApprox(
          new Date(timestamp.getTime() + (300 * second) + second),
          {
            seconds: 300,
          },
        ),
      ],
      errorMatch: expectMatcherError('Date time is not near expected'),
    });
  });

  test('FAIL: Date: approx minutes', () => {
    let timestamp = new Date();
    validateMatchFailArray({
      dataArray: [
        new Date(timestamp.getTime()),
        timestamp.toISOString(),
      ],
      matchers: [
        Matchers.dateTimeApprox(
          new Date(timestamp.getTime() - (5 * minute) - second),
          {
            minutes: 5,
          },
        ),
        Matchers.dateTimeApprox(
          new Date(timestamp.getTime() + (5 * minute) + second),
          {
            minutes: 5,
          },
        ),
        Matchers.dateTimeApprox(
          new Date(timestamp.getTime() - (300 * minute) - second),
          {
            minutes: 300,
          },
        ),
        Matchers.dateTimeApprox(
          new Date(timestamp.getTime() + (300 * minute) + second),
          {
            minutes: 300,
          },
        ),
      ],
      errorMatch: expectMatcherError('Date time is not near expected'),
    });
  });

  test('FAIL: Date: approx minutes', () => {
    let timestamp = new Date();
    validateMatchFailArray({
      dataArray: [
        new Date(timestamp.getTime()),
        timestamp.toISOString(),
      ],
      matchers: [
        Matchers.dateTimeApprox(
          new Date(timestamp.getTime() - (5 * hour) - second),
          {
            hours: 5,
          },
        ),
        Matchers.dateTimeApprox(
          new Date(timestamp.getTime() + (5 * hour) + second),
          {
            hours: 5,
          },
        ),
        Matchers.dateTimeApprox(
          new Date(timestamp.getTime() - (300 * hour) - second),
          {
            hours: 300,
          },
        ),
        Matchers.dateTimeApprox(
          new Date(timestamp.getTime() + (300 * hour) + second),
          {
            hours: 300,
          },
        ),
      ],
      errorMatch: expectMatcherError('Date time is not near expected'),
    });
  });

  test('FAIL: Date: approx minutes', () => {
    let timestamp = new Date();
    validateMatchFailArray({
      dataArray: [
        new Date(timestamp.getTime()),
        timestamp.toISOString(),
      ],
      matchers: [
        Matchers.dateTimeApprox(
          new Date(timestamp.getTime() - (5 * day) - second),
          {
            days: 5,
          },
        ),
        Matchers.dateTimeApprox(
          new Date(timestamp.getTime() + (5 * day) + second),
          {
            days: 5,
          },
        ),
        Matchers.dateTimeApprox(
          new Date(timestamp.getTime() - (300 * day) - second),
          {
            days: 300,
          },
        ),
        Matchers.dateTimeApprox(
          new Date(timestamp.getTime() + (300 * day) + second),
          {
            days: 300,
          },
        ),
      ],
      errorMatch: expectMatcherError('Date time is not near expected'),
    });
  });

  test('FAIL: Date: approx mix', () => {
    let timestamp = new Date();
    validateMatchFailArray({
      dataArray: [
        new Date(timestamp.getTime()),
        timestamp.toISOString(),
      ],
      matchers: [
        Matchers.dateTimeApprox(
          new Date(timestamp.getTime() - (3 * day) - (5 * hour) - (12 * minute) - (21 * second) - second),
          {
            days: 3,
            hours: 5,
            minutes: 12,
            seconds: 21,
          },
        ),
        Matchers.dateTimeApprox(
          new Date(timestamp.getTime() + (3 * day) + (5 * hour) + (12 * minute) + (21 * second) + second),
          {
            days: 3,
            hours: 5,
            minutes: 12,
            seconds: 21,
          },
        ),
      ],
      errorMatch: expectMatcherError('Date time is not near expected'),
    });
  });

  test('FAIL: undefined', () => {
    let timestamp = new Date();
    validateMatchFail({
      data: undefined,
      matchers: [
        Matchers.dateTimeApprox(timestamp, {}),
      ],
      errorMatch: expectMatcherError(ValueMatcher.VALUE_IS_REQUIRED),
    });
  });

  test('FAIL: null', () => {
    let timestamp = new Date();
    validateMatchFail({
      data: null,
      matchers: [
        Matchers.dateTimeApprox(timestamp, {}),
      ],
      errorMatch: expectMatcherError(ValueMatcher.VALUE_CANNOT_BE_NULL),
    });
  });

  test('FAIL: wrong params', () => {
    try {
      Matchers.dateTimeApprox(new Date(), {seconds: -1});
    } catch (e) {
      console.log(e)
      expect(e.message).toEqual('Total diff cannot be lesser than 0')
    }
  });

});