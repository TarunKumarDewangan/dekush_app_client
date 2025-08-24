import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  Button,
  ScrollView,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { Picker } from '@react-native-picker/picker'; // A dropdown component
import apiClient from '../services/api';

const CreateShopScreen = ({ navigation }) => {
  // Form State
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [address, setAddress] = useState('');
  const [shopInchargePhone, setShopInchargePhone] = useState('');
  
  // Category State
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  
  // UI State
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  // Fetch all available shop categories when the screen loads
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await apiClient.get('/owner/categories/all');
        // We only care about sub-categories for shop creation
        const subCategories = response.data.flatMap(mainCat => mainCat.children || []);
        setCategories(subCategories);
      } catch (err) {
        console.error('Failed to fetch categories:', err);
        setError('Could not load categories. Please go back and try again.');
      } finally {
        setLoading(false);
      }
    };
    fetchCategories();
  }, []);
  
  const handleSubmit = async () => {
    if (!name || !address || !shopInchargePhone || !selectedCategory) {
      Alert.alert('Missing Information', 'Please fill out all required fields.');
      return;
    }
    setSubmitting(true);
    setError('');

    // We must use FormData for image uploads, so we'll prepare for that
    // even though we aren't uploading images in this step.
    const formData = new FormData();
    formData.append('name', name);
    formData.append('description', description);
    formData.append('address', address);
    formData.append('shop_incharge_phone', shopInchargePhone);
    formData.append('category_id', selectedCategory);
    // When we add images: formData.append('images[]', imageFile);

    try {
      await apiClient.post('/owner/shops', formData, {
        headers: {
          'Content-Type': 'multipart/form-data', // Important for file uploads
        },
      });
      // On success, go back to the Dashboard. The dashboard will automatically
      // refresh its list because of the 'focus' listener we added.
      navigation.goBack();
    } catch (err) {
      console.error('Failed to create shop:', err.response?.data);
      const message = err.response?.data?.message || 'An error occurred.';
      setError(message);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <View style={styles.center}><ActivityIndicator size="large" /></View>;
  }

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Create a New Shop</Text>
      {error ? <Text style={styles.errorText}>{error}</Text> : null}
      
      <Text style={styles.label}>Shop Name</Text>
      <TextInput style={styles.input} value={name} onChangeText={setName} placeholder="e.g., Ravi's Electronics" />

      <Text style={styles.label}>Shop Address</Text>
      <TextInput style={styles.input} value={address} onChangeText={setAddress} placeholder="Full address of your shop" />
      
      <Text style={styles.label}>Shop In-Charge Phone</Text>
      <TextInput style={styles.input} value={shopInchargePhone} onChangeText={setShopInchargePhone} keyboardType="phone-pad" maxLength={10} placeholder="10-digit mobile number" />

      <Text style={styles.label}>Description</Text>
      <TextInput style={styles.inputMulti} value={description} onChangeText={setDescription} multiline placeholder="Describe what your shop sells" />

      <Text style={styles.label}>Shop Category</Text>
      <View style={styles.pickerContainer}>
        <Picker
          selectedValue={selectedCategory}
          onValueChange={(itemValue) => setSelectedCategory(itemValue)}
        >
          <Picker.Item label="-- Select a Category --" value={null} />
          {categories.map(cat => (
            <Picker.Item key={cat.id} label={cat.name} value={cat.id} />
          ))}
        </Picker>
      </View>
      
      {submitting ? (
        <ActivityIndicator size="large" style={{marginTop: 20}} />
      ) : (
        <Button title="Create Shop" onPress={handleSubmit} />
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
    center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    container: { flex: 1, padding: 20, backgroundColor: 'white' },
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
    inputMulti: {
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 8,
        marginBottom: 16,
        paddingHorizontal: 10,
        fontSize: 16,
        height: 100,
        textAlignVertical: 'top'
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
    },
});

export default CreateShopScreen;