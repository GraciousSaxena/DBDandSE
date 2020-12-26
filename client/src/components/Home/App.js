import React from "react"
import { connect } from "react-redux"
import HeaderWithAuth from "./Header"

const App = ({ currentUser }) => (
  <>
    <HeaderWithAuth currentUser={currentUser} />
    <h1>This is the app body</h1>
  </>
)

const mapStateToProps = state => ({
  currentUser: state.user.currentUser,
})

export default connect(mapStateToProps)(App)
