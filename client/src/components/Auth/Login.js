import React, { Component } from "react"
import {
  Grid,
  Header,
  Icon,
  Form,
  Segment,
  Button,
  Message,
} from "semantic-ui-react"
import { Link } from "react-router-dom"
import "../../styles/App.css"
import axios from "axios"
import firebase from "../../firebase"

class Login extends Component {
  state = { email: "", password: "", loading: false, errors: [] }

  handleChange = e => {
    this.setState({ [e.target.name]: e.target.value })
  }

  isFormEmpty = ({ email, password }) => {
    return !email.length || !password.length
  }

  isFormValid = () => {
    let errors = []
    let error

    if (this.isFormEmpty(this.state)) {
      error = { message: "Please fill out all fields!!!" }
      this.setState({ errors: errors.concat(error) })
      return false
    } else {
      return true
    }
  }

  handleSubmit = e => {
    e.preventDefault()

    if (this.isFormValid()) {
      this.setState({ errors: [], loading: true })
      axios
        .post("http://localhost:6969/customer/login", {
          email: this.state.email,
          password: this.state.password,
        })
        .then(res => {
          console.log(res)
          if (res.data === "Successfully logged in...") {
            console.log(res.data)
            firebase
              .auth()
              .signInWithEmailAndPassword(this.state.email, this.state.password)
              .then(signedInUser => {
                console.log(signedInUser)
              })
              .catch(err => {
                console.error(err)
              })
          } else {
            this.setState({
              errors: this.state.errors.concat({ message: res.data }),
              loading: false,
            })
          }
        })
        .catch(err => {
          this.setState({
            errors: this.state.errors.concat(err),
            loading: false,
          })
        })
    }
  }

  displayErrors = errors =>
    errors.map((error, i) => <p key={i}>{error.message}</p>)

  render() {
    const { email, password, loading, errors } = this.state

    return (
      <Grid textAlign="center" verticalAlign="middle" className="app">
        <Grid.Column style={{ maxWidth: 450 }} textAlign="left">
          <Header as="h2" icon color="black" textAlign="center">
            <Icon name="ticket" color="black" />
            Login to ShowTym
          </Header>
          <Form size="large" onSubmit={this.handleSubmit}>
            <Segment stacked>
              <Form.Input
                fluid
                name="email"
                value={email}
                onChange={this.handleChange}
                placeholder="Enter your registered email"
                label="Enter your E-mail"
                icon="mail"
                iconPosition="left"
                type="email"
              />
              <Form.Input
                fluid
                name="password"
                value={password}
                onChange={this.handleChange}
                placeholder="Enter your password"
                label="Enter your password"
                icon="lock"
                iconPosition="left"
                type="password"
              />
              <Button
                fluid
                color="black"
                size="large"
                className={loading ? "loading" : ""}
              >
                Sign In
              </Button>
            </Segment>
          </Form>
          {errors.length > 0 && (
            <Message error>Error: {this.displayErrors(errors)}</Message>
          )}
          <Message style={{ textAlign: "center" }}>
            New user? Create an account for free <Link to="/signup">here</Link>
          </Message>
        </Grid.Column>
      </Grid>
    )
  }
}

export default Login
