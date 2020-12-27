import React, { Component } from 'react'
import { withRouter } from 'react-router-dom'
import { Input, Menu } from 'semantic-ui-react'
import firebase from '../../firebase'
import { connect } from 'react-redux'

class Header extends Component {
  handleClick = () => {
    this.props.history.push('/')
  }

  handleLogout = () => {
    firebase
      .auth()
      .signOut()
      .then(() => console.log('Signed Out Successfully'))
  }

  handleEditProfile = () => {
    this.props.history.push('/edit-profile')
  }

  render() {
    const { currentUser } = this.props

    return (
      <Menu secondary size="huge" inverted style={{ backgroundColor: 'black' }}>
        <Menu.Item icon="ticket" name="ShowTym" onClick={this.handleClick} />
        <Menu.Menu>
          <Menu.Item>
            <Input
              placeholder="Search..."
              icon="search"
              name="searchWord"
              size="mini"
            />
          </Menu.Item>
        </Menu.Menu>
        <Menu.Menu position="right">
          {currentUser ? (
            <Menu.Item
              name={`Welcome ${currentUser.displayName}`}
              onClick={this.handleEditProfile}
            />
          ) : (
            <Menu.Item name="Welcome..." />
          )}
          <Menu.Item name="Logout" onClick={this.handleLogout} />
        </Menu.Menu>
      </Menu>
    )
  }
}

const HeaderWithAuth = withRouter(connect(null)(Header))

export default HeaderWithAuth
