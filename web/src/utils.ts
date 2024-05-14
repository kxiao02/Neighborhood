import dayjs from "dayjs";

export const fmtTime = (time: string) => {
  return dayjs(time).format("YYYY-MM-DD HH:mm:ss");
};
