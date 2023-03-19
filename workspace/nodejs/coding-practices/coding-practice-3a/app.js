const express = require("express");

const addDays = require("date-fns/addDays");
const app = express();

app.get("/", (request, response) => {
  const date = new Date();
  const dateAfterXdays = addDays(date, 100);
  const newDate = `${dateAfterXdays.getDate()}/${
    dateAfterXdays.getMonth() + 1
  }/${dateAfterXdays.getFullYear()}`;
  response.send(newDate);
});
app.listen(3000);

module.exports = app;
