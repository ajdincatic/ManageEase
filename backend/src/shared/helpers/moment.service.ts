import * as moment from 'moment';

export class MomentService {
  static checkIfDateIsBeforeCurrentDate(date: Date | string): boolean {
    return moment(date).isBefore(moment(), 'date');
  }

  static checkIfCurrentDateIsInScope(
    fromDate: Date | string,
    toDate: Date | string,
  ): boolean {
    return moment().isBetween(moment(fromDate), moment(toDate), 'date', '[]');
  }

  static checkIfDateIsInScope(
    selectedDate: Date | string,
    fromDate: Date | string,
    toDate: Date | string,
  ): boolean {
    return moment(selectedDate).isBetween(
      moment(fromDate),
      moment(toDate),
      'date',
      '[]',
    );
  }

  static getFirstDateOfCurrentMonth(): Date {
    return new Date(moment().startOf('month').format('YYYY-MM-DD'));
  }

  static getLastDateOfCurrentMonth(): Date {
    return new Date(moment().endOf('month').format('YYYY-MM-DD'));
  }

  static getFirstDateOfPreviousMonth(): string {
    return moment().add(-1, 'M').startOf('M').format('YYYY-MM-DD');
  }

  static getLastDateOfNextMonth(): string {
    return moment().add(1, 'M').endOf('M').format('YYYY-MM-DD');
  }

  static checkIfDateIsBeforeOtherDate(
    date: Date | string,
    numberOfDaysToCurrentDate: number,
  ): boolean {
    return moment(date).isBefore(
      moment().add(numberOfDaysToCurrentDate, 'day'),
      'date',
    );
  }

  static generateTokenExpirationDate(): number {
    return moment().add(7, 'days').valueOf();
  }

  static calculateVacationDays(
    dateOfEmploymeent: Date | string | undefined = undefined,
    iterationStartDate: Date | string | undefined = undefined,
  ): number {
    // for every 2 years 1 day is added to starting 20

    const startVacationDays = 20;

    const getDaysByYearsOfEmploymeent = moment(iterationStartDate).diff(
      moment(dateOfEmploymeent),
      'years',
    );

    return Math.floor(startVacationDays + getDaysByYearsOfEmploymeent / 2);
  }
}
