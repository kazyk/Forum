import "react-native-gesture-handler"
import * as firebase from "firebase"
import firebaseConfig from "./firebaseConfig"
import { App } from "./src/App"

// Initialize Firebase
firebase.initializeApp(firebaseConfig)

firebase.auth().onAuthStateChanged((user) => {
  console.log(user)
})

export default App
