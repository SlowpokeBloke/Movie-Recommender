import express from "express";
import mysql from "mysql";
import cors from "cors";
import bcrypt from "bcrypt";

const app = express();
app.use(cors());
app.use(express.json());

const db = mysql.createConnection({
    host: "localhost", 
    user: "root",
    password: "Bella8903_",
    database: "movie_recommender"
});

db.connect((err) => {
    if (err) {
        console.error("Error connecting to MySQL database:", err);
        return;
    }
    console.log("Connected to database!");
});

app.get("/", (req, res) => {
    res.json("Hello, this is the backend");
});

app.post('/createAccount', (req,res) => {
    const { full_name, age, email, password } = req.body;
    bcrypt.hash(password, 10, (err, hash) => { 
        if (err) {
            console.error("Error hashing password:", err);
            return res.status(500).json("Error hashing password");
        }
        const sql = "INSERT INTO `user` (`full_name`, `age`, `email`, `password`) VALUES (?)";
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
    const sql = "SELECT email, password FROM user WHERE email = ?";
    db.query(sql, [email], (err, data) =>{
        if (err){
            console.error("Error executing query:", err);
            return res.status(500).json("Error executing query");
        }
        if (data.length > 0){
            const hashedPassword = data[0].password;
            console.log("Retrieved hashed password:", hashedPassword);
            console.log("Input password:", password);
            bcrypt.compare(password.toString(), hashedPassword, (err, result) => { 
                if (err) {
                    console.error("Error comparing passwords:", err);
                    return res.status(500).json("Error comparing passwords");
                }
                console.log("Comparison result:", result);
                if (result) {
                    return res.json("Success");
                } else {
                    return res.json("Fail");
                }
            });
        } else {
            return res.json("Fail");
        }
    });
});




app.listen(8800, () => {
    console.log("Express server listening on port 8800");
});
