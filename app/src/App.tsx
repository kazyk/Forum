import { createBottomTabNavigator } from "@react-navigation/bottom-tabs"
import { NavigationContainer } from "@react-navigation/native"
import { createStackNavigator } from "@react-navigation/stack"
import React from "react"
import { StyleSheet, Text } from "react-native"
import { Provider } from "react-redux"
import { HomeScreen } from "./components/home/HomeScreen"
import { store } from "./store/Store"
import { useSelector } from "./util/redux"
import { AuthRootNavigator } from "./components/auth/AuthRootNavigator"

const HomeStack = createStackNavigator()

function HomeStackScreen() {
  return (
    <HomeStack.Navigator>
      <HomeStack.Screen name="Home" component={HomeScreen} />
    </HomeStack.Navigator>
  )
}

function Communities() {
  return <Text>Communities</Text>
}

function Search() {
  return <Text>Search</Text>
}

function Settings() {
  return <Text>Settings</Text>
}

const Tab = createBottomTabNavigator()

function Root() {
  const isLoggedIn = useSelector((state) => state.auth.currentUid != null)

  return isLoggedIn ? (
    <Tab.Navigator>
      <Tab.Screen name="Home" component={HomeStackScreen} />
      <Tab.Screen name="Communities" component={Communities} />
      <Tab.Screen name="Search" component={Search} />
      <Tab.Screen name="Settings" component={Settings} />
    </Tab.Navigator>
  ) : (
    <AuthRootNavigator />
  )
}

export function App() {
  return (
    <Provider store={store}>
      <NavigationContainer>
        <Root />
      </NavigationContainer>
    </Provider>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
})
