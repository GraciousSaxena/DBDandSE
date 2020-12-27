import axios from 'axios'
import React, { Component } from 'react'
import {
  Button,
  Dropdown,
  Form,
  Grid,
  Header,
  Message,
  Segment,
} from 'semantic-ui-react'
import HeaderWithAuth from './Header'

const options = [
  {
    key: 'horror',
    text: 'Horror',
    value: 'horror',
  },
  {
    key: 'comedy',
    text: 'Comedy',
    value: 'comedy',
  },
  {
    key: 'scifi',
    text: 'Sci-Fi',
    value: 'scifi',
  },
  {
    key: 'romance',
    text: 'Romance',
    value: 'romance',
  },
  {
    key: 'mytho',
    text: 'Mythology',
    value: 'mytho',
  },
  {
    key: 'thrill',
    text: 'Thriller',
    value: 'thriller',
  },
  {
    key: 'mystery',
    text: 'Mystery',
    value: 'mystery',
  },
]

export default class AddMovie extends Component {
  state = {
    name: '',
    description: '',
    spent: 0,
    value: [],
    loading: false,
    errors: [],
  }

  handleChange = e => {
    this.setState({ [e.target.name]: [e.target.value] })
  }

  handleGenreChange = (e, { value }) => {
    this.setState({ value })
    console.log(this.state.value)
  }

  isFormEmpty = ({ name, description, value }) => {
    return !name.length || !description.length || !value.length
  }

  isFormValid = () => {
    if (this.isFormEmpty(this.state)) {
      this.setState({
        errors: this.state.errors.concat({
          message: 'Please fill out all fields...',
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
        .post('http://localhost:6969/movies/add', {
          name: this.state.name,
          description: this.state.description,
          spent: this.state.spent,
        })
        .then(res => {
          if (res.data === 'Error') {
            this.setState({
              errors: this.state.errors.concat({ message: res.data }),
              loading: false,
            })
          } else {
            const movieId = res.data.insertId
            axios
              .post('http://localhost:6969/movies/add-genre', {
                movieId: movieId,
                genres: this.state.value,
              })
              .then(res => {
                this.setState({ loading: false })
              })
          }
        })
    }
  }

  displayErrors = errors =>
    errors.map((error, i) => <p key={i}>{error.message}</p>)

  render() {
    const { name, description, spent, loading, errors, value } = this.state
    return (
      <>
        <HeaderWithAuth />
        <Grid textAlign="center" verticalAlign="middle">
          <Grid.Column style={{ maxWidth: 500 }}>
            <Form size="large" onSubmit={this.handleSubmit}>
              <Header as="h2">Add a new Movie</Header>
              <Segment stacked>
                <Form.Input
                  fluid
                  name="name"
                  label="Movie Name"
                  value={name}
                  type="text"
                  onChange={this.handleChange}
                />

                <Form.Input
                  fluid
                  label="Movie Description"
                  name="description"
                  value={description}
                  type="text"
                  onChange={this.handleChange}
                />

                <Form.Input
                  fluid
                  name="spent"
                  label="Amount spent by the theatre"
                  value={spent}
                  type="number"
                  onChange={this.handleChange}
                />

                <Form.Field label="Select the genres" />

                <Dropdown
                  fluid
                  selection
                  multiple
                  options={options}
                  value={value}
                  placeholder="Add Genres"
                  onChange={this.handleGenreChange}
                  disabled={loading}
                  loading={loading}
                  style={{ marginBottom: 20 }}
                />

                <Button
                  fluid
                  color="black"
                  size="large"
                  className={loading ? 'loading' : ''}
                >
                  Add Movie
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
