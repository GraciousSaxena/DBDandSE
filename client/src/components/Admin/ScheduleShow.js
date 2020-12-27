import React, { Component } from 'react'
import axios from 'axios'
import HeaderWithAuth from './Header'
import { Button, Form, Grid, Message, Segment, Table } from 'semantic-ui-react'

export default class ScheduleShow extends Component {
  state = {
    currentMovies: [],
    id: 0,
    idList: [],
    day: 0,
    month: 0,
    year: 0,
    ticketCount: 0,
    ticketPrice: 0,
    errors: [],
    loading: false,
  }

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
          this.state.currentMovies.map(movie => {
            this.setState({ idList: this.state.idList.concat(movie.id) })
          })
        }
      })
      .catch(err => console.error(err))
  }

  displayErrors = errors =>
    errors.map((error, i) => <p key={i}>{error.message}</p>)

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

  handleChange = e => {
    this.setState({ [e.target.name]: parseInt(e.target.value, 10) })
  }

  isFormEmpty = ({ id, day, month, year, ticketPrice, ticketCount }) => {
    return (
      id === 0 ||
      day === 0 ||
      month === 0 ||
      year === 0 ||
      ticketPrice === 0 ||
      ticketCount === 0
    )
  }

  isIdValid = ({ id, idList }) => {
    return idList.includes(id)
  }

  isValidDate = ({ day, month, year }) => {
    if (year < 2020) {
      return false
    }
    if (month < 1 || month > 12) {
      return false
    }

    const days = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31]

    if ((year % 4 === 0 && year % 100 !== 0) || year % 400 === 0) {
      days[1] = 29
    }

    if (day < 1 || day > days[month - 1]) {
      return false
    }

    return true
  }

  isFormValid = () => {
    let error
    let errors = []

    if (this.isFormEmpty(this.state)) {
      error = { message: 'Please fill out all fields!!!' }
      this.setState({ errors: errors.concat(error) })
      return false
    } else if (!this.isIdValid(this.state)) {
      error = { message: 'Invalid movie Id....' }
      this.setState({ errors: errors.concat(error) })
      return false
    } else if (!this.isValidDate(this.state)) {
      error = { message: 'Wrong date entered!!!' }
      this.setState({ errors: errors.concat(error) })
    } else {
      return true
    }
  }

  handleSubmit = e => {
    e.preventDefault()
    console.log(this.state)

    if (this.isFormValid()) {
      this.setState({ errors: [], loading: true })
      axios
        .post('http://localhost:6969/movies/create-show', {
          movieId: this.state.id,
          day: this.state.day,
          month: this.state.month,
          year: this.state.year,
          ticketCount: this.state.ticketCount,
          ticketPrice: this.state.ticketPrice,
        })
        .then(res => {
          if (res.data === 'Could not create show') {
            this.setState({
              errors: this.state.errors.concat({ message: res.data }),
              loading: false,
            })
          } else {
            axios
              .put('http://localhost:6969/movies/create-show', {
                movieId: this.state.id,
              })
              .then(res => {
                console.log(res)
                this.setState({ errors: [], loading: false })
              })
          }
        })
    }
  }

  render() {
    const {
      currentMovies,
      id,
      day,
      month,
      year,
      ticketPrice,
      ticketCount,
      errors,
      loading,
    } = this.state

    return (
      <>
        <HeaderWithAuth />
        <Table celled textAlign="center">
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell>Movie ID</Table.HeaderCell>
              <Table.HeaderCell>Movie Name</Table.HeaderCell>
              <Table.HeaderCell>Shows Screened</Table.HeaderCell>
              <Table.HeaderCell>Running Costs</Table.HeaderCell>
              <Table.HeaderCell>Revenue Generated</Table.HeaderCell>
            </Table.Row>
          </Table.Header>

          {currentMovies.length && (
            <Table.Body>{this.displayMovies(currentMovies)}</Table.Body>
          )}
        </Table>
        <Grid textAlign="center" verticalAlign="middle">
          <Grid.Column style={{ maxWidth: 500 }}>
            <Form size="large" onSubmit={this.handleSubmit}>
              <Segment stacked>
                <Form.Input
                  fluid
                  type="number"
                  name="id"
                  value={id}
                  label="Enter the movie Id"
                  placeholder="Movie Id"
                  onChange={this.handleChange}
                />

                <Form.Field label="Date of Show" />

                <Form.Group widths="equal">
                  <Form.Input
                    fluid
                    type="number"
                    name="day"
                    value={day}
                    placeholder="Day"
                    onChange={this.handleChange}
                  />

                  <Form.Input
                    fluid
                    type="number"
                    name="month"
                    value={month}
                    placeholder="Month"
                    onChange={this.handleChange}
                  />

                  <Form.Input
                    fluid
                    type="number"
                    name="year"
                    value={year}
                    placeholder="Year"
                    onChange={this.handleChange}
                  />
                </Form.Group>

                <Form.Group widths="equal">
                  <Form.Input
                    fluid
                    type="number"
                    name="ticketPrice"
                    value={ticketPrice}
                    label="Enter the ticket Price"
                    placeholder="Ticket Price"
                    onChange={this.handleChange}
                  />

                  <Form.Input
                    fluid
                    type="number"
                    name="ticketCount"
                    value={ticketCount}
                    label="Enter the ticket Count"
                    placeholder="Ticket Count"
                    onChange={this.handleChange}
                  />
                </Form.Group>

                <Button
                  size="large"
                  fluid
                  color="black"
                  className={loading ? 'loading' : ''}
                >
                  Create Show
                </Button>
              </Segment>
            </Form>
            {errors.length > 0 && (
              <Message error>{this.displayErrors(errors)}</Message>
            )}
          </Grid.Column>
        </Grid>
      </>
    )
  }
}
