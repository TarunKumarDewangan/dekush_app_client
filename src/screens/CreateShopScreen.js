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
  Image,
  TouchableOpacity,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { launchImageLibrary } from 'react-native-image-picker'; // <-- 1. IMPORT IMAGE PICKER
import apiClient from '../services/api';

const CreateShopScreen = ({ navigation }) => {
  // Form State
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [address, setAddress] = useState('');
  const [shopInchargePhone, setShopInchargePhone] = useState('');
  const [images, setImages] = useState([]); // <-- Will store image data for upload
  
  // Category State
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  
  // UI State
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await apiClient.get('/owner/categories/all');
        const subCategories = response.data.flatMap(mainCat => mainCat.children || []);
        setCategories(subCategories);
      } catch (err) {
        setError('Could not load categories. Please go back and try again.');
      } finally {
        setLoading(false);
      }
    };
    fetchCategories();
  }, []);

  // 2. FUNCTION TO HANDLE IMAGE SELECTION
  const handleChoosePhotos = () => {
    launchImageLibrary(
      {
        mediaType: 'photo',
        selectionLimit: 4 - images.length, // Allow selecting up to 4 images total
        quality: 0.8,
      },
      (response) => {
        if (response.didCancel) {
          console.log('User cancelled image picker');
        } else if (response.errorCode) {
          console.log('ImagePicker Error: ', response.errorMessage);
          Alert.alert('Error', 'Could not select images.');
        } else {
          setImages(prevImages => [...prevImages, ...response.assets]);
        }
      },
    );
  };
  
  // 3. UPDATED SUBMIT FUNCTION
  const handleSubmit = async () => {
    if (!name || !address || !shopInchargePhone || !selectedCategory) {
      Alert.alert('Missing Information', 'Please fill out all required fields.');
      return;
    }
    setSubmitting(true);
    setError('');

    const formData = new FormData();
    formData.append('name', name);
    formData.append('description', description);
    formData.append('address', address);
    formData.append('shop_incharge_phone', shopInchargePhone);
    formData.append('category_id', selectedCategory);

    // Append each selected image to the form data
    images.forEach((image, index) => {
      formData.append('images[]', {
        uri: image.uri,
        type: image.type,
        name: image.fileName,
      });
    });

    try {
      await apiClient.post('/owner/shops', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      navigation.goBack();
    } catch (err) {
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
      
      {/* ... other form inputs remain the same ... */}
      <Text style={styles.label}>Shop Name</Text>
      <TextInput style={styles.input} value={name} onChangeText={setName} />
      <Text style={styles.label}>Shop Address</Text>
      <TextInput style={styles.input} value={address} onChangeText={setAddress} />
      <Text style={styles.label}>Shop In-Charge Phone</Text>
      <TextInput style={styles.input} value={shopInchargePhone} onChangeText={setShopInchargePhone} keyboardType="phone-pad" maxLength={10} />
      <Text style={styles.label}>Description</Text>
      <TextInput style={styles.inputMulti} value={description} onChangeText={setDescription} multiline />
      <Text style={styles.label}>Shop Category</Text>
      <View style={styles.pickerContainer}>
        <Picker selectedValue={selectedCategory} onValueChange={setSelectedCategory}>
          <Picker.Item label="-- Select a Category --" value={null} />
          {categories.map(cat => <Picker.Item key={cat.id} label={cat.name} value={cat.id} />)}
        </Picker>
      </View>

      {/* 4. UI FOR IMAGE PICKING AND PREVIEWS */}
      <Text style={styles.label}>Shop Images (up to 4)</Text>
      <View style={styles.imagePreviewContainer}>
        {images.map((image, index) => (
          <Image key={index} source={{ uri: image.uri }} style={styles.previewImage} />
        ))}
      </View>
      {images.length < 4 && (
        <Button title="Select Images..." onPress={handleChoosePhotos} />
      )}
      
      <View style={styles.submitButtonContainer}>
      {submitting ? (
        <ActivityIndicator size="large" />
      ) : (
        <Button title="Create Shop" onPress={handleSubmit} disabled={submitting} />
      )}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
    center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    container: { flex: 1, padding: 20, backgroundColor: 'white' },
    title: { fontSize: 24, fontWeight: 'bold', textAlign: 'center', marginBottom: 20 },
    label: { fontSize: 16, fontWeight: '500', marginBottom: 5, color: '#333' },
    input: { height: 48, borderColor: '#ccc', borderWidth: 1, borderRadius: 8, marginBottom: 16, paddingHorizontal: 10, fontSize: 16, },
    inputMulti: { borderColor: '#ccc', borderWidth: 1, borderRadius: 8, marginBottom: 16, paddingHorizontal: 10, fontSize: 16, height: 100, textAlignVertical: 'top' },
    pickerContainer: { borderColor: '#ccc', borderWidth: 1, borderRadius: 8, marginBottom: 20, },
    errorText: { textAlign: 'center', color: 'red', marginBottom: 10, fontSize: 14, },
    // New styles for images
    imagePreviewContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginBottom: 10,
    },
    previewImage: {
        width: 80,
        height: 80,
        borderRadius: 8,
        margin: 5,
    },
    submitButtonContainer: {
        marginTop: 20,
        marginBottom: 40, // Add space at the bottom
    }
});

export default CreateShopScreen;