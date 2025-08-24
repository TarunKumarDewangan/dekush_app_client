import React, { useState, useCallback } from 'react';
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  Button,
  ActivityIndicator,
  Alert,
  TouchableOpacity,
} from 'react-native';
import apiClient from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import { useFocusEffect } from '@react-navigation/native';
import UserModal from '../components/UserModal';

const AdminUserManagementScreen = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { user: adminUser } = useAuth();
  
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  // THIS IS THE CORRECTED useFocusEffect BLOCK
  useFocusEffect(
    useCallback(() => {
      // Define the async function inside the effect
      const fetchUsers = async () => {
        // Only show the full-screen loader on the very first load
        if (users.length === 0) {
            setLoading(true);
        }
        try {
          const response = await apiClient.get('/admin/users');
          setUsers(response.data.users);
        } catch (err) {
          console.error("Failed to fetch users:", err);
          setError('Could not load users.');
        } finally {
          setLoading(false);
        }
      };

      // Call the async function
      fetchUsers();
    }, []) // The dependency array is empty, which is correct here
  );
  
  const handleOpenCreateModal = () => {
    setSelectedUser(null);
    setModalVisible(true);
  };
  
  const handleOpenEditModal = (user) => {
    setSelectedUser(user);
    setModalVisible(true);
  };
  
  const handleFormSubmit = async (formData, userId) => {
    try {
      if (userId) {
        await apiClient.put(`/admin/users/${userId}`, formData);
      } else {
        await apiClient.post('/admin/users', formData);
      }
      setModalVisible(false);
      // Manually trigger a re-fetch after a successful submission
      const response = await apiClient.get('/admin/users');
      setUsers(response.data.users);
    } catch (error) {
        throw error;
    }
  };

  const handleDeleteUser = (userId) => {
    Alert.alert(
      "Confirm Deletion",
      "Are you sure you want to delete this user?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              await apiClient.delete(`/admin/users/${userId}`);
              // Manually trigger a re-fetch after a successful deletion
              const response = await apiClient.get('/admin/users');
              setUsers(response.data.users);
            } catch (error) {
              Alert.alert("Error", error.response?.data?.message || "Could not delete user.");
            }
          },
        },
      ]
    );
  };

  const renderUserItem = ({ item }) => (
    <View style={styles.userItem}>
      <View style={styles.userInfo}>
        <Text style={styles.userName}>{item.name} <Text style={styles.userRole}>({item.role})</Text></Text>
        <Text style={styles.userEmail}>{item.email || 'No Email'}</Text>
        <Text style={styles.userEmail}>Phone: {item.phone_number}</Text>
      </View>
      <View style={styles.userActions}>
        <Button title="Edit" onPress={() => handleOpenEditModal(item)} />
        {adminUser.id !== item.id && (
          <TouchableOpacity onPress={() => handleDeleteUser(item.id)} style={styles.deleteButton}>
              <Text style={styles.deleteButtonText}>Delete</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );

  if (loading) {
    return <View style={styles.center}><ActivityIndicator size="large" /></View>;
  }

  return (
    <>
      <FlatList
        style={styles.container}
        data={users}
        renderItem={renderUserItem}
        keyExtractor={(item) => `user-${item.id}`}
        ListHeaderComponent={
          <>
            <View style={styles.subHeader}>
                <Text style={styles.subTitle}>All Users</Text>
                <Button title="+ Create User" onPress={handleOpenCreateModal} />
            </View>
            {error ? <Text style={styles.errorText}>{error}</Text> : null}
          </>
        }
        ListEmptyComponent={<View style={styles.center}><Text>No users found.</Text></View>}
      />
      <UserModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onSubmit={handleFormSubmit}
        user={selectedUser}
      />
    </>
  );
};
const styles = StyleSheet.create({
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  subHeader: { padding: 16, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#fff', borderBottomWidth: 1, borderBottomColor: '#eee' },
  subTitle: { fontSize: 18, fontWeight: 'bold' },
  userItem: { backgroundColor: 'white', padding: 15, marginHorizontal: 16, marginTop: 10, borderRadius: 8, elevation: 2, flexDirection: 'row', alignItems: 'center' },
  userInfo: { flex: 1 },
  userName: { fontSize: 16, fontWeight: 'bold' },
  userRole: { fontSize: 14, color: 'gray', fontStyle: 'italic' },
  userEmail: { fontSize: 14, color: '#666' },
  userActions: { flexDirection: 'row', alignItems: 'center' },
  deleteButton: { marginLeft: 10, padding: 8, backgroundColor: '#ff4d4d', borderRadius: 5 },
  deleteButtonText: { color: 'white' },
  errorText: { color: 'red', textAlign: 'center', padding: 10 },
});

export default AdminUserManagementScreen;