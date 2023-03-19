const express = require("express");
const { open } = require("sqlite");
const sqlite3 = require("sqlite3");
const path = require("path");
const bcrypt = require("bcrypt");

const dbpath = path.join(__dirname, "userData.db");
const app = express();
app.use(express.json());
let db = null;
const initializeDBAndServer = async () => {
  try {
    db = await open({
      filename: dbpath,
      driver: sqlite3.Database,
    });
    app.listen(3000, () =>
      console.log("sever is running At http://localhost:3000/")
    );
  } catch (e) {
    console.log(`DB Error: ${e.message}`);
    process.exit(1);
  }
};
initializeDBAndServer();

//register user API 1
app.post("/register", async (request, response) => {
  const { username, name, password, gender, location } = request.body;
  const hashedPassword = await bcrypt.hash(password, 10);
  const selectUserQuery = `
        SELECT * FROM user 
        WHERE username='${username}';
    `;
  const dbUser = await db.get(selectUserQuery);
  let lengthOfPassword = password.length;
  if (dbUser === undefined) {
    //create user in user table
    console.log(lengthOfPassword);
    if (lengthOfPassword < 5) {
      response.status(400);
      response.send("Password is too short");
    } else {
      const createUserQuery = `
             INSERT INTO user
            (username,name,password,gender,location)
            VALUES
            (
                '${username}',
                '${name}',
                '${hashedPassword}',
                '${gender}',
                '${location}'
            );
        `;
      await db.run(createUserQuery);
      response.send("User created successfully");
    }
  } else {
    //send invalid username as response
    response.status(400);
    response.send("User already exists");
  }
});

//login user API 2
app.post("/login", async (request, response) => {
  const { username, password } = request.body;
  const selectUserQuery = `
        select * from user 
        where username='${username}';
    `;
  const dbUser = await db.get(selectUserQuery);
  if (dbUser === undefined) {
    response.status(400);
    response.send("Invalid user");
  } else {
    const isPaswordMatched = await bcrypt.compare(password, dbUser.password);
    if (isPaswordMatched === true) {
      response.send("Login success!");
    } else {
      response.status(400);
      response.send("Invalid password");
    }
  }
});

//Change-password API 3
app.put("/change-password", async (request, response) => {
  const { username, oldPassword, newPassword } = request.body;
  const hashedPassword = await bcrypt.hash(newPassword, 10);
  const selctUserQuery = `
        SELECT * FROM user
        WHERE username='${username}';

    `;
  const dbUser = await db.get(selctUserQuery);
  const isPasswordMatched = await bcrypt.compare(oldPassword, dbUser.password);
  if (isPasswordMatched) {
    const lengthOfPassword = newPassword.length;
    if (lengthOfPassword < 5) {
      response.status(400);
      response.send("Password is too short");
    } else {
      const updatePasswordQuery = `
                    UPDATE user 
                    SET 
                        password='${hashedPassword}'
                    where username='${username}';    
            `;
      await db.run(updatePasswordQuery);
      response.send("Password updated");
    }
  } else {
    response.status(400);
    response.send("Invalid current password");
  }
});
module.exports = app;
