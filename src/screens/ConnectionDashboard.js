import React, { useMemo, useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, FlatList, Image, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

const TABS = [
  { key: 'buyers', label: 'Buyers', color: '#2E7D32', },
  { key: 'coops', label: 'Cooperatives', color: '#1B5E20', },
  { key: 'suppliers', label: 'Suppliers', color: '#33691E', },
];

// TODO: Replace with backend API calls
const SAMPLE_DATA = {
  buyers: [
    { 
      id: 'b1', 
      name: 'FarmLink Buyers Ltd', 
      location: 'Lusaka', 
      category: 'Buyer', 
      phone: '+260 97 123 4567',
      fullName: 'John Mwamba',
      email: 'john@farmlink.co.zm'
    },
    { 
      id: 'b2', 
      name: 'Harvest Hub Traders', 
      location: 'Ndola', 
      category: 'Buyer', 
      phone: '+260 97 234 5678',
      fullName: 'Sarah Chisanga',
      email: 'sarah@harvesthub.co.zm'
    },
    { 
      id: 'b3', 
      name: 'AgriMarket Direct', 
      location: 'Kitwe', 
      category: 'Buyer', 
      phone: '+260 97 345 6789',
      fullName: 'Peter Banda',
      email: 'peter@agrimarket.co.zm'
    },
    { 
      id: 'b4', 
      name: 'GrainGate Buyers', 
      location: 'Choma', 
      category: 'Buyer', 
      phone: '+260 97 456 7890',
      fullName: 'Mary Mwila',
      email: 'mary@graingate.co.zm'
    },
  ],
  coops: [
    { 
      id: 'c1', 
      name: 'GreenGrow Cooperative', 
      location: 'Lusaka', 
      category: 'Cooperative',
      members: 45,
      established: '2018'
    },
    { 
      id: 'c2', 
      name: 'RiverValley Co-op', 
      location: 'Ndola', 
      category: 'Cooperative',
      members: 32,
      established: '2019'
    },
    { 
      id: 'c3', 
      name: 'SunHarvest Collective', 
      location: 'Kitwe', 
      category: 'Cooperative',
      members: 28,
      established: '2020'
    },
    { 
      id: 'c4', 
      name: 'MaizeMates Co-op', 
      location: 'Chongwe', 
      category: 'Cooperative',
      members: 38,
      established: '2017'
    },
  ],
  suppliers: [
    { 
      id: 's1', 
      name: 'AgroPlus Suppliers', 
      location: 'Ndola', 
      category: 'Supplier',
      phone: '+260 97 567 8901',
      fullName: 'David Mwansa',
      email: 'david@agroplus.co.zm'
    },
    { 
      id: 's2', 
      name: 'SeedSavvy Distributors', 
      location: 'Lusaka', 
      category: 'Supplier',
      phone: '+260 97 678 9012',
      fullName: 'Grace Tembo',
      email: 'grace@seedsavvy.co.zm'
    },
    { 
      id: 's3', 
      name: 'FertiPro Agro', 
      location: 'Kitwe', 
      category: 'Supplier',
      phone: '+260 97 789 0123',
      fullName: 'James Phiri',
      email: 'james@fertipro.co.zm'
    },
    { 
      id: 's4', 
      name: 'FarmTools Depot', 
      location: 'Chipata', 
      category: 'Supplier',
      phone: '+260 97 890 1234',
      fullName: 'Alice Ngoma',
      email: 'alice@farmtools.co.zm'
    },
  ],
};

export default function ConnectionsDashboard({ navigation }) {
  const [activeTab, setActiveTab] = useState('buyers');
  const [query, setQuery] = useState('');
  const [showFilter, setShowFilter] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState('All');

  // Get unique locations for filter
  const locations = useMemo(() => {
    const allLocations = [];
    Object.values(SAMPLE_DATA).forEach(category => {
      category.forEach(item => {
        if (!allLocations.includes(item.location)) {
          allLocations.push(item.location);
        }
      });
    });
    return ['All', ...allLocations.sort()];
  }, []);

  const data = useMemo(() => {
    let list = SAMPLE_DATA[activeTab] || [];
    
    // Apply location filter
    if (selectedLocation !== 'All') {
      list = list.filter(item => item.location === selectedLocation);
    }
    
    // Apply search filter
    if (query.trim()) {
      const q = query.toLowerCase();
      list = list.filter(item =>
        item.name.toLowerCase().includes(q) ||
        item.location.toLowerCase().includes(q) ||
        item.category.toLowerCase().includes(q)
      );
    }
    
    return list;
  }, [activeTab, query, selectedLocation]);

  const counts = useMemo(() => ({
    buyers: SAMPLE_DATA.buyers.length,
    coops: SAMPLE_DATA.coops.length,
    suppliers: SAMPLE_DATA.suppliers.length,
  }), []);

  // TODO: Integrate with voice assistant backend API
  const onMicPress = () => {
    // Navigate to real-time voice transcription screen
    if (navigation && navigation.navigate) {
      navigation.navigate('VoiceTranscription'); // Navigate to voice transcription screen
    }
  };

  // TODO: Implement filter functionality with backend
  const onFilterPress = () => {
    setShowFilter(!showFilter);
  };

  const onLocationSelect = (location) => {
    setSelectedLocation(location);
    setShowFilter(false);
  };

  // TODO: Replace with backend API call to get buyer/supplier details
  const onConnectPress = (item) => {
    if (activeTab === 'buyers' || activeTab === 'suppliers') {
      navigation.navigate('ProfileDetails', { 
        item, 
        type: activeTab,
        // TODO: Pass additional data from backend
      });
    }
  };

  // TODO: Replace with backend API call to join cooperative
  const onJoinPress = (item) => {
    Alert.alert(
      'Success!', 
      `You have joined ${item.name}`,
      [{ text: 'OK', style: 'default' }]
    );
  };

  const renderCard = ({ item }) => (
    <View style={styles.card}>
      <View style={styles.avatar}>
        <Ionicons 
          name={activeTab === 'buyers' ? 'storefront' : activeTab === 'coops' ? 'people' : 'cube'} 
          size={24} 
          color={activeTab === 'buyers' ? '#2E7D32' : activeTab === 'coops' ? '#1B5E20' : '#33691E'} 
        />
      </View>
      <View style={styles.cardContent}>
        <Text style={styles.cardTitle}>{item.name}</Text>
        <Text style={styles.cardSubtitle}>{item.location}</Text>
        <View style={styles.badgeRow}>
          <View style={[styles.badge, badgeStyleFor(activeTab)]}>
            <Text style={styles.badgeText}>{item.category}</Text>
          </View>
        </View>
      </View>
      <TouchableOpacity 
        style={styles.cardButton}
        onPress={() => activeTab === 'coops' ? onJoinPress(item) : onConnectPress(item)}
      >
        <Text style={styles.cardButtonText}>
          {activeTab === 'buyers' ? 'Connect' : activeTab === 'coops' ? 'Join' : 'Connect'}
        </Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.container}>
        <View style={styles.header}>
          <View style={styles.titleContainer}>
            <Text style={styles.title}>Connections Dashboard</Text>
            <Text style={styles.subtitle}>Find and connect with trusted partners</Text>
          </View>
          {/* TODO: Uncomment when counts are needed
          <View style={styles.countsContainer}>
            <View style={styles.countItem}>
              <Ionicons name="storefront" size={16} color="#2E7D32" />
              <Text style={styles.countText}>{counts.buyers} Buyers</Text>
            </View>
            <View style={styles.countItem}>
              <Ionicons name="people" size={16} color="#1B5E20" />
              <Text style={styles.countText}>{counts.coops} Cooperatives</Text>
            </View>
            <View style={styles.countItem}>
              <Ionicons name="cube" size={16} color="#33691E" />
              <Text style={styles.countText}>{counts.suppliers} Suppliers</Text>
            </View>
          </View>
          */}
        </View>

        <View style={styles.tabsRow}>
          {TABS.map(t => (
            <TouchableOpacity key={t.key} style={styles.tabItem} onPress={() => setActiveTab(t.key)}>
              <View style={styles.tabContent}>
                <Ionicons 
                  name={t.key === 'buyers' ? 'storefront' : t.key === 'coops' ? 'people' : 'cube'} 
                  size={18} 
                  color={activeTab === t.key ? t.color : '#6B7A6F'} 
                />
                <Text style={[styles.tabLabel, activeTab === t.key && { color: t.color }]}>
                  {t.label}
                </Text>
              </View>
              <View style={[styles.tabUnderline, activeTab === t.key && { backgroundColor: t.color }]} />
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.searchRow}>
          <View style={styles.searchBox}>
            <Ionicons name="search" size={20} color="#6B7A6F" style={styles.searchIcon} />
            <TextInput
              value={query}
              onChangeText={setQuery}
              placeholder="Search connections..."
              placeholderTextColor="#7A7A7A"
              style={styles.searchInput}
            />
            <TouchableOpacity onPress={onMicPress} style={styles.micBtn}>
              <Ionicons name="mic" size={20} color="#2E7D32" />
            </TouchableOpacity>
          </View>
          <TouchableOpacity onPress={onFilterPress} style={styles.filterButton}>
            <Ionicons name="options" size={20} color="#2E7D32" />
          </TouchableOpacity>
        </View>

        {/* Location Filter Dropdown */}
        {showFilter && (
          <View style={styles.filterDropdown}>
            <Text style={styles.filterTitle}>Filter by Location</Text>
            <View style={styles.locationList}>
              {locations.map((location, index) => (
                <TouchableOpacity
                  key={index}
                  style={[
                    styles.locationItem,
                    selectedLocation === location && styles.selectedLocationItem
                  ]}
                  onPress={() => onLocationSelect(location)}
                >
                  <Ionicons 
                    name="location" 
                    size={16} 
                    color={selectedLocation === location ? '#FFFFFF' : '#2E7D32'} 
                  />
                  <Text style={[
                    styles.locationText,
                    selectedLocation === location && styles.selectedLocationText
                  ]}>
                    {location}
                  </Text>
                  {selectedLocation === location && (
                    <Ionicons name="checkmark" size={16} color="#FFFFFF" />
                  )}
                </TouchableOpacity>
              ))}
            </View>
          </View>
        )}

        <FlatList
          data={data}
          keyExtractor={(item) => item.id}
          renderItem={renderCard}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        />

        <TouchableOpacity style={styles.fab} onPress={onMicPress}>
          <Ionicons name="mic" size={24} color="#FFFFFF" />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

function badgeStyleFor(tabKey) {
  switch (tabKey) {
    case 'buyers':
      return { backgroundColor: '#E8F5E9', borderColor: '#2E7D32' };
    case 'coops':
      return { backgroundColor: '#E9F7EF', borderColor: '#1B5E20' };
    case 'suppliers':
      return { backgroundColor: '#EDF7E6', borderColor: '#33691E' };
    default:
      return { backgroundColor: '#F1F8E9', borderColor: '#2E7D32' };
  }
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#FAF8F1' },
  container: { flex: 1, paddingHorizontal: 20, paddingBottom: 20 },
  
  // Compact header styles
  header: { 
    paddingTop: 12, 
    paddingBottom: 16,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    marginBottom: 12,
    paddingHorizontal: 16,
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  titleContainer: { alignItems: 'center', marginBottom: 12 },
  title: { fontSize: 22, fontWeight: '700', color: '#2E7D32', textAlign: 'center' },
  subtitle: { marginTop: 4, fontSize: 14, color: '#4E5D52', textAlign: 'center' },
  
  // Improved counts display
  countsContainer: { 
    flexDirection: 'row', 
    justifyContent: 'space-around',
    backgroundColor: '#F8F9FA',
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 16,
  },
  countItem: { 
    flexDirection: 'row', 
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 4,
  },
  countText: { fontSize: 13, color: '#2E7D32', fontWeight: '600', marginLeft: 6 },

  // Enhanced tab styling
  tabsRow: { 
    flexDirection: 'row', 
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    paddingHorizontal: 6,
    paddingVertical: 6,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  tabItem: { flex: 1, alignItems: 'center' },
  tabContent: { alignItems: 'center', paddingVertical: 8 },
  tabLabel: { fontSize: 14, color: '#6B7A6F', fontWeight: '600', marginTop: 4 },
  tabUnderline: { height: 3, width: '80%', borderRadius: 2, marginTop: 6, backgroundColor: 'transparent' },

  // Enhanced search bar with filter
  searchRow: { 
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  searchBox: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: '#E5E2D6',
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 },
    elevation: 2,
    marginRight: 12,
  },
  searchIcon: { marginRight: 8 },
  searchInput: { flex: 1, height: 48, fontSize: 16, color: '#324039' },
  micBtn: { padding: 10, marginLeft: 4 },
  filterButton: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F1F8E9',
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E2D6',
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 },
    elevation: 2,
  },

  // Filter dropdown styles
  filterDropdown: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    marginBottom: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    elevation: 3,
  },
  filterTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#2E7D32',
    marginBottom: 12,
  },
  locationList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  locationItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8F9FA',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#E5E2D6',
    marginRight: 8,
    marginBottom: 8,
  },
  selectedLocationItem: {
    backgroundColor: '#2E7D32',
    borderColor: '#2E7D32',
  },
  locationText: {
    fontSize: 14,
    color: '#2E7D32',
    fontWeight: '600',
    marginLeft: 6,
  },
  selectedLocationText: {
    color: '#FFFFFF',
  },

  // Enhanced card styling
  listContent: { paddingTop: 8, paddingBottom: 100 },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 14,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E5E2D6',
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 },
    elevation: 2,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#F1F8E9',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  cardContent: { flex: 1 },
  cardTitle: { fontSize: 16, fontWeight: '700', color: '#2E2E2E', marginBottom: 2 },
  cardSubtitle: { fontSize: 13, color: '#6B7A6F', marginBottom: 6 },
  badgeRow: { flexDirection: 'row', marginTop: 2 },
  badge: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 12, borderWidth: 1 },
  badgeText: { fontSize: 11, color: '#2E7D32', fontWeight: '600' },
  cardButton: {
    backgroundColor: '#2E7D32',
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 10,
    minWidth: 70,
    alignItems: 'center',
  },
  cardButtonText: { color: '#FFFFFF', fontSize: 13, fontWeight: '700' },

  // Enhanced floating action button
  fab: {
    position: 'absolute',
    bottom: 24,
    alignSelf: 'center',
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#2E7D32',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
    elevation: 4,
  },
});


