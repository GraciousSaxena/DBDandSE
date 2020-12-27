import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import HeaderWithAuth from './Header'
import axios from 'axios'
import { Table } from 'semantic-ui-react'

class App extends Component {
  state = {
    allCurrentMovies: [],
    recommendedMovies: [],
    otherMovies: [],
    userInfo: {},
  }

  componentDidMount() {
    axios
      .get('http://localhost:6969/movies')
      .then(res => {
        this.setState({ allCurrentMovies: res.data })
      })
      .catch(err => console.error(err))
  }

  displayMovies = allCurrentMovies =>
    allCurrentMovies.map(movie => (
      <Table.Row key={movie.id}>
        <Table.Cell>{movie.id}</Table.Cell>
        <Table.Cell>
          <Link to={`/movie/${movie.id}`}>{movie.name}</Link>
        </Table.Cell>
        <Table.Cell>{movie.daysScreened}</Table.Cell>
        <Table.Cell>{movie.spent}</Table.Cell>
        <Table.Cell>{movie.earned}</Table.Cell>
        <Table.Cell>{movie.isActive ? 'Yes' : 'No'}</Table.Cell>
      </Table.Row>
    ))

  render() {
    const { currentUser } = this.props

    const { allCurrentMovies } = this.state

    return (
      <>
        <HeaderWithAuth currentUser={currentUser} />

        <Table celled textAlign="center">
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell>Movie ID</Table.HeaderCell>
              <Table.HeaderCell>Movie Name</Table.HeaderCell>
              <Table.HeaderCell>Days Screened</Table.HeaderCell>
              <Table.HeaderCell>Running Costs</Table.HeaderCell>
              <Table.HeaderCell>Revenue Generated</Table.HeaderCell>
              <Table.HeaderCell>Screening Status</Table.HeaderCell>
            </Table.Row>
          </Table.Header>

          {allCurrentMovies.length && (
            <Table.Body>{this.displayMovies(allCurrentMovies)}</Table.Body>
          )}
        </Table>
      </>
    )
  }
}

const mapStateToProps = state => ({
  currentUser: state.user.currentUser,
})

export default connect(mapStateToProps)(App)
