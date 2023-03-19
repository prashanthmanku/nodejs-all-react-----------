const express = require("express");
const path = require("path");
const sqlite3 = require("sqlite3");
const { open } = require("sqlite");
const format = require("date-fns/format");
const isValid = require("date-fns/isValid");
// const jwt = require("jsonwebtoken");
// const bcrypt = require("bcrypt");

const dbpath = path.join(__dirname, "todoApplication.db");
const app = express();

app.use(express.json());

let db = null;
const initializeDBAndserver = async () => {
  try {
    db = await open({
      filename: dbpath,
      driver: sqlite3.Database,
    });
    app.listen(3000, () =>
      console.log("server is Running at http://localhost:3000/")
    );
  } catch (e) {
    console.log(`DB Error ${e.message}`);
  }
};
initializeDBAndserver();
const hasStatusPropertie = (q) => q.status !== undefined;
const hasPriorityProperty = (q) => q.priority !== undefined;
const haspriorityAndStatus = (q) =>
  q.status !== undefined && q.priority !== undefined;
const hascategoryAndStatus = (q) =>
  q.status !== undefined && q.category !== undefined;
const hasCategory = (q) => q.category !== undefined;
const hasCategoryAndPriority = (q) =>
  q.category !== undefined && q.priority !== undefined;

app.get("/todos/", async (request, response) => {
  const { status, priority, search_q = "", category } = request.query;
  let getTodosQuery;
  let todos;
  switch (true) {
    case haspriorityAndStatus(request.query):
      console.log("haspriorityAndStatus");
      if (priority == "HIGH" || priority == "MEDIUM" || priority == "LOW") {
        if (status == "TO DO" || status == "IN PROGRESS" || status == "DONE") {
          getTodosQuery = `
                    SELECT  id,todo,priority,status,category,due_date as dueDate
                     FROM
                    todo
                    WHERE status='${status}' AND
                    priority='${priority}';
            `;
          todos = await db.all(getTodosQuery);
          response.send(todos);
        } else {
          response.status(400);
          response.send("Invalid Todo Status");
        }
      } else {
        response.status(400);
        response.send("Invalid Todo priority");
      }
      break;

    case hascategoryAndStatus(request.query):
      console.log("hascategoryAndStatus");
      if (category == "WORK" || category == "HOME" || category == "LEARNING") {
        if (status == "TO DO" || status == "IN PROGRESS" || status == "DONE") {
          getTodosQuery = `
                    SELECT id,todo,priority,status,category,due_date as dueDate 
                    FROM todo
                    WHERE category='${category}' AND 
                    status='${status}';
            `;
          todos = await db.all(getTodosQuery);
          response.send(todos);
        } else {
          response.status(400);
          response.send("Invalid Todo Status");
        }
      } else {
        response.status(400);
        response.send("Invalid Todo Category");
      }
      break;

    case hasCategoryAndPriority(request.query):
      console.log("hasCategoryAndPriority");
      if (category == "WORK" || category == "HOME" || category == "LEARNING") {
        if (priority == "HIGH" || priority == "MEDIUM" || priority == "LOW") {
          getTodosQuery = `
                SELECT id,todo,priority,status,category,due_date as dueDate 
                FROM todo
                WHERE category='${category}' AND
                       priority='${priority}';
            `;
          todos = await db.all(getTodosQuery);
          response.send(todos);
        } else {
          response.status(400);
          response.send("Invalid Todo Priority");
        }
      } else {
        response.status(400);
        response.send("Invalid Todo Category");
      }

      break;
    case hasStatusPropertie(request.query):
      console.log("hasStatusPropertie");
      if (status == "TO DO" || status == "IN PROGRESS" || status == "DONE") {
        getTodosQuery = `
                select id,todo,priority,status,category,due_date as dueDate
                from todo
                where status='${status}';
            `;
        todos = await db.all(getTodosQuery);
        response.send(todos);
      } else {
        response.status(400);
        response.send("Invalid Todo Status");
      }
      break;

    case hasPriorityProperty(request.query):
      console.log("hasPriorityProperty");
      if (priority == "HIGH" || priority == "MEDIUM" || priority == "LOW") {
        getTodosQuery = `
                SELECT  id,todo,priority,status,category,due_date as dueDate
                FROM todo
                WHERE priority='${priority}';
          `;
        todos = await db.all(getTodosQuery);
        response.send(todos);
      } else {
        response.status(400);
        response.send("Invalid Todo Priority");
      }
      break;

    case hasCategory(request.query):
      console.log("hasCategory");
      if (category == "WORK" || category == "HOME" || category == "LEARNING") {
        getTodosQuery = `
                SELECT id,todo,priority,status,category,due_date as dueDate
                FROM todo
                WHERE category='${category}';
        `;
        todos = await db.all(getTodosQuery);
        response.send(todos);
      } else {
        response.status(400);
        response.send("Invalid Todo Category");
      }

      break;

    default:
      getTodosQuery = `
            SELECT id,todo,priority,status,category,due_date as dueDate
            FROM todo
            WHERE todo LIKE '%${search_q}%';
        `;
      todos = await db.all(getTodosQuery);
      response.send(todos);
  }
});

