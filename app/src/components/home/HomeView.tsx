import React from "react"
import { FlatList } from "react-native-gesture-handler"
import { Thread } from "../../store/Types"
import { ThreadCell } from "./ThreadCell"

type Props = {
  threads: Thread[] | null
}

export function HomeView(props: Props) {
  const { threads } = props
  return (
    <FlatList
      data={threads}
      renderItem={({ item }) => <ThreadCell thread={item} />}
    />
  )
}
