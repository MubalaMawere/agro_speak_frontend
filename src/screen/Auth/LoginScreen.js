import React, { useState, useRef, useEffect } from 'react';
import {View, Text, TextInput, TouchableOpacity, Alert, Animated, KeyboardAvoidingView, Platform, ScrollView, ActivityIndicator,} from 'react-native';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { css } from './AdaptiveAuthStyles';

export default function LoginScreen({ navigation }) {
    const [authMethod, setAuthMethod] = useState('phone');
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

    const handleLogin = () => {
        setIsLoading(true);

        if ((!formData.phone && authMethod === 'phone') || (!formData.email && authMethod === 'email')) {
            Alert.alert('Error', `Please enter your ${authMethod}`);
            setIsLoading(false);
            return;
        }

        if (!formData.password) {
            Alert.alert('Error', 'Please enter your password');
            setIsLoading(false);
            return;
        }

        setTimeout(() => {
            setIsLoading(false);
            if(formData.phone === "0961538892" || (formData.email.trim().toLowerCase() ==="silas@chalwe.com") && (formData.password==="1234"))
            {
                Alert.alert('Success', 'Login successful!', [
                    {
                        text: 'OK',
                        onPress: () => navigation.reset({
                            index: 0,
                            routes: [{ name: 'Home' }], // Navigate to Home and reset stack
                        }),
                    },
                ]);
            }else{
                Alert.alert('failed', 'Login failed!', [
                    {
                        text: 'OK',
                        // onPress: () => navigation.reset({
                        //     index: 0,
                        //     routes: [{ name: 'Login' }], // Navigate to Login and reset stack
                        // }),
                    },
                ]);
            }

        }, 2000);
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

                        {/* Auth Method Toggle */}
                        <Animated.View
                            style={[
                                css.formSection,
                                { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }
                            ]}
                        >
                            <View style={css.authMethodContainer}>
                                <TouchableOpacity
                                    style={[css.methodButton, authMethod === 'phone' && css.activeMethod]}
                                    onPress={() => setAuthMethod('phone')}
                                >
                                    <Ionicons
                                        name="call"
                                        size={18}
                                        color={authMethod === 'phone' ? 'white' : '#4CAF50'}
                                    />
                                    <Text
                                        style={[css.methodText, authMethod === 'phone' && css.activeMethodText]}
                                    >
                                        Phone
                                    </Text>
                                </TouchableOpacity>

                                <TouchableOpacity
                                    style={[css.methodButton, authMethod === 'email' && css.activeMethod]}
                                    onPress={() => setAuthMethod('email')}
                                >
                                    <Ionicons
                                        name="mail"
                                        size={18}
                                        color={authMethod === 'email' ? 'white' : '#4CAF50'}
                                    />
                                    <Text
                                        style={[css.methodText, authMethod === 'email' && css.activeMethodText]}
                                    >
                                        Email
                                    </Text>
                                </TouchableOpacity>
                            </View>

                            {/* Form */}
                            <View style={css.formContainer}>
                                {/* Phone or Email Input */}
                                <View style={css.inputContainer}>
                                    <View style={css.inputWrapper}>
                                        <Ionicons
                                            name={authMethod === 'phone' ? 'call' : 'mail'}
                                            size={18}
                                            color="#666"
                                            style={css.inputIcon}
                                        />
                                        <TextInput
                                            style={css.textInput}
                                            placeholder={authMethod === 'phone' ? 'Phone Number' : 'Email Address'}
                                            value={authMethod === 'phone' ? formData.phone : formData.email}
                                            onChangeText={(text) =>
                                                handleInputChange(authMethod === 'phone' ? 'phone' : 'email', text)
                                            }
                                            keyboardType={authMethod === 'phone' ? 'phone-pad' : 'email-address'}
                                            placeholderTextColor="#999"
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
