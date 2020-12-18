import React from "react"
import "./App.css"
import { useEffect, useState } from "react"
import Axios from "axios"

function App() {
  const [movieName, setMovieName] = useState("")
  const [movieReview, setMovieReview] = useState("")
  const [movieReviewList, setMovieList] = useState([])

  const [usernameReg, setUsernameReg] = useState("")
  const [passwordReg, setPasswordReg] = useState("")

  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")

  const [loginStatus, setLoginStatus] = useState("")

  useEffect(() => {
    Axios.get("http://localhost:3001/api/get").then((Response) => {
      setMovieList(Response.data)
    })
  })

  const register = () => {
    Axios.post("http://localhost:3001/register", {
      userID: usernameReg,
      password: passwordReg,
    }).then((Response) => {
      console.log(Response)
    })
  }

  const login = () => {
    Axios.post("http://localhost:3001/login", {
      userID: username,
      password: password,
    }).then((Response) => {
      if (Response.data.message) {
        setLoginStatus(Response.data.message)
      } else {
        setLoginStatus(Response.data[0].userID)
      }
    })
  }

  const submitReveiw = () => {
    console.log("Click registered!")
    Axios.post("http://localhost:3001/api/insert", {
      movieName: movieName,
      movieReview: movieReview,
    }).then(() => {
      alert("Successful insert")
    })
  }
  return (
    <div className="App">
      <h1>CRUD APPLICATION</h1>
      <div className="form">
        <label>Movie Name</label>

        <input
          type="text"
          name="movieName"
          onChange={(e) => {
            setMovieName(e.target.value)
          }}
        />

        <label>Review</label>

        <input
          type="text"
          name="review"
          onChange={(e) => {
            setMovieReview(e.target.value)
          }}
        />
      </div>
      <button onClick={submitReveiw}>Submit</button>
      {movieReviewList.map((val) => {
        return (
          <h2>
            MovieName: {val.movieName} | MovieReview: {val.movieReview}
          </h2>
        )
      })}
      <div className="App">
        <div className="registration">
          <h1>Registration</h1>
          <input
            type="text"
            placeholder="User ID"
            onChange={(event) => {
              setUsernameReg(event.target.value)
            }}
          ></input>
          <input
            type="text"
            placeholder="Password"
            onChange={(event) => {
              setPasswordReg(event.target.value)
            }}
          ></input>
          <button onClick={register}>Register</button>
        </div>
        <div className="login">
          <h1>Login</h1>
          <input
            type="text"
            placeholder="Username..."
            onChange={(event) => {
              setUsername(event.target.value)
            }}
          ></input>
          <input
            type="password"
            placeholder="Password..."
            onChange={(event) => {
              setPassword(event.target.value)
            }}
          ></input>
          <button onClick={login}>Login</button>
        </div>
        <h1>{loginStatus}</h1>
      </div>
    </div>
  )
}

export default App
