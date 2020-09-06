import firebase from 'firebase/app'
import 'firebase/firestore'
import "firebase/auth";

// config
var firebaseConfig = {
  apiKey: "AIzaSyArd4IpMLGGwh5wk2-uZlKECyCngomEuFo",
  authDomain: "fulltasks-bab3e.firebaseapp.com",
  databaseURL: "https://fulltasks-bab3e.firebaseio.com",
  projectId: "fulltasks-bab3e",
  storageBucket: "fulltasks-bab3e.appspot.com",
  messagingSenderId: "79082916179",
  appId: "1:79082916179:web:dafdf9bbc5f0057bb1f9a6",
  measurementId: "G-5MFY0RBS9Z"
};
firebase.initializeApp(firebaseConfig)
// Get a Firestore instance

export const db = firebase.firestore()
export const auth = firebase.auth() 