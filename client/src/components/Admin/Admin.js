import React, { Component } from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import { Button, Grid } from 'semantic-ui-react'
import HeaderWithAuth from './Header'

class AdminUtil extends Component {
  render() {
    return (
      <>
        <HeaderWithAuth />
        <Grid textAlign="center" verticalAlign="middle">
          <Grid.Column style={{ maxWidth: 500 }}>
            <Button
              fluid
              color="black"
              size="large"
              onClick={() => this.props.history.push('/admin/add-movie')}
              style={{ marginBottom: 30 }}
            >
              Add Movie
            </Button>

            <Button
              fluid
              color="black"
              size="large"
              onClick={() => this.props.history.push('/admin/edit-movie')}
              style={{ marginBottom: 30 }}
            >
              Edit Movie
            </Button>

            <Button
              fluid
              color="black"
              size="large"
              onClick={() => this.props.history.push('/admin/schedule-show')}
              style={{ marginBottom: 30 }}
            >
              Schedule Show
            </Button>
          </Grid.Column>
        </Grid>
      </>
    )
  }
}

const Admin = withRouter(connect(null)(AdminUtil))

export default Admin
