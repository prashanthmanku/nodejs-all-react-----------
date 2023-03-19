const express = require("express");
const path = require("path");

const { open } = require("sqlite");
const sqlite3 = require("sqlite3");

const app = express();
app.use(express.json());

const dbpath = path.join(__dirname, "covid19India.db");

let db = null;
console.log(dbpath);

const initializeDBAndServer = async () => {
  try {
    db = await open({
      filename: dbpath,
      driver: sqlite3.Database,
    });
    app.listen(3000, () =>
      console.log("server Running is Running At http://localhost:3000/")
    );
  } catch (e) {
    console.log(e.message);
    process.exit(1);
  }
};
initializeDBAndServer();

const convertdbObjToResponseObj = (obj) => {
  return {
    stateId: obj.state_id,
    stateName: obj.state_name,
    population: obj.population,
  };
};

app.get("/states/", async (request, response) => {
  const getstatesQuery = `
        SELECT * FROM
        state;
    `;
  const statesArray = await db.all(getstatesQuery);
  //   response.send(statesArray);
  response.send(
    statesArray.map((eachStateObj) => convertdbObjToResponseObj(eachStateObj))
  );
});

//get state  API
app.get("/states/:stateId", async (request, response) => {
  const { stateId } = request.params;
  const getStateQuery = `
            SELECT *
            FROM state 
            WHERE state_id=${stateId};
    `;
  const state = await db.get(getStateQuery);
  //   response.send(state);
  response.send(convertdbObjToResponseObj(state));
});

//post Distric API districsts
app.post("/districts/", async (request, response) => {
  const districtDetails = request.body;
  const {
    districtName,
    stateId,
    cases,
    cured,
    active,
    deaths,
  } = districtDetails;
  console.log(districtName);
  const addDistrictsQuery = `
            INSERT INTO district
            (district_name,state_id,cases,cured,active,deaths)
            VALUES
                ('${districtName}',${stateId},${cases},${cured},${active},${deaths});

    `;
  const dbResponse = await db.run(addDistrictsQuery);
  const districtId = dbResponse.lastID;
  console.log({ districtId: districtId });
  response.send("District Successfully Added");
});
//get district
const convert1 = (obj) => {
  return {
    districtId: obj.district_id,
    districtName: obj.district_name,
    stateId: obj.state_id,
    cases: obj.cases,
    cured: obj.cured,
    active: obj.active,
    deaths: obj.deaths,
  };
};

app.get("/districts/:districtId/", async (request, response) => {
  const { districtId } = request.params;
  const getDistrictQuery = `
            SELECT * FROM 
            district 
            WHERE district_id='${districtId}';
    `;
  const district = await db.get(getDistrictQuery);
  response.send(convert1(district));
});
//delete district

app.delete("/districts/:districtId/", async (request, response) => {
  const { districtId } = request.params;
  console.log(districtId);
  const deleteDistrictQuery = `
            DELETE FROM 
            district
            WHERE
             district_id=${districtId}
    `;
  await db.run(deleteDistrictQuery);
  response.send("District Removed");
});
//Updates the details of a specific district based on the district ID
app.put(`/districts/:districtId/`, async (request, response) => {
  const districtDetails = request.body;
  const { districtId } = request.params;
  const {
    districtName,
    stateId,
    cases,
    cured,
    active,
    deaths,
  } = districtDetails;
  const updateDisrictQuery = `
            UPDATE District
            SET 
            district_name='${districtName}',
            state_id=${stateId},
            cases=${cases},
            cured=${cured},
            active=${active},
            deaths=${deaths}
            WHERE district_id=${districtId};     
    `;
  await db.run(updateDisrictQuery);
  response.send("District Details Updated");
});
/*Returns the statistics of total cases, cured, active,
 deaths of a specific state based on state ID */

const convetrDBObjToResponseOBj = (dbObj) => {
  return {
    totalCases: dbObj.cases,
    totalCured: dbObj.cured,
    totalActive: dbObj.active,
    totalDeaths: dbObj.deaths,
  };
};

app.get(`/states/:stateId/stats/`, async (request, response) => {
  const { stateId } = request.params;
  const getStatisticsOfStateQuery = `
            SELECT 
            sum(cases) as totalCases,
            sum(cured) as totalCured,
            sum(active) as totalActive,
            sum(deaths) as totalDeaths

            FROM district
            
            WHERE state_id=${stateId}
            group by state_id;
     `;
  const statisticsOfState = await db.get(getStatisticsOfStateQuery);
  //   response.send(statisticsOfState);
  response.send(statisticsOfState);
});

/*Returns an object containing the state name of a district
 based on the district ID*/

const convert = (obj) => {
  return {
    stateName: obj.state_name,
  };
};
app.get(`/districts/:districtId/details/`, async (request, response) => {
  const { districtId } = request.params;
  const getStateNameQuery = `
            SELECT state_name
            FROM state 
            left  JOIN district
            ON district.state_id=state.state_id
            where district_id=${districtId};
     `;
  const stateName = await db.get(getStateNameQuery);
  console.log(stateName);
  //   response.send(stateName);
  response.send(convert(stateName));
});

module.exports = app;
