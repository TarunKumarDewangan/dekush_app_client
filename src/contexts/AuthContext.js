import React, { createContext, useState, useEffect, useContext } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import apiClient from '../services/api';

// 1. Create the context
const AuthContext = createContext();

// 2. Create the provider component
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
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
          // Token is invalid, clear it
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
  };

  const logout = async () => {
    await apiClient.post('/logout').catch(console.error); // Call API but don't block on error
    await AsyncStorage.removeItem('userToken');
    delete apiClient.defaults.headers.common['Authorization'];
    setToken(null);
    setUser(null);
  };

  const value = {
    user,
    token,
    loading,
    login,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

// 3. Create a custom hook to use the context
export const useAuth = () => {
  return useContext(AuthContext);
};