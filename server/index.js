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
        if (isActive === 0) {
          sql_db.query(
            'UPDATE movies SET predicted = earned WHERE id = (?)',
            [movieId],
            (err, result) => {
              if (err) {
                console.error(err)
              } else {
                res.send(result)
              }
            }
          )
        } else {
          res.send(result)
        }
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

app.get('/movie/:id', (req, res) => {
  const movieId = req.params.id

  sql_db.query(
    'SELECT * FROM movies WHERE id = (?)',
    [movieId],
    (err, result) => {
      res.send(result)
      console.log(result)
    }
  )
})

app.get('/movie/shows/:id', (req, res) => {
  const movieId = req.params.id

  sql_db.query(
    'SELECT * FROM shows WHERE movieId = (?)',
    [movieId],
    (err, result) => {
      if (result.length > 0) {
        res.send(result)
        console.log(result)
      } else {
        res.send('No shows currently')
      }
    }
  )
})

app.put('/movies/book', (req, res) => {
  console.log(req.body)
  const movieId = req.body.movieId
  const profit = req.body.profit
  const projProfit = req.body.projProfit

  sql_db.query(
    'UPDATE movies SET earned=earned+(?), predicted=predicted+(?) WHERE id=(?)',
    [profit, projProfit, movieId],
    (err, result) => {
      if (err) {
        console.error(err)
      } else {
        res.send(result)
      }
    }
  )
})

app.put('/show/book', (req, res) => {
  const showId = req.body.showId
  const ticketSold = req.body.ticketSold

  sql_db.query(
    'UPDATE shows SET ticketCount=ticketCount-(?) WHERE id=(?)',
    [ticketSold, showId],
    (err, result) => {
      if (err) {
        console.error(err)
      } else {
        res.send(result)
      }
    }
  )
})

app.get('/show/:id', (req, res) => {
  const showId = req.params.id

  sql_db.query('SELECT * FROM shows WHERE id=(?)', [showId], (err, result) => {
    res.send(result)
  })
})

app.post('/watched', (req, res) => {
  const movieId = req.body.movieId
  const email = req.body.email
  const empId = req.body.empId

  sql_db.query(
    'INSERT INTO watched (movieId, email, empId) VALUES (?, ?, ?)',
    [movieId, email, empId],
    (err, result) => {
      if (err) {
        console.error(err)
      } else {
        console.log(result)
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

app.get('/employees', (req, res) => {
  sql_db.query('SELECT * from employees', (err, result) => {
    res.send(result)
  })
})

app.post('/genre', (req, res) => {
  const movieId = req.body.movieId
  const genre = req.body.genre

  sql_db.query(
    'INSERT INTO genres (movieId, genre) VALUES (?, ?)',
    [movieId, genre],
    (err, result) => {
      if (err) {
        console.error(err)
      } else {
        console.log(result)
        res.send(result)
      }
    }
  )
})

app.post('/get-genre', (req, res) => {
  const movieId = req.body.movieId

  sql_db.query(
    'SELECT DISTINCT(genre) FROM genres WHERE movieId = (?)',
    [movieId],
    (err, result) => {
      if (err) {
        console.error(err)
      } else {
        console.log(result)
        res.send(result)
      }
    }
  )
})

app.post('/get-movie', (req, res) => {
  const genre = req.body.genre

  sql_db.query(
    'SELECT movieId FROM genres WHERE genre=(?)',
    [genre],
    (err, result) => {
      if (err) {
        console.error(err)
      } else {
        console.log(result)
        res.send(result)
      }
    }
  )
})

app.post('/watched-movie-id', (req, res) => {
  const email = req.body.email

  sql_db.query(
    'SELECT DISTINCT(movieId) FROM watched WHERE email=(?)',
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

app.get('/reviews/:id', (req, res) => {
  const movieId = req.params.id

  sql_db.query(
    'SELECT * FROM reviews WHERE movieId = (?)',
    [movieId],
    (err, result) => {
      if (err) {
        console.error(err)
      } else {
        res.send(result)
      }
    }
  )
})

app.post('/check', (req, res) => {
  const movieId = req.body.movieId
  const email = req.body.email

  sql_db.query(
    'SELECT * FROM reviews WHERE movieId = (?) AND email = (?)',
    [movieId, email],
    (err, result) => {
      if (err) {
        console.error(err)
      } else if (result.length > 0) {
        res.send('Already reviewed')
      } else {
        sql_db.query(
          'SELECT * FROM watched WHERE movieId = (?) AND email = (?)',
          [movieId, email],
          (err, result) => {
            if (err) {
              console.error(err)
            } else if (result.length > 0) {
              res.send('Allowed')
            } else {
              res.send('Watch movie first')
            }
          }
        )
      }
    }
  )
})

app.post('/reviews/add', (req, res) => {
  const movieId = req.body.movieId
  const email = req.body.email
  const rating = req.body.rating
  const review = req.body.review
  const effecRating = req.body.effecRating

  sql_db.query(
    'INSERT INTO reviews (movieId, email, review, rating) VALUES (?, ?, ?, ?)',
    [movieId, email, review, rating],
    (err, result) => {
      if (err) {
        console.error(err)
      } else {
        sql_db.query(
          'UPDATE movies SET ratings = (ratings * numReviews + (?)) / (numReviews + 1), numReviews = numReviews + 1 WHERE id = (?)',
          [effecRating, movieId],
          (err, result) => {
            if (err) {
              console.error(err)
            } else {
              res.send(result)
            }
          }
        )
      }
    }
  )
})

app.listen(6969, () => {
  console.log('Server is running ....')
})
