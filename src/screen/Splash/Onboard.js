import React, { useState, useRef, useEffect } from 'react';
import {View, Text, TouchableOpacity, Animated, ScrollView, StatusBar} from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import {css} from "../Auth/AdaptiveAuthStyles";
import {styles,getResponsiveValue} from "./onboardStyles";


export default function OnboardingScreens({ navigation }) {
    const [currentScreen, setCurrentScreen] = useState(0);
    const [isPlaying, setIsPlaying] = useState(false);

    // Animation values
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const slideAnim = useRef(new Animated.Value(50)).current;
    const pulseAnim = useRef(new Animated.Value(1)).current;

    const screens = [
        {
            id: 'welcome',
            title: 'Welcome to AGRO SPEAK',
            subtitle: 'Your AI-powered farming companion that understands your voice',
            icon: 'volume-high',
            iconColor: '#4CAF50',
            description: 'Get instant answers, track your farm data, and receive personalized advice - all through natural voice commands in your local language.',
            features: ['Voice recognition in your languages', 'Offline capability', '24/7 availability']
        },
        {
            id: 'voice-commands',
            title: 'Smart Voice Commands',
            subtitle: 'Simply speak to manage your entire farm operation',
            icon: 'mic',
            iconColor: '#2196F3',
            description: 'Ask questions naturally: "How much water does my maize need?" or "When should I harvest my tomatoes?"',
            features: ['Natural language processing', 'Context-aware responses', 'Multi-language support']
        },
        {
            id: 'weather-forecast',
            title: 'Hyper-Local Weather',
            subtitle: 'Get precise weather forecasts for your exact location',
            icon: 'cloud',
            iconColor: '#00BCD4',
            description: 'Receive detailed weather alerts, rainfall predictions, and seasonal forecasts tailored to your crops.',
            features: ['15-day detailed forecasts', 'Severe weather alerts', 'Crop-specific recommendations']
        },
        {
            id: 'market-insights',
            title: 'Real-Time Market Prices',
            subtitle: 'Stay ahead with live market data and trends',
            icon: 'trending-up',
            iconColor: '#FF9800',
            description: 'Get current prices, demand forecasts, and best selling opportunities for your crops across local and regional markets.',
            features: ['Live price updates', 'Demand predictions', 'Best selling locations']
        },
        {
            id: 'community',
            title: 'Farming Community',
            subtitle: 'Connect with fellow farmers and agricultural experts',
            icon: 'people',
            iconColor: '#9C27B0',
            description: 'Share experiences, get advice from experts, and learn from successful farmers in your region.',
            features: ['Expert consultations', 'Farmer networks', 'Success stories']
        }
    ];

    useEffect(() => {
        // Animate content when screen changes
        Animated.parallel([
            Animated.timing(fadeAnim, {toValue: 1, duration: 800, useNativeDriver: true,}),
            Animated.timing(slideAnim, {toValue: 0, duration: 600, useNativeDriver: true,}),
        ]).start();

        // Reset animations for next screen
        return () => {fadeAnim.setValue(0);slideAnim.setValue(50);};
    }, [currentScreen]);

    useEffect(() => {
        // Pulse animation for voice button
        if (isPlaying) {
            const pulse = Animated.loop(
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
            pulse.start();
            return () => pulse.stop();
        }
    }, [isPlaying]);

    const nextScreen = () => {
        if (currentScreen < screens.length - 1) {
            setCurrentScreen(currentScreen + 1);
        }
    };

    const prevScreen = () => {
        if (currentScreen > 0) {
            setCurrentScreen(currentScreen - 1);
        }
    };

    // const skipToEnd = () => {
    //     setCurrentScreen(screens.length - 1);
    // };

    const handleGetStarted = () => {
        //  login screen
        navigation.replace('Login');
    };

    const VoiceDemo = ({ isActive }) => (
        <View style={[styles.demoContainer, isActive && styles.voiceDemoActive]}>
            <View style={styles.voiceDemoContent}>
                <Animated.View style={[
                    styles.voiceButton,
                    isActive ? styles.voiceButtonActive : styles.voiceButtonInactive,
                    { transform: [{ scale: isActive ? pulseAnim : 1 }] }
                ]}>
                    <Ionicons
                        name="mic"
                        size={getResponsiveValue(32, 36, 40)}
                        color={isActive ? 'white' : '#666'}
                    />
                </Animated.View>
                <View style={styles.voiceTextContainer}>
                    <Text style={[
                        styles.voiceStatusText,
                        { color: isActive ? '#4CAF50' : '#666' }
                    ]}>
                        {isActive ? 'Listening...' : 'Tap to speak'}
                    </Text>
                    <Text style={styles.voiceExampleText}>
                        "What's the weather forecast for this week?"
                    </Text>
                </View>
            </View>
        </View>
    );

    const WeatherCard = () => (
        <View style={[
            styles.weatherCard,
            {
                backgroundColor: '#2196F3',
                // Gradient effect simulation
                shadowColor: '#00BCD4',
                shadowOffset: { width: 0, height: 8 },
                shadowOpacity: 0.3,
                shadowRadius: 16,
                elevation: 8,
            }
        ]}>
            <View style={styles.weatherHeader}>
                <View>
                    <Text style={styles.weatherTitle}>Today's Weather</Text>
                    <Text style={styles.weatherLocation}>Lusaka, Zambia</Text>
                </View>
                <Ionicons name="sunny" size={getResponsiveValue(40, 44, 48)} color="#FFD700" />
            </View>
            <View style={styles.weatherGrid}>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <Text style={styles.weatherTemp}>28°C</Text>
                    <Text style={styles.weatherCondition}>Sunny</Text>
                </View>
                <View style={styles.weatherRain}>
                    <Ionicons name="water" size={getResponsiveValue(16, 18, 20)} color="white" />
                    <Text style={styles.weatherRainText}>Rain: 20%</Text>
                </View>
            </View>
        </View>
    );

    const MarketCard = () => {
        const marketData = [
            { crop: 'Maize', price: 'K15/kg', trend: '+5%', color: '#4CAF50' },
            { crop: 'Soybeans', price: 'K22/kg', trend: '-2%', color: '#f44336' },
            { crop: 'Tomatoes', price: 'K8/kg', trend: '+12%', color: '#4CAF50' }
        ];

        return (
            <View style={styles.marketCard}>
                <Text style={styles.marketTitle}>Market Prices Today</Text>
                {marketData.map((item, index) => (
                    <View key={index} style={styles.marketItem}>
                        <Text style={styles.marketCrop}>{item.crop}</Text>
                        <View style={styles.marketPriceContainer}>
                            <Text style={styles.marketPrice}>{item.price}</Text>
                            <Text style={[styles.marketTrend, { color: item.color }]}>
                                {item.trend}
                            </Text>
                        </View>
                    </View>
                ))}
            </View>
        );
    };

    const FeatureList = ({ features }) => (
        <View style={styles.demoContainer}>
            <View style={styles.featureList}>
                {features.map((feature, index) => (
                    <View key={index} style={styles.featureItem}>
                        <View style={styles.featureDot} />
                        <Text style={styles.featureText}>{feature}</Text>
                    </View>
                ))}
            </View>
        </View>
    );

    const renderScreenContent = (screen) => {
        switch (screen.id) {
            case 'voice-commands':
                return <VoiceDemo isActive={isPlaying} />;
            case 'weather-forecast':
                return <WeatherCard />;
            case 'market-insights':
                return <MarketCard />;
            default:
                return <FeatureList features={screen.features} />;
        }
    };

    const currentScreenData = screens[currentScreen];

    return (
        <SafeAreaProvider>
            <SafeAreaView style={css.container} edges={['top', 'bottom']}>
            <StatusBar backgroundColor="#f8f9fa" barStyle="dark-content" />

            {/* Header */}
            <View style={styles.headerSection}>
                {/*<View style={styles.logoContainer}>*/}
                {/*    /!*<View style={styles.logoIcon}>*!/*/}
                {/*    /!*    <Text style={{ color: 'white', fontWeight: 'bold', fontSize: getResponsiveValue(14, 16, 18) }}>*!/*/}
                {/*    /!*        AS*!/*/}
                {/*    /!*    </Text>*!/*/}
                {/*    /!*</View>*!/*/}
                {/*    /!*<Text style={styles.logoText}>AGRO SPEAK</Text>*!/*/}
                {/*</View>*/}
                {/*{currentScreen < screens.length - 1 && (*/}
                {/*    <TouchableOpacity onPress={skipToEnd} style={styles.skipButton}>*/}
                {/*        <Text style={styles.skipButtonText}>Skip</Text>*/}
                {/*    </TouchableOpacity>*/}
                {/*)}*/}
            </View>

            {/*/!* Progress Bar *!/*/}
            {/*<View style={styles.progressContainer}>*/}
            {/*    <View style={styles.progressTrack}>*/}
            {/*        {screens.map((_, index) => (*/}
            {/*            <View*/}
            {/*                key={index}*/}
            {/*                style={[*/}
            {/*                    styles.progressDot,*/}
            {/*                    index <= currentScreen && styles.progressDotActive*/}
            {/*                ]}*/}
            {/*            />*/}
            {/*        ))}*/}
            {/*    </View>*/}
            {/*</View>*/}

            {/* Main Content */}
            <View style={styles.contentSection}>
                <Animated.View style={[styles.contentContainer, {opacity: fadeAnim, transform: [{ translateY: slideAnim }]}]}>
                    <ScrollView showsVerticalScrollIndicator={false}>
                        <View style={styles.iconContainer}>
                            <Ionicons name={currentScreenData.icon} size={getResponsiveValue(48, 56, 64)} color={currentScreenData.iconColor}/>
                        </View>

                        <Text style={styles.titleText}>{currentScreenData.title}</Text>
                        <Text style={styles.subtitleText}>{currentScreenData.subtitle}</Text>
                        <Text style={styles.descriptionText}>{currentScreenData.description}</Text>

                        {/* Interactive Content */}
                        {renderScreenContent(currentScreenData)}

                        {/* Voice Demo Button */}
                        {currentScreenData.id === 'voice-commands' && (
                            <TouchableOpacity
                                onPress={() => setIsPlaying(!isPlaying)}
                                style={[
                                    styles.actionButton,
                                    isPlaying && styles.actionButtonRed
                                ]}
                                activeOpacity={0.8}
                            >
                                <Ionicons
                                    name="play"
                                    size={20}
                                    color="white"
                                />
                                <Text style={styles.actionButtonText}>
                                    {isPlaying ? 'Stop Demo' : 'Try Voice Demo'}
                                </Text>
                            </TouchableOpacity>
                        )}
                    </ScrollView>
                </Animated.View>
            </View>

            {/* Navigation */}
            <View style={styles.bottomSection}>
                <View style={styles.navigationContainer}>
                    <TouchableOpacity
                        onPress={prevScreen}
                        disabled={currentScreen === 0}
                        style={[
                            styles.navButton,
                            currentScreen === 0 ? styles.navButtonDisabled : styles.navButtonBack
                        ]}
                        activeOpacity={currentScreen === 0 ? 1 : 0.7}
                    >
                        <Ionicons
                            name="chevron-back"
                            size={20}
                            color={currentScreen === 0 ? '#ccc' : '#666'}
                        />
                        <Text style={[
                            styles.navButtonText,
                            currentScreen === 0 ? styles.navButtonTextDisabled : styles.navButtonTextBack
                        ]}>
                            Back
                        </Text>
                    </TouchableOpacity>

                    <Text style={styles.screenCounter}>
                        {currentScreen + 1} of {screens.length}
                    </Text>

                    <TouchableOpacity
                        onPress={currentScreen === screens.length - 1 ? handleGetStarted : nextScreen}
                        style={[styles.navButton, styles.navButtonNext]}
                        activeOpacity={0.8}
                    >
                        <Text style={[styles.navButtonText, styles.navButtonTextNext]}>
                            {currentScreen === screens.length - 1 ? 'Get Started' : 'Next'}
                        </Text>
                        <Ionicons name="chevron-forward" size={20} color="white" />
                    </TouchableOpacity>
                </View>
            </View>
        </SafeAreaView>

        </SafeAreaProvider>
    );
}