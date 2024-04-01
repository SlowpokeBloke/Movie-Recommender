import express from "express";
import mysql from "mysql2";
import cors from "cors";
import { createConnection } from "mysql2/promise";
import bcrypt from "bcrypt";

const app = express();

let promiseDb;
    createConnection({
        host: "localhost",
        user: "root",
        password: "lele123!",
        database: "movie_recommender"
    }).then(db => {
        promiseDb = db;
        console.log("Promise-based database connection established.");
    }).catch(err => {
        console.error("Error establishing promise-based database connection:", err);
    });

const db = mysql.createConnection({
    host: "localhost", 
    user: "root",
    password: "lele123!",
    database: "movie_recommender"
  });

db.connect((err) => {
    if (err) {
        console.error("Error connecting to MySQL database:", err);
        return;
    }
    console.log("Connected to database!");
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
        const sql = "INSERT INTO `person` (`full_name`, `age`, `email`, `password`) VALUES (?)";
        const values = [
            full_name,
            parseInt(age), 
            email,
            hash // Store hashed password in the database
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
    const sql = "SELECT user_id, email, password FROM person WHERE email = ?";
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

app.post("/submitQuiz", async (req,res)=>{
    if(!promiseDb){
        console.log("Not connected to promiseDb");
    }
    console.log("Submitting quiz information");
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
    }
    catch (err) {
        console.error("Response query error:", err);
        return res.json(err);
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

app.listen(8800, () => {
    console.log("Express server listening on port 8800");
});
