import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  Button,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
// CORRECT: Import SafeAreaView from the correct library
import { SafeAreaView } from 'react-native-safe-area-context'; 
import { useAuth } from '../contexts/AuthContext';

const AdminDashboardScreen = ({ navigation }) => {
  const { user, logout } = useAuth();

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Admin Panel</Text>
          <Button title="Logout" onPress={logout} color="#dc3545" />
        </View>
        <Text style={styles.welcomeText}>Welcome, {user.name}</Text>
        
        <View style={styles.menuContainer}>
          <Text style={styles.menuTitle}>Management Sections</Text>
          
          <TouchableOpacity 
            style={styles.menuItem}
            onPress={() => navigation.navigate('AdminUserManagement')}
          >
            <Text style={styles.menuItemText}>User Management</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.menuItem}
            onPress={() => navigation.navigate('AdminMainCategories')}
          >
            <Text style={styles.menuItemText}>Main Categories</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.menuItem}
            onPress={() => navigation.navigate('AdminSubCategories')}
          >
            <Text style={styles.menuItemText}>Sub-Categories</Text>
          </TouchableOpacity>
          
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#212529',
  },
  container: { 
    flex: 1, 
    backgroundColor: '#f5f5f5' 
  },
  header: { 
    padding: 16, 
    backgroundColor: '#212529', 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center' 
  },
  title: { 
    fontSize: 22, 
    fontWeight: 'bold', 
    color: 'white' 
  },
  welcomeText: { 
    fontSize: 18, 
    fontWeight: '500', 
    textAlign: 'center', 
    padding: 20,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#eee'
  },
  menuContainer: { 
    margin: 16 
  },
  menuTitle: { 
    fontSize: 14, 
    color: 'gray', 
    fontWeight: 'bold', 
    marginBottom: 10, 
    textTransform: 'uppercase' 
  },
  menuItem: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 8,
    marginBottom: 10,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
  },
  menuItemText: {
    fontSize: 18,
  },
});

export default AdminDashboardScreen;