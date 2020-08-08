import React from "react"
import { Text, Button } from "react-native"
import { Center } from "../common/Center"

export type LoginScreenParam = {
  Login: undefined
}

export function LoginScreen() {
  return (
    <Center>
      <Button title="Login" onPress={() => {}} />
    </Center>
  )
}
