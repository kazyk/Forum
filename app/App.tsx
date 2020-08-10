import "react-native-gesture-handler"
import { enableScreens } from "react-native-screens"
import * as firebase from "firebase"
import "firebase/auth"
import "firebase/firestore"
import firebaseConfig from "./firebaseConfig"
import { App } from "./src/App"

enableScreens()

// Initialize Firebase
firebase.initializeApp(firebaseConfig)

export default App
