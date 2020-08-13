import { auth } from "firebase"
import React from "react"
import { Button } from "react-native-paper"
import { Center } from "../common/Center"

export function SettingScreen() {
  const logout = () => {
    auth().signOut()
  }
  return (
    <Center>
      <Button onPress={logout}>Logout</Button>
    </Center>
  )
}
