import React, { useState } from 'react';
import { StyleSheet, Text, TextInput, Button, View, ActivityIndicator, TouchableOpacity } from 'react-native';
import { useAuth } from '../contexts/AuthContext';

// The navigation prop is passed automatically by React Navigation
const LoginScreen = ({ navigation }) => {
  const [loginIdentifier, setLoginIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { login } = useAuth();

  const handleLogin = async () => {
    setError('');
    setLoading(true);
    try {
      await login(loginIdentifier, password);
    } catch (err) {
      setError('Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Dekush Login</Text>
      <TextInput
        style={styles.input}
        placeholder="Phone Number or Email"
        value={loginIdentifier}
        onChangeText={setLoginIdentifier}
        autoCapitalize="none"
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />
      {error ? <Text style={styles.errorText}>{error}</Text> : null}
      {loading ? (
        <ActivityIndicator size="large" color="#007bff" />
      ) : (
        <Button title="Login" onPress={handleLogin} />
      )}

      {/* THIS IS THE NEW PART */}
      <TouchableOpacity style={styles.registerLink} onPress={() => navigation.navigate('Register')}>
        <Text style={styles.registerLinkText}>Don't have an account? Sign Up</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        padding: 20,
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 24,
    },
    input: {
        height: 48,
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 8,
        marginBottom: 16,
        paddingHorizontal: 10,
    },
    errorText: {
        color: 'red',
        textAlign: 'center',
        marginBottom: 10,
    },
    registerLink: {
        marginTop: 20,
    },
    registerLinkText: {
        textAlign: 'center',
        color: '#007bff',
        fontSize: 16,
    }
});

export default LoginScreen;