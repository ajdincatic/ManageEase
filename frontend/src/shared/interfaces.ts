import { DayOffType, UserType } from "./enums";

export interface TokenPayload {
  expiresIn: number;
  accessToken: string;
}

export interface UserAfterLogin {
  id: number;
  firstName: string;
  lastName: string;
  type: UserType;
  token: TokenPayload;
}

export interface User {
  id: number;
  createdAt: string;
  updatedAt: string;
  firstName: string;
  lastName: string;
  type: UserType;
  email: string;
  dateOfEmployment: string;
  calculateBasedOnDateOfEmployment: boolean;
  numberOfVacationDays: number;
  numberOfUsedVacationDays: number;
  numberOfUsedSickLeaveDays: number;
  numberOfUsedPaidLeaveDays: number;
  numberOfUsedPaidLeaveFromManageEaseDays: number;
  numberOfUsedUnpaidLeaveDays: number;
  numberOfDayOffRequests: number;
  upcomingDaysOff: DaysOffUser[];
  requests: DaysOff[];
  calendar: CalendarEvent[];
  activeIteration: Iterations;
}

export interface Iterations {
  id: number;
  createdAt: string;
  updatedAt: string;
  name: string;
  startDate: string;
  endDate: string;
  isActive: boolean;
}

export interface DaysOffUser {
  id: number;
  createdAt: string;
  updatedAt: string;
  type: DayOffType;
  dates: string[];
  numberOfSelectedDays: number;
  description: string;
  isApproved: boolean;
  isPassed: boolean;
  isCurrentlyActive: boolean;
}

export interface DaysOff {
  id: number;
  createdAt: string;
  updatedAt: string;
  type: DayOffType;
  dates: string[];
  numberOfSelectedDays: number;
  description: string;
  isApproved: boolean;
  user: User;
}

export interface Holidays {
  id: number;
  createdAt: string;
  updatedAt: string;
  name: string;
  dates: string[];
  numberOfSelectedDays: number;
  isPassed: boolean;
  isCurrentlyActive: boolean;
}

export interface DaysOffFilter {
  type?: DayOffType | null;
  dateFrom?: Date | null;
  dateTo?: Date | null;
}

export interface CalendarEvent {
  title: string;
  type: string;
  start: string;
  allDay: boolean;
  color?: string;
}

export interface DayOffByUser {
  userId: number;
  name: string;
  date: string;
  type: DayOffType;
  description: string;
}

export interface DayOffRequestByUser {
  id: number;
  createdAt: Date;
  userId: number;
  numberOfSelectedDays: number;
  name: string;
  dates: string[];
  type: DayOffType;
  description: string;
}

export type MyForm = {
  [key: string]: FormElement;
};

export interface FormElement {
  value: any;
  valid: boolean;
  touched: boolean;
  minLength?: number;
  maxLength?: number;
  regexCheck?: RegExp;
  shouldValidate?: boolean;
  [key: string]: any;
}
