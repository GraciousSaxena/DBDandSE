import React, { Component } from "react"
import { withRouter } from "react-router-dom"
import HeaderWithAuth from "./Header"
import { connect } from "react-redux"
import {
  Button,
  Form,
  Grid,
  Header,
  Icon,
  Message,
  Segment,
} from "semantic-ui-react"
import axios from "axios"
import firebase from "../../firebase"

class EditProfile extends Component {
  state = {
    firstName: "",
    oldFirstName: "",
    lastName: "",
    contact: "",
    email: "",
    loading: false,
    errors: [],
  }

  componentDidMount() {
    axios
      .post("http://localhost:6969/customer/details", {
        email: this.props.currentUser.email,
      })
      .then(res => {
        const userInfo = res.data[0]
        this.setState({
          firstName: userInfo.firstName,
          lastName: userInfo.lastName,
          contact: userInfo.contact,
          email: userInfo.email,
          oldFirstName: userInfo.firstName,
        })
      })
  }

  handleChange = e => {
    this.setState({ [e.target.name]: e.target.value })
  }

  isFormEmpty = ({ firstName, contact }) => {
    return !firstName.length || !contact.length
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
    } else if (!this.isContactValid(this.state)) {
      error = { message: "Invalid contact number!!!" }
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
        .put("http://localhost:6969/customer/details", {
          firstName: this.state.firstName,
          lastName: this.state.lastName,
          email: this.state.email,
          contact: this.state.contact,
        })
        .then(res => {
          if (res.data === "Conflict while updating") {
            this.setState({
              errors: this.state.errors.concat({ message: res.data }),
              loading: false,
            })
          } else {
            if (this.state.firstName !== this.state.oldFirstName) {
              var user = firebase.auth().currentUser
              user
                .updateProfile({
                  displayName: this.state.firstName,
                })
                .then(() => {
                  console.log("Update successful")
                })
                .catch(err => {
                  console.error(err)
                })
            }
            this.props.history.push("/")
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
    const { currentUser } = this.props
    const { firstName, lastName, contact, email, loading, errors } = this.state

    return (
      <>
        <HeaderWithAuth currentUser={currentUser} />
        <Grid textAlign="center" verticalAlign="middle" className="app">
          <Grid.Column style={{ maxWidth: 600 }} textAlign="left">
            <Header as="h2" icon color="black" textAlign="center">
              <Icon name="ticket" color="black" />
              Update your information
            </Header>
            <Form size="large" onSubmit={this.handleSubmit}>
              <Segment stacked>
                <Form.Group widths="equal">
                  <Form.Input
                    fluid
                    name="firstName"
                    placeholder={firstName}
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
                    placeholder={lastName}
                    label="Enter your last name"
                    type="text"
                  />
                </Form.Group>
                <Form.Input
                  fluid
                  name="email"
                  value={email}
                  onChange={this.handleChange}
                  placeholder={email}
                  label="Enter your E-mail"
                  icon="mail"
                  iconPosition="left"
                  type="email"
                  disabled
                />
                <Form.Input
                  fluid
                  name="contact"
                  placeholder={contact}
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
                <Button
                  fluid
                  color="black"
                  size="large"
                  className={loading ? "loading" : ""}
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

const mapStateFromProps = state => ({
  currentUser: state.user.currentUser,
})

const EditProfileWithAuth = withRouter(connect(mapStateFromProps)(EditProfile))

export default EditProfileWithAuth
