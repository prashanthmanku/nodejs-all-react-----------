const request = require("supertest");
const { open } = require("sqlite");
const sqlite3 = require("sqlite3");
const path = require("path");

describe(":::NJSCADOQBS_TEST_SUITE_1:::Tests for Operations on Todo Application database", () => {
  let app;
  let appInstance;
  let database = null;
  const databasePath = path.join(__dirname, "../todoApplication.db");
  beforeAll(() => {
    try {
      app = require("../app.js");
      appInstance = request(app);
    } catch (error) {}

    open({
      filename: databasePath,
      driver: sqlite3.Database,
    })
      .then((sqliteDB) => {
        database = sqliteDB;
      })
      .catch((error) => {
        console.log(error);
      });
  });

  test(":::NJSCADOQBS_TEST_1:::An Express instance should be exported from the 'app.js' file using the default export syntax", () => {
    expect(typeof app).toBe("function");
  });

  test(":::NJSCADOQBS_TEST_2:::The GET request to the path '/todos/?status=TO%20DO' should return the list of all todos whose status is 'TO DO' as a response", (done) => {
    appInstance
      .get("/todos/?status=TO%20DO")
      .expect(200)
      .expect([
        {
          id: 2,
          todo: "Buy a Car",
          priority: "MEDIUM",
          status: "TO DO",
          category: "HOME",
          dueDate: "2020-09-22",
        },
        {
          id: 3,
          todo: "Clean the garden",
          priority: "LOW",
          status: "TO DO",
          category: "HOME",
          dueDate: "2021-02-22",
        },
        {
          id: 5,
          todo: "Submit the report",
          priority: "LOW",
          status: "TO DO",
          category: "WORK",
          dueDate: "2021-04-02",
        },
      ])
      .then((error, response) => {
        done();
      });
  });

  test(":::NJSCADOQBS_TEST_3:::The GET request to the path '/todos/?priority=HIGH' should return the list of all todos whose priority is 'HIGH' as a response", (done) => {
    appInstance
      .get("/todos/?priority=HIGH")
      .expect(200)
      .expect([
        {
          id: 1,
          todo: "Learn Node JS",
          priority: "HIGH",
          status: "IN PROGRESS",
          category: "LEARNING",
          dueDate: "2021-04-04",
        },
      ])
      .then((error, response) => {
        done();
      });
  });

  test(":::NJSCADOQBS_TEST_4:::The GET request to the path '/todos/?priority=HIGH&status=IN%20PROGRESS' should return the list of all todos whose priority is 'HIGH' and status is 'IN PROGRESS' as a response", (done) => {
    appInstance
      .get("/todos/?priority=HIGH&status=IN%20PROGRESS")
      .expect(200)
      .expect([
        {
          id: 1,
          todo: "Learn Node JS",
          priority: "HIGH",
          status: "IN PROGRESS",
          category: "LEARNING",
          dueDate: "2021-04-04",
        },
      ])
      .then((error, response) => {
        done();
      });
  });

  test(":::NJSCADOQBS_TEST_5:::The GET request to the path '/todos/?category=WORK&status=DONE' should return the list of all todos whose category is 'WORK' and status is 'DONE' as a response", (done) => {
    appInstance
      .get("/todos/?category=WORK&status=DONE")
      .expect(200)
      .expect([
        {
          id: 4,
          todo: "Fix the bug",
          priority: "MEDIUM",
          status: "DONE",
          category: "WORK",
          dueDate: "2021-01-12",
        },
      ])
      .then((error, response) => {
        done();
      });
  });
  test(":::NJSCADOQBS_TEST_6:::The GET request to the path '/todos/?category=LEARNING&priority=HIGH' should return the list of all todos whose category is 'LEARNING' and priority is 'HIGH' as a response", (done) => {
    appInstance
      .get("/todos/?category=LEARNING&priority=HIGH")
      .expect(200)
      .expect([
        {
          id: 1,
          todo: "Learn Node JS",
          priority: "HIGH",
          status: "IN PROGRESS",
          category: "LEARNING",
          dueDate: "2021-04-04",
        },
      ])
      .then((error, response) => {
        done();
      });
  });
  test(":::NJSCADOQBS_TEST_7:::The GET request to the path '/todos/?category=HOME' should return the list of all todos whose category is 'HOME' as a response", (done) => {
    appInstance
      .get("/todos/?category=HOME")
      .expect(200)
      .expect([
        {
          id: 2,
          todo: "Buy a Car",
          priority: "MEDIUM",
          status: "TO DO",
          category: "HOME",
          dueDate: "2020-09-22",
        },
        {
          id: 3,
          todo: "Clean the garden",
          priority: "LOW",
          status: "TO DO",
          category: "HOME",
          dueDate: "2021-02-22",
        },
      ])
      .then((error, response) => {
        done();
      });
  });
  test(":::NJSCADOQBS_TEST_8:::The GET request to the path '/todos/?search_q=Buy' should return the list of all todos whose todo contains 'Buy' text as a response", (done) => {
    appInstance
      .get("/todos/?search_q=Buy")
      .expect(200)
      .expect([
        {
          id: 2,
          todo: "Buy a Car",
          priority: "MEDIUM",
          status: "TO DO",
          category: "HOME",
          dueDate: "2020-09-22",
        },
      ])
      .then((error, response) => {
        done();
      });
  });
  test(":::NJSCADOQBS_TEST_9:::The GET request to the path '/todos/:todoId/' should return a specific todo based on the todo ID as a response", (done) => {
    appInstance
      .get("/todos/4")
      .expect(200)
      .expect({
        id: 4,
        todo: "Fix the bug",
        priority: "MEDIUM",
        status: "DONE",
        category: "WORK",
        dueDate: "2021-01-12",
      })
      .then((error, response) => {
        done();
      });
  });

  test(":::NJSCADOQBS_TEST_10:::The GET request to the path '/agenda/?date=:date' should return a list of all todos of the specific date as a response upon success", (done) => {
    appInstance
      .get("/agenda/?date=2021-4-2")
      .expect(200)
      .expect([
        {
          id: 5,
          todo: "Submit the report",
          priority: "LOW",
          status: "TO DO",
          category: "WORK",
          dueDate: "2021-04-02",
        },
      ])
      .then((error, response) => {
        done();
      });
  });

  test(":::NJSCADOQBS_TEST_11:::The GET request to the path '/todos/' with invalid todo status should return '400' as status code and 'Invalid Todo Status' text as a response to the request", (done) => {
    appInstance
      .get("/todos/?status=DOING")
      .expect(400)
      .expect("Invalid Todo Status")
      .then((error, response) => {
        done();
      });
  });

  test(":::NJSCADOQBS_TEST_12:::The GET request to the path '/todos/' with invalid todo priority should return '400' as status code and 'Invalid Todo Priority' text as a response to the request", (done) => {
    appInstance
      .get("/todos/?priority=LESS")
      .expect(400)
      .expect("Invalid Todo Priority")
      .then((error, response) => {
        done();
      });
  });

  test(":::NJSCADOQBS_TEST_13:::The GET request to the path '/todos/' with invalid todo category should return '400' as status code and 'Invalid Todo Category' text as a response to the request", (done) => {
    appInstance
      .get("/todos/?category=HOBBY")
      .expect(400)
      .expect("Invalid Todo Category")
      .then((error, response) => {
        done();
      });
  });

  test(":::NJSCADOQBS_TEST_14:::The GET request to the path '/agenda/' with an invalid date query should return '400' as status code and 'Invalid Due Date' text as a response to the request", (done) => {
    appInstance
      .get("/agenda/?date=123-AB-21")
      .expect(400)
      .expect("Invalid Due Date")
      .then((error, response) => {
        done();
      });
  });

  test(":::NJSCADOQBS_TEST_15:::The POST request to the path '/todos/' should return the 'Todo Successfully Added' text as a response upon success", (done) => {
    appInstance
      .post("/todos/")
      .set("Accept", "application/json")
      .send({
        id: 6,
        todo: "Review codes",
        priority: "MEDIUM",
        category: "WORK",
        status: "TO DO",
        dueDate: "2021-9-22",
      })
      .expect(200)
      .expect("Todo Successfully Added")
      .then((error, response) => {
        done();
      });
  });

  test(":::NJSCADOQBS_TEST_16:::The database should be updated on the post request", async () => {
    expect(await database.get(`SELECT * FROM todo WHERE id=6`)).toEqual({
      id: 6,
      todo: "Review codes",
      priority: "MEDIUM",
      category: "WORK",
      status: "TO DO",
      due_date: "2021-09-22",
    });
  });

  test(":::NJSCADOQBS_TEST_17:::The POST request to the path '/todos/' with invalid todo status should return '400' as status code and 'Invalid Todo Status' text as a response to the request", (done) => {
    appInstance
      .post("/todos/")
      .set("Accept", "application/json")
      .send({
        id: 6,
        todo: "Review codes",
        priority: "MEDIUM",
        category: "WORK",
        status: "akdjb",
        dueDate: "2021-9-22",
      })
      .expect(400)
      .expect("Invalid Todo Status")
      .then((error, response) => {
        done();
      });
  });

  test(":::NJSCADOQBS_TEST_18:::The POST request to the path '/todos/' with invalid todo priority should return '400' as status code and 'Invalid Todo Priority' text as a response to the request", (done) => {
    appInstance
      .post("/todos/")
      .set("Accept", "application/json")
      .send({
        id: 6,
        todo: "Review codes",
        priority: "zdvdb",
        category: "WORK",
        status: "TO DO",
        dueDate: "2021-9-22",
      })
      .expect(400)
      .expect("Invalid Todo Priority")
      .then((error, response) => {
        done();
      });
  });
  test(":::NJSCADOQBS_TEST_19:::The POST request to the path '/todos/' with invalid todo category should return '400' as status code and 'Invalid Todo Category' text as a response to the request", (done) => {
    appInstance
      .post("/todos/")
      .set("Accept", "application/json")
      .send({
        id: 6,
        todo: "Review codes",
        priority: "MEDIUM",
        category: "dgergs",
        status: "TO DO",
        dueDate: "2021-9-22",
      })
      .expect(400)
      .expect("Invalid Todo Category")
      .then((error, response) => {
        done();
      });
  });
  test(":::NJSCADOQBS_TEST_20:::The POST request to the path '/todos/' with invalid due date should return '400' as status code and 'Invalid Due Date' text as a response to the request", (done) => {
    appInstance
      .post("/todos/")
      .set("Accept", "application/json")
      .send({
        id: 6,
        todo: "Review codes",
        priority: "MEDIUM",
        category: "HOME",
        status: "TO DO",
        dueDate: "djbsiu",
      })
      .expect(400)
      .expect("Invalid Due Date")
      .then((error, response) => {
        done();
      });
  });
  test(":::NJSCADOQBS_TEST_21:::The PUT request to the path '/todos/:todoId/' with 'status' property in the body should return the 'Status Updated' text as a response upon success", (done) => {
    appInstance
      .put("/todos/3/")
      .set("Accept", "application/json")
      .send({
        status: "IN PROGRESS",
      })
      .expect(200)
      .expect("Status Updated")
      .then((error, response) => {
        done();
      });
  });

  test(":::NJSCADOQBS_TEST_22:::The PUT request to the path '/todos/:todoId/' with 'priority' property in the body should return the 'Priority Updated' text as a response upon success", (done) => {
    appInstance
      .put("/todos/3/")
      .set("Accept", "application/json")
      .send({
        priority: "HIGH",
      })
      .expect(200)
      .expect("Priority Updated")
      .then((error, response) => {
        done();
      });
  });

  test(":::NJSCADOQBS_TEST_23:::The PUT request to the path '/todos/:todoId/' with 'todo' property in the body should return the 'Todo Updated' text as a response upon success", (done) => {
    appInstance
      .put("/todos/3/")
      .set("Accept", "application/json")
      .send({
        todo: "Priority task",
      })
      .expect(200)
      .expect("Todo Updated")
      .then((error, response) => {
        done();
      });
  });

  test(":::NJSCADOQBS_TEST_24:::The PUT request to the path '/todos/:todoId/' with 'category' property in the body should return the 'Category Updated' text as a response upon success", (done) => {
    appInstance
      .put("/todos/3/")
      .set("Accept", "application/json")
      .send({
        category: "WORK",
      })
      .expect(200)
      .expect("Category Updated")
      .then((error, response) => {
        done();
      });
  });
  test(":::NJSCADOQBS_TEST_25:::The PUT request to the path '/todos/:todoId/' with 'dueDate' property in the body should return the 'Due Date Updated' text as a response upon success", (done) => {
    appInstance
      .put("/todos/3/")
      .set("Accept", "application/json")
      .send({
        dueDate: "2021-10-18",
      })
      .expect(200)
      .expect("Due Date Updated")
      .then((error, response) => {
        done();
      });
  });

  test(":::NJSCADOQBS_TEST_26:::The database should be updated on the put request", async () => {
    expect(await database.get(`SELECT * FROM todo WHERE id=3`)).toEqual({
      id: 3,
      todo: "Priority task",
      priority: "HIGH",
      status: "IN PROGRESS",
      category: "WORK",
      due_date: "2021-10-18",
    });
  });

  test(":::NJSCADOQBS_TEST_27:::The PUT request to the path '/todos/:todoId/' with invalid due date should return '400' as status code and 'Invalid Due Date' text as a response to the request", (done) => {
    appInstance
      .put("/todos/3/")
      .set("Accept", "application/json")
      .send({
        dueDate: "2021/??/AS",
      })
      .expect(400)
      .expect("Invalid Due Date")
      .then((error, response) => {
        done();
      });
  });

  test(":::NJSCADOQBS_TEST_28:::The PUT request to the path '/todos/:todoId/' with invalid status should return '400' as status code and 'Invalid Todo Status' text as a response to the request", (done) => {
    appInstance
      .put("/todos/3/")
      .set("Accept", "application/json")
      .send({
        status: "WELL",
      })
      .expect(400)
      .expect("Invalid Todo Status")
      .then((error, response) => {
        done();
      });
  });
  test(":::NJSCADOQBS_TEST_29:::The PUT request to the path '/todos/:todoId/' with invalid priority should return '400' as status code and 'Invalid Todo Priority' text as a response to the request", (done) => {
    appInstance
      .put("/todos/3/")
      .set("Accept", "application/json")
      .send({
        priority: "slfianei",
      })
      .expect(400)
      .expect("Invalid Todo Priority")
      .then((error, response) => {
        done();
      });
  });

  test(":::NJSCADOQBS_TEST_30:::The PUT request to the path '/todos/:todoId/' with invalid category should return '400' as status code and 'Invalid Todo Category' text as a response to the request", (done) => {
    appInstance
      .put("/todos/3/")
      .set("Accept", "application/json")
      .send({
        category: "2021/??/AS",
      })
      .expect(400)
      .expect("Invalid Todo Category")
      .then((error, response) => {
        done();
      });
  });

  test(":::NJSCADOQBS_TEST_31:::The DELETE request to the path '/todos/:todoId/' should return 'Todo Deleted' text as a response upon success", (done) => {
    appInstance
      .delete("/todos/4/")
      .expect(200)
      .expect("Todo Deleted")
      .then((error, response) => {
        done();
      });
  });
  test(":::NJSCADOQBS_TEST_32:::The database should be updated on the delete request", async () => {
    expect(await database.get(`SELECT * FROM todo WHERE id=4`)).toEqual(
      undefined
    );
  });
});
