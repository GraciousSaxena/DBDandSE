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

  handleSubmit = e => {
    e.preventDefault()

    if (this.isFormValid()) {
      this.setState({ errors: [], loading: true })
      axios
        .put('http://localhost:6969/movies', {
          id: this.state.id,
          name: this.state.name,
          description: this.state.description,
          isActive:
            this.state.isActiveText.toString().toLowerCase() === 'yes' ? 1 : 0,
        })
        .then(res => {
          if (res.data.message === 'Error') {
            this.setState({
              errors: this.state.errors.concat(res.data),
              loading: false,
            })
          } else {
            this.setState({
              loading: false,
            })
          }
        })
    }
  }

  displayMovies = allMovies =>
    allMovies.map(movie => (
      <Table.Row key={movie.id}>
        <Table.Cell>{movie.id}</Table.Cell>
        <Table.Cell>{movie.name}</Table.Cell>
        <Table.Cell>{movie.daysScreened}</Table.Cell>
        <Table.Cell>{movie.spent}</Table.Cell>
        <Table.Cell>{movie.earned}</Table.Cell>
        <Table.Cell>{movie.isActive ? 'Yes' : 'No'}</Table.Cell>
      </Table.Row>
    ))

  displayErrors = errors =>
    errors.map((error, i) => <p key={i}>{error.message}</p>)

  render() {
    const {
      allMovies,
      id,
      name,
      description,
      isActiveText,
      errors,
      loading,
    } = this.state

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
              <Table.HeaderCell>Screening Status</Table.HeaderCell>
            </Table.Row>
          </Table.Header>

          {allMovies.length && (
            <Table.Body>{this.displayMovies(allMovies)}</Table.Body>
          )}
        </Table>

        <Grid textAlign="center" verticalAlign="middle">
          <Grid.Column style={{ maxWidth: 500 }}>
            <Form size="large" onSubmit={this.handleSubmit}>
              <Segment stacked>
                <Form.Input
                  name="id"
                  value={id}
                  type="number"
                  onChange={this.handleChange}
                  label="Enter movie id"
                />

                <Form.Input
                  name="name"
                  value={name}
                  type="text"
                  onChange={this.handleChange}
                  label="Enter the updated movie name"
                />

                <Form.Input
                  name="description"
                  value={description}
                  type="text"
                  onChange={this.handleChange}
                  label="Enter description"
                />

                <Form.Input
                  name="isActiveText"
                  type="text"
                  value={isActiveText}
                  onChange={this.handleChange}
                  label="Is Screening?"
                />

                <Button
                  fluid
                  color="black"
                  size="large"
                  className={loading ? 'loading' : ''}
                >
                  Update
                </Button>
              </Segment>
            </Form>
            {errors.length > 0 && (
              <Message error>Error: {this.displayErrors(errors)}</Message>
            )}
          </Grid.Column>
        </Grid>
      </>
    )
  }
}
