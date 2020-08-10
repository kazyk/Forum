import React from "react"
import { FAB as PaperFAB } from "react-native-paper"
import { StyleSheet } from "react-native"

export function FAB(props: React.ComponentProps<typeof PaperFAB>) {
  return <PaperFAB style={styles.fab} {...props} />
}

const styles = StyleSheet.create({
  fab: {
    position: "absolute",
    margin: 16,
    right: 0,
    bottom: 0,
  },
})
