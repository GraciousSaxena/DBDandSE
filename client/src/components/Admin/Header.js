import React, { Component } from "react"
import { connect } from "react-redux"
import { withRouter } from "react-router-dom"
import { Menu } from "semantic-ui-react"

class Header extends Component {
  handleClick = () => {
    this.props.history.push("/admin")
  }

  handleRegisterEmployee = () => {
    this.props.history.push("/admin/register")
  }

  handleCurrentMovies = () => {
    this.props.history.push("/admin/current-movies")
  }

  handlePastMovies = () => {
    this.props.history.push("/admin/past-movies")
  }

  handleGenerateReports = () => {
    this.props.history.push("/admin/generate-reports")
  }

  render() {
    return (
      <Menu secondary size="huge" inverted style={{ backgroundColor: "black" }}>
        <Menu.Item icon="ticket" name="ShowTym" onClick={this.handleClick} />
        <Menu.Menu position="right">
          {/*Admin operations*/}
          <Menu.Item
            name="Register Employee"
            onClick={this.handleRegisterEmployee}
          />
          <Menu.Item name="Current movies" onClick={this.handleCurrentMovies} />
          <Menu.Item name="Past movies" onClick={this.handlePastMovies} />
          <Menu.Item
            name="Generate reports"
            onClick={this.handleGenerateReports}
          />
        </Menu.Menu>
      </Menu>
    )
  }
}

const HeaderWithAuth = withRouter(connect(null)(Header))

export default HeaderWithAuth
