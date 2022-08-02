import { expectThrowException, generateUuid, utcDate } from './utils';
import { matchAll, matchAny, validateMatch } from '../src/matcher/matcher.validation';
import { anyString } from '../dist/validation/generic/any.string.expectation';

function validateContentFail(data, expected) {
  try {
    validateMatch(data, expected);
    expectThrowException();
  } catch (e) {
    console.log(e);
  }
}

describe('Content validation', () => {

  it('Check on many keys', () => {
    let data = {
      some: 'one',
      other: 'two',
      utility: 'three',
      check: 'four',
      super: 'five',
    };
    validateMatch(data, { other: 'two', utility: 'three', check: 'four', super: 'five' });
    validateMatch(data, { some: 'one', utility: 'three', check: 'four', super: 'five' });
    validateMatch(data, { some: 'one', other: 'two', check: 'four', super: 'five' });
    validateMatch(data, { some: 'one', other: 'two', utility: 'three', super: 'five' });
    validateMatch(data, { some: 'one', other: 'two', utility: 'three', check: 'four' });
    validateContentFail(data, { err: 1, some: 'one', other: 'two', utility: 'three', check: 'four', super: 'five' });
    validateContentFail(data, { some: 'one', base: [], other: 'two', utility: 'three', check: 'four', super: 'five' });
    validateContentFail(data, {
      some: 'one', other: 'two', obj: { test: 1, notTest: '2' },
      utility: 'three', check: 'four', super: 'five',
    });
    validateContentFail(data, {
      some: 'one', other: 'two', utility: 'three',
      someAny: anyValue(), check: 'four', super: 'five',
    });
    validateContentFail(data, {
      some: 'one', other: 'two', utility: 'three',
      check: 'four', someArr: anyArray(), super: 'five',
    });
    validateContentFail(data, {
      some: 'one', other: 'two', utility: 'three',
      check: 'four', super: 'five', thing: [1, 2, 3],
    });
  });

  it('Data can contain additional fields which is ignored by check', () => {
    let data = {
      some: 1,
      other: '2',
      items: [1, 2, 3],
      set: {
        one: 1,
        two: '2',
      },
    };
    validateMatch(data, { some: 1 });
    validateMatch(data, { other: '2' });
    validateMatch(data, { items: [1, 2, 3] });
    validateMatch(data, { some: anyValue() });
    validateMatch(data, { other: anyString() });
    validateMatch(data, { items: [anyValue(), anyValue(), anyValue()] });
    validateMatch(data, { items: anyArray() });
    validateMatch(data, { items: anyArray(3) });
    validateMatch(data, { set: anyValue() });
    validateMatch(data, { set: anyObject() });
    validateMatch(data, {
      set: {},
    });
    validateMatch(data, {
      set: {
        one: 1,
        two: '2',
      },
    });
    validateMatch(data, {
      set: {
        one: anyValue(),
        two: anyString(),
      },
    });
    validateContentFail(data, { missing: 1 });
    validateContentFail(data, { missing: anyString() });
    validateContentFail(data, {
      missing: 1,
    });
    validateContentFail(data, {
      missing: anyString(),
    });
    validateContentFail(data, {
      missing: null,
    });
    validateContentFail(data, {
      set: {
        missing: 1,
      },
    });
    validateContentFail(data, {
      set: {
        missing: anyString(),
      },
    });
    validateContentFail(data, {
      set: {
        missing: null,
      },
    });
  });

  it('Array content check', () => {
    let data = {
      items: [
        {
          index: 1,
          some: 'Other',
          state: true,
        },
        {
          index: 2,
          some: 'Value',
          state: false,
        },
      ],
    };
    validateMatch(data, {
      items: [
        {
          index: 1,
        },
        {
          some: 'Value',
          state: false,
        },
      ],
    });
    validateMatch(data, {
      items: [
        {
          some: anyString(),
          state: anyValue(),
        },
        {
          index: anyValue(),
        },
      ],
    });
    validateMatch(data, {
      items: [
        anyObject(),
        {
          index: anyValue(),
        },
      ],
    });
    validateContentFail(data, {
      items: anyArray(3),
    });
    validateContentFail(data, {
      items: [
        anyObject(),
      ],
    });
    validateContentFail(data, {
      items: [
        anyObject(), anyObject(), anyObject(),
      ],
    });
    validateContentFail(data, {
      items: [
        anyObject(), {
          unspecifiedValue: 1,
        },
      ],
    });
    validateContentFail(data, {
      items: [
        anyObject(), {
          index: 99,
        },
      ],
    });
  });

  it('Any value in object: success', () => {
    validateMatch({
      some: 1,
      other: '2',
      another: true,
      obj: {
        some: 1,
      },
      arr: [
        1, 2, 3,
      ],
    }, {
      some: anyValue(),
      other: anyValue(),
      another: anyValue(),
      obj: anyValue(),
      arr: anyValue(),
    });
  });

  it('Any value in array: success', () => {
    validateMatch([1, '2', true, { val: 1 }, [1, 2, 3]], [anyValue(), anyValue(), anyValue(), anyValue(), anyValue()]);
  });

  it('Any value: success', () => {
    validateMatch(1, anyValue());
    validateMatch('11', anyValue());
    validateMatch(false, anyValue());
    validateMatch({ val: 1 }, anyValue());
    validateMatch([1, 2, 3], anyValue());
  });

  it('Any value cannot be null: in object', () => {
    validateContentFail(
      {
        some: null,
      }, {
        some: anyValue(),
      },
    );
  });

  it('Any value cannot be null: in array', () => {
    validateContentFail([null], [anyValue()]);
  });

  it('Any value cannot be null: direct', () => {
    validateContentFail(null, anyValue());
  });

  it('Any defined: success', () => {
    validateMatch({
      someNull: anyDefined(),
      some: 1,
      other: '2',
      another: true,
      obj: {
        some: 1,
      },
      arr: [
        1, 2, 3,
      ],
    }, {
      someNull: anyDefined(),
      some: anyDefined(),
      other: anyDefined(),
      another: anyDefined(),
      obj: anyDefined(),
      arr: anyDefined(),
    });
  });

  it('Any defined in array: success', () => {
    validateMatch([1, null, '2', true, { val: 1 }, [1, 2, 3]],
      [anyDefined(), anyDefined(), anyDefined(), anyDefined(), anyDefined(), anyDefined()]);
  });

  it('Any defined direct: success', () => {
    validateMatch(null, anyDefined());
    validateMatch(1, anyDefined());
    validateMatch('11', anyDefined());
    validateMatch(false, anyDefined());
    validateMatch({ val: 1 }, anyDefined());
    validateMatch([1, 2, 3], anyDefined());
  });

  it('Any defined cannot be undefined: in object', () => {
    validateContentFail(
      {
        // some is not defined,
      }, {
        some: anyDefined(),
      },
    );
  });

  it('Any defined cannot be null: in array', () => {
    validateContentFail([undefined], [anyDefined()]);
  });

  it('Any value cannot be undefined: direct', () => {
    validateContentFail(undefined, anyDefined());
  });

  it('Any string: success', () => {
    validateMatch('str', anyString());
    validateMatch('', anyString(true));
    validateMatch({
      one: 'string',
      another: '',
    }, {
      one: anyString(),
      another: anyString(true),
    });
    validateMatch({
      one: {
        another: 'some',
      },
    }, {
      one: {
        another: anyString(),
      },
    });
    validateMatch({
      one: ['some'],
    }, {
      one: [anyString()],
    });
    validateMatch(['str', ''], [anyString(), anyString(true)]);
  });

  it('Any string: fail', () => {
    validateContentFail('', anyString());
    validateContentFail(null, anyString(true));
    validateContentFail(1, anyString());
    validateContentFail({ some: 1 }, anyString());
    validateContentFail([1], anyString());
    validateContentFail({
      one: 1,
    }, {
      one: anyString(),
    });
  });

  it('Date: success', () => {
    validateMatch('2021-05-31T15:31:23.257Z', anyDate());
    validateMatch({
      dat: '2021-05-31T15:31:23.257Z',
    }, {
      dat: anyDate(),
    });
    validateMatch({
      dat: {
        som: '2021-05-31T15:31:23.257Z',
      },
    }, {
      dat: {
        som: anyDate(),
      },
    });
    validateMatch({
      dat: ['2021-05-31T15:31:23.257Z'],
    }, {
      dat: [anyDate()],
    });
    validateMatch(
      ['2021-05-31T15:31:23.257Z', '2020-05-31T15:31:23.257Z'],
      [anyDate(), anyDate()],
    );
  });

  it('Date: fail', () => {
    validateContentFail('not-a-date', anyDate());
    validateContentFail(1, anyDate());
    validateContentFail({
      dat: 'not-a-date',
    }, {
      dat: anyDate(),
    });
    validateContentFail({
      dat: true,
    }, {
      dat: anyDate(),
    });
    validateContentFail({
      dat: {
        som: 'not-a-date',
      },
    }, {
      dat: {
        som: anyDate(),
      },
    });
    validateContentFail({
      dat: {
        som: null,
      },
    }, {
      dat: {
        som: anyDate(),
      },
    });
    validateContentFail({
      dat: ['not-a-date'],
    }, {
      dat: [anyDate()],
    });
    validateContentFail({
      dat: [
        { json: 'obj' },
      ],
    }, {
      dat: [anyDate()],
    });
    validateContentFail(
      [null, '2020-05-31T15:31:23.257Z'],
      [anyDate(), anyDate()],
    );
    validateContentFail(
      [[1, 2, 3], '2020-05-31T15:31:23.257Z'],
      [anyDate(), anyDate()],
    );
  });

  it('UUID: success', () => {
    validateMatch('4bce889a-92ee-4c94-932a-d4e0f98039f7', anyUuid());
    validateMatch({
      dat: '4bce889a-92ee-4c94-932a-d4e0f98039f7',
    }, {
      dat: anyUuid(),
    });
    validateMatch({
      dat: {
        som: '4bce889a-92ee-4c94-932a-d4e0f98039f7',
      },
    }, {
      dat: {
        som: anyUuid(),
      },
    });
    validateMatch({
      dat: ['4bce889a-92ee-4c94-932a-d4e0f98039f7'],
    }, {
      dat: [anyUuid()],
    });
    validateMatch(
      ['4bce889a-92ee-4c94-932a-d4e0f98039f7', 'eb255f90-00b4-4735-a32f-cf72dc916711'],
      [anyUuid(), anyUuid()],
    );
  });

  it('UUID: fail', () => {
    validateContentFail('not-a-uuid', anyUuid());
    validateContentFail(1, anyUuid());
    validateContentFail({
      dat: 'not-a-uuid',
    }, {
      dat: anyUuid(),
    });
    validateContentFail({
      dat: true,
    }, {
      dat: anyUuid(),
    });
    validateContentFail({
      dat: {
        som: 'not-a-uuid',
      },
    }, {
      dat: {
        som: anyUuid(),
      },
    });
    validateContentFail({
      dat: {
        som: null,
      },
    }, {
      dat: {
        som: anyUuid(),
      },
    });
    validateContentFail({
      dat: ['not-a-uuid'],
    }, {
      dat: [anyUuid()],
    });
    validateContentFail({
      dat: [
        { json: 'obj' },
      ],
    }, {
      dat: [anyUuid()],
    });
    validateContentFail(
      [null, 'eb255f90-00b4-4735-a32f-cf72dc916711'],
      [anyUuid(), anyUuid()],
    );
    validateContentFail(
      [[1, 2, 3], 'eb255f90-00b4-4735-a32f-cf72dc916711'],
      [anyUuid(), anyUuid()],
    );
  });

  it('File url: success', () => {
    validateMatch('https://some.domain/file1.txt', fileUrl('file1.txt'));
    validateMatch({
      dat: 'https://some.domain/file1.txt',
    }, {
      dat: fileUrl('file1.txt'),
    });
    validateMatch({
      dat: {
        som: 'https://some.domain/file1.txt',
      },
    }, {
      dat: {
        som: fileUrl('file1.txt'),
      },
    });
    validateMatch({
      dat: ['https://some.domain/file1.txt'],
    }, {
      dat: [fileUrl('file1.txt')],
    });
    validateMatch(
      ['https://some.domain/file1.txt', 'https://some.domain/file2.txt'],
      [fileUrl('file1.txt'), fileUrl('file2.txt')],
    );
  });

  it('File url: fail', () => {
    validateContentFail('not-a-file-url', fileUrl('file1.txt'));
    validateContentFail(1, fileUrl('file1.txt'));
    validateContentFail({
      dat: 'not-a-file-url',
    }, {
      dat: fileUrl('file1.txt'),
    });
    validateContentFail({
      dat: true,
    }, {
      dat: fileUrl('file1.txt'),
    });
    validateContentFail({
      dat: {
        som: 'not-a-file-url',
      },
    }, {
      dat: {
        som: fileUrl('file1.txt'),
      },
    });
    validateContentFail({
      dat: {
        som: null,
      },
    }, {
      dat: {
        som: fileUrl('file1.txt'),
      },
    });
    validateContentFail({
      dat: ['not-a-file-url'],
    }, {
      dat: [fileUrl('file1.txt')],
    });
    validateContentFail({
      dat: [
        { json: 'obj' },
      ],
    }, {
      dat: [fileUrl('file1.txt')],
    });
    validateContentFail(
      [null, 'https://some.domain/file1.txt'],
      [fileUrl('file1.txt'), fileUrl('file2.txt')],
    );
    validateContentFail(
      [[1, 2, 3], 'eb255f90-00b4-4735-a32f-cf72dc916711'],
      [fileUrl('file1.txt'), fileUrl('file1.txt')],
    );
  });

  it('Value is absent (undefined): success', () => {
    validateMatch(
      {}, { some: valueAbsent() },
    );
    validateMatch(
      {
        items: [
          {},
        ],
      }, {
        items: [
          {
            some: valueAbsent(),
          },
        ],
      },
    );
  });

  it('Value is absent (undefined): fail', () => {
    validateContentFail(
      {
        some: 'value',
      }, { some: valueAbsent() },
    );
    validateContentFail(
      {
        items: [
          {
            some: null,
          },
        ],
      }, {
        items: [
          {
            some: valueAbsent(),
          },
        ],
      },
    );
  });

  it('Validate object: success', () => {
    validateMatch({}, anyObject());
    validateMatch([{}], [anyObject()]);
    validateMatch({ some: {} }, { some: anyObject() });
  });

  it('Validate object: fail', () => {
    validateContentFail(1, anyObject());
    validateContentFail(['string'], [anyObject()]);
    validateContentFail({ some: null }, { some: anyObject() });
    validateContentFail({ some: undefined }, { some: anyObject() });
    validateContentFail({ some: [] }, { some: anyObject() });
  });

  it('Validate array: success', () => {
    validateMatch([], anyArray());
    validateMatch([[]], [anyArray()]);
    validateMatch({ some: [] }, { some: anyArray() });
  });

  it('Validate array: fail', () => {
    validateContentFail(1, anyArray());
    validateContentFail(['string'], [anyArray()]);
    validateContentFail({ some: null }, { some: anyArray() });
    validateContentFail({ some: undefined }, { some: anyArray() });
    validateContentFail({ some: {} }, { some: anyArray() });
  });

  it('Validate array containing: success', () => {
    validateMatch([1, 2, 3], anyArrayContaining(1));
    validateMatch([1, 2, 3], anyArrayContaining(1, 2));
    validateMatch(['string', 'another', 'some'], anyArrayContaining('string'));
    validateMatch(['string', 'another', 'some'], anyArrayContaining('another'));
    validateMatch(['string', 'another', 'some'], anyArrayContaining('some'));
    validateMatch(['string', 'another', 'some'], anyArrayContaining('string', 'another', 'some'));
    let data = {
      items: [
        { id: 1, name: 'Name 1', data: 'Some data' },
        { id: 2, name: 'Name 2', data: 'Another data' },
        { id: 3, name: 'Name 3', data: 'No data' },
      ],
    };
    validateMatch(data, {
      items: anyArrayContaining({ id: 1 }),
    });
    validateMatch(data, {
      items: anyArrayContaining({ id: 2, name: 'Name 2', data: 'Another data' }),
    });
    validateMatch(data, {
      items: anyArrayContaining({ data: 'No data' }),
    });
    validateMatch(data, {
      items: anyArrayContaining({ id: 1 }, { name: 'Name 3' }, { data: 'Another data' }),
    });
  });

  it('Validate array containing: fail', () => {
    validateContentFail([1, 2, 3], anyArrayContaining(1, 4));
    validateContentFail([1, 2, 3], anyArrayContaining(1, 2, 7));
    validateContentFail(['string', 'another', 'some'], anyArrayContaining('string', 'not-string'));
    validateContentFail(['string', 'another', 'some'], anyArrayContaining('another', 1));
    validateContentFail(['string', 'another', 'some'], anyArrayContaining('some', { value: 'unexpected' }));
    validateContentFail(['string', 'another', 'some'], anyArrayContaining('string', 'another', 'some', 'and-one-more'));
    let data = {
      items: [
        { id: 1, name: 'Name 1', data: 'Some data' },
        { id: 2, name: 'Name 2', data: 'Another data' },
        { id: 3, name: 'Name 3', data: 'No data' },
      ],
    };
    validateContentFail(data, {
      items: anyArrayContaining({ id: 4 }),
    });
    validateContentFail(data, {
      items: anyArrayContaining({ id: 3, name: 'Name 2', data: 'Some data' }),
    });
    validateContentFail(data, {
      items: anyArrayContaining({ data: 'Unexpected data' }),
    });
    validateContentFail(data, {
      items: anyArrayContaining({ id: 1 }, { name: 'Name not defined' }, { data: 'Another data' }),
    });
  });

  it('Validate anyArrayNotContaining: success', () => {
    validateMatch([1, 2, 3], anyArrayNotContaining(4));
    validateMatch([1, 2, 3], anyArrayNotContaining(4, 5, 6));
    validateMatch(['string', 'another', 'some'], anyArrayNotContaining('one'));
    validateMatch(['string', 'another', 'some'], anyArrayNotContaining('two'));
    validateMatch(['string', 'another', 'some'], anyArrayNotContaining('three'));
    validateMatch(['string', 'another', 'some'], anyArrayNotContaining('one', 'two', 'three'));
    let data = {
      items: [
        { id: 1, name: 'Name 1', data: 'Some data' },
        { id: 2, name: 'Name 2', data: 'Another data' },
        { id: 3, name: 'Name 3', data: 'No data' },
      ],
    };
    validateMatch(data, {
      items: anyArrayNotContaining({ id: 4 }),
    });
    validateMatch(data, {
      items: anyArrayNotContaining({ id: 1, name: 'Name 2' }),
    });
  });

  it('Validate anyArrayNotContaining: fail', () => {
    validateContentFail([1, 2, 3], anyArrayNotContaining(1));
    validateContentFail([1, 2, 3], anyArrayNotContaining(1, 2, 5));
    validateContentFail(['string', 'another', 'some'], anyArrayNotContaining('string'));
    validateContentFail(['string', 'another', 'some'], anyArrayNotContaining('another'));
    validateContentFail(['string', 'another', 'some'], anyArrayNotContaining('some'));
    validateContentFail(['string', 'another', 'some'], anyArrayNotContaining('string', 'another', 'three'));
    let data = {
      items: [
        { id: 1, name: 'Name 1', data: 'Some data' },
        { id: 2, name: 'Name 2', data: 'Another data' },
        { id: 3, name: 'Name 3', data: 'No data' },
      ],
    };
    validateContentFail(data, {
      items: anyArrayNotContaining({ id: 1 }),
    });
    validateContentFail(data, {
      items: anyArrayNotContaining({ id: 2, name: 'Name 2' }),
    });
  });

  it('Multiple expectations: success', () => {
    validateMatch(generateUuid(), matchAll(
      anyUuid(),
      anyString(),
    ));
    validateMatch([1, 2, 3, 4], matchAll(
      anyArray(),
      anyArrayContaining(1, 2, 3),
    ));
    validateMatch([1, 2, 3, 4], matchAll(
      anyArray(4),
      [1, anyInteger(), anyInteger(), anyInteger()],
    ));
  });

  it('Multiple expectations: fail', () => {
    validateContentFail(generateUuid(), matchAll(
      anyUuid(),
      anyInteger(),
    ));
    validateContentFail([1, 2, 3, 4], matchAll(
      anyArray(),
      anyArrayContaining(1, 2, 5),
    ));
    validateContentFail([1, 2, 3, 4], matchAll(
      anyArray(5),
      [1, anyInteger(), anyInteger(), anyInteger()],
    ));
  });

  it('Any expectations: success', () => {
    validateMatch(generateUuid(), matchAny(
      anyUuid(),
      anyInteger(),
    ));
    validateMatch([1, 2, 3, 4], matchAny(
      anyArray(),
      anyBoolean(),
    ));
    validateMatch(1, matchAny(
      1, 2, 3,
    ));
  });

  it('Any expectations: fail', () => {
    validateContentFail(generateUuid(), matchAny(
      anyDate(),
      anyInteger(),
    ));
    validateContentFail([1, 2, 3, 4], matchAny(
      anyString(),
      anyBoolean(),
    ));
    validateContentFail(1, matchAny(
      2, 3, 4,
    ));
  });

  it('anyBoolean: success', () => {
    validateMatch(false, anyBoolean());
    validateMatch(true, anyBoolean());
    validateMatch({ value: false }, { value: anyBoolean() });
    validateMatch({ value: true }, { value: anyBoolean() });
    validateMatch({ value: [false] }, { value: [anyBoolean()] });
    validateMatch({ value: [true] }, { value: [anyBoolean()] });
  });

  it('anyBoolean: failed', () => {
    validateContentFail(null, anyBoolean());
    validateContentFail(123, anyBoolean());
    validateContentFail({ value: null }, { value: anyBoolean() });
    validateContentFail({ value: 'something' }, { value: anyBoolean() });
    validateContentFail({ valueAbsent: false }, { value: anyBoolean() });
    validateContentFail({ value: [1234] }, { value: [anyBoolean()] });
    validateContentFail({ value: ['someString'] }, { value: [anyBoolean()] });
  });

  it('anyUuid nullable: success', () => {
    validateMatch(null, anyUuid(true));
    validateMatch(generateUuid(), anyUuid(true));
  });

  it('anyUuid nullable: failed', () => {
    validateContentFail(undefined, anyUuid(true));
    validateContentFail('test-str', anyUuid(true));
  });

  it('anyDate nullable: success', () => {
    validateMatch(null, anyDate(true));
    validateMatch(utcDate(2000, 6, 21), anyDate(true));
  });

  it('anyDate nullable: failed', () => {
    validateContentFail(undefined, anyDate(true));
    validateContentFail('test-str', anyDate(true));
  });

  it('anyString nullable: success', () => {
    validateMatch(null, anyString(false, true));
    validateMatch('string', anyString(false, true));
    validateMatch(null, anyString(true, true));
    validateMatch('', anyString(true, true));
  });

  it('anyString nullable: failed', () => {
    validateContentFail(undefined, anyString(false, true));
    validateContentFail(12345, anyString(false, true));
    validateContentFail(undefined, anyString(true, true));
    validateContentFail([], anyString(true, true));
  });

});
