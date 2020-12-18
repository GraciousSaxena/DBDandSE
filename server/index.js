const express = require("express")
const mysql = require("mysql")
const cors = require("cors")
const jwt = require("jsonwebtoken")
const bodyParser = require("body-parser")

const app = express()
// Maybe the password was not correct last time I got this error
const db = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "password", // I also tried leaving it as '', but that didn't work either
  database: "movietheatre",
})

app.use(express.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(cors())

/*

app.post("/api/insert", (req, res) => {
  const movieName = req.body.movieName
  const movieReview = req.body.movieReview

  const sqlInsert =
    "INSERT INTO movie_reviews (movieName, movieReview) VALUES (?,?)"
  db.query(sqlInsert, [movieName, movieReview], (err, result) => {
    console.log("inside query")
    console.log(result)
    console.log(err)
  })
})

*/

app.post("/register", (req, res) => {
  const username = req.body.userID
  const password = req.body.password
  db.query(
    "INSERT into user_data (userID, password) VALUES (?, ?)",
    [username, password],
    (err, result) => {
      console.log(err)
    }
  )
})

app.post("/login", (req, res) => {
  const username = req.body.userID
  const password = req.body.password
  db.query(
    "SELECT * FROM user_data WHERE userID = ? AND password = ?",
    [username, password],
    (err, result) => {
      if (err) {
        console.log("Error")
        res.send({ err: err })
      }
      if (result.length > 0) {
        console.log("Login Successful")
        res.send(result)
        // alert("Login Successful!")
      } else {
        res.send({ message: "Wrong auth tokens entered..." })
      }
    }
  )
})

app.listen(3001, () => {
  console.log("Listening on port 3001!")
})
