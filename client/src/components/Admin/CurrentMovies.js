import React, { Component } from "react"
import HeaderWithAuth from "./Header"

class CurrentMovies extends Component {
  render() {
    return (
      <div>
        <HeaderWithAuth />
        <h1>This is the current movies list</h1>
      </div>
    )
  }
}

export default CurrentMovies
