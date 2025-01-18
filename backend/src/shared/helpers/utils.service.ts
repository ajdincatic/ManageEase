import { compare, hashSync } from 'bcrypt';

import { DayOffType } from '../enums/day-off-type.enum';

export class UtilsService {
  static generateHash(password: string): string {
    return hashSync(password, 10);
  }

  static validateHash(password: string, hash: string): Promise<boolean> {
    return compare(password, hash || '');
  }

  static getColorForCalendar(type: string): string | undefined {
    switch (type) {
      case DayOffType.SICK_LEAVE:
        return '#FF0000';
      case 'HOLIDAY':
        return undefined;
      default:
        return '#378006';
    }
  }

  static generateRandomString(length: number): string {
    return Math.random()
      .toString(36)
      .replace(/[^a-zA-Z0-9]+/g, '')
      .substring(0, length);
  }
}
