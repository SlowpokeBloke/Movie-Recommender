import express from "express";
import mysql from "mysql2";
import cors from "cors";
import { createConnection } from "mysql2/promise";
import bcrypt from "bcrypt";


const app = express();

let promiseDb;
    createConnection({
        host: "movie-recomm.cracaa44anex.us-east-2.rds.amazonaws.com",
        user: "root",
        password: "Lele123!",
        database: "movie_recommender"
    }).then(db => {
        promiseDb = db;
        console.log("Promise-based database connection established.");
    }).catch(err => {
        console.error("Error establishing promise-based database connection:", err);
    });

const db = mysql.createConnection({
    host: "movie-recomm.cracaa44anex.us-east-2.rds.amazonaws.com", 
    user: "root",
    password: "Lele123!",
    database: "movie_recommender"
});


db.connect((err) => {
    if (err) {
        console.error("Error connecting to MySQL database:", err);
        return;
    }
    console.log("Connected to MySQL database!");
});
app.use(express.json());
app.use(cors())

app.get("/", (req, res)=>{
    console.log("Received request for /")
    res.json("hello this is the backend")
})


app.post('/createAccount', (req,res) => {
    const { full_name, age, email, password } = req.body;
    bcrypt.hash(password, 10, (err, hash) => { // Hash the password
        if (err) {
            console.error("Error hashing password:", err);
            return res.status(500).json("Error hashing password");
        }
        const sql = "INSERT INTO movie_recommender.person (`full_name`, `age`, `email`, `password`) VALUES (?)";
        const values = [
            full_name,
            parseInt(age), 
            email,
            hash 
        ];
        db.query(sql, [values], (err, data) =>{
            if (err){
                console.error("Error inserting data into database:", err);
                return res.status(500).json("Error inserting data into database");
            }
            console.log("Data inserted into database successfully");
            return res.json(data);
        });
    });
});

app.post('/login', (req,res) => {
    const { email, password } = req.body;
    const sql = "SELECT user_id, email, password FROM movie_recommender.person WHERE email = ?";
    db.query(sql, [email], (err, data) =>{
        if (err){
            console.error("Error executing query:", err);
            return res.status(500).json("Error executing query");
        }
        if (data.length > 0){
            const hashedPassword = data[0].password;
            console.log("Retrieved hashed password:", hashedPassword);
            console.log("Input password:", password);
            bcrypt.compare(password.toString(), hashedPassword, (err, result) => { // Ensure password is a string
                if (err) {
                    console.error("Error comparing passwords:", err);
                    return res.status(500).json("Error comparing passwords");
                }
                console.log("Comparison result:", result);
                if (result) {
                    const user_id = data[0].user_id; // Get the user_id from the data
                    return res.json({ status: "Success", user_id: user_id }); // Include user_id in the response
                } else {
                    return res.json({ status: "Fail" });
                }
                
            });
        } else {
            return res.json("Fail");
        }
    });
});

app.get("/movie_table", (req, res) => {
    console.log("Handling /movie request");
    const q = "SHOW TABLES;";
    db.query(q, (err, data) => {
        if (err) {
            console.error("Database query error:", err);
            return res.json(err);
        }
        console.log("Database query success:", data);
        return res.json(data);
    });
});

app.get("/actor", (req, res) => {
    console.log("Handling /movie request");
    const q = "SELECT * FROM actor;";
    db.query(q, (err, data) => {
        if (err) {
            console.error("Database query error:", err);
            return res.json(err);
        }
        console.log("Database query success:", data);
        return res.json(data);
    });
});

app.get("/genre", (req, res) => {
    console.log("Handling /movie request");
    const q = "SELECT * FROM genre;";
    db.query(q, (err, data) => {
        if (err) {
            console.error("Database query error:", err);
            return res.json(err);
        }
        console.log("Database query success:", data);
        return res.json(data);
    });
});


