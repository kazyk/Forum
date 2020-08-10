import React from "react"
import { StyleSheet, View } from "react-native"
import { TextInput } from "react-native-paper"
import { ErrorInfo } from "../../../store/Types"
import { ErrorSnack } from "../../common/ErrorSnack"

type Props = {
  onChangeTitle: (text: string) => void
  onChangeBody: (text: string) => void
  error?: ErrorInfo
}

export function NewThreadView(props: Props) {
  return (
    <View style={StyleSheet.absoluteFill}>
      <TextInput label="Title" onChangeText={props.onChangeTitle} />
      <TextInput
        label="Body"
        multiline
        onChangeText={props.onChangeBody}
        style={styles.body}
      />
      <ErrorSnack error={props.error} />
    </View>
  )
}

const styles = StyleSheet.create({
  body: {
    height: 120,
  },
})
