import { Matches } from 'class-validator';

export const DateFormatMatches = (each = false) =>
  Matches(/^\d{4}(-)(((0)[0-9])|((1)[0-2]))(-)([0-2][0-9]|(3)[0-1])$/i, {
    message: '$property must be formatted as YYYY-MM-DD',
    each,
  });