app.get("/p/:user_id", async (req, res) => {
    console.log("Handling /profile request");
    const {user_id} = req.params;
    try{
        const q =`
        SELECT p.full_name, p.age FROM person p
        WHERE p.user_id = ?;
        `;
        // data is within an array to extract the first result
        const [result] = await promiseDb.query(q,[user_id]);
        if (result.length === 0) {
            return res.json({ error: "No name found" });
        }
        //check result
        console.log(result);
        //returning the first result only
        return res.json(result[0]); 
    } catch (err) {
        console.error(err);
        return res.json({ error: err.message });
    }
});

app.get("/fav_actors/:user_id", async (req, res) => {
    console.log("Handling /fav_actor request");
    const {user_id} = req.params;
    await initFavoriteActors(user_id);
    try{
    const q = 
        `
        SELECT a.actor_id, a.actor_name FROM user_favorite_actor fa
        JOIN actor a
        WHERE fa.user_id = ?
        AND a.actor_id = fa.actor_id;
        `;
        const [fav_actors] = await promiseDb.query(q,user_id);
        if(fav_actors.length===0){
            return res.status(404).json({error: "Favorited actors not found for this user"});
        }
        console.log(fav_actors);
        return res.json(fav_actors);
    }catch(err){
        console.error(err);
        return res.json(err);
    }
});
app.get("/fav_genres/:user_id", async (req, res) => {
    console.log("Handling /fav_genre request");
    const {user_id} = req.params;
    await initFavoriteGenres(user_id);
    try{
    const q = 
        `
        SELECT g.genre_id, g.genre_name FROM user_favorite_genre fg
        JOIN genre g
        WHERE fg.user_id = ?
        AND g.genre_id = fg.genre_id;
        `;
        const [fav_genres] = await promiseDb.query(q,user_id);
        if(fav_genres.length===0){
            return res.status(404).json({error: "Favorited genres not found for this user"});
        }
        return res.json(fav_genres);

    }catch(err){
        console.error(err);
        return res.json(err);
    }
});

//initializes user_favorite_actor if empty from response tables
async function initFavoriteActors(user_id){
    // const {user_id} = req.params;
    try{
        const qa = 
        `
        SELECT COUNT(*) as a_count FROM user_favorite_actor fa
        WHERE fa.user_id = ?;
        `;
        const [fa_result] = await promiseDb.query(qa,[user_id]);
        const fa_count = fa_result[0].a_count;
        console.log("fav actor table has " + fa_count + " entries");
        if(fa_count===0){
            console.log("initializing fav actors if empty from response tables");
            // return res.status(404).json({error: "Favorited genres not found for this user"});
            const fa_insert =`
            INSERT INTO user_favorite_actor (user_id, actor_id)
            (SELECT DISTINCT r.user_id, ra.actor_id FROM responses r
                JOIN response_actor ra
                JOIN actor a
                WHERE r.user_id = ?
                AND r.response_id IN (SELECT MAX(response_id) FROM responses WHERE user_id=?)
                AND r.response_id = ra.response_id
                AND ra.actor_id = a.actor_id
            );`;
            const [ufa_result] = await promiseDb.query(fa_insert,[user_id, user_id]);
            console.log("inserted quiz actor responses into user favorite actor table " + ufa_result);
        }else{
            console.log("user favorite actor table already initialized");
        }
    }catch(err){
        console.error(err);
        //return res.json(err);
    }

};
//initializes user_favorite_genre if empty from response tables
async function initFavoriteGenres(user_id){
    // const {user_id} = req.params;
    try{
        const qg = 
        `
        SELECT COUNT(*) as g_count FROM user_favorite_genre fg
        WHERE fg.user_id = ?;
        `;
        const [fg_result] = await promiseDb.query(qg,[user_id]);
        const fg_count = fg_result[0].g_count;
        console.log("fav genre table has " + fg_count + " entries");
        if(fg_count===0){
            console.log("initializing fav genres if empty from response tables");
            // return res.status(404).json({error: "Favorited genres not found for this user"});
            const fg_insert =`
            INSERT INTO user_favorite_genre (user_id, genre_id)
            (SELECT DISTINCT r.user_id, rg.genre_id FROM responses r
                JOIN response_genre rg
                JOIN genre g
                WHERE r.user_id = ?
                AND r.response_id IN (SELECT MAX(response_id) FROM responses WHERE user_id=?)
                AND r.response_id = rg.response_id
                AND rg.genre_id = g.genre_id
            );`;
            const [ufg_result] = await promiseDb.query(fg_insert,[user_id, user_id]);
            console.log("inserted quiz genre responses into user favorite genre table " + ufg_result);
        }else{
            console.log("user favorite genre table already initialized");
        }
    }catch(err){
        console.error(err);
        //return res.json(err);
    }

};

