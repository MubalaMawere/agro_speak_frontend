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
    Keyboard,Image,Button,
} from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';

import { Ionicons } from '@expo/vector-icons';
import {styles,getResponsiveValue} from "./Styles";
import ProfileScreen from '../Profile';
import useLocation from '../../hooks/useLocation';

import  useWeather  from '../../hooks/useWeather';
import WeatherDisplay from '../../components/WeatherDisplay';
import farmer2 from '../../../assets/farmer2.jpg';
import VoiceRecording from '../../components/voiceRecording';

const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;

const HomeScreen = ({ navigation }) => {
  
    const [isListening, setIsListening] = useState(false);
    const [refreshing, setRefreshing] = useState(false);
    const [activeTab, setActiveTab] = useState('Home');
    const [profileVisible, setProfileVisible] = useState(false);
    const [weatherModalVisible, setWeatherModalVisible] = useState(false);
     const[recordingOn,setRecordingOn]=useState(false);
    // Location hook with auto-start
    const {
        location,
        address,
        loading: locationLoading,
        error: locationError,
        getCurrentLocation,
        getFormattedAddress,
        isLocationAvailable
    } = useLocation({ autoStart: true });

    // Weather hook - automatically fetch when location changes
    const {
        weather,
        loading: weatherLoading,
        error: weatherError,
        fetchCurrentWeather,
        refreshWeather,
        current,
        hasCurrentWeather
    } = useWeather(location, true); // Auto-fetch weather when location changes

    // Animation refs
    const pulseAnim = useRef(new Animated.Value(1)).current;
    const pulseRing1 = useRef(new Animated.Value(0.8)).current;
    const pulseRing2 = useRef(new Animated.Value(0.8)).current;


    // Dashboard data (non-weather)
    const [dashboardData] = useState({
        cropAdvisory: {
            title: 'Maize',
            status: 'Flowering Stage',
            action: 'Apply fertilizer',
            days: 45
        },
        marketPrice: {
            crop: 'Maize',
            price: 'K15.50',
            trend: 'up',
            change: '+5.2%'
        },
        recentActivity: [
            { id: 0, action: 'viewed  information about Emmanuel Mwaba Mwangata the futurist (EMMZ)', time: '1 minute ago', icon: 'person' },
            { id: 1, action: 'viewed  information about Eric Sakala', time: '2 days ago', icon: 'person' },
            { id: 2, action: 'Asked about weather forecast', time: '2 hours ago', icon: 'partly-sunny' },
            { id: 3, action: 'Checked maize market prices', time: '5 hours ago', icon: 'trending-up' },
            { id: 4, action: 'Set irrigation reminder', time: '1 day ago', icon: 'water' },
            { id: 5, action: 'Updated crop status', time: '2 days ago', icon: 'leaf' }
        ]
    });

    useEffect(() => {
        // Voice button pulse animation
        if (isListening) {
            const pulseAnimation = Animated.loop(
                Animated.parallel([
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
                    ]),
                    Animated.sequence([
                        Animated.timing(pulseRing1, {
                            toValue: 1.3,
                            duration: 1500,
                            useNativeDriver: true,
                        }),
                        Animated.timing(pulseRing1, {
                            toValue: 0.8,
                            duration: 0,
                            useNativeDriver: true,
                        }),
                    ]),
                    Animated.sequence([
                        Animated.delay(750),
                        Animated.timing(pulseRing2, {
                            toValue: 1.3,
                            duration: 1500,
                            useNativeDriver: true,
                        }),
                        Animated.timing(pulseRing2, {
                            toValue: 0.8,
                            duration: 0,
                            useNativeDriver: true,
                        }),
                    ]),
                ])
            );
            pulseAnimation.start();
            return () => pulseAnimation.stop();
        }
    }, [isListening]);

