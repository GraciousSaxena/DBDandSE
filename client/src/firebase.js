import firebase from "firebase/app"
import "firebase/auth"
import "firebase/database"
import "firebase/storage"

var firebaseConfig = {
  apiKey: "AIzaSyCNG-5dN1XuedAEZuSBJW7w1Wz4i6V0WTg",
  authDomain: "popcorn-mov.firebaseapp.com",
  projectId: "popcorn-mov",
  storageBucket: "popcorn-mov.appspot.com",
  messagingSenderId: "945760473119",
  appId: "1:945760473119:web:6d9997c3036b2246a7c52a",
  measurementId: "G-Y4FFDJNFRP",
}
// Initialize Firebase
firebase.initializeApp(firebaseConfig)

export default firebase
