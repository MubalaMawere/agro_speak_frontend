import React, { useEffect, useState, useRef } from 'react';
import { View, Image, Text, Animated, Dimensions } from 'react-native';
import { css } from "./Styles";

const { width, height } = Dimensions.get('window');

export default function SplashScreen({ navigation }) {
    const [fadeAnim] = useState(new Animated.Value(0));
    const [scaleAnim] = useState(new Animated.Value(0.8));
    const [pulseAnim] = useState(new Animated.Value(1));

    // Create animated values for 4 dots
    const dot1Anim = useRef(new Animated.Value(0.3)).current;
    const dot2Anim = useRef(new Animated.Value(0.3)).current;
    const dot3Anim = useRef(new Animated.Value(0.3)).current;
    const dot4Anim = useRef(new Animated.Value(0.3)).current;

    const animateDots = () => {
        const duration = 400;
        const sequence = Animated.sequence([
            // Light up dot 1
            Animated.timing(dot1Anim, {
                toValue: 1,
                duration: duration,
                useNativeDriver: true,
            }),
            // Light up dot 2, fade dot 1
            Animated.parallel([
                Animated.timing(dot1Anim, {
                    toValue: 0.3,
                    duration: duration,
                    useNativeDriver: true,
                }),
                Animated.timing(dot2Anim, {
                    toValue: 1,
                    duration: duration,
                    useNativeDriver: true,
                })
            ]),
            // Light up dot 3, fade dot 2
            Animated.parallel([
                Animated.timing(dot2Anim, {
                    toValue: 0.3,
                    duration: duration,
                    useNativeDriver: true,
                }),
                Animated.timing(dot3Anim, {
                    toValue: 1,
                    duration: duration,
                    useNativeDriver: true,
                })
            ]),
            // Light up dot 4, fade dot 3
            Animated.parallel([
                Animated.timing(dot3Anim, {
                    toValue: 0.3,
                    duration: duration,
                    useNativeDriver: true,
                }),
                Animated.timing(dot4Anim, {
                    toValue: 1,
                    duration: duration,
                    useNativeDriver: true,
                })
            ]),
            // Fade dot 4
            Animated.timing(dot4Anim, {
                toValue: 0.3,
                duration: duration,
                useNativeDriver: true,
            }),
            // Small pause before repeating
            Animated.delay(200),
        ]);

        return sequence;
    };

    useEffect(() => {
        // Start main animations
        Animated.parallel([
            Animated.timing(fadeAnim, {
                toValue: 1,
                duration: 1000,
                useNativeDriver: true,
            }),
            Animated.spring(scaleAnim, {
                toValue: 1,
                tension: 100,
                friction: 8,
                useNativeDriver: true,
            }),
        ]).start();

        // Pulse animation for logo
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

        // Start dot animation loop
        const dotAnimation = Animated.loop(animateDots());
        dotAnimation.start();

        // Auto navigate after 3 seconds
        const timer = setTimeout(() => {
            navigation.replace('Onboard');
        }, 3000);

        return () => {
            clearTimeout(timer);
            pulseAnimation.stop();
            dotAnimation.stop();
        };
    }, []);

    return (
        <View style={css.container}>
            {/* Background Gradient Effect */}
            <View style={css.gradientOverlay} />

            {/* Main Content */}
            <Animated.View
                style={[
                    css.content,
                    {
                        opacity: fadeAnim,
                        transform: [{ scale: scaleAnim }]
                    }
                ]}
            >
                {/* App Icon Container */}
                <Animated.View
                    style={[
                        css.logoContainer,
                        { transform: [{ scale: pulseAnim }] }
                    ]}
                >
                    <View style={css.iconWrapper}>
                        <Image
                            source={require('../../../assets/splash.png')}
                            style={css.appIcon}
                        />
                        {/* Voice wave indicator */}
                        <View style={css.voiceIndicator}>
                            <View style={[css.voiceWave, css.wave1]} />
                            <View style={[css.voiceWave, css.wave2]} />
                            <View style={[css.voiceWave, css.wave3]} />
                        </View>
                    </View>
                </Animated.View>

                {/* App Name */}
                <Text style={css.appName}>AGRO SPEAK</Text>
                <Text style={css.tagline}>Connecting Farmers Through Voice</Text>

                {/* Animated Loading Dots - Facebook Style */}
                <View style={css.loadingContainer}>
                    <Animated.View
                        style={[
                            css.loadingDot,
                            { opacity: dot1Anim }
                        ]}
                    />
                    <Animated.View
                        style={[
                            css.loadingDot,
                            { opacity: dot2Anim }
                        ]}
                    />
                    <Animated.View
                        style={[
                            css.loadingDot,
                            { opacity: dot3Anim }
                        ]}
                    />
                    <Animated.View
                        style={[
                            css.loadingDot,
                            { opacity: dot4Anim }
                        ]}
                    />
                </View>
            </Animated.View>

            {/* Company Branding */}
            <View style={css.brandingContainer}>
                <Text style={css.fromText}>from</Text>
                <View style={css.companyContainer}>
                    <View style={css.companyIcon}>
                        <Text style={css.companyIconText}>TCC</Text>
                    </View>
                    <Text style={css.companyName}>The Compiler Corporation</Text>
                </View>
            </View>
        </View>
    );
}