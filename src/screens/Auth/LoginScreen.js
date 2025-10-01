import React, { useState, useRef, useEffect } from 'react';
import {View, Text, TextInput, TouchableOpacity, Alert, Animated, KeyboardAvoidingView, Platform, ScrollView, ActivityIndicator,} from 'react-native';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { css } from './AdaptiveAuthStyles';
import { getApiUrl, API_ENDPOINTS } from '../../config/api';
import { authStorage } from '../../utils/authStorage';
import { handleApiError } from '../../utils/errorHandler';

export default function LoginScreen({ navigation }) {
    const [authMethod, setAuthMethod] = useState('email'); // Default to email since backend only supports email
    const [formData, setFormData] = useState({ phone: '', email: '', password: '' });
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const fadeAnim = useRef(new Animated.Value(0)).current;
    const slideAnim = useRef(new Animated.Value(50)).current;

    useEffect(() => {
        Animated.parallel([
            Animated.timing(fadeAnim, { toValue: 1, duration: 800, useNativeDriver: true }),
            Animated.timing(slideAnim, { toValue: 0, duration: 800, useNativeDriver: true }),
        ]).start();
    }, []);

    const handleInputChange = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handleLogin = async () => {
        setIsLoading(true);

        // Validation - only support email login since backend expects email
        if (!formData.email) {
            Alert.alert('Error', 'Please enter your email');
            setIsLoading(false);
            return;
        }

        if (!formData.password) {
            Alert.alert('Error', 'Please enter your password');
            setIsLoading(false);
            return;
        }

        try {
            const response = await fetch(getApiUrl(API_ENDPOINTS.LOGIN), {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email: formData.email.trim().toLowerCase(),
                    password: formData.password,
                }),
            });

            const data = await response.json();

            if (response.ok) {
                // Store the JWT token and user data
                await authStorage.storeToken(data.token);
                await authStorage.storeUserData({
                    email: formData.email.trim().toLowerCase(),
                    role: data.role,
                });

                Alert.alert('Success', 'Login successful!', [
                    {
                        text: 'OK',
                        onPress: () => navigation.reset({
                            index: 0,
                            routes: [{ name: 'Home' }],
                        }),
                    },
                ]);
            } else {
                Alert.alert('Login Failed', data.error || 'Invalid credentials');
            }
        } catch (error) {
            const errorMessage = handleApiError(error);
            Alert.alert('Error', errorMessage);
        } finally {
            setIsLoading(false);
        }
    };


    return (
        <SafeAreaProvider>
            <SafeAreaView style={css.container} edges={['top', 'bottom']}>
                <KeyboardAvoidingView
                    style={{ flex: 1 }}
                    behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                >
                    <ScrollView
                        contentContainerStyle={{ flexGrow: 1 }}
                        keyboardShouldPersistTaps="handled"
                    >
                        {/* Header Section */}
                        <Animated.View
                            style={[
                                css.headerSection,
                                { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }
                            ]}
                        >
                            <View style={css.logoContainer}>
                                <View style={css.logoIcon}>
                                    <MaterialIcons name="agriculture" size={32} color="#4CAF50" />
                                </View>
                                <Text style={css.logoText}>AGRO SPEAK</Text>
                                <Text style={css.welcomeText}>Welcome back, Farmer!</Text>
                            </View>
                        </Animated.View>

                        {/* Form Section - Email Login Only */}
                        <Animated.View
                            style={[
                                css.formSection,
                                { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }
                            ]}
                        >

                            {/* Form */}
                            <View style={css.formContainer}>
                                {/* Email Input */}
                                <View style={css.inputContainer}>
                                    <View style={css.inputWrapper}>
                                        <Ionicons
                                            name="mail"
                                            size={18}
                                            color="#666"
                                            style={css.inputIcon}
                                        />
                                        <TextInput
                                            style={css.textInput}
                                            placeholder="Email Address"
                                            value={formData.email}
                                            onChangeText={(text) => handleInputChange('email', text)}
                                            keyboardType="email-address"
                                            placeholderTextColor="#999"
                                            autoCapitalize="none"
                                            autoCorrect={false}
                                        />
                                    </View>
                                </View>

                                {/* Password Input */}
                                <View style={css.inputContainer}>
                                    <View style={css.inputWrapper}>
                                        <Ionicons name="lock-closed" size={18} color="#666" style={css.inputIcon} />
                                        <TextInput
                                            style={css.textInput}
                                            placeholder="Password"
                                            value={formData.password}
                                            onChangeText={(text) => handleInputChange('password', text)}
                                            secureTextEntry={!showPassword}
                                            placeholderTextColor="#999"
                                        />
                                        <TouchableOpacity
                                            onPress={() => setShowPassword(!showPassword)}
                                            style={css.eyeIcon}
                                        >
                                            <Ionicons name={showPassword ? 'eye' : 'eye-off'} size={18} color="#666" />
                                        </TouchableOpacity>
                                    </View>
                                </View>

                                {/* Forgot Password */}
                                <View style={css.actionLinksContainer}>
                                    <TouchableOpacity
                                        onPress={() => Alert.alert('Info', 'Forgot password feature coming soon!')}
                                    >
                                        <Text style={css.actionLink}>Forgot Password?</Text>
                                    </TouchableOpacity>
                                </View>

                                {/* Login Button */}
                                <TouchableOpacity
                                    style={[css.submitButton, isLoading && css.submitButtonDisabled]}
                                    onPress={handleLogin}
                                    disabled={isLoading}
                                >
                                    {isLoading ? (
                                        <ActivityIndicator size="small" color="#fff" />
                                    ) : (
                                        <Text style={css.submitButtonText}>Login</Text>
                                    )}
                                </TouchableOpacity>
                            </View>
                        </Animated.View>

                        {/* Bottom Section */}
                        <Animated.View
                            style={[
                                css.bottomSection,
                                { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }
                            ]}
                        >
                            <View style={css.toggleContainer}>
                                <Text style={css.toggleText}>Don't have an account? </Text>
                                <TouchableOpacity onPress={() => navigation.navigate('Register')}>
                                    <Text style={css.toggleLink}>Register here</Text>
                                </TouchableOpacity>
                            </View>
                        </Animated.View>
                    </ScrollView>
                </KeyboardAvoidingView>
            </SafeAreaView>
        </SafeAreaProvider>
    );
}
