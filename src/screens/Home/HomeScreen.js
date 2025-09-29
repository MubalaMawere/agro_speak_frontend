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
    Alert
} from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import {styles,getResponsiveValue} from "./Styles";


const HomeScreen = ({ navigation }) => {
    const [isListening, setIsListening] = useState(false);
    const [refreshing, setRefreshing] = useState(false);
    const [activeTab, setActiveTab] = useState('Home');

    // Animation refs
    const pulseAnim = useRef(new Animated.Value(1)).current;
    const pulseRing1 = useRef(new Animated.Value(0.8)).current;
    const pulseRing2 = useRef(new Animated.Value(0.8)).current;

    // Sample data
    const [dashboardData] = useState({
        weather: {
            temp: 28,
            condition: 'Sunny',
            location: 'luanshya',
            humidity: 65,
            rainfall: 20
        },
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

    const handleVoicePress = () => {
        setIsListening(!isListening);
        if (!isListening) {

            setTimeout(() => {
                setIsListening(false);
                Alert.alert('Voice', 'Say something like "What\'s the weather?" or "Show my crops"');
            }, 3000);
        }
    };

    const onRefresh = () => {
        setRefreshing(true);
        // Simulate data refresh
        setTimeout(() => {
            setRefreshing(false);
        }, 1000);
    };

    const navigationItems = [
        { name: 'Home', icon: 'home', label: 'Home' },
        { name: 'Market', icon: 'storefront', label: 'Market' },
        { name: 'Subscription', icon: 'wallet', label: 'My Subscription' },
        { name: 'Settings', icon: 'settings', label: 'Settings' }
    ];

    const WeatherCard = () => (
        <TouchableOpacity style={[styles.infoCard, styles.weatherCard]} activeOpacity={0.8}>
            <View style={styles.weatherCardContent}>
                <View style={styles.weatherIcon}>
                    <Ionicons name="sunny" size={getResponsiveValue(32, 36, 40)} color="#FFD700" />
                </View>
                <Text style={styles.weatherTemp}>{dashboardData.weather.temp}°C</Text>
                <Text style={styles.weatherCondition}>{dashboardData.weather.condition}</Text>
                <Text style={styles.weatherLocation}>{dashboardData.weather.location}</Text>
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
                <Text style={styles.cardTitle}>Farm News</Text>
            </View>
            <Text style={styles.cardValue}>3 New Updates</Text>
            <Text style={styles.cardSubtext}>Weather alerts, market trends</Text>
            <View style={styles.newsAlert}>
                <Text style={styles.newsAlertText}>
                    Heavy rains expected this weekend
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
                            <TouchableOpacity style={styles.headerIconButton} activeOpacity={0.7} onPress={()=>{alert("notifications features  coming soon")}}>
                                <Ionicons name="notifications-outline" size={getResponsiveValue(20, 22, 24)} color="#s" />
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.headerIconButton} activeOpacity={0.7} onPress={()=>{alert("profile features  coming soon")}}>
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
                    {/* Voice Assistant Section */}
                    <View style={styles.voiceSection}>
                        <TouchableOpacity style={[styles.voiceButton, isListening && styles.voiceButtonActive]} onPress={handleVoicePress} activeOpacity={0.8}>
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
                        </TouchableOpacity>
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
        </SafeAreaProvider>
    );
};

export default HomeScreen;