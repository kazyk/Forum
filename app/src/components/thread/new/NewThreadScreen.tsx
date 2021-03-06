import React, { useCallback, useEffect, useState } from "react"
import { Button } from "react-native-paper"
import { NativeStackNavigationProp } from "react-native-screens/lib/typescript"
import { useDispatch } from "react-redux"
import {
  selectPostNewThreadSucceeded,
  threadActions,
  selectPostNewThreadError,
} from "../../../store/Thread"
import { NewThreadView } from "./NewThreadView"
import { useSelector } from "../../../store/Store"
import { useMe } from "../../../store/UserHooks"
import { RegistrationScreenParam } from "../../register/RegistrationScreen"

export type NewThreadScreenParam = {
  NewThread: undefined
}

type ParamList = RegistrationScreenParam

type Props = {
  navigation: NativeStackNavigationProp<ParamList>
}

export function NewThreadScreen({ navigation }: Props) {
  const me = useMe({
    navigateToRegistration: () => {
      navigation.goBack()
      navigation.navigate("Registration", {
        screenAfterRegistration: "NewThread",
      })
    },
  })

  const [title, setTitle] = useState("")
  const [body, setBody] = useState("")
  const canPost = title && body
  const succeeded = useSelector(selectPostNewThreadSucceeded)
  const error = useSelector(selectPostNewThreadError)
  const dispatch = useDispatch()

  const post = useCallback(() => {
    dispatch(
      threadActions.postNewThread({
        title,
        body,
      })
    )
  }, [title, body])

  useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <Button disabled={!canPost} onPress={post}>
          Post
        </Button>
      ),
    })
  }, [canPost, post, navigation])

  useEffect(() => {
    if (succeeded) {
      navigation.pop()
    }
  }, [navigation, succeeded])

  useEffect(() => {
    return () => {
      dispatch(threadActions.postNewThreadClear())
    }
  }, [])

  return (
    <NewThreadView
      onChangeTitle={setTitle}
      onChangeBody={setBody}
      error={error}
    />
  )
}
