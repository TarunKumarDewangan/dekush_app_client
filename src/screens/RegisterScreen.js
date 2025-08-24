import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  Button,
  ScrollView,
  ActivityIndicator,
  Alert,
  TouchableOpacity, // <-- THIS WAS MISSING
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import apiClient from '../services/api';

const RegisterScreen = ({ navigation }) => {
  // Form State
  const [name, setName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirmation, setPasswordConfirmation] = useState('');
  const [role, setRole] = useState('user');

  // UI State
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async () => {
    if (password !== passwordConfirmation) {
      setError('Passwords do not match.');
      return;
    }
    setSubmitting(true);
    setError('');

    try {
      await apiClient.post('/register', {
        name,
        phone_number: phoneNumber,
        password,
        password_confirmation: passwordConfirmation,
        role,
      });

      Alert.alert(
        'Success',
        'Registration successful! You can now log in.',
        [{ text: 'OK', onPress: () => navigation.navigate('Login') }]
      );
    } catch (err) {
      if (err.response && err.response.data && err.response.data.errors) {
        const messages = Object.values(err.response.data.errors).flat();
        setError(messages.join('\n'));
      } else {
        setError(err.response?.data?.message || 'An unexpected error occurred.');
      }
      console.error('Registration failed:', err.response?.data);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Create an Account</Text>
      {error ? <Text style={styles.errorText}>{error}</Text> : null}
      
      <Text style={styles.label}>Full Name</Text>
      <TextInput style={styles.input} value={name} onChangeText={setName} placeholder="Enter your full name" />

      <Text style={styles.label}>Mobile Number</Text>
      <TextInput style={styles.input} value={phoneNumber} onChangeText={setPhoneNumber} keyboardType="phone-pad" maxLength={10} placeholder="10-digit mobile number" />

      <Text style={styles.label}>Password</Text>
      <TextInput style={styles.input} value={password} onChangeText={setPassword} secureTextEntry placeholder="Minimum 8 characters" />

      <Text style={styles.label}>Confirm Password</Text>
      <TextInput style={styles.input} value={passwordConfirmation} onChangeText={setPasswordConfirmation} secureTextEntry placeholder="Re-enter your password" />

      <Text style={styles.label}>I want to:</Text>
      <View style={styles.pickerContainer}>
        <Picker
          selectedValue={role}
          onValueChange={(itemValue) => setRole(itemValue)}
        >
          <Picker.Item label="Browse and Use the App" value="user" />
          <Picker.Item label="Open my own Shop" value="shopowner" />
        </Picker>
      </View>
      
      {submitting ? (
        <ActivityIndicator size="large" style={{marginTop: 20}} />
      ) : (
        <View style={styles.buttonContainer}>
            <Button title="Register" onPress={handleSubmit} />
        </View>
      )}

      <TouchableOpacity style={styles.loginLink} onPress={() => navigation.navigate('Login')}>
        <Text style={styles.loginLinkText}>Already have an account? Log In</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
    container: { 
        flexGrow: 1, 
        justifyContent: 'center',
        padding: 20, 
        backgroundColor: 'white' 
    },
    title: { fontSize: 24, fontWeight: 'bold', textAlign: 'center', marginBottom: 20 },
    label: { fontSize: 16, fontWeight: '500', marginBottom: 5, color: '#333' },
    input: {
        height: 48,
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 8,
        marginBottom: 16,
        paddingHorizontal: 10,
        fontSize: 16,
    },
    pickerContainer: {
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 8,
        marginBottom: 20,
    },
    errorText: {
      textAlign: 'center',
      color: 'red',
      marginBottom: 10,
      fontSize: 14,
    },
    buttonContainer: {
        marginTop: 10,
    },
    loginLink: {
        marginTop: 20,
    },
    loginLinkText: {
        textAlign: 'center',
        color: '#007bff',
        fontSize: 16,
    },
});

export default RegisterScreen;