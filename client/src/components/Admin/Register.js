import React, { Component } from 'react'
import HeaderWithAuth from './Header'
import axios from 'axios'
import {
  Button,
  Form,
  Grid,
  Header,
  Icon,
  Message,
  Segment,
} from 'semantic-ui-react'

class Register extends Component {
  state = { name: '', email: '', loading: false, errors: [] }

  handleChange = e => {
    this.setState({ [e.target.name]: e.target.value })
  }

  displayErrors = errors =>
    errors.map((error, i) => <p key={i}>{error.message}</p>)

  isFormEmpty = ({ name, email }) => {
    return !name.length || !email.length
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
      this.setState({ loading: true, errors: [] })
      axios
        .post('http://localhost:6969/employees', {
          name: this.state.name,
          email: this.state.email,
        })
        .then(res => {
          if (res.data === 'Credentials already in use...') {
            this.setState({
              errors: this.state.errors.concat({ message: res.data }),
              loading: false,
            })
          } else {
            console.log('Employee successfully registered...')
            this.setState({ loading: false })
          }
        })
    }
  }

  render() {
    const { name, email, loading, errors } = this.state

    return (
      <div>
        <HeaderWithAuth />
        <Grid textAlign="center" verticalAlign="middle" className="app">
          <Grid.Column style={{ maxWidth: 450 }} textAlign="left">
            <Header as="h2" icon color="black" textAlign="center">
              <Icon name="ticket" color="black" />
              Add Employee
            </Header>
            <Form size="large" onSubmit={this.handleSubmit}>
              <Segment stacked>
                <Form.Input
                  fluid
                  name="name"
                  value={name}
                  onChange={this.handleChange}
                  placeholder="Enter employee name"
                  label="Enter your name"
                  icon="user"
                  iconPosition="left"
                  type="text"
                />
                <Form.Input
                  fluid
                  name="email"
                  value={email}
                  onChange={this.handleChange}
                  placeholder="Enter the email"
                  label="Enter the email"
                  icon="mail"
                  iconPosition="left"
                  type="email"
                />
                <Button
                  fluid
                  color="black"
                  size="large"
                  className={loading ? 'loading' : ''}
                >
                  Register
                </Button>
              </Segment>
            </Form>
            {errors.length > 0 && (
              <Message error>Error: {this.displayErrors(errors)}</Message>
            )}
          </Grid.Column>
        </Grid>
      </div>
    )
  }
}

export default Register
