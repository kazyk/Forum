import React from "react"
import { FlatList } from "react-native-gesture-handler"
import { Thread } from "../../store/Types"
import { ThreadCell } from "./ThreadCell"
import { StyleSheet, View } from "react-native"

type Props = {
  threads: Thread[] | null
}

export function HomeView(props: Props) {
  const { threads } = props
  return (
    <FlatList
      data={threads}
      ListHeaderComponent={<View style={styles.listHeader} />}
      renderItem={({ item }) => <ThreadCell thread={item} />}
    />
  )
}

const styles = StyleSheet.create({
  listHeader: {
    height: 8,
  },
})
