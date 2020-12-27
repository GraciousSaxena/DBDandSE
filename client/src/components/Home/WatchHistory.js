import React, { Component } from "react"
import { connect } from "react-redux"
import { withRouter } from "react-router-dom"
import HeaderWithAuth from "./Header"

class WatchHistory extends Component {
  render() {
    const { currentUser } = this.props

    return (
      <div>
        <HeaderWithAuth currentUser={currentUser} />
        <h1>This is the watch history screen</h1>
      </div>
    )
  }
}

const mapStateToProps = state => ({
  currentUser: state.user.currentUser,
})

const WatchHistoryWithAuth = withRouter(connect(mapStateToProps)(WatchHistory))

export default WatchHistoryWithAuth
