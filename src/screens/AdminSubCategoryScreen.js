import React, { useState, useCallback, useMemo } from 'react'; // <-- 1. IMPORT useMemo
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
import { Picker } from '@react-native-picker/picker';
import apiClient from '../services/api';

const AdminSubCategoryScreen = () => {
  const [mainCategories, setMainCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [newSubCategoryName, setNewSubCategoryName] = useState('');
  const [selectedParentId, setSelectedParentId] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchCategories = useCallback(async () => {
    try {
      // Don't show the main spinner for re-fetches
      // setLoading(true); 
      const response = await apiClient.get('/admin/categories/all');
      setMainCategories(response.data);
    } catch (error) {
      Alert.alert('Error', 'Could not fetch categories.');
    } finally {
      setLoading(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
        setLoading(true);
        fetchCategories();
    }, [fetchCategories])
  );

  const handleCreate = async () => {
    if (!newSubCategoryName.trim() || !selectedParentId) {
      Alert.alert('Error', 'Please select a parent category and enter a name.');
      return;
    }
    setIsSubmitting(true);
    try {
      await apiClient.post('/admin/categories', { name: newSubCategoryName, parent_id: selectedParentId });
      setNewSubCategoryName('');
      setSelectedParentId(null);
      fetchCategories(); // Re-fetch to show the new data
    } catch (error) {
      Alert.alert('Error', 'Failed to create sub-category.');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const handleDelete = (categoryId) => {
    Alert.alert("Confirm Delete", "Are you sure?",
      [
        { text: "Cancel", style: "cancel" },
        { text: "Delete", style: "destructive",
          onPress: async () => {
            try {
              await apiClient.delete(`/admin/categories/${categoryId}`);
              fetchCategories(); // Re-fetch to show the change
            } catch (error) {
              Alert.alert('Error', 'Failed to delete sub-category.');
            }
          }
        }
      ]
    );
  };
  
  // 2. USE useMemo TO STABILIZE THE LIST DATA
  const subCategories = useMemo(() => 
    mainCategories.flatMap(mc => 
      mc.children ? mc.children.map(sc => ({...sc, parentName: mc.name })) : []
    ), 
    [mainCategories] // This will only re-calculate when `mainCategories` changes
  );


  if (loading) {
    return <View style={styles.center}><ActivityIndicator size="large" /></View>;
  }

  return (
    <View style={styles.container}>
      <View style={styles.formContainer}>
        <TextInput
          style={styles.input}
          placeholder="New Sub-Category Name"
          value={newSubCategoryName}
          onChangeText={setNewSubCategoryName}
        />
        <View style={styles.pickerContainer}>
          <Picker selectedValue={selectedParentId} onValueChange={(itemValue) => setSelectedParentId(itemValue)}>
            <Picker.Item label="-- Select Parent Category --" value={null} />
            {mainCategories.map(cat => <Picker.Item key={cat.id} label={cat.name} value={cat.id} />)}
          </Picker>
        </View>
        <Button title={isSubmitting ? "Creating..." : "Create"} onPress={handleCreate} disabled={isSubmitting} />
      </View>
      <FlatList
        data={subCategories}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.listItem}>
            <View>
                <Text style={styles.itemName}>{item.name}</Text>
                <Text style={styles.itemParent}>Parent: {item.parentName}</Text>
            </View>
            <TouchableOpacity onPress={() => handleDelete(item.id)} style={styles.deleteButton}>
              <Text style={styles.deleteButtonText}>Delete</Text>
            </TouchableOpacity>
          </View>
        )}
        ListEmptyComponent={<Text style={styles.emptyText}>No sub-categories found.</Text>}
      />
    </View>
  );
};

const styles = StyleSheet.create({
    center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    container: { flex: 1, backgroundColor: '#f5f5f5' },
    formContainer: { padding: 15, backgroundColor: 'white', borderBottomWidth: 1, borderBottomColor: '#eee' },
    input: { height: 44, borderColor: '#ccc', borderWidth: 1, borderRadius: 8, paddingHorizontal: 10, marginBottom: 10 },
    pickerContainer: { borderColor: '#ccc', borderWidth: 1, borderRadius: 8, marginBottom: 10, },
    listItem: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: 'white', padding: 15, borderBottomWidth: 1, borderBottomColor: '#eee' },
    itemName: { fontSize: 16, fontWeight: 'bold' },
    itemParent: { fontSize: 12, color: 'gray'},
    deleteButton: { padding: 8, backgroundColor: '#dc3545', borderRadius: 5 },
    deleteButtonText: { color: 'white' },
    emptyText: { textAlign: 'center', marginTop: 20 },
});

export default AdminSubCategoryScreen;