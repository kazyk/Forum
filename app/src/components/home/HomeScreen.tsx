import { StackNavigationProp } from "@react-navigation/stack"
import React, { useEffect } from "react"
import { StyleSheet, View } from "react-native"
import { useDispatch } from "react-redux"
import { useSelector } from "../../store/Store"
import { selectHomeThreadList, threadActions } from "../../store/Thread"
import { FAB } from "../common/FAB"
import { NewThreadScreenParam } from "../thread/new/NewThreadScreen"
import { HomeView } from "./HomeView"

type Props = {
  navigation: StackNavigationProp<NewThreadScreenParam>
}

export function HomeScreen({ navigation }: Props) {
  const threads = useSelector(selectHomeThreadList)
  const dispatch = useDispatch()
  useEffect(() => {
    dispatch(threadActions.fetchHomeThreadList())
  }, [])
  const showNewThread = () => {
    navigation.navigate("NewThread")
  }
  return (
    <View style={StyleSheet.absoluteFill}>
      <HomeView threads={threads} />
      <FAB icon="plus" onPress={showNewThread} />
    </View>
  )
}
