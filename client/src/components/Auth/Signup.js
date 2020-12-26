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

class Signup extends Component {
  state = {
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    contact: "",
    loading: false,
    errors: [],
  }

  handleChange = e => {
    this.setState({ [e.target.name]: e.target.value })
  }

  isFormEmpty = ({ firstName, email, password, confirmPassword, contact }) => {
    return (
      !firstName.length ||
      !email.length ||
      !password.length ||
      !confirmPassword.length ||
      !contact.length
    )
  }

  isPasswordValid = ({ password, confirmPassword }) => {
    if (password.length < 6 || confirmPassword.length < 6) {
      return false
    } else if (password !== confirmPassword) {
      return false
    } else {
      return true
    }
  }

  isContactValid = ({ contact }) => {
    if (contact.length !== 10) {
      return false
    }
    const contactArray = [...contact]
    for (let i = 0; i < contactArray.length; i++) {
      if (contactArray[i] >= "0" && contactArray[i] <= "9") {
        continue
      } else {
        return false
      }
    }
    return true
  }

  isFormValid = () => {
    let errors = []
    let error

    if (this.isFormEmpty(this.state)) {
      error = { message: "Please fill out all fields!!!" }
      this.setState({ errors: errors.concat(error) })
      return false
    } else if (!this.isPasswordValid(this.state)) {
      error = { message: "The passwords entered are invalid!!! " }
      this.setState({ errors: errors.concat(error) })
      return false
    } else if (!this.isContactValid(this.state)) {
      error = { message: "Invalid Contact Number entered!!!" }
      this.setState({ errors: errors.concat(error) })
    } else {
      return true
    }
  }

  handleSubmit = e => {
    e.preventDefault()

    if (this.isFormValid()) {
      this.setState({ errors: [], loading: true })
      /*Create account*/
      axios
        .post("http://localhost:6969/customer/register", {
          firstName: this.state.firstName,
          lastName: this.state.lastName,
          email: this.state.email,
          password: this.state.password,
          contact: this.state.contact,
        })
        .then(res => {
          console.log(res)
          console.log(res.data)
          if (res.data === "Credentials already in use...") {
            this.setState({
              errors: this.state.errors.concat({ message: res.data }),
              loading: false,
            })
          } else {
            console.log("Account successfully created...")
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
    const {
      firstName,
      lastName,
      email,
      password,
      confirmPassword,
      contact,
      loading,
      errors,
    } = this.state

    return (
      <Grid textAlign="center" verticalAlign="middle" className="app">
        <Grid.Column style={{ maxWidth: 600 }} textAlign="left">
          <Header as="h2" icon color="black" textAlign="center">
            <Icon name="ticket" color="black" />
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
              {/*
                <Form.Field label="Date of Birth" />
              <Form.Group widths="equal">
                <Form.Input
                  fluid
                  name="day"
                  value={day}
                  onChange={this.handleChange}
                  control="select"
                />
                <Form.Input
                  fluid
                  name="month"
                  value={month}
                  onChange={this.handleChange}
                  control="select"
                />
                <Form.Input
                  fluid
                  name="year"
                  value={year}
                  onChange={this.handleChange}
                  control="select"
                />
              </Form.Group>
              */}
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
                name="confirmPassword"
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
                color="black"
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
