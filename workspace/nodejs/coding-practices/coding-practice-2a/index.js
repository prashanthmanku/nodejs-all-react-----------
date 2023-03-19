const addDays = require("date-fns/addDays");
const dateAfterNdays = (days) => {
  const date = addDays(new Date(2020, 7, 22), days);
  //   console.log(date);
  const resultDate = `${date.getDate()}-${
    date.getMonth() + 1
  }-${date.getFullYear()}`;
  console.log(resultDate);
  return resultDate;
};
// dateAfterNdays(2);
module.exports = dateAfterNdays;