//GET todo API 2
app.get(`/todos/:todoId/`, async (request, response) => {
  const { todoId } = request.params;
  const gettodoQuery = `
        SELECT id,todo,priority,status,category,due_date as dueDate
        FROM todo 
        WHERE id=${todoId};
    `;
  const todo = await db.get(gettodoQuery);
  response.send(todo);
});

//Returns a list of all todos with a specific due date in the query parameter `/agenda/?date=2021-12-12`
app.get(`/agenda/`, async (request, response) => {
  const { date } = request.query;
  const newDate = format(new Date(date), "yyyy/mm/dd");
  console.log(newDate);
});

//Create a todo in the todo table
const statusQ = (status) =>
  status == "TO DO" || status == "IN PROGRESS" || status == "DONE";
const priorityQ = (priority) =>
  priority == "HIGH" || priority == "MEDIUM" || priority == "LOW";

const categoryQ = (category) =>
  category == "WORK" || category == "HOME" || category == "LEARNING";
const dueDateQ = (dueDate) => isValid(new Date(dueDate));

app.post("/todos/", async (request, response) => {
  const { id, todo, priority, status, category, dueDate } = request.body;
  console.log(status, priority, category, dueDate);
  console.log(
    statusQ(status) &&
      priorityQ(priority) &&
      categoryQ(category) &&
      dueDateQ(dueDate)
  );
  const postTodoQuery = `
            INSERT INTO todo
            (id,todo,priority,status,category,due_date)
            VALUES
            (

                ${id},
                '${todo}',
                '${priority}',
                '${status}',
                '${category}',
                '${dueDate}'
            );
    `;
  await db.run(postTodoQuery);
  if (
    statusQ(status) &&
    priorityQ(priority) &&
    categoryQ(category) &&
    dueDateQ(dueDate)
  ) {
    // const postTodoQuery = `
    //         INSERT INTO todo
    //         (id,todo,priority,status,category,due_date)
    //         VALUES
    //         (

    //             ${id},
    //             '${todo}',
    //             '${priority}',
    //             '${status}',
    //             '${category}',
    //             '${dueDate}'
    //         );
    // `;
    // await db.run(postTodoQuery);
    response.send("Todo Successfully Added");
  } else if (statusQ(status) !== true) {
    response.status(400);
    response.send("Invalid Todo Status");
  } else if (priorityQ(priority) !== true) {
    response.status(400);
    response.send("Invalid Todo Priority");
  } else if (categoryQ(category) !== true) {
    response.status(400);
    response.send("Invalid Todo Category");
  } else if (dueDateQ(dueDate)) {
    response.status(400);
    response.send("Invalid Due Date");
  }
});

//Updates the details of a specific todo based on the todo ID

app.put(`/todos/:todoId/`, async (request, response) => {
  const { todoId } = request.params;
  const { status, priority, todo, category, dueDate } = request.body;
  let putDataQuery;

  switch (true) {
    case status !== undefined:
      if (status == "TO DO" || status == "IN PROGRESS" || status == "DONE") {
        console.log("status");
        putDataQuery = `
                UPDATE todo
                SET status='${status}'
                WHERE id=${todoId};
                
            `;
        await db.run(putDataQuery);
        response.send("Status Updated");
      } else {
        response.status(400);
        response.send("Invalid Todo Status");
      }
      break;

    case priority !== undefined:
      console.log("priority");
      if (priority == "HIGH" || priority == "MEDIUM" || priority == "LOW") {
        putDataQuery = `
            UPDATE todo 
            SET 
              priority='${priority}'
            WHERE 
                id=${todoId};  
        `;
        await db.run(putDataQuery);
        response.send("Priority Updated");
      } else {
        response.status(400);
        response.send("Invalid Todo Priority");
      }
      break;

    case todo !== undefined:
      console.log("todo");
      putDataQuery = `
            UPDATE  todo
            SET todo='${todo}'
            WHERE id=${todoId};
        `;
      await db.run(putDataQuery);
      response.send("Todo Updated");
      break;
    case category !== undefined:
      console.log(category);
      if (category == "WORK" || category == "HOME" || category == "LEARNING") {
        postTodoQuery = `
            UPDATE todo
            SET category='${category}'
            WHERE id=${todoId};
        `;
        await db.run(postTodoQuery);
        response.send("Category Updated");
      } else {
        response.status(400);
        response.send("Invalid Todo Category");
      }
      break;

    case dueDate !== undefined:
      const d = new Date(dueDate);
      console.log(d);
      const result = isValid(new Date(dueDate));
      console.log(result);
      if (result) {
        putDataQuery = `
                UPDATE todo 
                SET due_date='${dueDate}'
                WHERE id=${todoId};
                
        `;
        await db.run(putDataQuery);
        response.send("Due Date Updated");
      } else {
        response.status(400);
        response.send("Invalid Due Date");
      }
  }
});

//DELETE todo
app.delete("/todos/:todoId/", async (request, response) => {
  const { todoId } = request.params;
  const deltetodoQuery = `
            DELETE FROM todo
            WHERE id =${todoId};
    `;
  await db.run(deltetodoQuery);
  response.send("Todo Deleted");
});

module.exports = app;
