import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../contexts/AuthContext'; // <-- 1. Import useAuth

const WelcomeScreen = ({ navigation }) => {
  const { loginAsGuest } = useAuth(); // <-- 2. Get the new function from context

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Welcome to Dekush</Text>
        <Text style={styles.subtitle}>
          Your one-stop solution for local shops, services, and more.
        </Text>
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[styles.button, styles.loginButton]}
          onPress={() => navigation.navigate('Login')}
        >
          <Text style={styles.loginButtonText}>Login</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, styles.registerButton]}
          onPress={() => navigation.navigate('Register')}
        >
          <Text style={styles.registerButtonText}>Register</Text>
        </TouchableOpacity>

        {/* 3. ADD THE NEW GUEST BUTTON */}
        <TouchableOpacity
          style={styles.guestButton}
          onPress={loginAsGuest} // <-- Call the new function
        >
          <Text style={styles.guestButtonText}>See What's Inside</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'space-between',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#333',
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginTop: 10,
  },
  buttonContainer: {
    padding: 20,
  },
  button: {
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 10,
  },
  loginButton: {
    backgroundColor: '#007bff',
  },
  loginButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  registerButton: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#007bff',
  },
  registerButtonText: {
    color: '#007bff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  // NEW STYLES
  guestButton: {
    marginTop: 10,
    paddingVertical: 10,
  },
  guestButtonText: {
    color: '#6c757d', // A muted gray color
    textAlign: 'center',
    fontSize: 16,
  }
});

export default WelcomeScreen;