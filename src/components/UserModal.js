import React, { useState, useEffect } from 'react';
import {
  Modal,
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  ActivityIndicator,
  Alert,
  ScrollView,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';

const UserModal = ({ visible, onClose, onSubmit, user }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone_number: '',
    role: 'user',
    password: '',
    password_confirmation: '',
  });
  const [loading, setLoading] = useState(false);
  
  const isEditing = !!user; // If a user object is passed, we are editing

  useEffect(() => {
    if (isEditing) {
      setFormData({
        name: user.name,
        email: user.email || '',
        phone_number: user.phone_number,
        role: user.role,
        password: '', // Password fields are always cleared for security
        password_confirmation: '',
      });
    } else {
      // Reset form when opening to create a new user
      setFormData({
        name: '', email: '', phone_number: '', role: 'user', password: '', password_confirmation: '',
      });
    }
  }, [user, visible]);

  const handleChange = (name, value) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = () => {
    // Basic validation
    if (!formData.name || !formData.phone_number) {
        Alert.alert('Error', 'Name and Phone Number are required.');
        return;
    }
    if (!isEditing && !formData.password) {
        Alert.alert('Error', 'Password is required for new users.');
        return;
    }
    if (formData.password && formData.password !== formData.password_confirmation) {
        Alert.alert('Error', 'Passwords do not match.');
        return;
    }

    setLoading(true);
    onSubmit(formData, user?.id)
      .catch((err) => {
        const message = err.response?.data?.message || 'Could not save the user.';
        Alert.alert('Error', message);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <Modal visible={visible} onRequestClose={onClose} animationType="slide">
        <ScrollView contentContainerStyle={styles.container}>
            <Text style={styles.title}>{isEditing ? 'Edit User' : 'Create New User'}</Text>
            
            <Text style={styles.label}>Name</Text>
            <TextInput style={styles.input} value={formData.name} onChangeText={val => handleChange('name', val)} />
            
            <Text style={styles.label}>Email</Text>
            <TextInput style={styles.input} value={formData.email} onChangeText={val => handleChange('email', val)} keyboardType="email-address" autoCapitalize="none" />

            <Text style={styles.label}>Phone Number</Text>
            <TextInput style={styles.input} value={formData.phone_number} onChangeText={val => handleChange('phone_number', val)} keyboardType="phone-pad" />
            
            <Text style={styles.label}>Role</Text>
            <View style={styles.pickerContainer}>
                <Picker selectedValue={formData.role} onValueChange={val => handleChange('role', val)}>
                    <Picker.Item label="User" value="user" />
                    <Picker.Item label="Shop Owner" value="shopowner" />
                    <Picker.Item label="Admin" value="admin" />
                </Picker>
            </View>

            <Text style={styles.label}>{isEditing ? 'New Password (Optional)' : 'Password'}</Text>
            <TextInput style={styles.input} secureTextEntry value={formData.password} onChangeText={val => handleChange('password', val)} />

            <Text style={styles.label}>Confirm Password</Text>
            <TextInput style={styles.input} secureTextEntry value={formData.password_confirmation} onChangeText={val => handleChange('password_confirmation', val)} />

            {loading ? (
            <ActivityIndicator size="large" />
            ) : (
            <View style={styles.buttonContainer}>
                <Button title="Cancel" onPress={onClose} color="gray" />
                <Button title={isEditing ? 'Save Changes' : 'Create User'} onPress={handleSubmit} />
            </View>
            )}
        </ScrollView>
    </Modal>
  );
};

const styles = StyleSheet.create({
    container: { padding: 20 },
    title: { fontSize: 22, fontWeight: 'bold', textAlign: 'center', marginBottom: 20 },
    label: { fontSize: 16, marginBottom: 5 },
    input: {
        height: 48, borderColor: '#ccc', borderWidth: 1, borderRadius: 8, marginBottom: 15, paddingHorizontal: 10,
    },
    pickerContainer: {
        borderColor: '#ccc', borderWidth: 1, borderRadius: 8, marginBottom: 15,
    },
    buttonContainer: {
        flexDirection: 'row', justifyContent: 'space-around', marginTop: 20,
    },
});

export default UserModal;