app.post("/submitToFavActors", async (req, res)=>{
    if(!promiseDb){
        console.log("Not connected to promiseDb");
    }
    console.log("Submitting actor selection");
    console.log("Received actor selection:", req.body);
    //console.log("Add List Entry, Parameters: ", [user_id, movie_id]);
    const insertToFavorites = `
        INSERT INTO user_favorite_actor (user_id, actor_id)
        VALUES (?, ?);
    `;
    const values = [
        req.body.user_id,
        req.body.actor_id
    ];

    console.log("vals: " + values);
    try{
        const result = await promiseDb.query(insertToFavorites, values);
        const fa_id = result;
        console.log("New entry added to Favorite Actors");
        return res.json({ status: "Success", message: "Actor Selection processed and added into FA", values});
    }catch(error){
        console.error("Failed to insert entry into FA");
        return res.status(500).json({ status: "Error", message: "Failed to add actor into FA" });
    }
});
app.post("/deleteFavActor", async (req, res) => 
    {
        //console.log("Del List Entry, Parameters: ", [req.body.watch_list_id]);
        const deleteFavActor =`
            DELETE FROM user_favorite_actor WHERE user_id=? AND actor_id=?;
        `;
        const values = [
            req.body.user_id,
            req.body.actor_id,
        ];
        console.log("del vals: " + values);
        try{
            await promiseDb.query(deleteFavActor, values);
            console.log("Deleted favorite Actor entry");
            return res.json({ status: "Success", message: "Actor Selection processed and deleted from UFA", values});

        }catch(error){
            console.error("Failed to delete Actor entry");
            return res.status(500).json({ status: "Error", message: "Failed to delete actor from UFA" });
        }
    }
);

app.post("/submitToFavGenres", async (req, res)=>{
    if(!promiseDb){
        console.log("Not connected to promiseDb");
    }
    console.log("Submitting genre selection");
    console.log("Received genre selection:", req.body);
    //console.log("Add List Entry, Parameters: ", [user_id, movie_id]);
    const insertToFavorites = `
        INSERT INTO user_favorite_genre (user_id, genre_id)
        VALUES (?, ?);
    `;
    const values = [
        req.body.user_id,
        req.body.genre_id
    ];

    console.log("vals: " + values);
    try{
        const result = await promiseDb.query(insertToFavorites, values);
        const fg_id = result;
        console.log("New entry added to Favorite Genres");
        return res.json({ status: "Success", message: "Genre Selection processed and added into FG", values});
    }catch(error){
        console.error("Failed to insert entry into FG");
        return res.status(500).json({ status: "Error", message: "Failed to add actor into FG" });
    }
});
app.post("/deleteFavGenre", async (req, res) => 
    {
        //console.log("Del List Entry, Parameters: ", [req.body.watch_list_id]);
        const deleteFavGenre =`
            DELETE FROM user_favorite_genre WHERE user_id=? AND genre_id=?;
        `;
        const values = [
            req.body.user_id,
            req.body.genre_id,
        ];
        console.log("del vals: " + values);
        try{
            await promiseDb.query(deleteFavGenre, values);
            console.log("Deleted favorite Genre entry");
            return res.json({ status: "Success", message: "Genre Selection processed and deleted from UFG", values});

        }catch(error){
            console.error("Failed to delete Genre entry");
            return res.status(500).json({ status: "Error", message: "Failed to delete genre from UFG" });
        }
    }
);

