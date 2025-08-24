import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Button,
  ActivityIndicator,
  Alert,
  TouchableOpacity,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import apiClient from '../services/api';
import ProductModal from '../components/ProductModal';

const ProductManagementScreen = ({ route }) => {
  const { shopId, shopName } = route.params;
  const navigation = useNavigation();

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  const fetchProducts = useCallback(async () => {
    try {
      // We need to fetch the full shop details to get its product list
      const response = await apiClient.get(`/owner/shops/${shopId}`);
      setProducts(response.data.products || []);
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'Could not fetch products.');
    } finally {
      setLoading(false);
    }
  }, [shopId]);

  useEffect(() => {
    navigation.setOptions({ title: `Manage ${shopName}` }); // Set header title
    fetchProducts();
  }, [shopName, navigation, fetchProducts]);

  const handleOpenAddModal = () => {
    setSelectedProduct(null); // Ensure we are in "create" mode
    setModalVisible(true);
  };

  const handleOpenEditModal = (product) => {
    setSelectedProduct(product); // Set the product to edit
    setModalVisible(true);
  };
  
  const handleDeleteProduct = (productId) => {
    Alert.alert(
      "Delete Product",
      "Are you sure you want to delete this product?",
      [
        { text: "Cancel", style: "cancel" },
        { 
          text: "OK", 
          onPress: async () => {
            try {
              await apiClient.delete(`/products/${productId}`);
              await fetchProducts(); // Refresh the list after deleting
            } catch (error) {
              Alert.alert('Error', 'Failed to delete product.');
            }
          } 
        }
      ]
    );
  };

  // This function is passed to the modal and handles both creating and updating
  const handleFormSubmit = async (productData, productId) => {
    try {
      if (productId) {
        // Update existing product
        await apiClient.put(`/products/${productId}`, productData);
      } else {
        // Create new product
        await apiClient.post('/products', productData);
      }
      setModalVisible(false);
      await fetchProducts(); // Refresh the list
    } catch (error) {
      console.error("Form submission error:", error.response?.data);
      // Re-throw the error so the modal can display it
      throw error; 
    }
  };

  if (loading) {
    return <View style={styles.center}><ActivityIndicator size="large" /></View>;
  }

  const renderProductItem = ({ item }) => (
    <View style={styles.productItem}>
      <View style={styles.productInfo}>
        <Text style={styles.productName}>{item.name}</Text>
        <Text style={styles.productPrice}>₹{parseFloat(item.price).toFixed(2)}</Text>
      </View>
      <View style={styles.productActions}>
        <TouchableOpacity onPress={() => handleOpenEditModal(item)} style={styles.editButton}>
            <Text style={styles.buttonText}>Edit</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => handleDeleteProduct(item.id)} style={styles.deleteButton}>
            <Text style={styles.buttonText}>Delete</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <>
      <FlatList
        style={styles.container}
        data={products}
        renderItem={renderProductItem}
        keyExtractor={(item) => `product-${item.id}`}
        ListHeaderComponent={
          <Button title="+ Add New Product" onPress={handleOpenAddModal} />
        }
        ListEmptyComponent={
          <Text style={styles.emptyText}>No products found. Add one to get started!</Text>
        }
        contentContainerStyle={styles.listContent}
      />

      <ProductModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onSubmit={handleFormSubmit}
        product={selectedProduct}
        shopId={shopId}
      />
    </>
  );
};

const styles = StyleSheet.create({
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  listContent: { padding: 20 },
  productItem: {
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
    elevation: 2,
  },
  productInfo: { flex: 1 },
  productName: { fontSize: 16, fontWeight: '600' },
  productPrice: { fontSize: 14, color: 'green', marginTop: 4 },
  productActions: { flexDirection: 'row' },
  editButton: { padding: 8, backgroundColor: '#007bff', borderRadius: 5, marginRight: 8 },
  deleteButton: { padding: 8, backgroundColor: '#dc3545', borderRadius: 5 },
  buttonText: { color: 'white' },
  emptyText: { textAlign: 'center', marginTop: 50, fontSize: 16, color: 'gray' },
});

export default ProductManagementScreen;