import React, { ReactElement } from "react"
import { StyleSheet, View } from "react-native"

type Props = {
  children: ReactElement
}

export function Center(props: Props) {
  return <View style={styles.center}>{props.children}</View>
}

const styles = StyleSheet.create({
  center: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
})
