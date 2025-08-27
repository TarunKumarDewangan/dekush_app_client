import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  FlatList, // <-- We will use FlatList as the main component
  ActivityIndicator,
  Alert,
} from 'react-native';
import apiClient from '../services/api';

//const ASSET_URL = 'http://10.0.2.2:8000/storage/';
const ASSET_URL = 'https://dekush.in/storage/';

const ShopDetailScreen = ({ route }) => {
  const { shopId } = route.params;

  const [shop, setShop] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!shopId) return;

    const fetchShopDetails = async () => {
      try {
        const response = await apiClient.get(`/shops/${shopId}`);
        setShop(response.data);
      } catch (err) {
        console.error("Failed to fetch shop details:", err);
        setError('Could not load shop details.');
      } finally {
        setLoading(false);
      }
    };

    fetchShopDetails();
  }, [shopId]);

  if (loading) {
    return <View style={styles.center}><ActivityIndicator size="large" /></View>;
  }
  if (error) {
    return <View style={styles.center}><Text style={styles.errorText}>{error}</Text></View>;
  }
  if (!shop) {
    return <View style={styles.center}><Text>Shop not found.</Text></View>;
  }
  
  // This component will render all the shop info (image, name, etc.)
  const ShopHeader = () => {
    const mainImage = shop.images && shop.images.length > 0
      ? `${ASSET_URL}${shop.images[0].image_path}`
      : 'https://via.placeholder.com/400x200';
    
    return (
      <>
        <Image source={{ uri: mainImage }} style={styles.headerImage} />
        <View style={styles.content}>
          <Text style={styles.shopName}>{shop.name}</Text>
          <Text style={styles.shopDescription}>{shop.description}</Text>
          <View style={styles.infoBox}>
              <Text style={styles.infoText}>Address: {shop.address || 'Not provided'}</Text>
              <Text style={styles.infoText}>Contact: {shop.shop_incharge_phone || 'Not provided'}</Text>
          </View>
          <Text style={styles.sectionTitle}>Products</Text>
        </View>
      </>
    );
  };

  return (
    // THE FLATLIST IS NOW THE TOP-LEVEL COMPONENT FOR THE ENTIRE SCREEN
    <FlatList
      style={styles.container}
      data={shop.products}
      keyExtractor={(item) => `product-${item.id}`}
      ListHeaderComponent={ShopHeader} // <-- The shop info is now the header
      renderItem={({ item }) => (
        <View style={styles.productCard}>
          <Text style={styles.productName}>{item.name}</Text>
          <Text style={styles.productDescription}>{item.description}</Text>
          <Text style={styles.productPrice}>₹{parseFloat(item.price).toFixed(2)}</Text>
        </View>
      )}
      ListEmptyComponent={<Text style={styles.emptyText}>This shop has no products yet.</Text>}
    />
  );
};

const styles = StyleSheet.create({
    center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    container: { flex: 1, backgroundColor: '#fff' },
    headerImage: { width: '100%', height: 250 },
    content: { paddingHorizontal: 16, paddingTop: 16 },
    shopName: { fontSize: 26, fontWeight: 'bold', marginBottom: 8 },
    shopDescription: { fontSize: 16, color: '#666', marginBottom: 16 },
    infoBox: {
        backgroundColor: '#f5f5f5',
        padding: 12,
        borderRadius: 8,
        marginBottom: 20,
    },
    infoText: { fontSize: 14, color: '#333', marginBottom: 4},
    sectionTitle: { fontSize: 22, fontWeight: 'bold', marginBottom: 12, borderTopWidth: 1, borderTopColor: '#eee', paddingTop: 16 },
    productCard: {
        backgroundColor: '#f9f9f9',
        padding: 12,
        borderRadius: 8,
        marginBottom: 10,
        marginHorizontal: 16, // Add horizontal margin to match content padding
        borderWidth: 1,
        borderColor: '#eee',
    },
    productName: { fontSize: 16, fontWeight: '600' },
    productDescription: { fontSize: 14, color: 'gray', marginVertical: 4 },
    productPrice: { fontSize: 15, fontWeight: 'bold', color: '#007bff' },
    emptyText: { textAlign: 'center', color: '#888', marginTop: 20, paddingHorizontal: 16 },
    errorText: { color: 'red' },
});

export default ShopDetailScreen;