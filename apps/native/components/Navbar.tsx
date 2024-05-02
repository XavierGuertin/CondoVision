// Navbar.js
// A custom navigation bar component for a React Native application.
// It dynamically hides on specific screens such as Signup, Login, and Home for enhanced UX.

import React from "react";
import { View, TouchableOpacity, StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";
import Icon from "react-native-vector-icons/Ionicons";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";

const Navbar = () => {
  const navigation = useNavigation();
  const navigationState = navigation.getState();

  // Early return null if navigationState or its routes are undefined.
  if (!navigationState || !navigationState.routes) {
    return null;
  }

  // Determine the current route name.
  const currentRouteName = navigationState.routes[navigationState.index].name;

  // List of screens where the navbar should not be displayed.
  const hideOnScreens = ["Signup", "Login", "Home"];

  // Hide navbar on specified screens.
  if (hideOnScreens.includes(currentRouteName)) {
    return null;
  }

  // Renders navigation bar with buttons to navigate to different screens.
  return (
    <View style={styles.navbarContainer}>
      <TouchableOpacity
        id="propertyManagementBtn"
        onPress={() => navigation.navigate("PropertyManagement")}
      >
        <Icon name="home" size={30} />
      </TouchableOpacity>
      <TouchableOpacity
        id="notificationScreenBtn"
        onPress={() => navigation.navigate("Notifications")}
      >
        <Icon name="notifications" size={30} />
      </TouchableOpacity>
      <TouchableOpacity
        id="reportBtn"
        onPress={() => navigation.navigate("Report")}
      >
        <FontAwesome5 name="chart-line" solid size={30} color="#000" />
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate("UserProfile")}>
        <Icon testID="profile" name="person" size={30} />
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate("Settings")}>
        <Icon testID="settings" name="settings" size={30} />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  navbarContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    height: 75,
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "white",
    borderTopWidth: 1,
    borderTopColor: "#dddddd",
  },
});

export default Navbar;
