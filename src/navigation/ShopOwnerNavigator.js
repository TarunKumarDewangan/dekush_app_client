import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import DashboardScreen from '../screens/DashboardScreen';
import ProductManagementScreen from '../screens/ProductManagementScreen';
import CreateShopScreen from '../screens/CreateShopScreen'; // <-- 1. IMPORT

const Stack = createNativeStackNavigator();

const ShopOwnerNavigator = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen 
        name="Dashboard" 
        component={DashboardScreen} 
        options={{ headerShown: false }}
      />
      <Stack.Screen 
        name="ProductManagement"
        component={ProductManagementScreen}
        options={({ route }) => ({ title: `Manage ${route.params.shopName}` })}
      />
      {/* 2. ADD THE NEW SCREEN */}
      <Stack.Screen 
        name="CreateShop"
        component={CreateShopScreen}
        options={{ title: 'Create New Shop' }} // Set the header title
      />
    </Stack.Navigator>
  );
};

export default ShopOwnerNavigator;