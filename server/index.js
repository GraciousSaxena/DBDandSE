const express = require("express")
const mysql = require("mysql")
const cors = require("cors")

const app = express()

app.use(cors())
app.use(express.json())

const sql_db = mysql.createConnection({
  user: "root",
  host: "localhost",
  password: "password",
  database: "MovieDB",
})

app.post("/customer/register", (req, res) => {
  const firstName = req.body.firstName
  const lastName = req.body.lastName
  const email = req.body.email
  const password = req.body.password
  const contact = req.body.contact

  sql_db.query(
    "INSERT INTO customers (firstName, lastName, contact, email, password) VALUES (?, ?, ?, ?, ?)",
    [firstName, lastName, contact, email, password],
    (err, result) => {
      if (err) {
        if (err.code === "ER_DUP_ENTRY") {
          res.send("Credentials already in use...")
        }
        console.error(err)
      } else {
        console.log(result)
        res.send("Customer registered")
      }
    }
  )
})

app.listen(6969, () => {
  console.log("Server is running ....")
})
