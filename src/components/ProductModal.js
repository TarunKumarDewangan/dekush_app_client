import React, { useState, useEffect } from 'react';
import {
  Modal,
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  ActivityIndicator,
  Alert
} from 'react-native';

const ProductModal = ({ visible, onClose, onSubmit, product, shopId }) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [loading, setLoading] = useState(false);

  const isEditing = !!product; // If a product object is passed, we are in edit mode

  // This effect pre-fills the form when the `product` prop changes (for editing)
  useEffect(() => {
    if (isEditing) {
      setName(product.name);
      setDescription(product.description || '');
      setPrice(product.price.toString());
    } else {
      // Reset form when opening for a new product
      setName('');
      setDescription('');
      setPrice('');
    }
  }, [product, visible]);

  const handleSubmit = () => {
    if (!name || !price || !shopId) {
      Alert.alert('Error', 'Product Name, Price, and Shop ID are required.');
      return;
    }

    setLoading(true);
    const productData = {
      name,
      description,
      price,
      shop_id: shopId,
    };
    
    // The onSubmit function is passed from the parent screen
    onSubmit(productData, product?.id)
      .catch((err) => {
        console.error("Submission failed:", err)
        Alert.alert('Error', 'Could not save the product. Please try again.');
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          <Text style={styles.modalTitle}>{isEditing ? 'Edit Product' : 'Add New Product'}</Text>

          <TextInput
            style={styles.input}
            placeholder="Product Name"
            value={name}
            onChangeText={setName}
          />
          <TextInput
            style={styles.input}
            placeholder="Description (Optional)"
            value={description}
            onChangeText={setDescription}
            multiline
          />
          <TextInput
            style={styles.input}
            placeholder="Price"
            value={price}
            onChangeText={setPrice}
            keyboardType="numeric"
          />

          {loading ? (
            <ActivityIndicator size="large" />
          ) : (
            <View style={styles.buttonContainer}>
              <Button title="Cancel" onPress={onClose} color="gray" />
              <Button title={isEditing ? 'Save Changes' : 'Add Product'} onPress={handleSubmit} />
            </View>
          )}
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalView: {
    width: '90%',
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 25,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalTitle: {
    marginBottom: 15,
    textAlign: 'center',
    fontSize: 20,
    fontWeight: 'bold',
  },
  input: {
    width: '100%',
    height: 44,
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 15,
    paddingHorizontal: 10,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
});

export default ProductModal;