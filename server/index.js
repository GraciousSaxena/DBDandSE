const express = require('express')
const mysql = require('mysql')
const cors = require('cors')
const mongoose = require('mongoose')
const url =
  'mongodb+srv://admin:mrmitb6969@justbuy.1pqtn.mongodb.net/showtime?retryWrites=true&w=majority'
const Genre = require('./models/genreSchema')

const app = express()

app.use(cors())
app.use(express.json())

const nosql_db = mongoose
  .connect(url, {
    useUnifiedTopology: true,
    useNewUrlParser: true,
    useCreateIndex: true,
  })
  .then(() => {
    console.log('Mongo Connected')
  })

const sql_db = mysql.createConnection({
  user: 'root',
  host: 'localhost',
  password: 'password',
  database: 'MovieDB',
})

app.post('/customer/register', (req, res) => {
  const firstName = req.body.firstName
  const lastName = req.body.lastName
  const email = req.body.email
  const password = req.body.password
  const contact = req.body.contact

  sql_db.query(
    'INSERT INTO customers (firstName, lastName, contact, email, password) VALUES (?, ?, ?, ?, ?)',
    [firstName, lastName, contact, email, password],
    (err, result) => {
      if (err) {
        if (err.code === 'ER_DUP_ENTRY') {
          res.send('Credentials already in use...')
        }
        console.error(err)
      } else {
        console.log(result)
        res.send('Customer registered')
      }
    }
  )
})

app.post('/customer/login', (req, res) => {
  const email = req.body.email
  const password = req.body.password

  sql_db.query(
    'SELECT * FROM customers WHERE email = (?) AND password = (?)',
    [email, password],
    (err, result) => {
      if (err) {
        console.error(err)
      } else if (result.length > 0) {
        res.send('Successfully logged in...')
      } else {
        res.send('Invalid login credentials...')
      }
    }
  )
})

app.post('/customer/details', (req, res) => {
  const email = req.body.email

  sql_db.query(
    'SELECT * FROM customers WHERE email = (?)',
    [email],
    (err, result) => {
      if (err) {
        console.error(err)
      } else {
        res.send(result)
      }
    }
  )
})

app.put('/customer/details', (req, res) => {
  const firstName = req.body.firstName
  const lastName = req.body.lastName
  const email = req.body.email
  const contact = req.body.contact

  sql_db.query(
    'UPDATE customers SET firstName = (?), lastName = (?), contact = (?) WHERE email = (?)',
    [firstName, lastName, contact, email],
    (err, result) => {
      if (err) {
        res.send('Conflict while updating')
      } else {
        res.send('Successfully updated')
      }
    }
  )
})

app.post('/movies', (req, res) => {
  const isActive = req.body.isActive

  sql_db.query(
    'SELECT * FROM movies WHERE isActive = (?)',
    [isActive],
    (err, result) => {
      if (err) {
        res.send('Could not fetch data')
      }
      console.log(result)
      res.send(result)
    }
  )
})

app.get('/movies', (req, res) => {
  sql_db.query('SELECT * FROM movies', (err, result) => {
    if (err) {
      console.error(err)
    } else {
      res.send(result)
    }
  })
})

app.put('/movies', (req, res) => {
  const movieId = req.body.id
  const name = req.body.name
  const description = req.body.description
  const isActive = req.body.isActive
  sql_db.query(
    'UPDATE movies SET name = (?), description = (?), isActive = (?) WHERE id = (?)',
    [name, description, isActive, movieId],
    (err, result) => {
      if (err) {
        res.send({ message: 'Error' })
      } else {
        res.send(result)
      }
    }
  )
})

app.post('/movies/add', (req, res) => {
  const name = req.body.name
  const description = req.body.description
  const spent = req.body.spent

  sql_db.query(
    'INSERT INTO movies (name, description, spent) VALUES (?, ?, ?)',
    [name, description, spent],
    (err, result) => {
      if (err) {
        res.send('Error')
      } else {
        res.send(result)
      }
    }
  )
})

app.post('/movies/add-genre', (req, res) => {
  const movieId = req.body.movieId
  const genres = req.body.genres

  const moviedata = {
    movieId: movieId,
    genres: genres,
  }
  new Genre(moviedata).save().then(() => res.send('Successfully added'))
})

app.post('/movies/create-show', (req, res) => {
  const movieId = req.body.movieId
  const day = req.body.day
  const month = req.body.month
  const year = req.body.year
  const ticketCount = req.body.ticketCount
  const ticketPrice = req.body.ticketPrice

  sql_db.query(
    'INSERT INTO shows (movieId, day, month, year, ticketCount, ticketPrice) VALUES (?, ?, ?, ?, ?, ?)',
    [movieId, day, month, year, ticketCount, ticketPrice],
    (err, result) => {
      if (err) {
        res.send('Could not create show')
      } else {
        res.send(result)
      }
    }
  )
})

app.put('/movies/create-show', (req, res) => {
  const movieId = req.body.movieId

  sql_db.query(
    'UPDATE movies SET daysScreened = daysScreened + 1 WHERE id = (?)',
    [movieId],
    (err, result) => {
      if (err) {
        res.send('Failed update')
      } else {
        res.send(result)
      }
    }
  )
})

app.post('/employees', (req, res) => {
  const name = req.body.name
  const email = req.body.email
  sql_db.query(
    'INSERT INTO employees (name, email) VALUES (?, ?)',
    [name, email],
    (err, result) => {
      if (err) {
        if (err.code === 'ER_DUP_ENTRY') {
          res.send('Credentials already in use...')
        }
        console.error(err)
      } else {
        console.log(result)
        res.send('Employee registered')
      }
    }
  )
})

app.listen(6969, () => {
  console.log('Server is running ....')
})
