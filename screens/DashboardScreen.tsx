// import React from 'react';
// import DashboardNavigation from '../navigation/DashboardNavigation';

// export default function DashboardScreen() {
//   return <DashboardNavigation />;
// }

import React, { useContext, useEffect } from 'react';
import DashboardNavigation from '../navigation/DashboardNavigation';
import { UserContext } from '../context/UserContext';

export default function DashboardScreen({ navigation }: any) {
  const { user } = useContext(UserContext);

  // Redirect to login if somehow user is null
  useEffect(() => {
    if (!user) navigation.replace('LoginScreen');
  }, [user]);

  return <DashboardNavigation />;
}
