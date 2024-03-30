import express from "express";
import mysql from "mysql";
import cors from "cors";
<<<<<<< HEAD
=======

>>>>>>> ffa5f2452c0aea7e85ec00c54a81f6aaae4aad22
const app = express();

const db = mysql.createConnection({
    host: "localhost", 
<<<<<<< HEAD
    user: "root",
    password: "lele123!",
=======
    user: "mcoca",
    password: "Bingo123",
>>>>>>> ffa5f2452c0aea7e85ec00c54a81f6aaae4aad22
    database: "movie_recommender"
});

db.connect((err) => {
    if (err) {
        console.error("Error connecting to MySQL database:", err);
        return;
    }
    console.log("Connected to database!");
});

<<<<<<< HEAD
=======
//basic db calls to view db in backend app
//db.query("SHOW TABLES;");

//backend app display
>>>>>>> ffa5f2452c0aea7e85ec00c54a81f6aaae4aad22
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

app.post("/genre", (req, res) => {
    console.log("Handling /movie request");
    const q = "INSERT INTO genre (`genre_id`, `genre_name`) VALUES(?);";
    const values = [12, 'Thriller']
    db.query(q,[values],(err,data)=>{
        if (err) {
            console.error("Database query error:", err);
            return res.json(err);
        }
        console.log("Database query success:", data);
        return res.json(data);
    })
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
