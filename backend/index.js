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
    const q = "SELECT * FROM actor LIMIT 600;";
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
         // a single response
         res.json({ status: "Success", message: "Quiz processed successfully.", user_id: user_id });
    }
    catch (err) {
        console.error("Response query error:", err);
        // no response has been sent yet
        if (!res.headersSent) {
            res.status(500).json({ status: "Error", message: "Failed to process quiz submission." });
        }
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

app.get("/selection/:user_id", async (req, res) => {
    const { user_id } = req.params;

    try {
        const sql = `
            SELECT movie.*, 
                GROUP_CONCAT(keyword.keyword_name) AS keywords, 
                GROUP_CONCAT(DISTINCT genre.genre_name) AS genres, 
                GROUP_CONCAT(DISTINCT languages.full_name) AS languages, 
                images.poster_path AS poster
            FROM selection
            JOIN movie ON selection.movie_id = movie.movie_id
            JOIN movie_genre ON selection.movie_id = movie_genre.movie_id
            JOIN genre ON movie_genre.genre_id = genre.genre_id
            JOIN keyword_movie ON selection.movie_id = keyword_movie.movie_id
            JOIN keyword ON keyword_movie.keyword_id = keyword.keyword_id 
            JOIN languages_movie ON selection.movie_id = languages_movie.movie_id
            JOIN languages ON languages_movie.language_id = languages.language_id
            JOIN images ON selection.movie_id = images.movie_id
            WHERE selection.user_id = ?
            GROUP BY movie.movie_id;   
        `;
        const [selectionData] = await promiseDb.query(sql, [user_id]);

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
