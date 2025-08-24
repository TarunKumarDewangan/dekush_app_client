import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

// Navigators
import ShopOwnerNavigator from './ShopOwnerNavigator';
import AdminNavigator from './AdminNavigator';

// Screens
import WelcomeScreen from '../screens/WelcomeScreen';
import HomeScreen from '../screens/HomeScreen';
import LoginScreen from '../screens/LoginScreen';
import RegisterScreen from '../screens/RegisterScreen';
import ShopDetailScreen from '../screens/ShopDetailScreen';
import SearchScreen from '../screens/SearchScreen';

import { useAuth } from '../contexts/AuthContext';

const Stack = createNativeStackNavigator();

const UserAppStack = () => (
  <Stack.Navigator>
    <Stack.Screen name="Home" component={HomeScreen} options={{ headerShown: false }} />
    <Stack.Screen name="ShopDetail" component={ShopDetailScreen} options={{ title: 'Shop Details' }} />
    <Stack.Screen name="Search" component={SearchScreen} options={{ title: 'Search Results' }} />
  </Stack.Navigator>
);

const AuthStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="Welcome" component={WelcomeScreen} /> 
    <Stack.Screen name="Login" component={LoginScreen} /> 
    <Stack.Screen name="Register" component={RegisterScreen} /> 
  </Stack.Navigator>
);

const NavigatorSelector = () => {
  const { user, isGuest } = useAuth(); // <-- Get the isGuest state
  
  // If the user is a guest, show them the public app stack
  if (isGuest) {
    return <UserAppStack />;
  }
  
  // If the user is logged in, use the role-based logic
  if (user) {
    switch (user.role) {
      case 'admin': return <AdminNavigator />;
      case 'shopowner': return <ShopOwnerNavigator />;
      default: return <UserAppStack />;
    }
  }
  
  // If no user and not a guest, show the auth screens
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