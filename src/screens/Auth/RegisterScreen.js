import React, { useState, useRef, useEffect } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    Alert,
    Animated,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    ActivityIndicator
} from 'react-native';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { css } from './AdaptiveAuthStyles';
import { getApiUrl, API_ENDPOINTS } from '../../config/api';
import { handleApiError } from '../../utils/errorHandler';

export default function RegisterScreen({ navigation }) {
    const [authMethod, setAuthMethod] = useState('email'); // Default to email since backend only supports email
    const [formData, setFormData] = useState({
        name: '', 
        phone: '', 
        email: '', 
        password: ''
    });
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

    const handleRegister = async () => {
        // Validation
        if (!formData.name.trim()) {
            Alert.alert('Error', 'Please enter your full name');
            return;
        }
        
        if (!formData.email.trim()) {
            Alert.alert('Error', 'Please enter your email address');
            return;
        }

        // Basic email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(formData.email.trim())) {
            Alert.alert('Error', 'Please enter a valid email address');
            return;
        }

        if (!formData.password) {
            Alert.alert('Error', 'Please enter a password');
            return;
        }
        
        if (formData.password.length < 6) {
            Alert.alert('Error', 'Password must be at least 6 characters');
            return;
        }

        setIsLoading(true);

        try {
            const response = await fetch(getApiUrl(API_ENDPOINTS.REGISTER), {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    fullName: formData.name.trim(),
                    email: formData.email.trim().toLowerCase(),
                    password: formData.password,
                    phone: formData.phone.trim() || null, // Optional phone number
                }),
            });

            const data = await response.json();

            if (response.ok) {
                Alert.alert(
                    'Success',
                    'Registration successful! You can now login with your credentials.',
                    [
                        {
                            text: 'OK',
                            onPress: () => navigation.reset({
                                index: 0,
                                routes: [{ name: 'Login' }],
                            }),
                        },
                    ]
                );
            } else {
                Alert.alert('Registration Failed', data.error || 'Registration failed. Please try again.');
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
                    <ScrollView contentContainerStyle={{ flexGrow: 1 }} keyboardShouldPersistTaps="handled">
                        {/* Header Section */}
                        <Animated.View
                            style={[{ opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>
                            <View style={css.logoContainer}>
                                <View style={css.logoIcon}>
                                    <MaterialIcons name="agriculture" size={32} color="#4CAF50" />
                                </View>
                                <Text style={css.logoText}>AGRO SPEAK</Text>
                                <Text style={css.welcomeText}>Join the farming community!
                                    by creating your account</Text>
                            </View>
                        </Animated.View>

                        {/* Registration Form */}
                        <Animated.View
                            style={[css.formSection, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>

                            {/* Form */}
                            <View style={css.formContainer}>
                                {/* Full Name */}
                                <View style={css.inputContainer}>
                                    <View style={css.inputWrapper}>
                                        <Ionicons name="person" size={18} color="#666" style={css.inputIcon} />
                                        <TextInput 
                                            style={css.textInput} 
                                            placeholder="Full Name" 
                                            value={formData.name} 
                                            onChangeText={(text) => handleInputChange('name', text)} 
                                            placeholderTextColor="#999"
                                            autoCapitalize="words"
                                        />
                                    </View>
                                </View>

                                {/* Email Address */}
                                <View style={css.inputContainer}>
                                    <View style={css.inputWrapper}>
                                        <Ionicons name="mail" size={18} color="#666" style={css.inputIcon}/>
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

                                {/* Phone Number (Optional) */}
                                <View style={css.inputContainer}>
                                    <View style={css.inputWrapper}>
                                        <Ionicons name="call" size={18} color="#666" style={css.inputIcon}/>
                                        <TextInput
                                            style={css.textInput}
                                            placeholder="Phone Number (Optional)"
                                            value={formData.phone}
                                            onChangeText={(text) => handleInputChange('phone', text)}
                                            keyboardType="phone-pad"
                                            placeholderTextColor="#999"
                                        />
                                    </View>
                                </View>

                                {/* Password */}
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

                                {/* Terms */}
                                <View style={css.termsContainer}>
                                    <Text style={css.termsText}>
                                        By registering, you agree to our{' '}
                                        <Text style={css.termsLink}>Terms of Service</Text> and{' '}
                                        <Text style={css.termsLink}>Privacy Policy</Text>
                                    </Text>
                                </View>


                                {/* Submit Button */}
                                <TouchableOpacity
                                    style={[css.submitButton, isLoading && css.submitButtonDisabled]}
                                    onPress={handleRegister}
                                    disabled={isLoading}
                                >
                                    {isLoading ? (
                                        <ActivityIndicator size="small" color="#fff" />
                                    ) : (
                                        <Text style={css.submitButtonText}>Create Account</Text>
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
                                <Text style={css.toggleText}>Already have an account? </Text>
                                <TouchableOpacity onPress={() => navigation.navigate('Login')}>
                                    <Text style={css.toggleLink}>Login here</Text>
                                </TouchableOpacity>
                            </View>
                        </Animated.View>
                    </ScrollView>
                </KeyboardAvoidingView>
            </SafeAreaView>
        </SafeAreaProvider>
    );
}
