export const URL = "https://echo-1-8dqu.onrender.com/api/v1";
export const socketURL = "https://echo-1-8dqu.onrender.com";

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
