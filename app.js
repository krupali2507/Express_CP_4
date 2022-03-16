const express = require("express");
const { open } = require("sqlite");
const sqlite3 = require("sqlite3");
const path = require("path");
const app = express();

app.use(express.json());

const dbPath = path.join(__dirname, "cricketTeam.db");

let db = null;

const initializeDbAndServer = async () => {
  try {
    db = await open({
      filename: dbPath,
      driver: sqlite3.Database,
    });
    app.listen(3000, () => {
      console.log("Server started at localhost:3000");
    });
  } catch (error) {
    console.log(`DB error: ${error}`);
    process.exit(1);
  }
};

app.get("/players/", async (request, response) => {
  const getPlayersData = `SELECT * FROM cricket_team`;
  const playersDetail = await db.all(getPlayersData);
  response.send(playersDetail);
});

app.get("/players/:playerId/", async (request, response) => {
  const { playerId } = request.params;
  const getPlayerQuery = `SELECT * FROM cricket_team WHERE player_id = ${playerId}`;
  const playerDetail = await db.get(getPlayerQuery);
  response.send(playerDetail);
});

app.post("/players/", async (request, response) => {
  const playerDetail = request.body;
  const { playerName, jerseyNumber, role } = playerDetail;

  const addPlayerQuery = `INSERT INTO cricket_team (player_name,jersey_number,role) VALUES ('${playerName}' , '${jerseyNumber}', '${role}');`;
  const dbResponse = await db.run(addPlayerQuery);
  response.send("Player Added to Team");
});

app.put("/players/:playerId/", async (request, response) => {
  const { playerId } = request.params;
  const playerDetail = request.body;
  const { playerName, jerseyNumber, role } = playerDetail;

  const updatePlayerDetailQuery = `UPDATE cricket_team SET player_name = '${playerName}' , 
                                                                  jersey_number = ${jerseyNumber},
                                                                  role = '${role}'
                                                        WHERE player_id = ${playerId};`;

  await db.run(updatePlayerDetailQuery);
  response.send("Player Details Updated");
});

app.delete("/players/:playerId/", async (request, response) => {
  const { playerId } = request.params;

  const deletePlayerQuery = `DELETE FROM cricket_team WHERE player_id = ${playerId}`;

  await db.run(deletePlayerQuery);
  response.send("Player Removed");
});

initializeDbAndServer();
