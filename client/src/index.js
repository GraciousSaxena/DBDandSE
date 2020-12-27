import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import reportWebVitals from './reportWebVitals'
import {
  BrowserRouter as Router,
  Route,
  Switch,
  withRouter,
} from 'react-router-dom'
import App from './components/Home/App'
import Login from './components/Auth/Login'
import Signup from './components/Auth/Signup'
import Admin from './components/Admin/Admin'
import 'semantic-ui-css/semantic.min.css'
import { createStore } from 'redux'
import { composeWithDevTools } from 'redux-devtools-extension'
import { Provider, connect } from 'react-redux'
import rootReducer from './reducers'
import Spinner from './Spinner'
import { setUser, clearUser } from './actions/index'
import firebase from './firebase'
import EditProfileWithAuth from './components/Home/EditProfile'
import WatchHistoryWithAuth from './components/Home/WatchHistory'
import Register from './components/Admin/Register'
import CurrentMovies from './components/Admin/CurrentMovies'
import PastMovies from './components/Admin/PastMovies'
import GenerateReports from './components/Admin/GenerateReports'
import AddMovie from './components/Admin/AddMovie'
import EditMovie from './components/Admin/EditMovie'
import ScheduleShow from './components/Admin/ScheduleShow'
import BookTicket from './components/Home/BookTicket'
import BookShow from './components/Home/BookShow'

const store = createStore(rootReducer, composeWithDevTools())

class Root extends Component {
  componentDidMount() {
    const path = this.props.location.pathname.split('/')[1]
    if (path === 'admin') {
      this.props.history.push('/admin')
    } else {
      firebase.auth().onAuthStateChanged(user => {
        if (user) {
          this.props.setUser(user)
          this.props.history.push('/')
        } else {
          this.props.history.push('/login')
          this.props.clearUser()
        }
      })
    }
  }

  render() {
    return this.props.isLoading ? (
      <Spinner />
    ) : (
      <Switch>
        <Route path="/" component={App} exact />
        <Route path="/login" component={Login} />
        <Route path="/signup" component={Signup} />
        <Route path="/admin" component={Admin} exact />
        <Route path="/admin/register" component={Register} />
        <Route path="/admin/current-movies" component={CurrentMovies} />
        <Route path="/admin/past-movies" component={PastMovies} />
        <Route path="/admin/add-movie" component={AddMovie} />
        <Route path="/admin/edit-movie" component={EditMovie} />
        <Route path="/admin/schedule-show" component={ScheduleShow} />
        <Route path="/admin/generate-reports" component={GenerateReports} />
        <Route path="/edit-profile" component={EditProfileWithAuth} />
        <Route path="/watch-history" component={WatchHistoryWithAuth} />
        <Route path="/movie/:id" component={BookTicket} />
        <Route path="/show/:id" component={BookShow} />
      </Switch>
    )
  }
}

const mapStateFromProps = state => ({
  isLoading: state.user.isLoading,
})

const RootWithAuth = withRouter(
  connect(mapStateFromProps, { setUser, clearUser })(Root)
)

ReactDOM.render(
  <Provider store={store}>
    <Router>
      <RootWithAuth />
    </Router>
  </Provider>,
  document.getElementById('root')
)
// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals()
