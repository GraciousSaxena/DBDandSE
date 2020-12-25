import React, { Component } from "react"
import { Menu } from "semantic-ui-react"

class Header extends Component {
  handleClick = e => {
    e.preventDefault()
  }

  render() {
    return (
      <Menu secondary size="huge" inverted style={{ backgroundColor: "black" }}>
        <Menu.Item icon="ticket" name="ShowTym" onClick={this.handleClick} />
        <Menu.Menu position="right">
          {/*Admin operations*/}
          <Menu.Item name="Register Employee" />
          <Menu.Item name="Current movies" />
          <Menu.Item name="Past movies" />
          <Menu.Item name="Profit reports" />
        </Menu.Menu>
      </Menu>
    )
  }
}

export default Header
