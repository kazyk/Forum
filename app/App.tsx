import "react-native-gesture-handler"
import * as firebase from "firebase"
import firebaseConfig from "./firebaseConfig"
import { App } from "./src/App"

// Initialize Firebase
firebase.initializeApp(firebaseConfig)

export default App
