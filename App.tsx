
// DEMO 1. TO SEE HE WORKINK OF THE APPLICATION USE THE BELOW CODE INSTEAD OF THE ABOVE CODE
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { UserProvider } from './context/UserContext';
import RootNavigator from './navigation/StartNavigation';

export default function App() {
  return (
    <UserProvider>
      <NavigationContainer>
        <RootNavigator />
      </NavigationContainer>
    </UserProvider>
  );
}


// COMMENT THE ABOVE CODE AND UNCOMMENT THE BELOW CODE TO SEE THE DEMO OF NAVIGATION WITH PARAMS AND FLATLIST
//DEMO 2 - Navigation with Params and FlatList
// Example to useNavigation and useRoute - Single record

// import React from "react";
// import { View, Text, Button } from "react-native";
// import {
//   NavigationContainer,
//   RouteProp,
//   useNavigation,
//   useRoute,
// } from "@react-navigation/native";
// import {
//   createNativeStackNavigator,
//   NativeStackNavigationProp,
// } from "@react-navigation/native-stack";

// /**
//  * 1️⃣ Define Strongly Typed Routes
//  */
// type RootStackParamList = {
//   Home: undefined;
//   Details: {
//     userId: number;
//     userName: string;
//   };
// };

// const Stack = createNativeStackNavigator<RootStackParamList>();

// /**
//  * 2️⃣ Home Screen
//  */
// type HomeScreenNavigationProp = NativeStackNavigationProp<
//   RootStackParamList,
//   "Home"
// >;

// const HomeScreen = () => {
//   const navigation = useNavigation<HomeScreenNavigationProp>();

//   return (
//     <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
//       <Text style={{ fontSize: 20 }}>Home Screen</Text>

//       <Button
//         title="Go to Details"
//         onPress={() =>
//           navigation.navigate("Details", {
//             userId: 101,
//             userName: "John Doe",
//           })
//         }
//       />
//     </View>
//   );
// };

// /**
//  * 3️⃣ Details Screen
//  */
// type DetailsRouteProp = RouteProp<RootStackParamList, "Details">;

// const DetailsScreen = () => {
//   const route = useRoute<DetailsRouteProp>();
//   const navigation =
//     useNavigation<NativeStackNavigationProp<RootStackParamList>>();

//   const { userId, userName } = route.params;

//   return (
//     <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
//       <Text style={{ fontSize: 20 }}>Details Screen</Text>
//       <Text>User ID: {userId}</Text>
//       <Text>User Name: {userName}</Text>

//       <Button title="Go Back" onPress={() => navigation.goBack()} />
//     </View>
//   );
// };

// /**
//  * 4️⃣ App Navigator
//  */
// export default function App() {
//   return (
//     <NavigationContainer>
//       <Stack.Navigator>
//         <Stack.Screen name="Home" component={HomeScreen} />
//         <Stack.Screen name="Details" component={DetailsScreen} />
//       </Stack.Navigator>
//     </NavigationContainer>
//   );
// }

//COMMENT THE ABOVE CODE AND UNCOMMENT THE BELOW CODE TO SEE THE DEMO OF NAVIGATION WITH PARAMS AND FLATLIST
//DEMO 3 - Navigation with Params and FlatList
//Using FlatList
// import React from "react";
// import {
//   View,
//   Text,
//   Button,
//   FlatList,
//   TouchableOpacity,
// } from "react-native";
// import {
//   NavigationContainer,
//   RouteProp,
//   useNavigation,
//   useRoute,
// } from "@react-navigation/native";
// import {
//   createNativeStackNavigator,
//   NativeStackNavigationProp,
// } from "@react-navigation/native-stack";

// /**
//  * 1️⃣ Define Route Types
//  */
// type RootStackParamList = {
//   UserList: undefined;
//   UserDetails: { userId: number };
// };

// const Stack = createNativeStackNavigator<RootStackParamList>();

// /**
//  * 2️⃣ Mock Data (Strongly Typed)
//  */
// type User = {
//   id: number;
//   name: string;
//   email: string;
// };

// const USERS: User[] = [
//   { id: 1, name: "John Doe", email: "john@test.com" },
//   { id: 2, name: "Jane Smith", email: "jane@test.com" },
//   { id: 3, name: "Michael Lee", email: "michael@test.com" },
// ];

// /**
//  * 3️⃣ User List Screen
//  */
// type UserListNavProp = NativeStackNavigationProp<
//   RootStackParamList,
//   "UserList"
// >;

// const UserListScreen = () => {
//   const navigation = useNavigation<UserListNavProp>();

//   const renderItem = ({ item }: { item: User }) => (
//     <TouchableOpacity
//       style={{
//         padding: 15,
//         borderBottomWidth: 1,
//         borderColor: "#ddd",
//       }}
//       onPress={() =>
//         navigation.navigate("UserDetails", { userId: item.id })
//       }
//     >
//       <Text style={{ fontSize: 18 }}>{item.name}</Text>
//       <Text style={{ color: "gray" }}>{item.email}</Text>
//     </TouchableOpacity>
//   );

//   return (
//     <View style={{ flex: 1 }}>
//       <FlatList
//         data={USERS}
//         keyExtractor={(item) => item.id.toString()}
//         renderItem={renderItem}
//       />
//     </View>
//   );
// };

// /**
//  * 4️⃣ User Details Screen
//  */
// type UserDetailsRouteProp = RouteProp<
//   RootStackParamList, //UserList and UserDetails
//   "UserDetails"
// >;

// const UserDetailsScreen = () => {
//   const route = useRoute<UserDetailsRouteProp>();
//   const navigation =
//     useNavigation<NativeStackNavigationProp<RootStackParamList>>();

//   const { userId } = route.params; // Get userId from route params

//   // Find selected user by ID
//   const user = USERS.find((u) => u.id === userId); //Id=1

//   if (!user) {
//     return (
//       <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
//         <Text>User not found</Text>
//       </View>
//     );
//   }

//   return (
//     <View
//       style={{
//         flex: 1,
//         justifyContent: "center",
//         alignItems: "center",
//       }}
//     >
//       <Text style={{ fontSize: 22 }}>{user.name}</Text>
//       <Text style={{ marginVertical: 10 }}>{user.email}</Text>

//       <Button title="Go Back" onPress={() => navigation.goBack()} />
//     </View>
//   );
// };

// /**
//  * 5️⃣ App
//  */
// export default function App() {
//   return (
//     <NavigationContainer>
//       <Stack.Navigator>
//         <Stack.Screen name="UserList" component={UserListScreen} />
//         <Stack.Screen name="UserDetails" component={UserDetailsScreen} />
//       </Stack.Navigator>
//     </NavigationContainer>
//   );
// }