import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import AdminDashboardScreen from '../screens/AdminDashboardScreen';

const Stack = createNativeStackNavigator();

const AdminNavigator = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen 
        name="AdminDashboard" 
        component={AdminDashboardScreen} 
        options={{ headerShown: false }} // The screen has its own custom header
      />
      {/* We will add screens for editing/creating users here later */}
    </Stack.Navigator>
  );
};

export default AdminNavigator;