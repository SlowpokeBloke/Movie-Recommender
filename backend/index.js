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

app.get("/movie", (req,res)=>{
    const q = "SHOW TABLES;"
    db.query(q,(err,data)=>{
        if(err) return res.json(err)
        return res.json(data)
    })

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
async function selectCriteriaForMovie(user_id, response_id){
    // most rescent response id
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
        GROUP BY m.movie_id
        ORDER BY RAND()
        LIMIT 1;
    `;
    
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
        //not wrapping it 
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
        if(err) returnres.json(err)
        return res.json(data)
    })
});

app.get("/movie", (req,res)=>{
    const query = "SELECT * FROM movie;";
    db.query(query,(err, data)=>{
        if(err) returnres.json(err)
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

//most recent response
app.get("/recent_response", (req,res)=>{
    const query = 
    `
    SELECT p.user_id, p.full_name, r.response_id, r.release_date, r.movie_night, r.ratings
    FROM person p 
    JOIN responses r on p.user_id = r.user_id
    WHERE p.user_id = 2 AND r.response_id IN (
	    SELECT MAX(r2.response_id)
        FROM responses r2
        WHERE r2.user_id = p.user_id
    );

    `;
    db.query(query,(err, data)=>{
        if(err) return res.json(err)
        return res.json(data)
    })
});
// response_genres {test}
app.get("/user_resp_genre", (req,res)=>{
    const query = 
    `
    SELECT mg.movie_id, m.title, g.genre_id, g.genre_name
    FROM response_genre r
    JOIN genre g ON r.genre_id = g.genre_id
    JOIN movie_genre mg ON g.genre_id = mg.genre_id
    JOIN movie m ON mg.movie_id = m.movie_id
    WHERE r.response_id = 6
    ORDER BY g.genre_name, mg.movie_id;
    ;

    `;
    db.query(query,(err, data)=>{
        if(err) return res.json(err)
        return res.json(data)
    })
});
// response_actors {test}
app.get("/user_resp_actor", (req,res)=>{
    const query = 
    `
    SELECT am.movie_id, m.title, a.actor_id, a.actor_name
    FROM response_actor ra
    JOIN actor a ON ra.actor_id = a.actor_id
    JOIN actor_movie am ON a.actor_id = am.actor_id
    JOIN movie m ON am.movie_id = m.movie_id
    WHERE ra.response_id = 6
    ORDER BY a.actor_name, am.movie_id;
    `;
    db.query(query,(err, data)=>{
        if(err) return res.json(err)
        return res.json(data)
    })
});

// response of actors and genres combined {test}
app.get("/user_resp_genre_actor", (req,res)=>{
    const query = 
    `
    SELECT m.movie_id, m.title, a.actor_id, a.actor_name, g.genre_id, g.genre_name
    FROM movie m
    JOIN actor_movie am ON m.movie_id = am.movie_id
    JOIN actor a ON am.actor_id = a.actor_id
    JOIN movie_genre mg ON m.movie_id = mg.movie_id
    JOIN genre g ON mg.genre_id = g.genre_id
        WHERE EXISTS (
                SELECT 1 FROM response_actor ra 
                WHERE ra.actor_id = a.actor_id AND ra.response_id = 6
        ) AND EXISTS (
                SELECT 1 FROM response_genre rg 
                WHERE rg.genre_id = g.genre_id AND rg.response_id = 6
        )
    ORDER BY a.actor_name, g.genre_name, m.movie_id;

    `;
    db.query(query,(err, data)=>{
        if(err) return res.json(err)
        return res.json(data)
    })
});

//user response with genres, actors, ratings, and release_dates {test}
app.get("/total_user_resp/:user_id", async (req, res)=>{
    const {user_id} = req.params;
    try{
        const recentResponse= 
        `
        SELECT p.user_id, p.full_name, r.response_id, r.release_date, r.movie_night, r.ratings
        FROM person p 
        JOIN responses r on p.user_id = r.user_id
        WHERE p.user_id = ? AND r.response_id IN (
	        SELECT MAX(r2.response_id)
            FROM responses r2
            WHERE r2.user_id = p.user_id);
        `
        //query that needs the param of the user_id
        const [userResponses] = await promiseDb.query(recentResponse,[user_id]);
        if(userResponses.length === 0 ){
            return res.status(404).json("No user responses found");
        }

        const {response_id, release_date, ratings } = userResponses[0];
        // condition for release date
        let releaseDateChosen = "";

        if(release_date.includes("10 years")){
            releaseDateChosen = "AND m.release_date >= CURDATE() - INTERVAL 10 YEAR";
        } else if (release_date.includes("20 years")){
            releaseDateChosen = "AND m.release_date >= CURDATE() - INTERVAL 20 YEAR";
        } else if (release_date.includes("Any release date")){
            releaseDateChosen = "AND m.release_date <= CURDATE()"
        }
        //condition for ratings since dynamic
        let ratingsChosen = "";
        if (ratings === "High Ratings"){
            ratingsChosen = "AND v.vote_avg >= 7.0";
        } else if (ratings === "Low Ratings"){
            ratingsChosen = "AND v.vote_avg <= 6.9";
        }

        const moviePool = 
        `
        SELECT m.movie_id, m.title, a.actor_id, a.actor_name, g.genre_id, g.genre_name
        FROM movie m
        JOIN actor_movie am ON m.movie_id = am.movie_id
        JOIN actor a ON am.actor_id = a.actor_id
        JOIN movie_genre mg ON m.movie_id = mg.movie_id
        JOIN genre g ON mg.genre_id = g.genre_id
            WHERE EXISTS (
                    SELECT 1 FROM response_actor ra 
                    WHERE ra.actor_id = a.actor_id AND ra.response_id = ${response_id}
            ) AND EXISTS (
                    SELECT 1 FROM response_genre rg 
                    WHERE rg.genre_id = g.genre_id AND rg.response_id = ${response_id}
            )
            ${releaseDateChosen}
            ${ratingsChosen}
            GROUP BY m.movie_id
            ORDER BY RAND()
            LIMIT 1;
        `;
        const [movies] = await promiseDb.query(moviePool);
        if(movies.length === 0){
            return res.status(404).json("No movies found based on user responses. Try again.");
        }
        res.json({status: "Success", movies});
       
        // when movie found, insert into selection
        const movie_id = movies[0].movie_id;
        
        const insertSelection = `
            INSERT INTO selection (user_id, movie_id, response_id)
            VALUES (?, ?, ?);
        `;
        await promiseDb.query(insertSelection, [user_id, movie_id, response_id]).then(result => {
            
            const selection_id = result[0].insertId;
            res.json({ status: "Success", message: "New selection created", selection_id, user_id, response_id });
        }).catch(err => {
            console.error("Insert failed:", err);
            res.status(500).json({ error: "Failed to insert selection", details: err.message });
        });}
        catch (error){
            console.error("Database query error: ", error);
            res.status(500).json("Failed to process user responses because of responses");            
        }   
        
});



app.listen(8800, () => {
    console.log("Express server listening on port 8800");
});
