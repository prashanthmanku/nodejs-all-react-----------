const convertDBObjTOResponseObj = (dbObj) => {
  return {
    movieName: dbObj.movie_name,
  };
};
const convertDBObjTOResponseObj2 = (dbObj2) => {
  return {
    movieId: dbObj2.movie_id,
    directorId: dbObj2.director_id,
    movieName: dbObj2.movie_name,
    leadActor: dbObj2.lead_actor,
  };
};
const convertDBObjTOResponseObj3 = (obj) => {
  return {
    directorId: obj.director_id,
    directorName: obj.director_name,
  };
};

const express = require("express");
const path = require("path");
const { open } = require("sqlite");
const sqlite3 = require("sqlite3");

const app = express();
app.use(express.json());

const dbpath = path.join(__dirname, "moviesData.db");
db = null;
const initializeDBAndServer = async () => {
  try {
    db = await open({
      filename: dbpath,
      driver: sqlite3.Database,
    });
    app.listen(3000, () =>
      console.log("Server is Running at http://localhost:3000/")
    );
  } catch (e) {
    console.log(e.message);
    process.exit(1);
  }
};
initializeDBAndServer();
app.get("/movies/", async (request, response) => {
  const getMoviesquery = `
        SELECT movie_name
        FROM
        movie
        
        ;
    `;
  const moviesArray = await db.all(getMoviesquery);
  //   response.send(convertDBObjTOResponseObj(moviesArray[1]));
  //   console.log(moviesArray);
  response.send(
    moviesArray.map((eachmovie) => convertDBObjTOResponseObj(eachmovie))
  );
});
//post movie api
app.post("/movies/", async (request, response) => {
  const movieDetails = request.body;
  console.log(movieDetails);
  const { directorId, movieName, leadActor } = movieDetails;
  const addMovieQuery = `
            INSERT INTO
            movie
            (director_id,movie_name,lead_actor)
            VALUES
            (${directorId},'${movieName}','${leadActor}');
    `;
  await db.run(addMovieQuery);
  response.send("Movie Successfully Added");
});
//get movie API

app.get("/movies/:movieId/", async (request, response) => {
  const { movieId } = request.params;
  console.log(movieId);
  const getMovieQuery = `
            SELECT *
            FROM movie
            WHERE 
            movie_id=${movieId};
    `;
  const movie = await db.get(getMovieQuery);
  console.log(movie);
  response.send(convertDBObjTOResponseObj2(movie));
});
app.put("/movies/:movieId/", async (request, response) => {
  const { movieId } = request.params;
  const movieDetails = request.body;
  const { directorId, movieName, leadActor } = movieDetails;

  const updateMovieQuery = `
            UPDATE movie 
            SET 
            director_id=${directorId},
            movie_name='${movieName}',
            lead_actor='${leadActor}'
            WHERE movie_id=${movieId}
            
    `;
  await db.run(updateMovieQuery);
  response.send("Movie Details Updated");
});
app.delete("/movies/:movieId", async (request, response) => {
  const { movieId } = request.params;
  const deleteMovieQuery = `
            DELETE FROM 
            movie 
            WHERE movie_id=${movieId}
    `;
  await db.run(deleteMovieQuery);
  response.send("Movie Removed");
});
app.get("/directors/", async (request, response) => {
  const getDirectoriesQuery = `
            SELECT * 
            FROM director 


    `;
  const directorsArray = await db.all(getDirectoriesQuery);
  //   response.send(directorsArray);
  response.send(directorsArray.map((each) => convertDBObjTOResponseObj3(each)));
});

app.get("/directors/:directorId/movies", async (request, response) => {
  const { directorId } = request.params;
  const getDirectorMoviesQuery = `
            SELECT * FROM 
            movie
            WHERE director_id=${directorId};
    `;
  const directorMoviesArray = await db.all(getDirectorMoviesQuery);
  //   response.send(directorMovies);
  response.send(
    directorMoviesArray.map((eachmovie) => convertDBObjTOResponseObj(eachmovie))
  );
});

module.exports = app;
