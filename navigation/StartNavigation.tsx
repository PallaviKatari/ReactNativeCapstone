import { createStackNavigator } from '@react-navigation/stack'; 
import LoginScreen from '../screens/LoginScreen';
import DashboardScreen from '../screens/DashboardScreen';
const Stack = createStackNavigator();
export default function StartNavigation() {
    return (
        <Stack.Navigator><Stack.Screen name="LoginScreen" component={LoginScreen} />
        <Stack.Screen name="DashboardScreen" component={DashboardScreen} /></Stack.Navigator>);
}