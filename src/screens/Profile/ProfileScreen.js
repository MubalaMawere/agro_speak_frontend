import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    ScrollView,
    Animated,
    Dimensions,
    StatusBar,
    Alert,
    TextInput,
    Switch,
    Modal,
    ActivityIndicator,
    Image,
    KeyboardAvoidingView,
    Platform,
    Keyboard
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { getResponsiveValue } from '../Home/Styles';
import { authStorage } from '../../utils/authStorage';
import { getApiUrl, API_BASE_URL, API_ENDPOINTS } from '../../config/api';
import { handleApiError } from '../../utils/errorHandler';
import AsyncStorage from '@react-native-async-storage/async-storage';

const { width: screenWidth } = Dimensions.get('window');

const ProfileScreen = ({ visible, onClose, navigation }) => {
    const slideAnim = useRef(new Animated.Value(-screenWidth)).current;
    const overlayOpacity = useRef(new Animated.Value(0)).current;
    
    const [loading, setLoading] = useState(false);
    const [loggingOut, setLoggingOut] = useState(false);
    const [notificationsEnabled, setNotificationsEnabled] = useState(true);
    const [locationEnabled, setLocationEnabled] = useState(true);

    // Real user data
    const [userProfile, setUserProfile] = useState({
        id: null,
        email: '',
        name: '',
        phone: '',
        avatarUrl: null,
        createdAt: '',
        updatedAt: '',
        role: 'Farmer',
        location: '',
        farmSize: '',
        primaryCrop: '',
    });

    // Removed edit handlers - Profile is now read-only

    // Load user profile data when component mounts or becomes visible
    useEffect(() => {
        if (visible) {
            loadUserProfile();
            Animated.parallel([
                Animated.timing(slideAnim, {
                    toValue: 0,
                    duration: 300,
                    useNativeDriver: true,
                }),
                Animated.timing(overlayOpacity, {
                    toValue: 1,
                    duration: 300,
                    useNativeDriver: true,
                }),
            ]).start();
        } else {
            Animated.parallel([
                Animated.timing(slideAnim, {
                    toValue: -screenWidth,
                    duration: 250,
                    useNativeDriver: true,
                }),
                Animated.timing(overlayOpacity, {
                    toValue: 0,
                    duration: 250,
                    useNativeDriver: true,
                }),
            ]).start();
        }
    }, [visible]);

    const loadUserProfile = async () => {
        try {
            setLoading(true);
            
            const storedUserData = await authStorage.getUserData();
            
            if (storedUserData) {
                setUserProfile(prev => ({
                    ...prev,
                    email: storedUserData.email || '',
                    role: storedUserData.role || 'Farmer',
                    location: storedUserData.location || '',
                    farmSize: storedUserData.farmSize || '',
                    primaryCrop: storedUserData.primaryCrop || '',
                }));
            }

            await fetchProfileFromAPI();

        } catch (error) {
            console.error('Error loading profile:', error);
            Alert.alert('Error', 'Failed to load profile data');
        } finally {
            setLoading(false);
        }
    };

    const fetchProfileFromAPI = async () => {
        try {
            const token = await authStorage.getToken();
            if (!token) {
                console.log('No token available for profile fetch');
                return;
            }

            console.log('Fetching profile from API...');
            
            const response = await fetch(getApiUrl(API_ENDPOINTS.PROFILE), {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });

            if (response.ok) {
                const profileData = await response.json();
                console.log('Profile data received:', profileData);

                const mappedProfile = {
                    id: profileData.id,
                    email: profileData.email,
                    name: profileData.fullName || '',
                    phone: profileData.phone || '',
                    avatarUrl: profileData.avatarUrl,
                    createdAt: profileData.createdAt,
                    updatedAt: profileData.updatedAt,
                    role: userProfile.role,
                    location: userProfile.location,
                    farmSize: userProfile.farmSize,
                    primaryCrop: userProfile.primaryCrop,
                };

                setUserProfile(prev => ({ ...prev, ...mappedProfile }));
                
                const mergedUserData = await authStorage.getUserData();
                await authStorage.storeUserData({
                    ...mergedUserData,
                    ...mappedProfile
                });

            } else if (response.status === 401) {
                Alert.alert('Session Expired', 'Please login again');
                handleLogout();
            } else {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }
        } catch (error) {
            console.error('Error fetching profile from API:', error);
            const errorMessage = handleApiError(error);
            if (!error.message.includes('Network request failed')) {
                Alert.alert('Error', 'Failed to load latest profile data');
            }
        }
    };

    const updateProfile = async (updatedData) => {
        try {
            const currentData = await authStorage.getUserData();
            const newUserData = { ...currentData, ...updatedData };
            await authStorage.storeUserData(newUserData);
            setUserProfile(prev => ({ ...prev, ...updatedData }));

            try {
                const backendResponse = await updateProfileOnAPI(updatedData);
                
                if (backendResponse) {
                    const mappedProfile = {
                        id: backendResponse.id,
                        email: backendResponse.email,
                        name: backendResponse.fullName || '',
                        phone: backendResponse.phone || '',
                        avatarUrl: backendResponse.avatarUrl,
                        updatedAt: backendResponse.updatedAt,
                    };

                    setUserProfile(prev => ({ ...prev, ...mappedProfile }));
                    await authStorage.storeUserData({ ...newUserData, ...mappedProfile });
                }
            } catch (apiError) {
                console.error('Backend update failed, keeping local changes:', apiError);
                Alert.alert('Warning', 'Profile updated locally. Changes will sync when connection is restored.');
            }

            return true;
        } catch (error) {
            console.error('Error updating profile:', error);
            Alert.alert('Error', 'Failed to update profile');
            return false;
        }
    };

    const updateProfileOnAPI = async (profileData) => {
        try {
            const token = await authStorage.getToken();
            if (!token) throw new Error('No auth token available');

            const backendData = {
                fullName: profileData.name || '',
                phone: profileData.phone || '',
            };

            console.log('Updating profile on API:', backendData);

            const response = await fetch(getApiUrl(API_ENDPOINTS.UPDATE_PROFILE), {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(backendData),
            });

            if (response.ok) {
                const updatedProfile = await response.json();
                console.log('Profile updated successfully:', updatedProfile);
                return updatedProfile;
            } else if (response.status === 401) {
                throw new Error('Authentication failed - please login again');
            } else {
                const errorText = await response.text();
                throw new Error(`Failed to update profile: ${errorText}`);
            }
        } catch (error) {
            console.error('Error updating profile on API:', error);
            throw error;
        }
    };

    const handleAvatarUpload = () => {
        Alert.alert(
            'Update Profile Picture',
            'Choose an option',
            [
                { text: 'Cancel', style: 'cancel' },
                { text: 'Take Photo', onPress: () => Alert.alert('Info', 'Camera functionality coming soon!') },
                { text: 'Choose from Gallery', onPress: () => Alert.alert('Info', 'Gallery functionality coming soon!') },
            ]
        );
    };

    const savePreferences = async () => {
        try {
            const preferences = {
                notificationsEnabled,
                locationEnabled,
            };
            
            await AsyncStorage.setItem('user_preferences', JSON.stringify(preferences));
            
            console.log('Preferences saved:', preferences);
        } catch (error) {
            console.error('Error saving preferences:', error);
        }
    };

    const loadPreferences = async () => {
        try {
            const preferences = await AsyncStorage.getItem('user_preferences');
            if (preferences) {
                const parsed = JSON.parse(preferences);
                setNotificationsEnabled(parsed.notificationsEnabled ?? true);
                setLocationEnabled(parsed.locationEnabled ?? true);
            }
        } catch (error) {
            console.error('Error loading preferences:', error);
        }
    };

    useEffect(() => {
        if (visible) {
            loadPreferences();
        }
    }, [visible]);

    // Removed save functionality - Profile is now read-only

    const handleLogout = () => {
        Alert.alert(
            'Logout',
            'Are you sure you want to logout?',
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Logout',
                    style: 'destructive',
                    onPress: async () => {
                        try {
                            setLoggingOut(true);
                            
                            await authStorage.clearAuthData();
                            
                            onClose();
                            
                            if (navigation) {
                                navigation.reset({
                                    index: 0,
                                    routes: [{ name: 'Login' }],
                                });
                            }
                            
                            Alert.alert('Success', 'You have been logged out successfully');
                        } catch (error) {
                            console.error('Logout error:', error);
                            Alert.alert('Error', 'Failed to logout. Please try again.');
                        } finally {
                            setLoggingOut(false);
                        }
                    }
                }
            ]
        );
    };

    const ProfileHeader = () => (
        <View style={styles.profileHeader}>
            <View style={styles.avatarContainer}>
                <View style={styles.avatar}>
                    {userProfile.avatarUrl ? (
                        <Image 
                            source={{ uri: `${API_BASE_URL}${userProfile.avatarUrl}` }}
                            style={styles.avatarImage}
                        />
                    ) : (
                        <Ionicons name="person" size={getResponsiveValue(40, 45, 50)} color="#4CAF50" />
                    )}
                </View>
                <TouchableOpacity style={styles.cameraButton} onPress={handleAvatarUpload}>
                    <Ionicons name="camera" size={16} color="white" />
                </TouchableOpacity>
            </View>
            
            <View style={styles.profileInfo}>
                <Text style={styles.profileName}>
                    {userProfile.name || 'User'}
                </Text>
                <Text style={styles.profileEmail}>{userProfile.email}</Text>
                <View style={styles.joinedContainer}>
                    <Ionicons name="time" size={14} color="#666" />
                    <Text style={styles.joinedText}>
                        Joined {userProfile.createdAt ? 
                            new Date(userProfile.createdAt).toLocaleDateString('en-US', { 
                                year: 'numeric', 
                                month: 'long' 
                            }) : 'Recently'}
                    </Text>
                </View>
            </View>


        </View>
    );

    const ProfileSection = ({ title, children, icon }) => (
        <View style={styles.profileSection}>
            <View style={styles.sectionHeader}>
                <Ionicons name={icon} size={20} color="#4CAF50" />
                <Text style={styles.sectionTitle}>{title}</Text>
            </View>
            {children}
        </View>
    );

    // Read-only InfoItem Component
    const InfoItem = ({ label, value }) => {
        return (
            <View style={styles.infoItem}>
                <Text style={styles.infoLabel}>{label}</Text>
                <Text style={styles.infoValue}>{value || 'Not provided'}</Text>
            </View>
        );
    };

    const ToggleItem = ({ label, value, onValueChange, description }) => (
        <View style={styles.toggleItem}>
            <View style={styles.toggleInfo}>
                <Text style={styles.toggleLabel}>{label}</Text>
                {description && <Text style={styles.toggleDescription}>{description}</Text>}
            </View>
            <Switch
                value={value}
                onValueChange={onValueChange}
                trackColor={{ false: '#e0e0e0', true: '#c8e6c9' }}
                thumbColor={value ? '#4CAF50' : '#f4f3f4'}
            />
        </View>
    );

    const MenuOption = ({ icon, title, subtitle, onPress, showArrow = true, color = '#333' }) => (
        <TouchableOpacity style={styles.menuOption} onPress={onPress} activeOpacity={0.7}>
            <View style={styles.menuIconContainer}>
                <Ionicons name={icon} size={22} color={color} />
            </View>
            <View style={styles.menuContent}>
                <Text style={[styles.menuTitle, { color }]}>{title}</Text>
                {subtitle && <Text style={styles.menuSubtitle}>{subtitle}</Text>}
            </View>
            {showArrow && <Ionicons name="chevron-forward" size={20} color="#ccc" />}
        </TouchableOpacity>
    );

    return (
        <Modal transparent visible={visible} animationType="none">
            <View style={styles.container}>
                <Animated.View 
                    style={[
                        styles.overlay, 
                        { opacity: overlayOpacity }
                    ]}
                >
                    <TouchableOpacity 
                        style={styles.overlayTouchable}
                        onPress={onClose}
                        activeOpacity={1}
                    />
                </Animated.View>

                <Animated.View 
                    style={[
                        styles.profilePanel,
                        { transform: [{ translateX: slideAnim }] }
                    ]}
                >
                    <KeyboardAvoidingView 
                        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                        style={{ flex: 1 }}
                        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
                    >
                        <SafeAreaView style={styles.profileContent} edges={['top', 'bottom']}>
                            <StatusBar backgroundColor="rgba(0,0,0,0.5)" barStyle="light-content" />
                            
                            <View style={styles.header}>
                                <TouchableOpacity style={styles.closeButton} onPress={onClose}>
                                    <Ionicons name="close" size={24} color="#333" />
                                </TouchableOpacity>
                                <Text style={styles.headerTitle}>Profile</Text>
                                <View style={styles.headerSpacer} />
                            </View>

                            <ScrollView 
                                showsVerticalScrollIndicator={false} 
                                style={styles.scrollContent}
                                keyboardShouldPersistTaps="handled"
                                keyboardDismissMode="interactive"
                                contentInsetAdjustmentBehavior="automatic"
                            >
                                <ProfileHeader />

                                {loading && !userProfile.email && (
                                    <View style={styles.loadingOverlay}>
                                        <ActivityIndicator size="large" color="#4CAF50" />
                                        <Text style={styles.loadingText}>Loading profile...</Text>
                                    </View>
                                )}

                                <ProfileSection title="Personal Information" icon="person-outline">
                                    <InfoItem 
                                        label="Full Name" 
                                        value={userProfile.name}
                                    />
                                    <InfoItem 
                                        label="Email" 
                                        value={userProfile.email}
                                    />
                                    <InfoItem 
                                        label="Phone Number" 
                                        value={userProfile.phone}
                                    />
                                    <InfoItem 
                                        label="Location" 
                                        value={userProfile.location}
                                    />
                                </ProfileSection>

                                <ProfileSection title="Farm Information" icon="leaf-outline">
                                    <InfoItem 
                                        label="Farm Size" 
                                        value={userProfile.farmSize}
                                    />
                                    <InfoItem 
                                        label="Primary Crop" 
                                        value={userProfile.primaryCrop}
                                    />
                                </ProfileSection>

                                <ProfileSection title="Settings" icon="settings-outline">
                                    <ToggleItem
                                        label="Push Notifications"
                                        value={notificationsEnabled}
                                        onValueChange={(value) => {
                                            setNotificationsEnabled(value);
                                            savePreferences();
                                        }}
                                        description="Get alerts about weather, prices, and updates"
                                    />
                                    <ToggleItem
                                        label="Location Services"
                                        value={locationEnabled}
                                        onValueChange={(value) => {
                                            setLocationEnabled(value);
                                            savePreferences();
                                        }}
                                        description="Allow location access for weather and local information"
                                    />
                                </ProfileSection>

                                <ProfileSection title="More Options" icon="menu-outline">
                                    <MenuOption
                                        icon="shield-checkmark"
                                        title="Privacy & Security"
                                        subtitle="Manage your privacy settings"
                                        onPress={() => Alert.alert('Info', 'Privacy settings coming soon!')}
                                    />
                                    <MenuOption
                                        icon="help-circle"
                                        title="Help & Support"
                                        subtitle="Get help and contact support"
                                        onPress={() => Alert.alert('Info', 'Help section coming soon!')}
                                    />
                                    <MenuOption
                                        icon="information-circle"
                                        title="About App"
                                        subtitle="Version 1.0.0"
                                        onPress={() => Alert.alert('AGRO SPEAK', 'Version 1.0.0\nBuilt for farmers, by farmers')}
                                    />
                                </ProfileSection>

                                <View style={styles.actionButtons}>
                                    <TouchableOpacity 
                                        style={[styles.logoutButton, loggingOut && styles.logoutButtonDisabled]}
                                        onPress={handleLogout}
                                        disabled={loggingOut}
                                    >
                                        {loggingOut ? (
                                            <ActivityIndicator size="small" color="#f44336" />
                                        ) : (
                                            <>
                                                <Ionicons name="log-out" size={20} color="#f44336" />
                                                <Text style={styles.logoutButtonText}>Logout</Text>
                                            </>
                                        )}
                                    </TouchableOpacity>
                                </View>

                                <View style={styles.bottomSpacing} />
                            </ScrollView>
                        </SafeAreaView>
                    </KeyboardAvoidingView>
                </Animated.View>
            </View>
        </Modal>
    );
};

