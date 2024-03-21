import { createNativeStackNavigator } from "@react-navigation/native-stack";
import {
  HomeScreen,
  LoginScreen,
  SignupScreen,
  PropertyManagementScreen,
  UserProfileScreen,
  NotificationsScreen,
  ReportScreen,
  SettingsScreen,
  AddCondoProfileScreen,
  CondoPaymentFeeStatusAndHistoryScreen,
  FacilityBookingScreen
} from "./screens/index"; // screens
import React, { useState, useEffect } from "react";
import {
  NavigationContainer,
  useNavigationState,
} from "@react-navigation/native";
import Navbar from "@native/components/Navbar";
import CondoUnitDescriptionScreen from "./screens/CondoUnitDescriptionScreen";
import CondoUnitRegistrationScreen from "./screens/CondoUnitRegistrationScreen";

//enable to suppress warnings/errors in the Android Studio device simulator -> useful for demo recordings
// import { LogBox  } from 'react-native';
// LogBox.ignoreAllLogs(true);

const Stack = createNativeStackNavigator();

const App = () => {
  const [currentRouteName, setCurrentRouteName] = useState("");

  return (
    <NavigationContainer
      onStateChange={(state) => {
        const routeName = getActiveRouteName(state);
        setCurrentRouteName(routeName);
      }}
    >
      <Stack.Navigator
        initialRouteName="Home"
        screenOptions={{
          headerShown: false, // This line hides the header globally
        }}
      >
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Signup" component={SignupScreen} />
        <Stack.Screen
          name="PropertyManagement"
          component={PropertyManagementScreen}
        />
        <Stack.Screen name="UserProfile" component={UserProfileScreen} />
        <Stack.Screen
          name="Notifications"
          component={CondoUnitRegistrationScreen}
        />
        <Stack.Screen name="Report" component={ReportScreen} />
        <Stack.Screen name="Settings" component={SettingsScreen} />
        <Stack.Screen
          name="AddCondoProfileScreen"
          component={AddCondoProfileScreen}
        />
        <Stack.Screen
          name="CondoUnitDescriptionScreen"
          component={CondoUnitDescriptionScreen}
        />
        <Stack.Screen
          name="CondoPaymentFeeStatusAndHistoryScreen"
          component={CondoPaymentFeeStatusAndHistoryScreen}
        />
        <Stack.Screen
            name="FacilityBookingScreen"
            component={FacilityBookingScreen}
        />
      </Stack.Navigator>
      <Navbar />
    </NavigationContainer>
  );
};

// Finds the current active route name
function getActiveRouteName(state: any) {
  const route = state.routes[state.index];
  if (route.state) {
    // Dive into nested navigators
    return getActiveRouteName(route.state);
  }
  return route.name;
}

export default App;
