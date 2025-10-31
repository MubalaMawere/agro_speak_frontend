import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Linking, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

export default function ProfileDetails({ route, navigation }) {
  const { item, type } = route.params;
  const [isConnected, setIsConnected] = useState(false);

  // TODO: Replace with backend API call to get detailed profile information
  const getProfileDetails = () => {
    return {
      fullName: item.fullName,
      phone: item.phone,
      email: item.email,
      location: item.location,
      businessName: item.name,
      category: item.category,
      rating: 4.8,
      reviews: 127,
      established: '2015',
      description: type === 'buyers' 
        ? 'Leading agricultural buyer specializing in maize, soybeans, and groundnuts. We offer competitive prices and reliable payment terms.'
        : 'Premium supplier of high-quality seeds, fertilizers, and farming equipment. Trusted by farmers across Zambia.',
      services: type === 'buyers' 
        ? ['Maize Purchase', 'Soybean Trading', 'Groundnut Buying', 'Cash Payment']
        : ['Seed Supply', 'Fertilizer Distribution', 'Equipment Rental', 'Technical Support'],
    };
  };

  const profile = getProfileDetails();

  // TODO: Integrate with phone calling functionality
  const handleCall = () => {
    const phoneNumber = profile.phone.replace(/\s/g, '');
    Linking.openURL(`tel:${phoneNumber}`).catch(() => {
      Alert.alert('Error', 'Unable to make phone call');
    });
  };

  // TODO: Navigate to chat screen with backend integration
  const handleChat = () => {
    navigation.navigate('ChatScreen', { 
      contact: profile,
      type: type,
      // TODO: Pass conversation ID from backend
    });
  };

  // TODO: Replace with backend API call to connect/connect with user
  const handleConnect = () => {
    setIsConnected(true);
    Alert.alert(
      'Connected!', 
      `You are now connected with ${profile.fullName}`,
      [{ text: 'OK', style: 'default' }]
    );
  };

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        {/* Header with back button */}
        <View style={styles.header}>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="arrow-back" size={24} color="#2E7D32" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Profile Details</Text>
          <View style={styles.placeholder} />
        </View>

        {/* Profile Card */}
        <View style={styles.profileCard}>
          <View style={styles.avatarContainer}>
            <View style={styles.avatar}>
              <Ionicons 
                name={type === 'buyers' ? 'storefront' : 'cube'} 
                size={40} 
                color="#2E7D32" 
              />
            </View>
            <View style={styles.ratingContainer}>
              <Ionicons name="star" size={16} color="#FFD700" />
              <Text style={styles.rating}>{profile.rating}</Text>
              <Text style={styles.reviews}>({profile.reviews} reviews)</Text>
            </View>
          </View>

          <Text style={styles.businessName}>{profile.businessName}</Text>
          <Text style={styles.fullName}>{profile.fullName}</Text>
          <Text style={styles.location}>
            <Ionicons name="location" size={16} color="#6B7A6F" />
            {' '}{profile.location}
          </Text>
        </View>

        {/* Contact Information */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Contact Information</Text>
          
          <View style={styles.contactItem}>
            <Ionicons name="call" size={20} color="#2E7D32" />
            <Text style={styles.contactText}>{profile.phone}</Text>
          </View>
          
          <View style={styles.contactItem}>
            <Ionicons name="mail" size={20} color="#2E7D32" />
            <Text style={styles.contactText}>{profile.email}</Text>
          </View>
        </View>

        {/* Business Information */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Business Information</Text>
          
          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>Category</Text>
            <Text style={styles.infoValue}>{profile.category}</Text>
          </View>
          
          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>Established</Text>
            <Text style={styles.infoValue}>{profile.established}</Text>
          </View>
          
          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>Description</Text>
            <Text style={styles.infoValue}>{profile.description}</Text>
          </View>
        </View>

        {/* Services */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            {type === 'buyers' ? 'What We Buy' : 'Our Services'}
          </Text>
          {profile.services.map((service, index) => (
            <View key={index} style={styles.serviceItem}>
              <Ionicons name="checkmark-circle" size={16} color="#2E7D32" />
              <Text style={styles.serviceText}>{service}</Text>
            </View>
          ))}
        </View>

        {/* Action Buttons */}
        <View style={styles.actionButtons}>
          <TouchableOpacity style={styles.callButton} onPress={handleCall}>
            <Ionicons name="call" size={20} color="#FFFFFF" />
            <Text style={styles.buttonText}>Call</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.chatButton} onPress={handleChat}>
            <Ionicons name="chatbubble" size={20} color="#FFFFFF" />
            <Text style={styles.buttonText}>Chat</Text>
          </TouchableOpacity>
          
          {!isConnected && (
            <TouchableOpacity style={styles.connectButton} onPress={handleConnect}>
              <Ionicons name="person-add" size={20} color="#FFFFFF" />
              <Text style={styles.buttonText}>Connect</Text>
            </TouchableOpacity>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#FAF8F1' },
  container: { flex: 1, paddingHorizontal: 20 },
  
  // Header styling
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    marginBottom: 20,
  },
  backButton: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: '#F1F8E9',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#2E7D32',
  },
  placeholder: { width: 40 },
  
  // Profile card
  profileCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 24,
    marginBottom: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    elevation: 3,
  },
  avatarContainer: {
    alignItems: 'center',
    marginBottom: 16,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#F1F8E9',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rating: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2E7D32',
    marginLeft: 4,
  },
  reviews: {
    fontSize: 14,
    color: '#6B7A6F',
    marginLeft: 4,
  },
  businessName: {
    fontSize: 24,
    fontWeight: '800',
    color: '#2E2E2E',
    textAlign: 'center',
    marginBottom: 4,
  },
  fullName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#4E5D52',
    textAlign: 'center',
    marginBottom: 8,
  },
  location: {
    fontSize: 16,
    color: '#6B7A6F',
    textAlign: 'center',
  },
  
  // Section styling
  section: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#2E7D32',
    marginBottom: 16,
  },
  
  // Contact items
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  contactText: {
    fontSize: 16,
    color: '#2E2E2E',
    marginLeft: 12,
    fontWeight: '500',
  },
  
  // Info items
  infoItem: {
    marginBottom: 12,
  },
  infoLabel: {
    fontSize: 14,
    color: '#6B7A6F',
    fontWeight: '600',
    marginBottom: 4,
  },
  infoValue: {
    fontSize: 16,
    color: '#2E2E2E',
    lineHeight: 22,
  },
  
  // Services
  serviceItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  serviceText: {
    fontSize: 16,
    color: '#2E2E2E',
    marginLeft: 8,
  },
  
  // Action buttons
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 32,
    paddingHorizontal: 4,
  },
  callButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#2E7D32',
    paddingVertical: 14,
    paddingHorizontal: 12,
    borderRadius: 12,
    marginRight: 6,
  },
  chatButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#1B5E20',
    paddingVertical: 14,
    paddingHorizontal: 12,
    borderRadius: 12,
    marginHorizontal: 3,
  },
  connectButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#33691E',
    paddingVertical: 14,
    paddingHorizontal: 12,
    borderRadius: 12,
    marginLeft: 6,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
    marginLeft: 6,
    textAlign: 'center',
  },
});