const styles = {
    container: {
        flex: 1,
        flexDirection: 'row',
    },
    overlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    overlayTouchable: {
        flex: 1,
    },
    profilePanel: {
        width: screenWidth * 0.85,
        backgroundColor: 'white',
        elevation: 10,
        shadowColor: '#000',
        shadowOffset: { width: 2, height: 0 },
        shadowOpacity: 0.25,
        shadowRadius: 10,
    },
    profileContent: {
        flex: 1,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingVertical: 15,
        backgroundColor: 'white',
        borderBottomWidth: 1,
        borderBottomColor: '#f0f0f0',
    },
    closeButton: {
        padding: 5,
    },
    headerTitle: {
        flex: 1,
        textAlign: 'center',
        fontSize: getResponsiveValue(18, 20, 22),
        fontWeight: 'bold',
        color: '#333',
    },
    headerSpacer: {
        width: 34, // Same width as close button for centering
    },
    scrollContent: {
        flex: 1,
    },
    profileHeader: {
        backgroundColor: '#f8f9fa',
        padding: 20,
        alignItems: 'center',
        borderBottomWidth: 1,
        borderBottomColor: '#e9ecef',
        position: 'relative',
    },
    avatarContainer: {
        position: 'relative',
        marginBottom: 15,
    },
    avatar: {
        width: getResponsiveValue(80, 90, 100),
        height: getResponsiveValue(80, 90, 100),
        borderRadius: getResponsiveValue(40, 45, 50),
        backgroundColor: '#e8f5e8',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 3,
        borderColor: '#4CAF50',
        overflow: 'hidden',
    },
    avatarImage: {
        width: '100%',
        height: '100%',
        borderRadius: getResponsiveValue(40, 45, 50),
    },
    cameraButton: {
        position: 'absolute',
        bottom: 0,
        right: 0,
        backgroundColor: '#4CAF50',
        borderRadius: 15,
        width: 30,
        height: 30,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 2,
        borderColor: 'white',
    },
    profileInfo: {
        alignItems: 'center',
    },
    profileName: {
        fontSize: getResponsiveValue(20, 22, 24),
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 4,
    },
    profileEmail: {
        fontSize: getResponsiveValue(14, 15, 16),
        color: '#666',
        marginBottom: 8,
    },
    joinedContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    joinedText: {
        fontSize: getResponsiveValue(12, 13, 14),
        color: '#666',
        marginLeft: 5,
    },
    profileSection: {
        backgroundColor: 'white',
        marginVertical: 8,
        paddingVertical: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#f0f0f0',
    },
    sectionHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 20,
        marginBottom: 15,
    },
    sectionTitle: {
        fontSize: getResponsiveValue(16, 17, 18),
        fontWeight: '600',
        color: '#333',
        marginLeft: 10,
    },
    infoItem: {
        paddingHorizontal: 20,
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#f8f9fa',
    },
    infoLabel: {
        fontSize: getResponsiveValue(12, 13, 14),
        color: '#666',
        marginBottom: 4,
        fontWeight: '500',
    },
    infoValue: {
        fontSize: getResponsiveValue(15, 16, 17),
        color: '#333',
    },
    toggleItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingVertical: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#f8f9fa',
    },
    toggleInfo: {
        flex: 1,
        marginRight: 15,
    },
    toggleLabel: {
        fontSize: getResponsiveValue(15, 16, 17),
        color: '#333',
        marginBottom: 2,
    },
    toggleDescription: {
        fontSize: getResponsiveValue(12, 13, 14),
        color: '#666',
    },
    menuOption: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingVertical: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#f8f9fa',
    },
    menuIconContainer: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#f8f9fa',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 15,
    },
    menuContent: {
        flex: 1,
    },
    menuTitle: {
        fontSize: getResponsiveValue(15, 16, 17),
        fontWeight: '500',
        marginBottom: 2,
    },
    menuSubtitle: {
        fontSize: getResponsiveValue(12, 13, 14),
        color: '#666',
    },
    actionButtons: {
        padding: 20,
    },
    logoutButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#fff5f5',
        borderRadius: 25,
        paddingVertical: 15,
        borderWidth: 1,
        borderColor: '#f44336',
    },
    logoutButtonText: {
        color: '#f44336',
        fontSize: getResponsiveValue(16, 17, 18),
        fontWeight: '600',
        marginLeft: 8,
    },
    logoutButtonDisabled: {
        opacity: 0.5,
    },
    bottomSpacing: {
        height: 20,
    },
    loadingOverlay: {
        padding: 40,
        alignItems: 'center',
        justifyContent: 'center',
    },
    loadingText: {
        marginTop: 10,
        fontSize: getResponsiveValue(14, 15, 16),
        color: '#666',
        textAlign: 'center',
    },
};

export default ProfileScreen;