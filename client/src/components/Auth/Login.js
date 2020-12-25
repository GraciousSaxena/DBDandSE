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

class Login extends Component {
  state = { email: "", password: "", loading: false, errors: [] }

  handleChange = e => {
    this.setState({ [e.target.name]: e.target.value })
  }

  handleSubmit = e => {
    e.preventDefault()
  }

  displayErrors = errors =>
    errors.map((error, i) => <p key={i}>{error.message}</p>)

  render() {
    const { email, password, loading, errors } = this.state

    return (
      <Grid textAlign="center" verticalAlign="middle" className="app">
        <Grid.Column style={{ maxWidth: 450 }} textAlign="left">
          <Header as="h2" icon color="orange" textAlign="center">
            <Icon name="ticket" color="orange" />
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
                color="orange"
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
