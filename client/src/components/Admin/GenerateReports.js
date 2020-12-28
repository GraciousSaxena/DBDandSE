import axios from 'axios'
import React, { Component } from 'react'
import { Button, Form, Grid, Message, Segment, Table } from 'semantic-ui-react'

export default class EditMovie extends Component {
  state = {
    allMovies: [],
    id: 0,
    name: '',
    description: '',
    errors: [],
    loading: false,
    isActiveText: '',
  }

  componentDidMount() {
    axios
      .get('http://localhost:6969/movies')
      .then(res => {
        this.setState({ allMovies: res.data })
      })
      .catch(err => console.error(err))
  }

  handleChange = e => {
    this.setState({ [e.target.name]: [e.target.value] })
  }

  isFormEmpty = ({ id, name }) => {
    return id === 0 || !name.length
  }

  isFormValid = () => {
    if (this.isFormEmpty(this.state)) {
      this.setState({
        errors: this.state.errors.concat({
          message: 'Please fill out all fields',
        }),
      })
      return false
    }
    return true
  }

  displayMovies = allMovies =>
    allMovies.map(movie => (
      <Table.Row key={movie.id}>
        <Table.Cell>{movie.id}</Table.Cell>
        <Table.Cell>{movie.name}</Table.Cell>
        <Table.Cell>{movie.daysScreened}</Table.Cell>
        <Table.Cell>{movie.spent}</Table.Cell>
        <Table.Cell>{movie.earned}</Table.Cell>
        <Table.Cell>{movie.predicted}</Table.Cell>
        <Table.Cell>{movie.isActive ? 'Yes' : 'No'}</Table.Cell>
      </Table.Row>
    ))

  displayErrors = errors =>
    errors.map((error, i) => <p key={i}>{error.message}</p>)

  render() {
    const { allMovies } = this.state

    return (
      <>
        <Table celled textAlign="center">
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell>Movie ID</Table.HeaderCell>
              <Table.HeaderCell>Movie Name</Table.HeaderCell>
              <Table.HeaderCell>Shows Screened</Table.HeaderCell>
              <Table.HeaderCell>Running Costs</Table.HeaderCell>
              <Table.HeaderCell>Revenue Generated</Table.HeaderCell>
              <Table.HeaderCell>Revenue Predicted</Table.HeaderCell>
              <Table.HeaderCell>Screening Status</Table.HeaderCell>
            </Table.Row>
          </Table.Header>

          {allMovies.length && (
            <Table.Body>{this.displayMovies(allMovies)}</Table.Body>
          )}
        </Table>
      </>
    )
  }
}
