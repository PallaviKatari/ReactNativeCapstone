// import { createStackNavigator } from '@react-navigation/stack'; 
// import LoginScreen from '../screens/LoginScreen';
// import DashboardScreen from '../screens/DashboardScreen';
// const Stack = createStackNavigator();
// export default function StartNavigation() {
//     return (
//         <Stack.Navigator><Stack.Screen name="LoginScreen" component={LoginScreen} />
//         <Stack.Screen name="DashboardScreen" component={DashboardScreen} /></Stack.Navigator>);
// }

// navigation/StartNavigation.tsx
// import React, { useContext, useEffect } from 'react';
// import { createStackNavigator } from '@react-navigation/stack';
// import { TouchableOpacity, Text } from 'react-native';
// import LoginScreen from '../screens/LoginScreen';
// import DashboardScreen from '../screens/DashboardScreen';
// import { UserContext } from '../context/UserContext';

// const Stack = createStackNavigator();

// export default function StartNavigation() {
//   const { user, setUser } = useContext(UserContext);

//   const logout = () => {
//     setUser(null); // clear user
//   };

//   return (
//     <Stack.Navigator>
//       <Stack.Screen
//         name="LoginScreen"
//         component={LoginScreen}
//         options={{ headerShown: false }}
//       />
//       <Stack.Screen
//         name="DashboardScreen"
//         component={DashboardScreen}
//         options={({ navigation }) => ({
//           title: 'Dashboard',
//           headerRight: () => (
//             <TouchableOpacity
//               onPress={logout}
//               style={{ marginRight: 16 }}
//             >
//               <Text style={{ color: '#0066c0', fontWeight: 'bold' }}>Logout</Text>
//             </TouchableOpacity>
//           ),
//         })}
//       />
//     </Stack.Navigator>
//   );
// }

import React, { useContext, useEffect } from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { TouchableOpacity, Text } from 'react-native';
import LoginScreen from '../screens/LoginScreen';
import DashboardScreen from '../screens/DashboardScreen';
import { UserContext } from '../context/UserContext';

const Stack = createStackNavigator();

export default function StartNavigation() {
  const { user, setUser } = useContext(UserContext);

  const logout = (navigation: any) => {
    setUser(null);
    navigation.replace('LoginScreen'); // redirect to login
  };

  return (
    <Stack.Navigator initialRouteName={user ? 'DashboardScreen' : 'LoginScreen'}>
      <Stack.Screen
        name="LoginScreen"
        component={LoginScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="DashboardScreen"
        component={DashboardScreen}
        options={({ navigation }) => ({
          title: 'Dashboard',
          headerRight: () => (
            <TouchableOpacity onPress={() => logout(navigation)} style={{ marginRight: 16 }}>
              <Text style={{ color: '#0066c0', fontWeight: 'bold' }}>Logout</Text>
            </TouchableOpacity>
          ),
        })}
      />
    </Stack.Navigator>
  );
}