import React, { Component } from 'react'
import { Table } from 'semantic-ui-react'
import HeaderWithAuth from './Header'
import axios from 'axios'

class CurrentMovies extends Component {
  state = { currentMovies: [] }

  componentDidMount() {
    axios
      .post('http://localhost:6969/movies', {
        isActive: 1,
      })
      .then(res => {
        if (res.data === 'Could not fetch data') {
          console.error(res.data)
        } else {
          this.setState({ currentMovies: res.data })
        }
      })
      .catch(err => console.error(err))
    this.setState({ didMount: true })
  }

  displayMovies = currentMovies =>
    currentMovies.map(movie => (
      <Table.Row key={movie.id}>
        <Table.Cell>{movie.id}</Table.Cell>
        <Table.Cell>{movie.name}</Table.Cell>
        <Table.Cell>{movie.daysScreened}</Table.Cell>
        <Table.Cell>{movie.spent}</Table.Cell>
        <Table.Cell>{movie.earned}</Table.Cell>
      </Table.Row>
    ))

  render() {
    const { currentMovies } = this.state

    return (
      <>
        <HeaderWithAuth />
        <Table celled textAlign="center">
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell>Movie ID</Table.HeaderCell>
              <Table.HeaderCell>Movie Name</Table.HeaderCell>
              <Table.HeaderCell>Days Screened</Table.HeaderCell>
              <Table.HeaderCell>Running Costs</Table.HeaderCell>
              <Table.HeaderCell>Revenue Generated</Table.HeaderCell>
            </Table.Row>
          </Table.Header>

          {currentMovies.length && (
            <Table.Body>{this.displayMovies(currentMovies)}</Table.Body>
          )}
        </Table>
      </>
    )
  }
}

export default CurrentMovies
