import React from "react"
import { Button } from "react-native"
import { useDispatch } from "react-redux"
import { authActions } from "../../store/Auth"
import { selectIsPendingSignIn } from "../../store/Auth"
import { Center } from "../common/Center"
import { useSelector } from "../../store/Store"

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
