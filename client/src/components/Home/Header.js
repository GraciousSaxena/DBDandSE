import React, { Component } from "react"
import { Input, Menu } from "semantic-ui-react"

class Header extends Component {
  handleClick = e => {
    e.preventDefault()
  }

  render() {
    return (
      <Menu secondary size="huge" inverted style={{ backgroundColor: "black" }}>
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
          <Menu.Item name="Welcome Guest..." />
          <Menu.Item name="Login" onClick={this.handleClick} />
          <Menu.Item name="Watch History" onClick={this.handleClick} />
        </Menu.Menu>
      </Menu>
    )
  }
}

export default Header
