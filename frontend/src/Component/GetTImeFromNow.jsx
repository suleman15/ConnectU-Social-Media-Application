import dayjs from "dayjs";

function getTimeFromNow(createdDate) {
  const date = dayjs(createdDate);

  return date.toNow();
}

export default getTimeFromNow;