app.get("/watch_list/:user_id", async (req, res) => {
    console.log("Handling /watch_list request");
    const {user_id} = req.params;
    try{
    const q = 
        `
        SELECT wl.watch_list_id, m.title FROM watch_list wl
        JOIN movie m
        WHERE wl.user_id = ?
        AND m.movie_id = wl.movie_id
        AND wl.completed = false;
        `;
        const [saved_movies] = await promiseDb.query(q,[user_id]);
        if(saved_movies.length===0){
            return res.status(404).json({error: "Saved movies not found for this user"});
        }
        console.log(saved_movies);
        return res.json(saved_movies);

    }catch(err){
        console.error(err);
        return res.json(err);
    }
});
app.get("/completed_list/:user_id", async (req, res) => {
    console.log("Handling /watch_list request");
    const {user_id} = req.params;
    try{
    const q = 
        `
        SELECT wl.watch_list_id, m.title FROM watch_list wl
        JOIN movie m
        WHERE wl.user_id = ?
        AND m.movie_id = wl.movie_id
        AND wl.completed = true;
        `;
        const [saved_movies] = await promiseDb.query(q,[user_id]);
        if(saved_movies.length===0){
            return res.status(404).json({error: "Saved movies not found for this user"});
        }
        console.log(saved_movies);
        return res.json(saved_movies);

    }catch(err){
        console.error(err);
        return res.json(err);
    }
});

app.post("/submitToList", async (req, res)=>{
    if(!promiseDb){
        console.log("Not connected to promiseDb");
    }
    console.log("Submitting movie selection");
    console.log("Received movie selection:", req.body);
    //console.log("Add List Entry, Parameters: ", [user_id, movie_id]);
    const insertToList = `
        INSERT INTO watch_list (user_id, movie_id)
        VALUES (?, ?);
    `;
    const values = [
        req.body.user_id,
        req.body.movie_id
    ];

    console.log("vals: " + values);
    try{
        const result = await promiseDb.query(insertToList, values);
        const watchList_id = result;
        console.log("New entry added to Watch List");
        return res.json({ status: "Success", message: "Movie Selection processed and added to WL", values});
    }catch(error){
        console.error("Failed to insert entry into Watch List");
        return res.status(500).json({ status: "Error", message: "Failed to add to list" });
    }
});
app.post("/deleteFromList", async (req, res) => 
    {
        //console.log("Del List Entry, Parameters: ", [req.body.watch_list_id]);
        const deleteFromList =`
            DELETE FROM watch_list WHERE watch_list_id=?;
        `;
        const values = [req.body.watch_list_id];
        console.log("del vals: " + values);
        try{
            await promiseDb.query(deleteFromList, values);
            console.log("Deleted watchlist entry");
            return res.json({ status: "Success", message: "Movie Selection processed and deleted from WL", values});

        }catch(error){
            console.error("Failed to delete Watch List entry");
            return res.status(500).json({ status: "Error", message: "Failed to delete from list" });
        }
    }
);

app.post("/updateList", async (req, res) => 
    {
        const updateList =`
            UPDATE watch_list
            SET completed = true
            WHERE watch_list_id=?;
        `;
        const values = [req.body.watch_list_id];
        console.log("update vals: " + values);
        try{
            db.query(updateList, values);
            console.log("updated watchlist entry");
            return res.json({ status: "Success", message: "Movie status updated in WL", values});

        }catch(error){
            console.error("Failed to update Watch List entry");
            return res.status(500).json({ status: "Error", message: "Failed to update movie status in list" });
        }
    }
);


