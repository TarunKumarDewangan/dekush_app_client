import React, { createContext, useState, useEffect, useContext } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import apiClient from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [isGuest, setIsGuest] = useState(false); // <-- 1. ADD GUEST STATE
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadToken = async () => {
      const storedToken = await AsyncStorage.getItem('userToken');
      if (storedToken) {
        apiClient.defaults.headers.common['Authorization'] = `Bearer ${storedToken}`;
        try {
          const { data } = await apiClient.get('/user');
          setUser(data);
          setToken(storedToken);
        } catch (error) {
          await AsyncStorage.removeItem('userToken');
        }
      }
      setLoading(false);
    };
    loadToken();
  }, []);

  const login = async (loginIdentifier, password) => {
    const response = await apiClient.post('/login', {
      login_identifier: loginIdentifier,
      password: password,
    });
    const { token: newToken, user: newUser } = response.data;
    await AsyncStorage.setItem('userToken', newToken);
    apiClient.defaults.headers.common['Authorization'] = `Bearer ${newToken}`;
    setToken(newToken);
    setUser(newUser);
    setIsGuest(false); // Make sure they are no longer a guest
  };

  // 2. NEW FUNCTION TO LOG IN AS GUEST
  const loginAsGuest = () => {
    setIsGuest(true);
  };

  const logout = async () => {
    // If they were logged in with a token, call the API
    if (token) {
        await apiClient.post('/logout').catch(console.error);
        await AsyncStorage.removeItem('userToken');
        delete apiClient.defaults.headers.common['Authorization'];
        setToken(null);
        setUser(null);
    }
    // Always reset the guest state on logout
    setIsGuest(false);
  };

  const value = {
    user,
    token,
    loading,
    isGuest, // <-- 3. EXPORT GUEST STATE
    login,
    logout,
    loginAsGuest, // <-- 4. EXPORT GUEST LOGIN FUNCTION
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};