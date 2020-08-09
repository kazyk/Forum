import React from "react"
import { Text, Button } from "react-native"
import { Center } from "../common/Center"
import { useDispatch } from "react-redux"
import { authActions } from "../../store/Auth"
import { useSelector } from "../../util/redux"
import { selectIsPendingSignIn } from "../../store/AuthSelectors"

export function SignUpScreen() {
  const isPending = useSelector(selectIsPendingSignIn)
  const dispatch = useDispatch()
  const signUp = () => {
    dispatch(authActions.signInAnonymous())
  }
  return (
    <Center>
      <Button title="SignUp" disabled={isPending} onPress={signUp} />
    </Center>
  )
}
