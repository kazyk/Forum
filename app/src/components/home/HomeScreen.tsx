import React from "react"
import { View, Text, StyleSheet } from "react-native"
import { FAB } from "../common/FAB"
import { StackNavigationProp } from "@react-navigation/stack"
import { NewThreadScreenParam } from "../thread/new/NewThreadScreen"

type Props = {
  navigation: StackNavigationProp<NewThreadScreenParam>
}

export function HomeScreen({ navigation }: Props) {
  const showNewThread = () => {
    navigation.navigate("NewThread")
  }
  return (
    <View style={StyleSheet.absoluteFill}>
      <Text>Home</Text>
      <FAB icon="plus" onPress={showNewThread} />
    </View>
  )
}
