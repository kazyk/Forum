import { createBottomTabNavigator } from "@react-navigation/bottom-tabs"
import { NavigationContainer } from "@react-navigation/native"
import React from "react"
import { StyleSheet, Text } from "react-native"
import { createNativeStackNavigator } from "react-native-screens/native-stack"
import { Provider } from "react-redux"
import { AuthRootNavigator } from "./components/auth/AuthRootNavigator"
import { HomeScreen } from "./components/home/HomeScreen"
import { store, useSelector } from "./store/Store"
import { NewThreadScreen } from "./components/thread/new/NewThreadScreen"
import { RegistrationScreen } from "./components/register/RegistrationScreen"
import { SettingScreen } from "./components/setting/SettingScreen"

const HomeStack = createNativeStackNavigator()

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

const RootStack = createNativeStackNavigator()

const Tab = createBottomTabNavigator()
function TabScreen() {
  return (
    <Tab.Navigator>
      <Tab.Screen name="Home" component={HomeStackScreen} />
      <Tab.Screen name="Communities" component={Communities} />
      <Tab.Screen name="Search" component={Search} />
      <Tab.Screen name="Setting" component={SettingScreen} />
    </Tab.Navigator>
  )
}

function Root() {
  const isLoggedIn = useSelector((state) => state.auth.currentUser != null)

  return isLoggedIn ? (
    <RootStack.Navigator screenOptions={{ stackPresentation: "modal" }}>
      <RootStack.Screen
        name="Tab"
        component={TabScreen}
        options={{ headerShown: false }}
      />
      <RootStack.Screen name="NewThread" component={NewThreadScreen} />
      <RootStack.Screen name="Registration" component={RegistrationScreen} />
    </RootStack.Navigator>
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
