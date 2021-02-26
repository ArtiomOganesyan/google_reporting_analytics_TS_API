export const dateValidation = {
  isBeforeReportApiStart: (startDate: string) =>
    new Date("2005-01-01") > new Date(startDate) ? true : false,
  isInvalidRange: (startDate: string, endDate: string) =>
    new Date(startDate) > new Date(endDate) ? true : false,
  isInvalidDate: (date: string) => !new Date(date).getTime(),
};
