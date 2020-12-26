import React, { Component } from "react"
import HeaderWithAuth from "./Header"

class PastMovies extends Component {
  render() {
    return (
      <div>
        <HeaderWithAuth />
        <h1>This is the past movies list</h1>
      </div>
    )
  }
}

export default PastMovies