const handleRecording=(status)=>{
    setStartRecord(!startRecord);
    if(status==true){
        VoiceRecording(status);
    }else{
        VoiceRecording(status);
    }
    
}
    const handleVoicePress = async () => {
        setIsListening(!isListening);
        if (!isListening) {
            // Test location data when voice is pressed
            try {
                const locationData = await getCurrentLocation();
                
                const locationInfo = `
📍 LOCATION FOUND!
Coordinates: ${locationData.latitude.toFixed(6)}, ${locationData.longitude.toFixed(6)}
Accuracy: ${locationData.accuracy}m

🏠 Address: ${locationData.address ? locationData.address.formattedAddress : 'Address not available'}

${locationData.address ? `
City: ${locationData.address.city || 'Unknown'}
Region: ${locationData.address.region || 'Unknown'}
         Country: ${locationData.address.country || 'Unknown'}` : ''}`;

                setTimeout(() => {
                    setIsListening(false);
                    Alert.alert('Current Location Data', locationInfo);
                }, 2000);
            } catch (error) {
                setTimeout(() => {
                    setIsListening(false);
                    Alert.alert('Voice + Location', 'Say something like "What\'s the weather?" or "Show my crops"\n\nLocation: ' + (error.message || 'Not available'));
                }, 3000);
            }
        }
    };

    const onRefresh = async () => {
        setRefreshing(true);
        try {
            // Refresh location data
            await getCurrentLocation();
            // Refresh weather data if location is available
            if (location) {
                await refreshWeather();
            }
            setTimeout(() => {
                setRefreshing(false);
            }, 1000);
        } catch (error) {
            console.log('Refresh error:', error);
            setRefreshing(false);
        }
    };

    const navigationItems = [
        { name: 'Home', icon: 'home', label: 'Home' },
        { name: 'Market', icon: 'storefront', label: 'Market' },
        { name: 'Subscription', icon: 'wallet', label: 'My Subscription' },
        { name: 'Settings', icon: 'settings', label: 'Settings' }
    ];

    const WeatherCard = () => (
        <TouchableOpacity style={[styles.infoCard, styles.weatherCard]} activeOpacity={0.8} onPress={async () => {
            if (!isLocationAvailable) {
                await getCurrentLocation();
            } else if (!hasCurrentWeather && location) {
                await fetchCurrentWeather(location);
            } else {
                setWeatherModalVisible(true);
            }
        }}>
            <View style={styles.weatherCardContent}>
                <View style={styles.weatherIcon}>
                    {locationLoading ? (
                        <Ionicons name="location" size={getResponsiveValue(32, 36, 40)} color="#4CAF50" />
                    ) : weatherLoading ? (
                        <Ionicons name="sync" size={getResponsiveValue(32, 36, 40)} color="#4A90E2" />
                    ) : hasCurrentWeather ? (
                        <Ionicons 
                            name={current?.icon === 'sunny' ? 'sunny' : current?.icon === 'rainy' ? 'rainy' : 'cloudy'} 
                            size={getResponsiveValue(32, 36, 40)} 
                            color={current?.icon === 'sunny' ? '#FFD700' : current?.icon === 'rainy' ? '#4A90E2' : '#95A5A6'} 
                        />
                    ) : weatherError ? (
                        <Ionicons name="cloud-offline" size={getResponsiveValue(32, 36, 40)} color="#f44336" />
                    ) : locationError ? (
                        <Ionicons name="location-outline" size={getResponsiveValue(32, 36, 40)} color="#f44336" />
                    ) : (
                        <Ionicons name="cloud-outline" size={getResponsiveValue(32, 36, 40)} color="#95A5A6" />
                    )}
                </View>
                <Text style={styles.weatherTemp}>
                    {hasCurrentWeather ? `${current.temperature}°C` : '--°C'}
                </Text>
                <Text style={styles.weatherCondition}>
                    {hasCurrentWeather ? current.condition : locationLoading ? 'Getting location...' : weatherLoading ? 'Loading weather...' : 'Tap to get weather'}
                </Text>
                <Text style={styles.weatherLocation}>
                    {locationLoading ? 'Getting location...' : 
                     address ? (address.city || address.district || address.subregion || address.region || 'Unknown location') : 
                     'Tap to get location'}
                </Text>
                
                {/* Status indicators */}
                {weatherLoading && (
                    <Text style={[styles.weatherLocation, { color: '#4A90E2', fontSize: 10 }]}>
                        Loading weather data...
                    </Text>
                )}
                {weatherError && !weatherLoading && (
                    <Text style={[styles.weatherLocation, { color: '#f44336', fontSize: 10 }]}>
                        Weather unavailable - Tap to retry
                    </Text>
                )}
                {locationError && !locationLoading && (
                    <Text style={[styles.weatherLocation, { color: '#f44336', fontSize: 10 }]}>
                        Location unavailable - Tap to retry
                    </Text>
                )}
                {hasCurrentWeather && (
                    <Text style={[styles.weatherLocation, { color: '#4CAF50', fontSize: 10 }]}>
                        Live weather data
                    </Text>
                )}
            </View>
        </TouchableOpacity>
    );

    const CropAdvisoryCard = () => (
        <TouchableOpacity style={styles.infoCard} activeOpacity={0.8}>
            <View style={styles.cardHeader}>
                <View style={[styles.cardIcon, { backgroundColor: '#e8f5e8' }]}>
                    <Ionicons name="leaf" size={getResponsiveValue(16, 18, 20)} color="#4CAF50" />
                </View>
                <Text style={styles.cardTitle}>Crop Advisory</Text>
            </View>
            <Text style={styles.cardValue}>{dashboardData.cropAdvisory.title}</Text>
            <Text style={styles.cardSubtext}>{dashboardData.cropAdvisory.status}</Text>
            <Text style={[styles.cardSubtext, { color: '#4CAF50', fontWeight: '600', marginTop: 4 }]}>
                {dashboardData.cropAdvisory.action}
            </Text>
        </TouchableOpacity>
    );

    const MarketPriceCard = () => (
        <TouchableOpacity style={styles.infoCard} activeOpacity={0.8}>
            <View style={styles.cardHeader}>
                <View style={[styles.cardIcon, { backgroundColor: '#fff3e0' }]}>
                    <Ionicons name="trending-up" size={getResponsiveValue(16, 18, 20)} color="#FF9800" />
                </View>
                <Text style={styles.cardTitle}>Market Price</Text>
            </View>
            <Text style={styles.cardValue}>{dashboardData.marketPrice.price}/kg</Text>
            <Text style={styles.cardSubtext}>{dashboardData.marketPrice.crop}</Text>
            <View style={styles.marketTrend}>
                <Ionicons
                    name={dashboardData.marketPrice.trend === 'up' ? 'trending-up' : 'trending-down'}
                    size={12}
                    color={dashboardData.marketPrice.trend === 'up' ? '#4CAF50' : '#f44336'}
                />
                <Text style={[
                    styles.marketTrendText,
                    { color: dashboardData.marketPrice.trend === 'up' ? '#4CAF50' : '#f44336' }
                ]}>
                    {dashboardData.marketPrice.change}
                </Text>
            </View>
        </TouchableOpacity>
    );

    const NewsAlertsCard = () => (
        <TouchableOpacity style={styles.infoCard} activeOpacity={0.8}>
            <View style={styles.cardHeader}>
                <View style={[styles.cardIcon, { backgroundColor: '#e3f2fd' }]}>
                    <Ionicons name="newspaper" size={getResponsiveValue(16, 18, 20)} color="#2196F3" />
                </View>
                <Text style={styles.cardTitle}>Farm Insights</Text>
            </View>
            <Text style={styles.cardValue}>
                {hasCurrentWeather ? 'Weather Data Active' : '3 New Updates'}
            </Text>
            <Text style={styles.cardSubtext}>
                {hasCurrentWeather ? 'Real-time weather monitoring' : 'Weather alerts, market trends'}
            </Text>
            <View style={styles.newsAlert}>
                <Text style={styles.newsAlertText}>
                    {hasCurrentWeather 
                        ? `Current: ${current.temperature}°C ${current.condition}`
                        : 'Heavy rains expected this weekend'
                    }
                </Text>
            </View>
        </TouchableOpacity>
    );

    return (
        <SafeAreaProvider>
            <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
                <StatusBar backgroundColor="white" barStyle="dark-content" />

                {/* Header */}
                <View style={styles.headerSection}>
                    <View style={styles.headerTop}>
                        <View style={styles.logoContainer}>
                            {/*<View style={styles.logoIcon}>*/}
                            {/*    /!*<Text style={{ color: 'white', fontWeight: 'bold', fontSize: getResponsiveValue(14, 16, 18) }}>*!/*/}
                            {/*    /!*    A*!/*/}
                            {/*    /!*</Text>*!/*/}
                            {/*</View>*/}
                            {/*<Text style={styles.logoText}>AGRO SPEAK</Text>*/}
                        </View>
                        <View style={styles.headerIcons}>
                            <TouchableOpacity 
                                style={styles.headerIconButton} 
                                activeOpacity={0.7} 
                                onPress={async () => {
                                    try {
                                        await getCurrentLocation();
                                        Alert.alert(
                                            'Current Location', 
                                            address ? address.formattedAddress : 'Location retrieved successfully'
                                        );
                                    } catch (error) {
                                        console.log('Location error:', error);
                                    }
                                }}
                            >
                                <Ionicons 
                                    name={locationLoading ? "location" : isLocationAvailable ? "location" : "location-outline"} 
                                    size={getResponsiveValue(20, 22, 24)} 
                                    color={isLocationAvailable ? "#4CAF50" : "#666"} 
                                />
                            </TouchableOpacity>
                            <TouchableOpacity 
                                style={styles.headerIconButton} 
                                activeOpacity={0.7} 
                                onPress={() => navigation.navigate('WeatherTest')}
                            >
                                <Ionicons name="cloudy-outline" size={getResponsiveValue(20, 22, 24)} color="#4A90E2" />
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.headerIconButton} activeOpacity={0.7} onPress={()=>{alert("notifications features  coming soon")}}>
                                <Ionicons name="notifications-outline" size={getResponsiveValue(20, 22, 24)} color="#666" />
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.headerIconButton} activeOpacity={0.7} onPress={() => {
                                Keyboard.dismiss();
                                setProfileVisible(true);
                            }}>
                                <Ionicons name="person-circle-outline" size={getResponsiveValue(20, 22, 24)} color="#666" />
                            </TouchableOpacity>
                        </View>
                    </View>
                    {/*<View style={styles.greetingContainer}>*/}
                    {/*    <Text style={styles.greetingText}>{getCurrentGreeting()}, Farmer!</Text>*/}
                    {/*    <Text style={styles.subGreetingText}>How can I help you today?</Text>*/}
                    {/*</View>*/}
                </View>

                <ScrollView
                    showsVerticalScrollIndicator={false}
                    refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={['#4CAF50']} />}
                >
                    {/* Voice Assistant Section  or the top section*/}
                    <View style={styles.voiceSection}>
                    
                    <Image
                    source={farmer2}
                    style={{width:screenWidth*1, 
                        height:screenHeight*.4,
                        position:'absolute',
                         resizeMode:'contain',
                        top:0, 
                        borderBottomLeftRadius:50,
                        }}
                    />
                        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <VoiceRecording />

      
    </View>
                        {/* <TouchableOpacity style={[styles.voiceButton, isListening && styles.voiceButtonActive]} onPress={()=>handleRecording(startRecord)} activeOpacity={0.8}>
                            {isListening && (
                                <>
                                    <Animated.View style={[
                                        styles.pulseRing,
                                        {
                                            width: getResponsiveValue(120, 140, 160),
                                            height: getResponsiveValue(120, 140, 160),
                                            transform: [{ scale: pulseRing1 }],
                                            opacity: pulseRing1.interpolate({
                                                inputRange: [0.8, 1.3],
                                                outputRange: [0.7, 0],
                                            }),
                                        }
                                    ]} />
                                    <Animated.View style={[
                                        styles.pulseRing,
                                        {
                                            width: getResponsiveValue(120, 140, 160),
                                            height: getResponsiveValue(120, 140, 160),
                                            transform: [{ scale: pulseRing2 }],
                                            opacity: pulseRing2.interpolate({
                                                inputRange: [0.8, 1.3],
                                                outputRange: [0.7, 0],
                                            }),
                                        }
                                    ]} />
                                </>
                            )}
                            <Animated.View style={[
                                styles.voiceIconContainer,
                                { transform: [{ scale: pulseAnim }] }
                            ]}>
                                <Ionicons
                                    name={isListening ? "mic" : "mic-outline"}
                                    size={getResponsiveValue(40, 48, 56)}
                                    color="white"
                                />
                            </Animated.View>
                            <Text style={styles.voiceButtonText}>
                                {isListening ? "Listening..." : "Tap to Speak"}
                            </Text>
                        </TouchableOpacity> */}
                        <Text style={[styles.voiceStatusText, isListening && styles.voiceStatusActive]}>
                            {isListening ? "I'm listening..." : "Voice Assistant Ready"}
                        </Text>
                        {!isListening && (
                            <Text style={styles.voiceHintText}>
                                Try saying "What's the weather?" or "Show my crops"
                            </Text>
                        )}
                    </View>

                    {/* Quick Info Cards */}
                    <View style={styles.cardsSection}>
                        <View style={styles.sectionHeader}>
                            <Text style={styles.sectionTitle}>Quick Overview</Text>
                            <TouchableOpacity style={styles.seeAllButton} activeOpacity={0.7} onPress={()=>{alert("this feature is coming soon")}}>
                                <Text style={styles.seeAllText}>See All</Text>
                            </TouchableOpacity>
                        </View>

                        <View style={styles.cardsGrid}>
                            <View style={styles.cardRow}>
                                <WeatherCard />
                                <CropAdvisoryCard />
                            </View>
                            <View style={styles.cardRow}>
                                <MarketPriceCard />
                                <NewsAlertsCard />
                            </View>
                        </View>
                    </View>

                    {/* Recent Activity */}
                    <View style={styles.activitySection}>
                        <View style={styles.sectionHeader}>
                            <Text style={styles.sectionTitle}>Recent Activity</Text>
                            <TouchableOpacity style={styles.seeAllButton} activeOpacity={0.7} onPress={()=>{alert("coming soon")}}>
                                <Text style={styles.seeAllText}>View All</Text>
                            </TouchableOpacity>
                        </View>

                        <View style={styles.activityList}>
                            {dashboardData.recentActivity.slice(0, dashboardData.recentActivity.length).map((activity) => (
                                <TouchableOpacity key={activity.id} style={styles.activityItem} activeOpacity={0.7}>
                                    <View style={styles.activityIcon}>
                                        <Ionicons name={activity.icon} size={getResponsiveValue(16, 18, 20)} color="#4CAF50" />
                                    </View>
                                    <View style={styles.activityContent}>
                                        <Text style={styles.activityText}>{activity.action}</Text>
                                        <Text style={styles.activityTime}>{activity.time}</Text>
                                    </View>
                                </TouchableOpacity>
                            ))}
                        </View>
                    </View>
                </ScrollView>

                {/* Bottom Navigation */}
                <SafeAreaView edges={['bottom']}>
                    <View style={styles.bottomNavigation}>
                        {navigationItems.map((item) => (
                            <TouchableOpacity
                                key={item.name}
                                style={styles.navItem}
                                onPress={() => {
                                    setActiveTab(item.name);
                                    if (item.name !== 'Home') {
                                        // navigation.navigate(item.name);
                                        alert( item.name+" page is under development \n\n\t\t\t\t COMING SOON")
                                    }
                                }}
                                activeOpacity={0.7}
                            >
                                <View style={styles.navIcon}>
                                    <Ionicons
                                        name={activeTab === item.name ? item.icon : `${item.icon}-outline`}
                                        size={getResponsiveValue(22, 24, 26)}
                                        color={activeTab === item.name ? '#4CAF50' : '#666'}
                                    />
                                </View>
                                <Text style={[
                                    styles.navLabel,
                                    activeTab === item.name && styles.navLabelActive
                                ]}>
                                    {item.label}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                </SafeAreaView>
            </SafeAreaView>

            {/* Profile Screen */}
            <ProfileScreen
                visible={profileVisible}
                onClose={() => setProfileVisible(false)}
                navigation={navigation}
            />

            {/* Weather Details Modal */}
            {weatherModalVisible && (
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContainer}>
                        <View style={styles.modalHeader}>
                            <Text style={styles.modalTitle}>Weather Details</Text>
                            <TouchableOpacity onPress={() => setWeatherModalVisible(false)}>
                                <Ionicons name="close" size={24} color="#2C3E50" />
                            </TouchableOpacity>
                        </View>
                        <WeatherDisplay 
                            weather={weather}
                            loading={weatherLoading}
                            error={weatherError}
                            onRefresh={refreshWeather}
                            showForecast={true}
                            showSoil={true}
                            compact={false}
                        />
                    </View>
                </View>
            )}
        </SafeAreaProvider>
    );
};

export default HomeScreen;