async function selectCriteriaForMovie(user_id, response_id){
    // most recent response id
    const recentResponse= 
    `
    SELECT p.user_id, p.full_name, r.response_id, r.release_date, r.movie_night, r.ratings
    FROM person p 
    JOIN responses r on p.user_id = r.user_id
    WHERE p.user_id = ? AND r.response_id IN (
        SELECT MAX(r2.response_id)
        FROM responses r2
        WHERE r2.user_id = p.user_id);
    `;
    try{

    const [userResponses] = await promiseDb.query(recentResponse,[user_id, response_id]);
    if(userResponses.length === 0 ){
        return { movie_id: null, error: "No user responses found" };
    }
    // extracts first users choices
    const { release_date, ratings } = userResponses[0];
    // condition for release date
    let releaseDateChosen = "";

    if(release_date.includes("10 years")){
        releaseDateChosen = "AND m.release_date >= CURDATE() - INTERVAL 10 YEAR";
    } else if (release_date.includes("20 years")){
        releaseDateChosen = "AND m.release_date >= CURDATE() - INTERVAL 20 YEAR";
    } else if (release_date.includes("Any release date")){
        releaseDateChosen = "AND m.release_date <= CURDATE()"
    }
    //condition for ratings
    let ratingsChosen = "";
    if (ratings === "High Ratings"){
        ratingsChosen = "AND v.vote_avg >= 7.0";
    } else if (ratings === "Low Ratings"){
        ratingsChosen = "AND v.vote_avg <= 6.9";
    }
    //all the data needed for the movie based on the user responses
    const moviePool = 
    `
    SELECT m.movie_id, m.title, a.actor_id, a.actor_name, g.genre_id, g.genre_name
    FROM movie m
    JOIN actor_movie am ON m.movie_id = am.movie_id
    JOIN actor a ON am.actor_id = a.actor_id
    JOIN movie_genre mg ON m.movie_id = mg.movie_id
    JOIN genre g ON mg.genre_id = g.genre_id
    JOIN total_votes v ON m.movie_id = v.movie_id
        WHERE EXISTS (
                SELECT 1 FROM response_actor ra 
                WHERE ra.actor_id = a.actor_id AND ra.response_id = ${response_id}
        ) AND EXISTS (
                SELECT 1 FROM response_genre rg 
                WHERE rg.genre_id = g.genre_id AND rg.response_id = ${response_id}
        )
        ${releaseDateChosen}
        ${ratingsChosen}
        ORDER BY RAND()
        LIMIT 1;
    `;
    //GROUP BY m.movie_id
    const [movies] = await promiseDb.query(moviePool);
    if(movies.length === 0){
        console.log("No movies found based on user responses");
         return null;
    }
    console.log("Executing SQL:", moviePool);
    return movies[0].movie_id; 
    }catch (error){
        console.error("Error selecting movie on criteria:", error);
        return null;
    }

}
async function insertNewSelection(user_id, movie_id, response_id ){
    //check
    console.log("Parameters:", [user_id, movie_id, response_id]);
    const insertSelection = `
            INSERT INTO selection (user_id, movie_id, response_id)
            VALUES (?, ?, ?);
        `;
        try {
            const [result] = await promiseDb.query(insertSelection, [user_id, movie_id, response_id]);
            console.log("New selection created, ID:", result.insertId);
            // selection_id returned directly
            return result.insertId;  
        }catch(error){
            console.error("Insert failed:", error);
            return null;
        }};

