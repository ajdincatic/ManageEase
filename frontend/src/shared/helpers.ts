import moment from "moment";

export const isWeekday = (date: Date | string) => {
  const day = moment(date).day();
  return day !== 0 && day !== 6;
};

export const getDateArrayFromRange = (
  startDate: Date | string,
  endDate: Date | string
): string[] => {
  var dateArray: string[] = [];
  var currentDate = startDate;
  if (endDate) {
    while (currentDate <= endDate) {
      if (isWeekday(currentDate))
        dateArray.push(moment(currentDate).format("YYYY-MM-DD"));
      currentDate = moment(currentDate).add(1, "day").toDate();
    }
  } else {
    if (currentDate) dateArray.push(moment(currentDate).format("YYYY-MM-DD"));
  }
  return dateArray;
};

export const addDaysToCurrentDate = (numberOfDays: number): Date => {
  return moment().add(numberOfDays, "days").toDate();
};

export const validatePassword = (password: string) => {
  const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d\w\W]{8,}$/;
  return regex.test(password);
};

export const isNullOrEmpty = (str: string) => {
  if (!str) {
    return true; // no input
  }
  if (typeof str !== "string") {
    return false;
  }
  if (!str.trim()) {
    return true; // only spaces
  }
  return false;
};

export const formatDateToYYYYMMDD = (date: Date | string): string => {
  return moment(date).format("YYYY-MM-DD");
};

export const formatDateToDMYYYY = (date: Date | string): string => {
  return moment(date).format("D.M.YYYY");
};

export const formatDateToDMMMMYYYY = (date: Date | string): string => {
  return moment(date).format("D MMMM, YYYY");
};

export const dateFromNow = (date: Date | string): string => {
  return moment(date).fromNow();
};

export const getStartDateOfCurrentMonth = (): Date => {
  return new Date(moment().startOf("month").format("YYYY-MM-DD"));
};

export const getEndDateOfCurrentMonth = (): Date => {
  return new Date(moment().endOf("month").format("YYYY-MM-DD"));
};

export const getStartDateOfPreviousMonth = (): Date => {
  return new Date(moment().add(-1, "M").startOf("M").format("YYYY-MM-DD"));
};

export const getEndDateOfNextMonth = (): Date => {
  return new Date(moment().add(1, "M").endOf("M").format("YYYY-MM-DD"));
};

export const getCurrentYear = (): number => {
  return moment().year();
};
