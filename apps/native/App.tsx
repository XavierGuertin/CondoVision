import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { HomeScreen, LoginScreen, SignupScreen PropertyManagementScreen } from './screens/index'; // screens


const Stack = createNativeStackNavigator();

function App() {
    return (
        <NavigationContainer>
            <Stack.Navigator initialRouteName="Home"
                screenOptions={{
                    headerShown: false, // This line hides the header globally
                }}
            >
                <Stack.Screen name="Home" component={HomeScreen} />
                <Stack.Screen name="Login" component={LoginScreen} />
                <Stack.Screen name="Signup" component={SignupScreen} />
                <Stack.Screen name="PropertyManagement" component={PropertyManagementScreen} />
            </Stack.Navigator>
        </NavigationContainer>
    );
}

export default App;
