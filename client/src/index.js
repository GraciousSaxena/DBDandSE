import React from "react"
import ReactDOM from "react-dom"
import reportWebVitals from "./reportWebVitals"
import { BrowserRouter as Router, Route, Switch } from "react-router-dom"
import App from "./components/Home/App"
import Login from "./components/Auth/Login"
import Signup from "./components/Auth/Signup"
import "semantic-ui-css/semantic.min.css"

const Root = () => (
  <Router>
    <Switch>
      <Route path="/" component={App} exact />
      <Route path="/login" component={Login} />
      <Route path="/signup" component={Signup} />
    </Switch>
  </Router>
)

ReactDOM.render(
  <React.StrictMode>
    <Root />
  </React.StrictMode>,
  document.getElementById("root")
)

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals()
