const mongoose = require('mongoose')

const genreSchema = mongoose.Schema({
  movieId: {
    type: Number,
    required: true,
  },
  genres: [],
})

const Genre = mongoose.model('Genre', genreSchema)

module.exports = Genre
