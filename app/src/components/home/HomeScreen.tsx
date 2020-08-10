import React from "react"
import { View, Text, StyleSheet } from "react-native"
import { FAB } from "../common/FAB"

export type HomeScreenParam = {
  Home: {}
}

export function HomeScreen() {
  return (
    <View style={StyleSheet.absoluteFill}>
      <Text>Home</Text>
      <FAB icon="plus" />
    </View>
  )
}
