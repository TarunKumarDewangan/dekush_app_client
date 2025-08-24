import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  SectionList, // <-- IMPORTANT: We are now using SectionList
  ActivityIndicator,
  Button,
} from 'react-native';
import { useAuth } from '../contexts/AuthContext';
import apiClient from '../services/api';
import ShopCard from '../components/ShopCard';

const HomeScreen = ({ navigation }) => {
  const { user, logout } = useAuth();
  
  // We will now structure our data for the SectionList
  const [sections, setSections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [shopsResponse, hospitalsResponse, ambulancesResponse] = await Promise.all([
          apiClient.get('/shops'),
          apiClient.get('/hospitals'),
          apiClient.get('/ambulances')
        ]);
        
        // Create the data structure that SectionList needs
        const formattedSections = [
          {
            title: 'Featured Shops',
            data: shopsResponse.data.shops || [],
            renderItem: ({ item }) => ( // Custom render function for shops
              <ShopCard
                shop={item}
                onPress={() => navigation.navigate('ShopDetail', { shopId: item.id })}
              />
            ),
          },
          {
            title: 'Nearby Hospitals',
            data: hospitalsResponse.data || [],
            renderItem: ({ item }) => ( // Custom render function for hospitals
                <View style={styles.listItem}>
                    <Text style={styles.itemName}>{item.name}</Text>
                    <Text style={styles.itemDetail}>{item.address}</Text>
                </View>
            ),
          },
          {
            title: 'Ambulance Services',
            data: ambulancesResponse.data || [],
            renderItem: ({ item }) => ( // Custom render function for ambulances
                <View style={styles.listItem}>
                    <Text style={styles.itemName}>{item.service_name} - {item.city}</Text>
                    <Text style={styles.itemDetail}>Phone: {item.phone_number}</Text>
                </View>
            ),
          }
        ];
        
        setSections(formattedSections);

      } catch (err) {
        console.error("Failed to fetch home screen data:", err);
        setError('Could not load data. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.center}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  // A component to render the header (Welcome message and Logout button)
  const ListHeader = (
    <View style={styles.header}>
      <Text style={styles.welcomeText}>Welcome, {user.name}!</Text>
      <Button title="Logout" onPress={logout} color="#ff4d4d" />
    </View>
  );

  return (
    <SectionList
      style={styles.container}
      sections={sections}
      keyExtractor={(item, index) => item.id + '-' + index}
      // The `renderItem` is now defined inside our `sections` data array
      renderItem={({ section }) => section.renderItem}
      renderSectionHeader={({ section: { title } }) => (
        <Text style={styles.sectionTitle}>{title}</Text>
      )}
      ListHeaderComponent={ListHeader} // <-- Display the header at the very top
      stickySectionHeadersEnabled={false}
      showsVerticalScrollIndicator={false}
      ListEmptyComponent={
        <View style={styles.center}>
          <Text>No data available right now.</Text>
        </View>
      }
    />
  );
};

const styles = StyleSheet.create({
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  container: {
    flex: 1,
    backgroundColor: '#f0f2f5',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  welcomeText: {
    fontSize: 18,
    fontWeight: '500',
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    backgroundColor: '#f0f2f5',
    paddingHorizontal: 16,
    paddingTop: 20,
    paddingBottom: 10,
  },
  listItem: {
    backgroundColor: 'white',
    padding: 16,
    marginHorizontal: 16,
    borderRadius: 8,
    marginBottom: 12,
  },
  itemName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  itemDetail: {
    fontSize: 14,
    color: '#555',
    marginTop: 4,
  },
  errorText: {
    color: 'red',
  },
});

export default HomeScreen;