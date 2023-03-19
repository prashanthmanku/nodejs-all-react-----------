const express = require("express");
const path = require("path");
const { open } = require("sqlite");
const sqlite3 = require("sqlite3");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const dbpath = path.join(__dirname, "covid19IndiaPortal.db");
const app = express();
app.use(express.json());

let db = null;

const initializeDBAndServer = async () => {
  try {
    db = await open({
      filename: dbpath,
      driver: sqlite3.Database,
    });
    app.listen(3001, () =>
      console.log("server is Running at http://localhost:3001/")
    );
  } catch (e) {
    console.log(`DB Error ${e.message}`);
    process.exit(1);
  }
};
initializeDBAndServer();

//middileware fn
const authenticatejwtToken = (request, response, next) => {
  const authHeader = request.headers["authorization"];
  let jwtToken;
  if (authHeader !== undefined) {
    jwtToken = authHeader.split(" ")[1];
  }
  if (jwtToken === undefined) {
    response.status(401);
    response.send("Invalid JWT Token");
  } else {
    jwt.verify(jwtToken, "SECRET_CODE", async (error, payload) => {
      if (error) {
        response.status(401);
        response.send("Invalid JWT Token");
      } else {
        console.log(payload);
        next();
      }
    });
  }
};

//login API
app.post("/login/", async (request, response) => {
  const { username, password } = request.body;
  const selectUserQuery = `
            SELECT * FROM user 
            where username='${username}';

    `;
  const dbUser = await db.get(selectUserQuery);
  if (dbUser === undefined) {
    response.status(400);
    response.send("Invalid user");
  } else {
    const isPasswordMatched = await bcrypt.compare(password, dbUser.password);
    if (isPasswordMatched === true) {
      const payload = { username: username };
      const jwtToken = jwt.sign(payload, "SECRET_CODE");
      response.send({ jwtToken });
    } else {
      response.status(400);
      response.send("Invalid password");
    }
  }
});

//get states API
app.get("/states/", authenticatejwtToken, async (request, response) => {
  const getStatesQuery = `
        SELECT state_id as stateId,state_name as stateName,population 
        FROM state;
    `;
  const statesArray = await db.all(getStatesQuery);
  response.send(statesArray);
});

//get state API
app.get(
  "/states/:stateId/",
  authenticatejwtToken,
  async (request, response) => {
    const { stateId } = request.params;
    const getStateQuery = `
      SELECT state_id as stateId,state_name as stateName,population
      FROM
      state 
      WHERE 
      state_id=${stateId};
    `;
    const state = await db.get(getStateQuery);
    response.send(state);
  }
);

//create district in district Table API
app.post("/districts/", authenticatejwtToken, async (request, response) => {
  const { districtName, stateId, cases, cured, active, deaths } = request.body;
  const createDistrictQUery = `
            INSERT INTO district
            (district_name,state_id,cases,cured,active,deaths)
            VALUES
            (
                '${districtName}',
                ${stateId},
                ${cases},
                ${cured},
                ${active},
                ${deaths}


            );
           

    `;
  await db.run(createDistrictQUery);
  response.send("District Successfully Added");
});

app.get(
  `/districts/:districtId/`,
  authenticatejwtToken,
  async (request, response) => {
    const { districtId } = request.params;
    const getDistrictQuery = `
        SELECT  district_id as districtId,district_name as districtName,state_id as stateId,
        cases,cured,active,deaths
        FROM district
        WHERE district_id=${districtId}
    `;
    const district = await db.get(getDistrictQuery);
    response.send(district);
  }
);

//DELETE district API
app.delete(
  `/districts/:districtId/`,
  authenticatejwtToken,
  async (request, response) => {
    const { districtId } = request.params;
    const deleteDistrictQuery = `
            DELETE FROM district
            WHERE 
            district_id=${districtId};
    `;
    await db.run(deleteDistrictQuery);
    response.send("District Removed");
  }
);

//put DIstrict DEtails Api
app.put(
  `/districts/:districtId/`,
  authenticatejwtToken,
  async (request, response) => {
    const { districtId } = request.params;
    const {
      districtName,
      stateId,
      cases,
      cured,
      active,
      deaths,
    } = request.body;
    const putDistrictDetails = `
        UPDATE district
        SET 
        district_name='${districtName}',
        state_id=${stateId},
        cases=${cases},
        cured=${cured},
        active=${active},
        deaths=${deaths};
    `;
    await db.run(putDistrictDetails);
    response.send("District Details Updated");
  }
);

//statistics of total cases, cured, active, deaths of a specific state based on state ID
app.get(
  `/states/:stateId/stats/`,
  authenticatejwtToken,
  async (request, response) => {
    const { stateId } = request.params;
    const statisticsQuery = `
        SELECT sum(cases) as totalCases,sum(cured) as totalCured,
        sum(active) as totalActive,sum(deaths) as totalDeaths
        FROM district
        WHERE state_id=${stateId};
    `;
    const array = await db.get(statisticsQuery);
    response.send(array);
  }
);

module.exports = app;
