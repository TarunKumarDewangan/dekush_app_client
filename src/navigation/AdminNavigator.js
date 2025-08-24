import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import AdminDashboardScreen from '../screens/AdminDashboardScreen';
import AdminUserManagementScreen from '../screens/AdminUserManagementScreen'; // <-- This import must be correct
import AdminMainCategoryScreen from '../screens/AdminMainCategoryScreen';
import AdminSubCategoryScreen from '../screens/AdminSubCategoryScreen';

const Stack = createNativeStackNavigator();

const AdminNavigator = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen 
        name="AdminDashboard" 
        component={AdminDashboardScreen} 
        options={{ headerShown: false }}
      />
      <Stack.Screen 
        name="AdminUserManagement"
        component={AdminUserManagementScreen}
        options={{ title: 'User Management' }}
      />
      <Stack.Screen 
        name="AdminMainCategories"
        component={AdminMainCategoryScreen}
        options={{ title: 'Manage Main Categories' }}
      />
      <Stack.Screen 
        name="AdminSubCategories"
        component={AdminSubCategoryScreen}
        options={{ title: 'Manage Sub-Categories' }}
      />
    </Stack.Navigator>
  );
};

export default AdminNavigator;