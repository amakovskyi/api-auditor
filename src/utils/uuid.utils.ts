import { v4, validate } from 'uuid';

export class UuidUtils {

  static isValidUuid(value: string): boolean {
    return validate(value);
  }

  static generate(): string {
    return v4();
  }

}