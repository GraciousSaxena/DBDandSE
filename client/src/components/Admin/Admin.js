import React, { Component } from "react"
import HeaderWithAuth from "./Header"

class Admin extends Component {
  render() {
    return (
      <>
        <HeaderWithAuth />
        <h1>This is the admin body</h1>
      </>
    )
  }
}

export default Admin
