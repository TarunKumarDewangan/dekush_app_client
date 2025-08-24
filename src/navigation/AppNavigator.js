import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

// Navigators
import ShopOwnerNavigator from './ShopOwnerNavigator';
import AdminNavigator from './AdminNavigator'; // <-- 1. IMPORT ADMIN NAVIGATOR

// Screens
import HomeScreen from '../screens/HomeScreen';
import LoginScreen from '../screens/LoginScreen';
import RegisterScreen from '../screens/RegisterScreen';
import ShopDetailScreen from '../screens/ShopDetailScreen';

import { useAuth } from '../contexts/AuthContext';

const Stack = createNativeStackNavigator();

// Stack for regular 'user' role
const UserAppStack = () => (
  <Stack.Navigator>
    <Stack.Screen 
      name="Home"
      component={HomeScreen}
      options={{ title: 'Dekush Home' }}
    />
    <Stack.Screen 
      name="ShopDetail"
      component={ShopDetailScreen}
      options={{ title: 'Shop Details' }}
    />
  </Stack.Navigator>
);

// Stack for unauthenticated users
const AuthStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="Login" component={LoginScreen} />
    <Stack.Screen name="Register" component={RegisterScreen} />
  </Stack.Navigator>
);

// This function component decides which navigator to show
const NavigatorSelector = () => {
  const { user } = useAuth();
  
  // Logic to select the correct navigator based on user role
  if (user) {
    switch (user.role) {
      case 'admin':
        return <AdminNavigator />;
      case 'shopowner':
        return <ShopOwnerNavigator />;
      default:
        return <UserAppStack />;
    }
  }
  
  // If no user, show the authentication screens
  return <AuthStack />;
};

const AppNavigator = () => {
  return (
    <NavigationContainer>
      <NavigatorSelector />
    </NavigationContainer>
  );
};

export default AppNavigator;