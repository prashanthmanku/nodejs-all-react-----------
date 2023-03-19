const express = require("express");

const { open } = require("sqlite");
const sqlite3 = require("sqlite3");

const path = require("path");

const dbpath = path.join(__dirname, "goodreads.db");

const app = express();
let db = null;

const initializeDBAndServer = async () => {
  try {
    db = await open({
      filename: dbpath,
      driver: sqlite3.Database,
    });
    app.listen(3000, () =>
      console.log("server running at http://localhost:3000/")
    );
  } catch (e) {
    console.log(`DB error:${e.message}`);
    process.exit(1);
  }
};

initializeDBAndServer();

app.get("/books/", async (request, response) => {
  const getBooksQuery = `
        SELECT * FROM book ORDER BY book_id;
    `;
  const booksArray = await db.all(getBooksQuery);
  response.send(booksArray);
});
//get Book API
app.get("/books/:bookId/", async (request, response) => {
  const { bookId } = request.params;
  const getBookQuery = `
        SELECT * 
        fROM book
        WHERE book_id=${bookId};
    `;
  const book = await db.get(getBookQuery);
  response.send(book);
});
