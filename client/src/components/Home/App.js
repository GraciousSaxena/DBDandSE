import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import HeaderWithAuth from './Header'
import axios from 'axios'
import { Button, Grid, Table } from 'semantic-ui-react'
import Rating from './Rating'

class App extends Component {
  state = {
    allCurrentMovies: [],
    recommendedMovies: [],
    watchedMovieId: [],
    preferredGenres: [],
    recommendedMovieId: [],
    otherMovies: [],
    userInfo: {},
    fillAllCalled: false,
    fetchedAll: false,
  }

  displayMovies = movies =>
    movies.map(movie => (
      <Table.Row key={movie.id}>
        <Table.Cell>
          <Link to={`/movie/${movie.id}`}>{movie.name}</Link>
        </Table.Cell>
        <Table.Cell>
          <Rating value={movie.ratings} color="teal" />
        </Table.Cell>
      </Table.Row>
    ))

  fillAll = () => {
    this.setState({ fillAllCalled: true })

    axios
      .post('http://localhost:6969/watched-movie-id', {
        email: this.props.currentUser.email,
      })
      .then(res => {
        console.log(res.data)
        res.data.map(m => {
          this.setState({
            watchedMovieId: this.state.watchedMovieId.concat(m.movieId),
          })
        })

        this.state.watchedMovieId.map((mId, i) => {
          axios
            .post('http://localhost:6969/get-genre', {
              movieId: this.state.watchedMovieId[i],
            })
            .then(res => {
              res.data.map(entry => {
                this.setState({
                  preferredGenres: this.state.preferredGenres.concat(
                    entry.genre
                  ),
                })
              })

              this.state.preferredGenres.map((preferredGenre, i) => {
                axios
                  .post('http://localhost:6969/get-movie', {
                    genre: this.state.preferredGenres[i],
                  })
                  .then(res => {
                    res.data.map(entry => {
                      this.setState({
                        recommendedMovieId: this.state.recommendedMovieId.concat(
                          entry.movieId
                        ),
                      })
                    })

                    this.setState({
                      recommendedMovieId: [
                        ...new Set(this.state.recommendedMovieId),
                      ],
                    })

                    axios
                      .post('http://localhost:6969/movies', {
                        isActive: 1,
                      })
                      .then(res => {
                        console.log(res)
                        this.setState({ allCurrentMovies: res.data })

                        this.state.allCurrentMovies.map((movie, i) => {
                          if (
                            this.state.recommendedMovieId.includes(movie.id)
                          ) {
                            this.setState({
                              recommendedMovies: this.state.recommendedMovies.concat(
                                movie
                              ),
                            })
                          } else {
                            this.setState({
                              otherMovies: this.state.otherMovies.concat(movie),
                            })
                          }
                        })
                      })
                  })
              })
            })
        })
      })

    this.handleDuplicates(this.state)

    this.setState({ fetchedAll: true })
  }

  handleDuplicates = ({ recommendedMovies, otherMovies }) => {
    let newRecommended = []
    let newOthers = []

    let distinctRecommended = []
    let distinctOthers = []

    for (let i = 0; i < recommendedMovies.length; i++) {
      if (distinctRecommended[recommendedMovies[i].id]) {
        continue
      }
      distinctRecommended[recommendedMovies[i].id] = true
      newRecommended = newRecommended.concat(recommendedMovies[i])
    }

    for (let i = 0; i < otherMovies.length; i++) {
      if (distinctOthers[otherMovies[i].id]) {
        continue
      }
      distinctOthers[otherMovies[i].id] = true
      newOthers = newOthers.concat(otherMovies[i])
    }

    this.setState({ recommendedMovies: newRecommended, otherMovies: newOthers })
  }

  render() {
    const { currentUser } = this.props

    const {
      allCurrentMovies,
      fillAllCalled,
      fetchedAll,
      recommendedMovies,
      otherMovies,
    } = this.state

    return (
      <>
        <HeaderWithAuth currentUser={currentUser} />
        <Grid textAlign="center" verticalAlign="middle">
          <Grid.Column style={{ maxWidth: 1000 }}>
            <Button
              color="black"
              size="small"
              onClick={this.fillAll}
              disabled={fillAllCalled}
            >
              Get Movies Available
            </Button>
            {console.log(recommendedMovies, otherMovies)}
            {fetchedAll && (
              <Table celled textAlign="center">
                <Table.Header>
                  <Table.Row>
                    <Table.HeaderCell>Movie Name</Table.HeaderCell>
                    <Table.HeaderCell>Rating</Table.HeaderCell>
                  </Table.Row>
                </Table.Header>
                <Table.Body>
                  {recommendedMovies.length > 0 ? (
                    this.displayMovies(recommendedMovies)
                  ) : (
                    <></>
                  )}
                  {otherMovies.length > 0 ? (
                    this.displayMovies(otherMovies)
                  ) : (
                    <></>
                  )}
                </Table.Body>
              </Table>
            )}
          </Grid.Column>
        </Grid>
      </>
    )
  }
}

const mapStateToProps = state => ({
  currentUser: state.user.currentUser,
})

export default connect(mapStateToProps)(App)
