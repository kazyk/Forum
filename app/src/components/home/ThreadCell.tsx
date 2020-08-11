import React from "react"
import { StyleSheet, Text, View } from "react-native"
import { Thread } from "../../store/Types"

export function ThreadCell(props: { thread: Thread }) {
  const { thread } = props
  return (
    <View style={styles.cell}>
      <Text>{thread.title}</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  cell: {
    height: 100,
    backgroundColor: "white",
  },
})
