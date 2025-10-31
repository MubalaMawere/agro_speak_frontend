// Updated HomeScreen with cleaned code and properly positioned floating button
// Note: Only structure and relevant fixes applied — no commented blocks

import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StatusBar,
  Animated,
  Dimensions,
  RefreshControl,
  Alert,
  Keyboard,
  Image,
  Pressable,
  FlatList
} from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { styles, getResponsiveValue } from '../Styles';
import useLocation from '../../src/hooks/useLocation';
import useWeather from '../../src/hooks/useWeather';
import WeatherCropTrends from '../../src/components/weatherCropTrends';
import WeatherDisplay from '../../src/components/WeatherDisplay';
import farmer2 from '../../assets/farmer2.jpg';
import VoiceRecording from '../../src/components/voiceRecording';
import Message from '../../src/components/message';
import VoiceAssistantButton from '../../src/components/VoiceAssistantButton';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

const screenWidth = Dimensions.get('window').width;

const HomeScreen = ({ navigation }) => {
  const [isListening, setIsListening] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [activeButton, setActiveButton] = useState(null);
  const [selected, setSelected] = useState('weather');

  const {
    location,
    address,
    loading: locationLoading,
    error: locationError,
    getCurrentLocation,
    isLocationAvailable
  } = useLocation({ autoStart: true });

  const {
    weather,
    loading: weatherLoading,
    error: weatherError,
    current,
    hasCurrentWeather,
    refreshWeather,
    fetchCurrentWeather
  } = useWeather(location, true);

  const pulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    if (isListening) {
      const pulseAnimation = Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.1,
            duration: 1000,
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 1000,
            useNativeDriver: true,
          }),
        ])
      );
      pulseAnimation.start();
      return () => pulseAnimation.stop();
    }
  }, [isListening]);

  const data = [
    { id: 1, name: 'Matenda', picture: require('../../assets/tomatoPlant.jpg'), details: 'Tomatoes face early blight.' },
    { id: 2, name: 'Tuzilombo', picture: require('../../assets/bugsPlant.jpg'), details: 'Maize streak virus risk.' },
    { id: 3, name: 'Kuyeza', picture: require('../../assets/women.jpg'), details: 'Cassava mosaic disease.' },
    { id: 4, name: 'Zofufuza', picture: require('../../assets/searchPlant.jpg'), details: 'Groundnut leaf spot.' },
    { id: 5, name: 'Zamaphunzilo', picture: require('../../assets/learnPlant.jpg'), details: 'Sorghum anthracnose.' },
  ];

  const onRefresh = async () => {
    setRefreshing(true);
    try {
      await getCurrentLocation();
      if (location) await refreshWeather();
      setTimeout(() => setRefreshing(false), 1000);
    } catch (e) {
      setRefreshing(false);
    }
  };

  const buttons = [
    { id: 0, label: 'weather', icon: 'cloudy-outline', activeIcon: 'cloudy' },
    { id: 1, label: 'trending', icon: 'globe-outline', activeIcon: 'globe' },
    { id: 2, label: 'insite', icon: 'analytics-outline', activeIcon: 'analytics' },
    { id: 3, label: 'favourite', icon: 'heart-outline', activeIcon: 'heart' },
  ];

  const WeatherCard = () => (
    <TouchableOpacity
      style={[styles.infoCard, styles.weatherCard]}
      onPress={async () => {
        if (!isLocationAvailable) await getCurrentLocation();
        else if (!hasCurrentWeather && location) await fetchCurrentWeather(location);
      }}
    >
      <View style={styles.weatherCardContent}>
        <View style={styles.weatherIcon}>
          <Ionicons
            name={hasCurrentWeather ? 'sunny' : 'cloud-outline'}
            size={getResponsiveValue(36, 40, 44)}
            color={hasCurrentWeather ? '#FFD700' : '#95A5A6'}
          />
        </View>

        <Text style={styles.weatherTemp}>
          {hasCurrentWeather ? `${current.temperature}°C` : '--°C'}
        </Text>

        <Text style={styles.weatherCondition}>
          {hasCurrentWeather ? current.condition : 'Tap to get weather'}
        </Text>

        <Text style={styles.weatherLocation}>
          {address?.city || 'Unknown location'}
        </Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <GestureHandlerRootView>
      <SafeAreaProvider>
        <SafeAreaView style={styles.container}>
          <StatusBar backgroundColor="white" barStyle="dark-content" />

          <View style={styles.headerSection}>
            <View style={styles.headerTop}>
              <View style={styles.headerIcons}>
                <TouchableOpacity
                  style={styles.headerIconButton}
                  onPress={async () => {
                    try {
                      await getCurrentLocation();
                      Alert.alert('Location', address?.formattedAddress || 'Location updated');
                    } catch {}
                  }}
                >
                  <Ionicons
                    name={isLocationAvailable ? 'location' : 'location-outline'}
                    size={getResponsiveValue(22, 24, 26)}
                    color={isLocationAvailable ? '#4CAF50' : '#666'}
                  />
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.headerIconButton}
                  onPress={() => alert('Notifications coming soon')}
                >
                  <Ionicons name="notifications-outline" size={22} color="#666" />
                </TouchableOpacity>
              </View>
            </View>
          </View>

          <View style={styles.voiceSection}>
            <Image source={farmer2} style={styles.bg_image} />
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
              <VoiceRecording />
            </View>
            <View style={{ width: screenWidth, height: 60, position: 'absolute', bottom: 0 }}>
              <Text style={[styles.voiceStatusText, isListening && styles.voiceStatusActive]}> 
                {isListening ? "I'm listening..." : 'Voice Assistant Ready'}
              </Text>
            </View>
          </View>

          <Message />

          <View style={styles.siteNavContainer}>
            {buttons.map((btn) => {
              const isActive = activeButton === btn.id;
              return (
                <Pressable
                  key={btn.id}
                  onPress={() => {
                    setActiveButton(btn.id);
                    setSelected(btn.label);
                  }}
                  style={[styles.button, isActive && styles.activeButton]}
                >
                  <Ionicons
                    name={isActive ? btn.activeIcon : btn.icon}
                    size={24}
                    color={isActive ? '#2ab400ff' : '#a8a8a8ff'}
                  />
                  <Text style={{ color: isActive ? '#2ab400ff' : '#a8a8a8ff' }}>{btn.label}</Text>
                </Pressable>
              );
            })}
          </View>

          {selected === 'weather' && (
            <View style={styles.weatherContainer}>
              <View style={styles.weartherCardContainer}><WeatherCard /></View>
              <View style={styles.weatherActivity}>
                <FlatList
                  data={data}
                  renderItem={({ item }) => (
                    <WeatherCropTrends
                      name={item.name}
                      picture={item.picture}
                      details={item.details}
                    />
                  )}
                  keyExtractor={(item) => item.id}
                />
              </View>
            </View>
          )}

          {/* Floating Voice Button Fixed Position */}
          <View style={{ position: 'absolute', bottom: 20, right: 20, zIndex: 999 }}>
            <VoiceAssistantButton onPress={() => navigation.navigate('VoiceAssistant')} />
          </View>

        </SafeAreaView>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
};

export default HomeScreen;