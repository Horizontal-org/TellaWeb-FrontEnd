import { addSeconds, format } from "date-fns";

export const secondsToTime = (seconds: number) => {
  var helperDate = addSeconds(new Date(0), seconds || 0);
  return format(helperDate, "mm:ss");
};
