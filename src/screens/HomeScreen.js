import React, { useState, useEffect, useCallback } from 'react';
import {
  StyleSheet,
  Text,
  View,
  SectionList,
  ActivityIndicator,
  Button,
  TextInput,
} from 'react-native';
import { useAuth } from '../contexts/AuthContext';
import apiClient from '../services/api';
import ShopCard from '../components/ShopCard';

const HomeScreen = ({ navigation }) => {
  const { user, logout } = useAuth();
  
  const [sections, setSections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchData = useCallback(async () => {
    try {
      const [shopsResponse, hospitalsResponse, ambulancesResponse] = await Promise.all([
        apiClient.get('/shops'),
        apiClient.get('/hospitals'),
        apiClient.get('/ambulances')
      ]);
      
      const formattedSections = [
        { title: 'Featured Shops', data: shopsResponse.data.shops || [], renderItem: ({ item }) => <ShopCard shop={item} onPress={() => navigation.navigate('ShopDetail', { shopId: item.id })} /> },
        { title: 'Nearby Hospitals', data: hospitalsResponse.data || [], renderItem: ({ item }) => <View style={styles.listItem}><Text style={styles.itemName}>{item.name}</Text><Text style={styles.itemDetail}>{item.address}</Text></View> },
        { title: 'Ambulance Services', data: ambulancesResponse.data || [], renderItem: ({ item }) => <View style={styles.listItem}><Text style={styles.itemName}>{item.service_name} - {item.city}</Text><Text style={styles.itemDetail}>Phone: {item.phone_number}</Text></View> }
      ];
      setSections(formattedSections);
    } catch (err) {
      setError('Could not load data.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  if (loading) {
    return <View style={styles.center}><ActivityIndicator size="large" /></View>;
  }
  if (error) {
    return <View style={styles.center}><Text style={styles.errorText}>{error}</Text></View>;
  }

  const ListHeader = () => {
    const [query, setQuery] = useState('');
    const handleSearch = () => {
        if (query.trim()) {
            navigation.navigate('Search', { query });
        }
    };
    return (
      <>
        <View style={styles.header}>
          <Text style={styles.welcomeText}>Welcome, {user.name}!</Text>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            {/* THIS IS THE TEST BUTTON */}
            <Button 
                title="Crash App" 
                onPress={() => { throw new Error("Sentry Test Crash!"); }} 
                color="#c0392b" // A red color
            />
            <View style={{width: 10}}/> 
            <Button title="Logout" onPress={logout} />
          </View>
        </View>
        <View style={styles.searchContainer}>
            <TextInput
                style={styles.searchInput}
                placeholder="Search shops, products, etc..."
                value={query}
                onChangeText={setQuery}
                onSubmitEditing={handleSearch}
            />
            <Button title="Search" onPress={handleSearch} />
        </View>
      </>
    );
  };

  return (
    <SectionList
      style={styles.container}
      sections={sections}
      keyExtractor={(item, index) => item.id + '-' + index}
      renderItem={({ section }) => section.renderItem}
      renderSectionHeader={({ section: { title } }) => <Text style={styles.sectionTitle}>{title}</Text>}
      ListHeaderComponent={ListHeader}
      stickySectionHeadersEnabled={false}
      showsVerticalScrollIndicator={false}
      ListEmptyComponent={<View style={styles.center}><Text>No data available.</Text></View>}
    />
  );
};

const styles = StyleSheet.create({
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  container: { flex: 1, backgroundColor: '#f0f2f5' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 16, backgroundColor: 'white', borderBottomWidth: 1, borderBottomColor: '#ddd', },
  welcomeText: { fontSize: 18, fontWeight: '500' },
  searchContainer: { backgroundColor: 'white', padding: 10, flexDirection: 'row', alignItems: 'center', borderBottomWidth: 1, borderBottomColor: '#ddd', },
  searchInput: { flex: 1, height: 40, borderColor: '#ccc', borderWidth: 1, borderRadius: 8, paddingHorizontal: 10, marginRight: 10, backgroundColor: '#f9f9f9', },
  sectionTitle: { fontSize: 22, fontWeight: 'bold', backgroundColor: '#f0f2f5', paddingHorizontal: 16, paddingTop: 20, paddingBottom: 10, },
  listItem: { backgroundColor: 'white', padding: 16, marginHorizontal: 16, borderRadius: 8, marginBottom: 12, },
  itemName: { fontSize: 16, fontWeight: 'bold' },
  itemDetail: { fontSize: 14, color: '#555', marginTop: 4 },
  errorText: { color: 'red' }
});

export default HomeScreen;