import React from "react"
import {
  Grid,
  Header,
  Icon,
  Form,
  Segment,
  Button,
  Message,
  Dropdown,
} from "semantic-ui-react"
import { Link } from "react-router-dom"
import "../../styles/App.css"

function Signup() {
  return (
    <Grid textAlign="center" verticalAlign="middle" className="app">
      <Grid.Column style={{ maxWidth: 600 }} textAlign="left">
        <Header as="h2" icon color="blue" textAlign="center">
          <Icon name="ticket" color="blue" />
          Register for ShowTym
        </Header>
        <Form size="large">
          <Segment stacked>
            <Form.Group widths="equal">
              <Form.Input
                fluid
                name="firstName"
                placeholder="Enter your First name"
                label="Enter your first name"
                icon="user"
                type="text"
                iconPosition="left"
              />
              <Form.Input
                fluid
                name="lastName"
                placeholder="Enter your Last name"
                label="Enter your last name"
                type="text"
              />
            </Form.Group>
            <Form.Input
              fluid
              name="email"
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
              label="Enter your contact number"
              icon="mobile"
              iconPosition="left"
            />
            <Form.Field label="Date of Birth" />
            <Form.Group widths="equal">
              <Dropdown placeholder="Select Date" name="day" fluid selection />
              <Dropdown
                placeholder="Select Month"
                name="month"
                fluid
                selection
              />
              <Dropdown placeholder="Select Year" name="year" fluid selection />
            </Form.Group>
            <Form.Input
              fluid
              name="password"
              placeholder="Enter your password"
              label="Enter your password"
              icon="lock"
              iconPosition="left"
              type="password"
            />
            <Form.Input
              fluid
              name="password"
              placeholder="Re-enter your password"
              label="Confirm your password"
              icon="repeat"
              iconPosition="left"
              type="password"
            />
            <Button fluid color="blue" size="large">
              Register
            </Button>
          </Segment>
        </Form>
        <Message style={{ textAlign: "center" }}>
          Existing user? Login <Link to="/login">here</Link>
        </Message>
      </Grid.Column>
    </Grid>
  )
}

export default Signup
