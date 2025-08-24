import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

// Navigators
import ShopOwnerNavigator from './ShopOwnerNavigator';
import AdminNavigator from './AdminNavigator';

// Screens
import HomeScreen from '../screens/HomeScreen';
import LoginScreen from '../screens/LoginScreen';
import RegisterScreen from '../screens/RegisterScreen';
import ShopDetailScreen from '../screens/ShopDetailScreen';
import SearchScreen from '../screens/SearchScreen'; // Import is correct

import { useAuth } from '../contexts/AuthContext';

const Stack = createNativeStackNavigator();

// THIS IS THE CORRECTED STACK FOR USERS
const UserAppStack = () => (
  <Stack.Navigator>
    <Stack.Screen 
      name="Home"
      component={HomeScreen}
      options={{ headerShown: false }} // Home screen has its own custom header
    />
    <Stack.Screen 
      name="ShopDetail"
      component={ShopDetailScreen}
      options={{ title: 'Shop Details' }}
    />
    {/* THIS SCREEN WAS MISSING FROM THE STACK */}
    <Stack.Screen 
      name="Search"
      component={SearchScreen}
      options={{ title: 'Search Results' }}
    />
  </Stack.Navigator>
);

// This is the stack for unauthenticated users
const AuthStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen 
      name="Login" 
      component={LoginScreen} 
    />
    <Stack.Screen 
      name="Register" 
      component={RegisterScreen} 
    />
  </Stack.Navigator>
);

// This component decides which navigator to show based on the user's role
const NavigatorSelector = () => {
  const { user } = useAuth();
  
  if (user) {
    switch (user.role) {
      case 'admin':
        return <AdminNavigator />;
      case 'shopowner':
        return <ShopOwnerNavigator />;
      default:
        // Regular users will get the UserAppStack
        return <UserAppStack />;
    }
  }
  
  // If no user is logged in, show the authentication screens
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