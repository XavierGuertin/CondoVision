import React from "react";
import { View, TouchableOpacity, StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";
import Icon from "react-native-vector-icons/Ionicons";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";


/**
 * Navbar component to navigate across different screens in the app.
 * It dynamically hides on specified screens to enhance user experience.
 */
const Navbar = () => {
  const navigation = useNavigation();
  const navigationState = navigation.getState();

  // Check if navigationState is defined and has routes
  if (!navigationState || !navigationState.routes) {
    return null;
  }

  const currentRouteName = navigationState.routes[navigationState.index].name;

  // Check if current screen is in the list to hide Navbar
  const hideOnScreens = ["Signup", "Login", "Home"];
  if (hideOnScreens.includes(currentRouteName)) {
    return null;
  }

  return (
    <View style={styles.navbarContainer}>
      <TouchableOpacity
        id="propertyManagementBtn"
        onPress={() => navigation.navigate("PropertyManagement")}
      >
        <Icon name="home" size={30} />
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate("Notifications")}>
        <Icon name="notifications" size={30} />
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate("Report")}>
        <FontAwesome5 name="chart-line" solid size={30} color="#000" />
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate("UserProfile")}>
        <Icon name="person" size={30} />
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate("Settings")}>
        <Icon name="settings" size={30} />
      </TouchableOpacity>
    </View>
  );
};

// Styles for the Navbar component
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
