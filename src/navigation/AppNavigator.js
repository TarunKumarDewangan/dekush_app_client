import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

// Import Navigators
import ShopOwnerNavigator from './ShopOwnerNavigator';
import AdminNavigator from './AdminNavigator';

// Import ALL Screens that can be navigated to
import WelcomeScreen from '../screens/WelcomeScreen';
import LoginScreen from '../screens/LoginScreen';
import RegisterScreen from '../screens/RegisterScreen';
import HomeScreen from '../screens/HomeScreen';
import ShopDetailScreen from '../screens/ShopDetailScreen';
import SearchScreen from '../screens/SearchScreen';

import { useAuth } from '../contexts/AuthContext';
import { View, ActivityIndicator } from 'react-native';

const RootStack = createNativeStackNavigator();

const AppNavigator = () => {
  const { user, isGuest, loading } = useAuth();
  
  // Show a loading spinner while the auth state is being determined
  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <NavigationContainer>
      <RootStack.Navigator screenOptions={{ headerShown: false }}>
        {user ? (
          // USER IS LOGGED IN
          <>
            {user.role === 'admin' && (
              <RootStack.Screen name="AdminStack" component={AdminNavigator} />
            )}
            {user.role === 'shopowner' && (
              <RootStack.Screen name="ShopOwnerStack" component={ShopOwnerNavigator} />
            )}
            {user.role === 'user' && (
              <RootStack.Screen name="Home" component={HomeScreen} />
            )}
            {/* Make Home screen available to admins/owners */}
            {(user.role === 'admin' || user.role === 'shopowner') && (
                <RootStack.Screen name="Home" component={HomeScreen} />
            )}
          </>
        ) : isGuest ? (
          // USER IS A GUEST
          <RootStack.Screen name="Home" component={HomeScreen} />
        ) : (
          // NO USER, NOT A GUEST (AUTH FLOW)
          <>
            <RootStack.Screen name="Welcome" component={WelcomeScreen} />
            <RootStack.Screen name="Login" component={LoginScreen} />
            <RootStack.Screen name="Register" component={RegisterScreen} />
          </>
        )}
        
        {/* These screens are available globally, regardless of auth state */}
        <RootStack.Screen 
          name="ShopDetail" 
          component={ShopDetailScreen}
          options={{ headerShown: true, title: 'Shop Details' }}
        />
        <RootStack.Screen 
          name="Search" 
          component={SearchScreen}
          options={{ headerShown: true, title: 'Search Results' }}
        />
      </RootStack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;