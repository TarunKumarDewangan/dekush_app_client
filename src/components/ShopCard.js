import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';

// The URL to your Laravel backend's public storage
const ASSET_URL = 'http://10.0.2.2:8000/storage/';

const ShopCard = ({ shop, onPress }) => {
  // Determine the image URL. Use a placeholder if the shop has no images.
  const imageUrl = shop.images && shop.images.length > 0
    ? `${ASSET_URL}${shop.images[0].image_path}`
    : 'https://via.placeholder.com/150'; // A generic placeholder

  return (
    <TouchableOpacity style={styles.card} onPress={onPress}>
      <Image source={{ uri: imageUrl }} style={styles.image} />
      <View style={styles.infoContainer}>
        <Text style={styles.name}>{shop.name}</Text>
        <Text style={styles.description} numberOfLines={2}>
          {shop.description || 'No description available.'}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: 'white',
    borderRadius: 8,
    overflow: 'hidden',
    marginBottom: 16,
    elevation: 3, // Shadow for Android
    shadowColor: '#000', // Shadow for iOS
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  image: {
    width: '100%',
    height: 150,
  },
  infoContainer: {
    padding: 12,
  },
  name: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  description: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
});

export default ShopCard;