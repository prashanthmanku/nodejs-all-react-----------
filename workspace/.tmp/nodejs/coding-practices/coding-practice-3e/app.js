const express = require("express");
const app = express();

app.get("/", (request, response) => {
  const date = new Date();
  response.send(
    `${date.getDate()}-${date.getMonth() + 1}-${date.getFullYear()}`
  );
  //   console.log(date);
});
app.listen(3000);
module.exports = app;
