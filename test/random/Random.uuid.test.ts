import { Random } from '../../src';
import { UuidUtils } from '../../src/utils/uuid.utils';

describe('Random.uuid()', () => {

  test('Type and content', () => {
    for (let i = 0; i < 1000; i++) {
      let uuid = Random.uuid();
      expect(typeof uuid).toEqual('string');
      expect(UuidUtils.isValidUuid(uuid)).toBeTruthy();
    }
  });

});