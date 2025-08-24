import React, { useState, useCallback } from 'react';
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  Button,
  TouchableOpacity,
  ActivityIndicator,
  Alert
} from 'react-native';
import apiClient from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import { useNavigation, useFocusEffect } from '@react-navigation/native';

const DashboardScreen = () => {
  const [shops, setShops] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { logout, user } = useAuth();
  const navigation = useNavigation();

  const fetchShops = async () => {
    try {
      setLoading(true);
      const response = await apiClient.get('/owner/shops');
      setShops(response.data);
    } catch (err) {
      setError('Could not load your shops. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchShops();
    }, [])
  );

  if (loading) {
    return <View style={styles.center}><ActivityIndicator size="large" color="#007bff" /></View>;
  }

  const renderShopItem = ({ item }) => (
    <View style={styles.shopItem}>
      <View style={styles.shopInfo}>
        <Text style={styles.shopName}>{item.name}</Text>
        <Text style={styles.shopDescription} numberOfLines={1}>{item.description || 'No description'}</Text>
      </View>
      <Button 
        title="Manage" 
        onPress={() => navigation.navigate('ProductManagement', { shopId: item.id, shopName: item.name })}
      />
    </View>
  );

  return (
    <FlatList
      style={styles.container}
      data={shops}
      renderItem={renderShopItem}
      keyExtractor={item => `shop-${item.id}`}
      ListHeaderComponent={
        <>
          <View style={styles.header}>
            <Text style={styles.welcomeText}>Welcome, {user.name}!</Text>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
                {/* THIS IS THE CORRECTED, SIMPLE NAVIGATION CALL */}
                <Button 
                    title="Browse App" 
                    onPress={() => navigation.navigate('Home')} 
                />
                <View style={{width: 10}} />
                <TouchableOpacity style={styles.logoutButton} onPress={logout}>
                    <Text style={styles.logoutButtonText}>LOGOUT</Text>
                </TouchableOpacity>
            </View>
          </View>
          <View style={styles.titleContainer}>
            <Text style={styles.title}>My Shops</Text>
            <Button
              title="+ Create New Shop"
              onPress={() => navigation.navigate('CreateShop')} 
            />
          </View>
          {error ? <Text style={styles.errorText}>{error}</Text> : null}
        </>
      }
      ListEmptyComponent={
        <View style={styles.emptyView}>
          <Text style={styles.emptyText}>You haven't created any shops yet.</Text>
        </View>
      }
      contentContainerStyle={{ flexGrow: 1 }}
    />
  );
};

const styles = StyleSheet.create({
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  header: {
    backgroundColor: 'white', padding: 16, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', borderBottomWidth: 1, borderBottomColor: '#eee'
  },
  welcomeText: { fontSize: 18 },
  logoutButton: { backgroundColor: '#dc3545', paddingVertical: 8, paddingHorizontal: 12, borderRadius: 5, },
  logoutButtonText: { color: 'white', fontWeight: 'bold', },
  titleContainer: { padding: 20, borderBottomWidth: 1, borderBottomColor: '#eee', marginBottom: 10, },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 16 },
  shopItem: {
    backgroundColor: 'white', padding: 16, borderRadius: 8, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginHorizontal: 20, marginBottom: 10, elevation: 2,
  },
  shopInfo: { flex: 1, marginRight: 10, },
  shopName: { fontSize: 18, fontWeight: '600' },
  shopDescription: { fontSize: 14, color: 'gray' },
  errorText: { textAlign: 'center', color: 'red', marginVertical: 10, },
  emptyView: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  emptyText: { fontSize: 16, color: 'gray', }
});

export default DashboardScreen;