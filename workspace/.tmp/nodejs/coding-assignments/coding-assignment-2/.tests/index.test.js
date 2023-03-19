const request = require("supertest");
const { open } = require("sqlite");
const sqlite3 = require("sqlite3");
const path = require("path");
const bcrypt = require("bcrypt");

let appInstance;
let auth = {};
function loginUser() {
  return function (done) {
    appInstance
      .post("/login/")
      .send({
        username: "JimCameron",
        password: "james@456",
      })
      .expect(200)
      .then(onResponse);

    function onResponse(res, err) {
      auth.token = res.body.jwtToken;
      return done();
    }
  };
}
describe(":::NJSCADIJBI_TEST_SUITE_1:::Tests for Operations on Twitter Clone database", () => {
  let app;
  let database = null;
  const databasePath = path.join(__dirname, "../twitterClone.db");
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
      .catch((error) => {});
  });

  it(":::NJSCADIJBI_TEST_1:::An Express instance should be exported from the 'app.js' file using the default export syntax", (done) => {
    expect(typeof app).toBe("function");
    const getToken = loginUser();
    getToken(done);
  });

  it(":::NJSCADIJBI_TEST_2:::The POST request with path '/register/' should return 'User already exists' as a response if the username already exists", (done) => {
    appInstance
      .post("/register/")
      .set("Accept", "application/json")
      .send({
        name: "Serena Williams",
        username: "serenawilliams",
        password: "serana@123",
        gender: "female",
      })
      .expect(400)
      .expect("User already exists")
      .then((error, response) => {
        done();
      });
  });
  it(":::NJSCADIJBI_TEST_3:::A user should not be created if the username already exists in database", async () => {
    expect(
      await database.all(
        `SELECT name, username, gender FROM user WHERE username='serenawilliams'`
      )
    ).toEqual([
      {
        name: "Serena Williams",
        username: "serenawilliams",
        gender: "female",
      },
    ]);
  });

  it(":::NJSCADIJBI_TEST_4:::The POST request with path '/register/' should return 'Password is too short' as a response if the registrant provides a password with less than 6 characters", (done) => {
    appInstance
      .post("/register/")
      .set("Accept", "application/json")
      .send({
        name: "Serena Thomas",
        username: "serenathomas",
        password: "seran",
        gender: "female",
      })
      .expect(400)
      .expect("Password is too short")
      .then((error, response) => {
        done();
      });
  });

  it(":::NJSCADIJBI_TEST_5:::The POST request with path '/register/' should return 'User created successfully' text as a response for a successful registration", (done) => {
    appInstance
      .post("/register/")
      .set("Accept", "application/json")
      .send({
        name: "Serena Thomas",
        username: "serenathomas",
        password: "serana@123",
        gender: "female",
      })
      .expect(200)
      .expect("User created successfully")
      .then((error, response) => {
        done();
      });
  });

  it(":::NJSCADIJBI_TEST_6:::The password should be encrypted before creating a user in the database", async () => {
    const databasePassword = await database.get(
      `SELECT password FROM user WHERE username='serenathomas'`
    );
    expect(await bcrypt.compare("serana@123", databasePassword.password)).toBe(
      true
    );
  });

  it(":::NJSCADIJBI_TEST_7:::The user should be created in the database upon the success of the request with path '/register/'", async () => {
    expect(
      await database.get(
        `SELECT username, name, gender FROM user WHERE username = 'serenathomas';`
      )
    ).toEqual({
      name: "Serena Thomas",
      username: "serenathomas",
      gender: "female",
    });
  });

  it(":::NJSCADIJBI_TEST_8:::The POST request with path '/login/' should return 'Invalid user' text as a response for an unregistered user", (done) => {
    appInstance
      .post("/login/")
      .set("Accept", "application/json")
      .send({
        username: "wilda",
        password: "anderson2000",
      })
      .expect(400)
      .expect("Invalid user")
      .then((error, response) => {
        done();
      });
  });

  it(":::NJSCADIJBI_TEST_9:::The POST request with path '/login/' should return 'Invalid password' text as a response if the user provides an incorrect password", (done) => {
    appInstance
      .post("/login/")
      .set("Accept", "application/json")
      .send({
        username: "JimCameron",
        password: "sdgrgsdkj",
      })
      .expect(400)
      .expect("Invalid password")
      .then((error, response) => {
        done();
      });
  });

  it(":::NJSCADIJBI_TEST_10:::The POST request with path '/login/' should return 'JWT Token' as a response if the user provides correct credentials", (done) => {
    appInstance
      .post("/login/")
      .set("Accept", "application/json")
      .send({
        username: "JimCameron",
        password: "james@456",
      })
      .expect(200)
      .then((response, error) => {
        expect(typeof JSON.parse(response.text).jwtToken).toBe("string");
        done();
      });
  });
  it(":::NJSCADIJBI_TEST_11:::The GET request to the path '/user/tweets/feed/' with invalid JWT token should return status code as '401' and 'Invalid JWT Token' text as a response", (done) => {
    appInstance
      .get("/user/tweets/feed")
      .set("Authorization", "bearer " + auth.token + "fhbek")
      .expect(401)
      .expect("Invalid JWT Token")
      .then((error, response) => {
        done();
      });
  });

  it(":::NJSCADIJBI_TEST_12:::The GET request to the path '/user/tweets/feed/' with valid JWT token should return the latest 4 tweets of people whom the user follows", (done) => {
    appInstance
      .get("/user/tweets/feed")
      .set("Authorization", "bearer " + auth.token)
      .expect(200)
      .expect([
        {
          username: "SrBachchan",
          tweet: "T 3859 - do something wonderful, people may imitate it ..",
          dateTime: "2021-04-07 14:50:19",
        },
        {
          username: "narendramodi",
          tweet:
            "Looking forward to a unique interaction with youngsters, their parents and teachers.",
          dateTime: "2021-04-07 14:50:15",
        },
        {
          username: "narendramodi",
          tweet:
            "On the way to the rally in Kanyakumari, caught a glimpse of the majestic Vivekananda Rock Memorial and the grand Thiruvalluvar Statue.",
          dateTime: "2021-04-07 14:50:15",
        },
        {
          username: "JoeBiden",
          tweet:
            "My Administration is working to get America vaccinated as quickly as possible. Tune in as I provide an update on our progress and the timeline moving forward.",
          dateTime: "2021-04-07 14:50:15",
        },
      ])
      .then((error, response) => {
        done();
      });
  });

  it(":::NJSCADIJBI_TEST_13:::The GET request to the path '/user/following/' without JWT token should return status code as '401' and 'Invalid JWT Token' text as a response", (done) => {
    appInstance
      .get("/user/following/")
      .expect(401)
      .expect("Invalid JWT Token")
      .then((error, response) => {
        done();
      });
  });
  it(":::NJSCADIJBI_TEST_14:::The GET request to the path '/user/following/' with valid JWT token should return the list of all names of people whom the user follows", (done) => {
    appInstance
      .get("/user/following/")
      .set("Authorization", "bearer " + auth.token)
      .expect(200)
      .expect([
        { name: "Narendra Modi" },
        { name: "Joe Biden" },
        { name: "Serena Williams" },
        { name: "Amitabh Bachchan" },
      ])
      .then((error, response) => {
        done();
      });
  });
  it(":::NJSCADIJBI_TEST_15:::The GET request to the path '/user/followers/' without JWT token should return status code as '401' and 'Invalid JWT Token' text as a response", (done) => {
    appInstance
      .get("/user/followers/")
      .set("Authorization", "bearer " + auth.token + "fhbek")
      .expect(401)
      .expect("Invalid JWT Token")
      .then((error, response) => {
        done();
      });
  });
  it(":::NJSCADIJBI_TEST_16:::The GET request to the path '/user/followers/' with valid JWT token should return the list of all names of people who follows the user", (done) => {
    appInstance
      .get("/user/followers/")
      .set("Authorization", "bearer " + auth.token)
      .expect(200)
      .expect([{ name: "Narendra Modi" }, { name: "Joe Biden" }])
      .then((error, response) => {
        done();
      });
  });
  it(":::NJSCADIJBI_TEST_17:::The GET request to the path '/user/tweets/' without JWT token should return status code as '401' and 'Invalid JWT Token' text as a response", (done) => {
    appInstance
      .get("/user/tweets/")
      .set("Authorization", "bearer " + auth.token + "fhbek")
      .expect(401)
      .expect("Invalid JWT Token")
      .then((error, response) => {
        done();
      });
  });
  it(":::NJSCADIJBI_TEST_18:::The GET request to the path '/user/tweets/' with valid JWT token should return the list of all tweets of the user", (done) => {
    appInstance
      .get("/user/tweets/")
      .set("Authorization", "bearer " + auth.token)
      .expect(200)
      .expect([
        {
          tweet:
            "Oel ngati kameie, China! We are re excited to bring Avatar back to your big screens this weekend.",
          likes: 2,
          replies: 1,
          dateTime: "2021-04-07 14:50:15",
        },
        {
          tweet: "Oel ngati kameie, Avatar fans.",
          likes: 3,
          replies: 1,
          dateTime: "2021-04-07 14:50:15",
        },
      ])
      .then((error, response) => {
        done();
      });
  });

  it(":::NJSCADIJBI_TEST_19:::The GET request to the path '/tweets/:tweetId/' without JWT token should return status code as '401' and 'Invalid JWT Token' text as a response", (done) => {
    appInstance
      .get("/tweets/3")
      .set("Authorization", "bearer " + auth.token + "fhbek")
      .expect(401)
      .expect("Invalid JWT Token")
      .then((error, response) => {
        done();
      });
  });

  it(":::NJSCADIJBI_TEST_20:::The GET request to the path '/tweets/:tweetId/' with valid JWT token should return the `Invalid Request` text if the user requests a tweet other than the users he is following", (done) => {
    appInstance
      .get("/tweets/11")
      .set("Authorization", "bearer " + auth.token)
      .expect(401)
      .expect("Invalid Request")
      .then((error, response) => {
        done();
      });
  });

  it(":::NJSCADIJBI_TEST_21:::The GET request to the path '/tweets/:tweetId/' with valid JWT token should return the tweet", (done) => {
    appInstance
      .get("/tweets/1")
      .set("Authorization", "bearer " + auth.token)
      .expect(200)
      .expect({
        tweet:
          "Looking forward to a unique interaction with youngsters, their parents and teachers.",
        likes: 3,
        replies: 3,
        dateTime: "2021-04-07 14:50:15",
      })
      .then((error, response) => {
        done();
      });
  });

  it(":::NJSCADIJBI_TEST_22:::The GET request to the path '/tweets/:tweetId/likes/' without JWT token should return status code as '401' and 'Invalid JWT Token' text as a response", (done) => {
    appInstance
      .get("/tweets/2/likes")
      .set("Authorization", "bearer " + auth.token + "fhbek")
      .expect(401)
      .expect("Invalid JWT Token")
      .then((error, response) => {
        done();
      });
  });

  it(":::NJSCADIJBI_TEST_23:::The GET request to the path '/tweets/:tweetId/likes/' with valid JWT token should return the `Invalid Request` text if the user requests a tweet other than the users he is following", (done) => {
    appInstance
      .get("/tweets/11/likes")
      .set("Authorization", "bearer " + auth.token)
      .expect(401)
      .expect("Invalid Request")
      .then((error, response) => {
        done();
      });
  });

  it(":::NJSCADIJBI_TEST_24:::The GET request to the path '/tweets/:tweetId/likes/' with valid JWT token and should return the list of usernames who liked the tweet", (done) => {
    appInstance
      .get("/tweets/3/likes")
      .set("Authorization", "bearer " + auth.token)
      .expect(200)
      .expect({
        likes: ["narendramodi", "JimCameron"],
      })
      .then((error, response) => {
        done();
      });
  });

  it(":::NJSCADIJBI_TEST_25:::The GET request to the path '/tweets/:tweetId/replies/' without JWT token should return status code as '401' and 'Invalid JWT Token' text as a response", (done) => {
    appInstance
      .get("/tweets/5/replies")
      .set("Authorization", "bearer " + auth.token + "fhbek")
      .expect(401)
      .expect("Invalid JWT Token")
      .then((error, response) => {
        done();
      });
  });

  it(":::NJSCADIJBI_TEST_26:::The GET request to the path '/tweets/:tweetId/replies/' with valid JWT token should return the `Invalid Request` text if the user requests a tweet other than the users he is following", (done) => {
    appInstance
      .get("/tweets/11/replies")
      .set("Authorization", "bearer " + auth.token)
      .expect(401)
      .expect("Invalid Request")
      .then((error, response) => {
        done();
      });
  });

  it(":::NJSCADIJBI_TEST_27:::The GET request to the path '/tweets/:tweetId/replies/' with valid JWT token and should return tweet and the list of all replies", (done) => {
    appInstance
      .get("/tweets/2/replies")
      .set("Authorization", "bearer " + auth.token)
      .expect(200)
      .expect({
        replies: [
          {
            name: "Narendra Modi",
            reply: "When you see it..",
          },
          {
            name: "Joe Biden",
            reply:
              "A lot of people make the mistake of just hopping around on jobs a whole lot...",
          },
        ],
      })
      .then((error, response) => {
        done();
      });
  });
  it(":::NJSCADIJBI_TEST_28:::The POST request to the path '/user/tweets/' without JWT token should return status code as '401' and 'Invalid JWT Token' text as a response", (done) => {
    appInstance
      .post("/user/tweets/")
      .set("Accept", "application/json")
      .send({
        tweet: "Test tweet",
      })
      .expect(401)
      .expect("Invalid JWT Token")
      .then((error, response) => {
        done();
      });
  });
  it(":::NJSCADIJBI_TEST_29:::The POST request to the path '/user/tweets/' with valid JWT token should return `Created a Tweet` text as a response upon success", (done) => {
    appInstance
      .post("/user/tweets/")
      .set("Authorization", "bearer " + auth.token)
      .send({
        tweet: "Test tweet",
      })
      .expect(200)
      .expect("Created a Tweet")
      .then((error, response) => {
        done();
      });
  });
  it(":::NJSCADIJBI_TEST_30:::The database should be updated upon the successful post request", async () => {
    expect(
      await database.get(`select tweet from tweet where tweet_id=12`)
    ).toEqual({
      tweet: "Test tweet",
    });
  });
  it(":::NJSCADIJBI_TEST_31:::The DELETE request to the path 'tweets/:tweetId/' without JWT token should return status code as '401' and 'Invalid JWT Token' text as a response", (done) => {
    appInstance
      .delete("/tweets/3/")
      .expect(401)
      .expect("Invalid JWT Token")
      .then((error, response) => {
        done();
      });
  });
  it(":::NJSCADIJBI_TEST_32:::The DELETE request to the path 'tweets/:tweetId/' with valid JWT token should return status code as '401' and 'Invalid Request' if the tweet doesn't belong to the user", (done) => {
    appInstance
      .delete("/tweets/4/")
      .set("Authorization", "bearer " + auth.token)
      .expect(401)
      .expect("Invalid Request")
      .then((error, response) => {
        done();
      });
  });
  it(":::NJSCADIJBI_TEST_33:::The DELETE request to the path 'tweets/:tweetId' with valid JWT token should return `Tweet Removed` text as a response upon success", (done) => {
    appInstance
      .delete("/tweets/7/")
      .set("Authorization", "bearer " + auth.token)
      .expect(200)
      .expect("Tweet Removed")
      .then((error, response) => {
        done();
      });
  });
  it(":::NJSCADIJBI_TEST_34:::The database should be updated upon the successful delete request", async () => {
    expect(await database.get(`select * from tweet where tweet_id=7`)).toBe(
      undefined
    );
  });
});
