// import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
// import ProfileScreen from '../screens/ProfileScreen';
// import ApproveLoans from '../screens/ApproveLoans';
// const Tab = createBottomTabNavigator();
// export default function DashboardNavigation() {
//     return (
//         <Tab.Navigator><Tab.Screen name="Profile" component={ProfileScreen} />
//             <Tab.Screen name="ApproveLoans" component={ApproveLoans} /></Tab.Navigator>);
// }

import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import ProfileScreen from '../screens/ProfileScreen';
import ApproveLoans from '../screens/ApproveLoans';

const Tab = createBottomTabNavigator();

export default function DashboardNavigation() {
  return (
    <Tab.Navigator>
      <Tab.Screen name="Profile" component={ProfileScreen} />
      <Tab.Screen name="Loans" component={ApproveLoans} />
    </Tab.Navigator>
  );
}