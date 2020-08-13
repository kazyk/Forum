import React, { useEffect, useCallback, useState } from "react"
import { NewThreadScreenParam } from "../thread/new/NewThreadScreen"
import { View } from "react-native"
import { TextInput, Button } from "react-native-paper"
import { NativeStackNavigationProp } from "react-native-screens/lib/typescript"
import { useDispatch } from "react-redux"
import {
  userActions,
  selectRegisterUserIsPending,
  selectRegistrationUserSuccess,
} from "../../store/User"
import { useSelector } from "../../store/Store"

type ParamList = NewThreadScreenParam

export type RegistrationScreenParam = {
  Registration: {
    screenAfterRegistration: keyof ParamList
  }
}

type Props = {
  navigation: NativeStackNavigationProp<ParamList>
}

export function RegistrationScreen(props: Props) {
  const { navigation } = props
  const dispatch = useDispatch()
  const [displayName, setDisplayName] = useState("")
  const isPending = useSelector(selectRegisterUserIsPending)
  const canProceed = displayName && !isPending
  const success = useSelector(selectRegistrationUserSuccess)

  const register = useCallback(() => {
    dispatch(
      userActions.register({
        displayName,
      })
    )
  }, [displayName])

  useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <Button disabled={!canProceed} onPress={register}>
          Done
        </Button>
      ),
    })
  }, [navigation, canProceed, register])

  useEffect(() => {
    if (success) {
      // TODO navigate after registration
    }
  }, [success])

  useEffect(() => {
    return () => {
      dispatch(userActions.registrationClear())
    }
  }, [])

  return (
    <View>
      <TextInput label="Display name" onChangeText={setDisplayName} />
    </View>
  )
}
