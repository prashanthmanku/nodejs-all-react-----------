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
    app.listen(3000, () => {
      console.log("server is running at http://localhost:3000");
    });
  } catch (e) {
    console.log(`DB Error:${e.message}`);
    process.exit(1);
  }
};
initializeDBAndServer();
//get players API
const convert1 = (obj) => {
  return {
    PlayerId: obj.player_id,
    playerName: obj.player_name,
    jerseyNumber: obj.jersey_number,
    role: obj.role,
  };
};

app.get("/players/", async (request, response) => {
  const getplayersQuery = `select * from cricket_team`;
  const playersArray = await db.all(getplayersQuery);
  //   response.send(playersArray);
  response.send(playersArray.map((eachobj) => convert1(eachobj)));
});
//post player API
app.post("/players/", async (request, response) => {
  const playerDetails = request.body;
  console.log(playerDetails);
  const { playerName, jerseyNumber, role } = playerDetails;
  const postplayerQuery = `
        INSERT INTO cricket_team
        (player_name,jersey_number,role)
        values
        ('${playerName}','${jerseyNumber}','${role}');
    `;
  const dbResponse = await db.run(postplayerQuery);
  const id = dbResponse.lastID;
  response.send({ id: id });
});
//get player API
app.get("/players/:playerId/", async (request, response) => {
  const { playerId } = request.params;
  const getplayerQuery = `
        SELECT * FROM cricket_team
        WHERE player_id='${playerId}'
    `;
  const player = await db.get(getplayerQuery);
  //   response.send(player);
  response.send(convert1(player));
  //   console.log(player);
});
//update player API
app.put(`/players/:playerId/`, async (request, response) => {
  const { playerId } = request.params;
  const playerDetails = request.body;
  const { playerName, jerseyNumber, role } = playerDetails;
  const updatePlayerQuery = `
        update cricket_team
        set 
        player_name='${playerName}',
        jersey_number=${jerseyNumber},
        role='${role}';

    `;
  db.run(updatePlayerQuery);
  response.send("Player Details Updated");
});
//Delete player API
app.delete("/players/:playerId/", async (request, response) => {
  const { playerId } = request.params;
  const deleteplayerQuery = `
            DELETE FROM cricket_team
            WHERE player_id=${playerId};
    `;
  await db.run(deleteplayerQuery);
  response.send("Player Removed");
});
