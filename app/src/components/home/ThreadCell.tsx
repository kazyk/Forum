import React from "react"
import { StyleSheet } from "react-native"
import { Subheading, Surface } from "react-native-paper"
import { Thread } from "../../store/Types"

type Props = {
  thread: Thread
}

function _ThreadCell(props: Props) {
  const { thread } = props
  return (
    <Surface style={styles.cell}>
      <Subheading>{thread.title}</Subheading>
    </Surface>
  )
}

export const ThreadCell = React.memo(_ThreadCell)

const styles = StyleSheet.create({
  cell: {
    marginHorizontal: 8,
    marginBottom: 8,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 4,
    height: 100,
    backgroundColor: "white",
    elevation: 2,
  },
})
