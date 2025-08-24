import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator } from 'react-native';
import apiClient from '../services/api';
import ShopCard from '../components/ShopCard';

const SearchScreen = ({ route, navigation }) => {
  const { query } = route.params;
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const performSearch = async () => {
      setLoading(true);
      try {
        const response = await apiClient.get(`/search?q=${query}`);
        setResults(response.data);
      } catch (error) {
        console.error('Search failed:', error);
      } finally {
        setLoading(false);
      }
    };
    performSearch();
  }, [query]);

  if (loading) {
    return <View style={styles.center}><ActivityIndicator size="large" /></View>;
  }

  const allResults = [
    ...(results?.shops || []),
    ...(results?.products || []),
    ...(results?.hospitals || []),
    ...(results?.ambulances || []),
  ];

  if (allResults.length === 0) {
    return <View style={styles.center}><Text>No results found for "{query}"</Text></View>;
  }

  const renderResultItem = ({ item }) => {
    if (item.shop_incharge_phone) { // It's a shop
      return <ShopCard shop={item} onPress={() => navigation.navigate('ShopDetail', { shopId: item.id })} />;
    }
    if (item.price) { // It's a product
        return <View style={styles.listItem}><Text style={styles.itemName}>{item.name} (Product)</Text><Text style={styles.itemDetail}>From {item.shop.name}</Text></View>
    }
    // Add similar checks for hospitals and ambulances if needed
    return null;
  };

  return (
    <FlatList
      style={styles.container}
      data={allResults}
      renderItem={renderResultItem}
      keyExtractor={(item, index) => item.id.toString() + index}
      ListHeaderComponent={<Text style={styles.title}>Results for "{query}"</Text>}
    />
  );
};

const styles = StyleSheet.create({
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  container: { flex: 1, padding: 10, backgroundColor: '#f5f5f5' },
  title: { fontSize: 20, fontWeight: 'bold', margin: 10 },
  listItem: { backgroundColor: 'white', padding: 15, borderRadius: 8, marginBottom: 10 },
  itemName: { fontSize: 16, fontWeight: 'bold' },
  itemDetail: { fontSize: 14, color: 'gray' }
});

export default SearchScreen;