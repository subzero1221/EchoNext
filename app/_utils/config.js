export const URL = "https://echo-production-d05f.up.railway.app/api/v1";
export const socketURL = "https://echo-production-d05f.up.railway.app";

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