app.post("/submitQuiz", async (req,res)=>{
    if(!promiseDb){
        console.log("Not connected to promiseDb");
    }
    console.log("Submitting quiz information");
    console.log("Received quiz submission:", req.body);
    
  try{ 
        
        const{user_id, nightType,releaseDate,genreType, actorType, ratingChosen} = req.body;
        const values = [user_id, releaseDate,nightType, ratingChosen];

        const responseQuery = "INSERT INTO responses (`user_id`, `release_date`, `movie_night`, `ratings`) VALUES(?, ?, ?, ?);"; 
        const[response] = await promiseDb.query(responseQuery,values);
        // response id created after response query inserted
        const response_id = response.insertId;

        // waits until all insertions are done 
        await Promise.all(genreType.map( async (genre_id) => {
            const responseGenreQuery = 'INSERT INTO response_genre (`response_id`, `genre_id`) VALUES(?, ?);';
            await promiseDb.query(responseGenreQuery, [response_id, genre_id]);
        }));

        await Promise.all(actorType.map(async (actor_id) =>{
            const responseActorQuery = 'INSERT INTO response_actor (`response_id`, `actor_id`) VALUES (?, ?); ';
            await promiseDb.query(responseActorQuery, [response_id, actor_id]);

        }));
         // insertions have to finish
         await Promise.all([...genreType, ...actorType]);
         
        // checking for movies
         const movie_id = await selectCriteriaForMovie(user_id, response_id);
         if (!movie_id) {
             return res.status(404).json({ status: "Error", message: "No suitable movie found" });
         }
         // no selection
         const selection_id = await insertNewSelection(user_id, movie_id, response_id);
         if (!selection_id) {
             return res.status(500).json({ status: "Error", message: "Failed to create selection" });
         }
         //result output
         res.json({ status: "Success", message: "Quiz processed and selection created", selection_id, user_id, response_id });
     } catch (err) {
         console.error("Response query error:", err);
         res.status(500).json({ status: "Error", message: "Failed to process quiz submission", error: err.message });
     }
 });

app.get("/movie_db", (req,res)=>{
    const query = "SHOW TABLES;";
    db.query(query,(err, data)=>{
        if(err) return res.json(err)
        return res.json(data)
    })
});

app.get("/movie", (req,res)=>{
    const query = "SELECT * FROM movie;";
    db.query(query,(err, data)=>{
        if(err) return res.json(err)
        return res.json(data)
    })
});

app.post("/movie", (req,res)=>{
    const query = "INSERT INTO movie (`title`,`runtime`,`overview`,`release_date`) VALUES (?)";
    const values = [
        req.body.title,
        req.body.runtime,
        req.body.overview,
        req.body.release_date
    ];
    db.query(query,[values],(err,data)=>{
        if(err) returnres.json(err);
        return res.json("Movie successfully created.");
    })
});

app.get("/selection/:user_id/:selection_id", async (req, res) => {
    const { user_id, selection_id} = req.params;

    try {
        const sql = `
            SELECT movie.*, 
                GROUP_CONCAT(DISTINCT keyword.keyword_name) AS keywords, 
                GROUP_CONCAT(DISTINCT genre.genre_name) AS genres, 
                GROUP_CONCAT(DISTINCT languages.full_name) AS languages, 
                images.poster_path AS poster
            FROM selection s
            JOIN movie ON s.movie_id = movie.movie_id
            JOIN movie_genre ON s.movie_id = movie_genre.movie_id
            JOIN genre ON movie_genre.genre_id = genre.genre_id
            JOIN keyword_movie ON s.movie_id = keyword_movie.movie_id
            JOIN keyword ON keyword_movie.keyword_id = keyword.keyword_id 
            JOIN languages_movie ON s.movie_id = languages_movie.movie_id
            JOIN languages ON languages_movie.language_id = languages.language_id
            JOIN images ON s.movie_id = images.movie_id
            WHERE s.user_id = ? AND s.selection_id = ?
            GROUP BY movie.movie_id;   
        `;
        const [selectionData] = await promiseDb.query(sql, [user_id, selection_id]);

        if (selectionData.length === 0) {
            return res.status(404).json({ error: "Selection not found for this user" });
        }

        const formattedSelectionData = selectionData.map(movie => ({
            ...movie,
            keywords: movie.keywords.split(',')
        }));

        res.json(formattedSelectionData);
    } catch (err) {
        console.error("Error fetching selection data:", err);
        res.status(500).json({ error: "Failed to fetch selection data" });
    }
});

app.listen(8800, () => {
    console.log("Express server listening on port 8800");
});
