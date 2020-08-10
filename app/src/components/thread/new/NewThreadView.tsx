import React from "react"
import { View, StyleSheet } from "react-native"
import { TextInput } from "react-native-paper"

type Props = {
  onChangeTitle: (text: string) => void
  onChangeBody: (text: string) => void
}

export function NewThreadView(props: Props) {
  return (
    <View>
      <TextInput label="Title" onChangeText={props.onChangeTitle} />
      <TextInput
        label="Body"
        multiline
        onChangeText={props.onChangeBody}
        style={styles.body}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  body: {
    height: 120,
  },
})
