import React from "react"
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

function Login() {
  return (
    <Grid textAlign="center" verticalAlign="middle" className="app">
      <Grid.Column style={{ maxWidth: 450 }} textAlign="left">
        <Header as="h2" icon color="blue" textAlign="center">
          <Icon name="ticket" color="blue" />
          Login to ShowTym
        </Header>
        <Form size="large">
          <Segment stacked>
            <Form.Input
              fluid
              name="email"
              placeholder="Enter your registered email"
              label="Enter your E-mail"
              icon="mail"
              iconPosition="left"
              type="email"
            />
            <Form.Input
              fluid
              name="password"
              placeholder="Enter your password"
              label="Enter your password"
              icon="lock"
              iconPosition="left"
              type="password"
            />
            <Button fluid color="blue" size="large">
              Sign In
            </Button>
          </Segment>
        </Form>
        <Message style={{ textAlign: "center" }}>
          New user? Create an account for free <Link to="/signup">here</Link>
        </Message>
      </Grid.Column>
    </Grid>
  )
}

export default Login
