import React, { useEffect } from "react"
import { createStackNavigator } from "@react-navigation/stack"
import { useDispatch } from "react-redux"
import { useSelector } from "../../util/redux"
import { LoginScreen } from "./LoginScreen"
import { SignUpScreen } from "./SignUpScreen"
import { Center } from "../common/Center"
import { ActivityIndicator } from "react-native"
import { authActions } from "../../store/Auth"

const Stack = createStackNavigator()

export function AuthRootNavigator() {
  const initialized = useSelector((state) => state.auth.initialized)

  const dispatch = useDispatch()
  useEffect(() => {
    dispatch(authActions.initialize())
  }, [])

  return (
    <Stack.Navigator>
      {initialized ? (
        <>
          <Stack.Screen name="SignUp" component={SignUpScreen} />
          <Stack.Screen name="Login" component={LoginScreen} />
        </>
      ) : (
        <Stack.Screen name="Launching" component={LaunchingScreen} />
      )}
    </Stack.Navigator>
  )
}

function LaunchingScreen() {
  return (
    <Center>
      <ActivityIndicator />
    </Center>
  )
}
