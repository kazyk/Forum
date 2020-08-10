import React, { useCallback, useEffect, useState } from "react"
import { Button } from "react-native-paper"
import { NativeStackNavigationProp } from "react-native-screens/lib/typescript"
import { useDispatch } from "react-redux"
import { selectPostNewThreadSucceeded, threadActions } from "../../../store/Thread"
import { useSelector } from "../../../util/redux"
import { NewThreadView } from "./NewThreadView"

export type NewThreadScreenParam = {
  NewThread: undefined
}

type Props = {
  navigation: NativeStackNavigationProp<{}>
}

export function NewThreadScreen({ navigation }: Props) {
  const [title, setTitle] = useState("")
  const [body, setBody] = useState("")
  const canPost = title && body
  const succeeded = useSelector(selectPostNewThreadSucceeded)

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
      dispatch(threadActions.newThreadClosed())
    }
  }, [])

  return <NewThreadView onChangeTitle={setTitle} onChangeBody={setBody} />
}
