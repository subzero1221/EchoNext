export const URL = "http://localhost:8000/api/v1";
export const socketURL = "http://localhost:8000";

export const errorStrCorrecter = (str) => {
  const prefix = "User validation failed: ";
  if (str.startsWith(prefix)) {
    return str.slice(prefix.length).trim();
  }
  return str;
};

import TimeAgo from "javascript-time-ago";
import en from "javascript-time-ago/locale/en";
TimeAgo.addDefaultLocale(en);
export const createTimeAgo = (locale = "en-US") => new TimeAgo(locale);
