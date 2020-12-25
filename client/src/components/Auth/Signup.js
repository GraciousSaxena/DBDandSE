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

class Signup extends Component {
  state = {
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    contact: "",
    day: "",
    month: "",
    year: "",
    loading: false,
    errors: [],
  }

  handleChange = e => {
    this.setState({ [e.target.name]: e.target.value })
  }

  handleSubmit = e => {
    e.preventDefault()
  }

  displayErrors = errors =>
    errors.map((error, i) => <p key={i}>{error.message}</p>)

  render() {
    const {
      firstName,
      lastName,
      email,
      password,
      confirmPassword,
      contact,
      day,
      month,
      year,
      loading,
      errors,
    } = this.state

    return (
      <Grid textAlign="center" verticalAlign="middle" className="app">
        <Grid.Column style={{ maxWidth: 600 }} textAlign="left">
          <Header as="h2" icon color="orange" textAlign="center">
            <Icon name="ticket" color="orange" />
            Register for ShowTym
          </Header>
          <Form size="large" onSubmit={this.handleSubmit}>
            <Segment stacked>
              <Form.Group widths="equal">
                <Form.Input
                  fluid
                  name="firstName"
                  placeholder="Enter your First name"
                  label="Enter your first name"
                  value={firstName}
                  onChange={this.handleChange}
                  icon="user"
                  type="text"
                  iconPosition="left"
                />
                <Form.Input
                  fluid
                  name="lastName"
                  value={lastName}
                  onChange={this.handleChange}
                  placeholder="Enter your Last name"
                  label="Enter your last name"
                  type="text"
                />
              </Form.Group>
              <Form.Input
                fluid
                name="email"
                value={email}
                onChange={this.handleChange}
                placeholder="Enter your email"
                label="Enter your E-mail"
                icon="mail"
                iconPosition="left"
                type="email"
              />
              <Form.Input
                fluid
                name="contact"
                placeholder="Enter your mobile number"
                value={contact}
                onChange={this.handleChange}
                label="Enter your contact number"
                icon="mobile"
                iconPosition="left"
                type="text"
              />
              <Form.Field label="Date of Birth" />
              <Form.Group widths="equal">
                <Form.Input
                  fluid
                  name="day"
                  value={day}
                  onChange={this.handleChange}
                  placeholder="Enter date"
                  type="text"
                />
                <Form.Input
                  fluid
                  name="month"
                  value={month}
                  onChange={this.handleChange}
                  placeholder="Enter month"
                  type="text"
                />
                <Form.Input
                  fluid
                  name="year"
                  value={year}
                  onChange={this.handleChange}
                  placeholder="Enter year"
                  type="text"
                />
              </Form.Group>
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
              <Form.Input
                fluid
                name="password"
                value={confirmPassword}
                onChange={this.handleChange}
                placeholder="Re-enter your password"
                label="Confirm your password"
                icon="repeat"
                iconPosition="left"
                type="password"
              />
              <Button
                fluid
                color="orange"
                size="large"
                className={loading ? "loading" : ""}
              >
                Register
              </Button>
            </Segment>
          </Form>
          {errors.length > 0 && (
            <Message error>Error: {this.displayErrors(errors)}</Message>
          )}
          <Message style={{ textAlign: "center" }}>
            Existing user? Login <Link to="/login">here</Link>
          </Message>
        </Grid.Column>
      </Grid>
    )
  }
}

export default Signup
