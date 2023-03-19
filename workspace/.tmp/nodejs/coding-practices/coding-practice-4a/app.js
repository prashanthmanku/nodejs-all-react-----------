const convertDBObjectToResponseObject = (dbObject) => {
  return {
    playerId: dbObject.player_id,
    playerName: dbObject.player_name,
    jerseyNumber: dbObject.jersey_number,
    role: dbObject.role,
  };
};
const express = require("express");
const path = require("path");
const { open } = require("sqlite");
const sqlite3 = require("sqlite3");

const app = express();
app.use(express.json());

const dbpath = path.join(__dirname, "cricketTeam.db");

let db = null;
const initializeDBAndServer = async () => {
  try {
    db = await open({
      filename: dbpath,
      driver: sqlite3.Database,
    });
    app.listen(3001, () => {
      console.log("server Running at http://localhost:3001/");
    });
  } catch (e) {
    console.log(`DB Error: ${e.message}`);
    process.exit(1);
  }
};
initializeDBAndServer();
//get players API
app.get("/players/", async (request, response) => {
  const getPlayesQuery = `
            SELECT * FROM  cricket_team ORDER BY player_id;
    `;
  const playersArray = await db.all(getPlayesQuery);
  //   response.send(
  //     playersArray.map((eachplayer) => {
  //       convertDBObjectToResponseObject(eachplayer);
  //     })
  //  );

  //   response.send(convertDBObjectToResponseObject(playersArray[1]));
  response.send(
    playersArray.map((eachPlayer) =>
      //   console.log(eachPlayer);
      convertDBObjectToResponseObject(eachPlayer)
    )
  );
});
//POST player API
app.post("/players/", async (request, response) => {
  const playerDetails = request.body;
  const { playerName, jerseyNumber, role } = playerDetails;
  const addPlayerQuery = `
            INSERT INTO 
            cricket_team 
            (player_name,jersey_number,role)
            VALUES
            (
                '${playerName}',
                ${jerseyNumber},
                '${role}'
            );

    `;
  const dbResponse = await db.run(addPlayerQuery);
  const playerid = dbResponse.lastID;
  //   response.send({ plaerid: playerid });
  response.send("Player Added to Team");
});
//GET player
app.get("/players/:playerId/", async (request, response) => {
  const { playerId } = request.params;
  const getPlayerQuery = `
            SELECT * FROM cricket_team WHERE player_id=${playerId};
    `;
  const player = await db.get(getPlayerQuery);
  response.send(convertDBObjectToResponseObject(player));
});

//put PLAYER API
app.put("/players/:playerId/", async (request, response) => {
  const { playerId } = request.params;
  const playerDetails = request.body;
  const { playerName, jerseyNumber, role } = playerDetails;
  //   response.send(`response ${role}`);
  const updatePlayerQuery = `
              UPDATE cricket_team
              SET
              player_name= '${playerName}',

              jersey_number=${jerseyNumber},
              role='${role}'
              WHERE
              player_id=${playerId};
      `;
  await db.run(updatePlayerQuery);

  response.send("Player Details Updated");
});
//Delete player API
app.delete("/players/:playerId/", async (request, response) => {
  const { playerId } = request.params;
  const deletePlayerQuery = `
            DELETE FROM cricket_team
            WHERE 
            player_id=${playerId}
    `;
  await db.run(deletePlayerQuery);
  response.send("Player Removed");
});
module.exports = app;
