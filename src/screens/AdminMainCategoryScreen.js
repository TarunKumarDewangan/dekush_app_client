import React, { useState, useCallback } from 'react';
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  Button,
  TextInput,
  ActivityIndicator,
  Alert,
  TouchableOpacity,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import apiClient from '../services/api';

const AdminMainCategoryScreen = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // THIS IS THE CORRECTED useFocusEffect
  useFocusEffect(
    useCallback(() => {
      const fetchCategories = async () => {
        setLoading(true); // Always set loading when focusing
        try {
          const response = await apiClient.get('/admin/categories/all');
          setCategories(response.data);
        } catch (error) {
          Alert.alert('Error', 'Could not fetch categories.');
        } finally {
          setLoading(false);
        }
      };
      
      fetchCategories();
    }, [])
  );

  const handleCreate = async () => {
    if (!newCategoryName.trim()) {
      Alert.alert('Error', 'Category name cannot be empty.');
      return;
    }
    setIsSubmitting(true);
    try {
      await apiClient.post('/admin/categories', { name: newCategoryName, parent_id: null });
      setNewCategoryName('');
      // Manually refetch after creation
      const response = await apiClient.get('/admin/categories/all');
      setCategories(response.data);
    } catch (error) {
      Alert.alert('Error', 'Failed to create category.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = (categoryId) => {
    Alert.alert( "Confirm Delete", "Are you sure? This will delete all sub-categories.",
      [
        { text: "Cancel", style: "cancel" },
        { text: "Delete", style: "destructive",
          onPress: async () => {
            try {
              await apiClient.delete(`/admin/categories/${categoryId}`);
              // Manually refetch after deletion
              const response = await apiClient.get('/admin/categories/all');
              setCategories(response.data);
            } catch (error) {
              Alert.alert('Error', 'Failed to delete category.');
            }
          }
        }
      ]
    );
  };

  if (loading) {
    return <View style={styles.center}><ActivityIndicator size="large" /></View>;
  }

  return (
    <View style={styles.container}>
      <View style={styles.formContainer}>
        <TextInput
          style={styles.input}
          placeholder="New Main Category Name"
          value={newCategoryName}
          onChangeText={setNewCategoryName}
        />
        <Button title={isSubmitting ? "Creating..." : "Create"} onPress={handleCreate} disabled={isSubmitting} />
      </View>
      <FlatList
        data={categories}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.listItem}>
            <Text style={styles.itemName}>{item.name}</Text>
            <TouchableOpacity onPress={() => handleDelete(item.id)} style={styles.deleteButton}>
              <Text style={styles.deleteButtonText}>Delete</Text>
            </TouchableOpacity>
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
    center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    container: { flex: 1, backgroundColor: '#f5f5f5' },
    formContainer: { padding: 15, backgroundColor: 'white', borderBottomWidth: 1, borderBottomColor: '#eee' },
    input: { height: 44, borderColor: '#ccc', borderWidth: 1, borderRadius: 8, paddingHorizontal: 10, marginBottom: 10 },
    listItem: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: 'white', padding: 15, borderBottomWidth: 1, borderBottomColor: '#eee' },
    itemName: { fontSize: 16 },
    deleteButton: { padding: 8, backgroundColor: '#dc3545', borderRadius: 5 },
    deleteButtonText: { color: 'white' },
});

export default AdminMainCategoryScreen;