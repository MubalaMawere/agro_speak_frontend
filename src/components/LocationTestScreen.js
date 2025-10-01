import React, { useState } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    ScrollView,
    Alert,
    ActivityIndicator,
    StyleSheet
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import useLocation from '../hooks/useLocation';

const LocationTestScreen = () => {
    const {
        location,
        address,
        loading,
        error,
        getCurrentLocation,
        getFormattedAddress,
        getCoordinatesString,
        isLocationAvailable,
        coordinates
    } = useLocation();

    const [fullLocationData, setFullLocationData] = useState(null);

    const handleGetLocation = async () => {
        try {
            const locationData = await getCurrentLocation();
            setFullLocationData(locationData);
            
            // Show complete data in alert
            const info = `
📍 COORDINATES:
Latitude: ${locationData.latitude}
Longitude: ${locationData.longitude}
Accuracy: ${locationData.accuracy}m

🏠 ADDRESS:
${locationData.address ? locationData.address.formattedAddress : 'Address not available'}

${locationData.address ? `
Street: ${locationData.address.street || 'N/A'}
City: ${locationData.address.city || 'N/A'}
Region: ${locationData.address.region || 'N/A'}
Country: ${locationData.address.country || 'N/A'}
Postal Code: ${locationData.address.postalCode || 'N/A'}
` : ''}`;

            Alert.alert('Complete Location Data', info);
            
        } catch (err) {
            console.error('Location test error:', err);
        }
    };

    return (
        <ScrollView style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>Location Test</Text>
                <Text style={styles.subtitle}>Test current location name and coordinates</Text>
            </View>

            <View style={styles.buttonContainer}>
                <TouchableOpacity
                    style={[styles.button, loading && styles.buttonDisabled]}
                    onPress={handleGetLocation}
                    disabled={loading}
                >
                    {loading ? (
                        <ActivityIndicator color="white" size="small" />
                    ) : (
                        <Ionicons name="location" size={20} color="white" />
                    )}
                    <Text style={styles.buttonText}>
                        {loading ? 'Getting Location...' : 'Get Current Location'}
                    </Text>
                </TouchableOpacity>
            </View>

            {/* Status Indicator */}
            <View style={styles.statusContainer}>
                <View style={[styles.statusIndicator, { 
                    backgroundColor: isLocationAvailable ? '#4CAF50' : error ? '#f44336' : '#ffc107' 
                }]}>
                    <Ionicons 
                        name={isLocationAvailable ? 'checkmark-circle' : error ? 'close-circle' : 'time'} 
                        size={16} 
                        color="white" 
                    />
                    <Text style={styles.statusText}>
                        {loading ? 'Loading...' : 
                         error ? 'Error' :
                         isLocationAvailable ? 'Location Available' : 'No Location'}
                    </Text>
                </View>
            </View>

            {/* Coordinates Section */}
            {location && (
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>📍 Coordinates</Text>
                    <View style={styles.dataContainer}>
                        <View style={styles.dataRow}>
                            <Text style={styles.dataLabel}>Latitude:</Text>
                            <Text style={styles.dataValue}>{location.latitude.toFixed(6)}</Text>
                        </View>
                        <View style={styles.dataRow}>
                            <Text style={styles.dataLabel}>Longitude:</Text>
                            <Text style={styles.dataValue}>{location.longitude.toFixed(6)}</Text>
                        </View>
                        <View style={styles.dataRow}>
                            <Text style={styles.dataLabel}>Accuracy:</Text>
                            <Text style={styles.dataValue}>{location.accuracy}m</Text>
                        </View>
                        <View style={styles.dataRow}>
                            <Text style={styles.dataLabel}>Formatted:</Text>
                            <Text style={styles.dataValue}>{getCoordinatesString()}</Text>
                        </View>
                        <View style={styles.dataRow}>
                            <Text style={styles.dataLabel}>Simple:</Text>
                            <Text style={styles.dataValue}>{coordinates}</Text>
                        </View>
                    </View>
                </View>
            )}

            {/* Address Section */}
            {address && (
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>🏠 Address Information</Text>
                    <View style={styles.dataContainer}>
                        <View style={styles.dataRow}>
                            <Text style={styles.dataLabel}>Full Address:</Text>
                            <Text style={styles.dataValue} numberOfLines={3}>
                                {address.formattedAddress}
                            </Text>
                        </View>
                        {address.street && (
                            <View style={styles.dataRow}>
                                <Text style={styles.dataLabel}>Street:</Text>
                                <Text style={styles.dataValue}>{address.street}</Text>
                            </View>
                        )}
                        {address.city && (
                            <View style={styles.dataRow}>
                                <Text style={styles.dataLabel}>City:</Text>
                                <Text style={styles.dataValue}>{address.city}</Text>
                            </View>
                        )}
                        {address.region && (
                            <View style={styles.dataRow}>
                                <Text style={styles.dataLabel}>Region/State:</Text>
                                <Text style={styles.dataValue}>{address.region}</Text>
                            </View>
                        )}
                        {address.country && (
                            <View style={styles.dataRow}>
                                <Text style={styles.dataLabel}>Country:</Text>
                                <Text style={styles.dataValue}>{address.country}</Text>
                            </View>
                        )}
                        {address.postalCode && (
                            <View style={styles.dataRow}>
                                <Text style={styles.dataLabel}>Postal Code:</Text>
                                <Text style={styles.dataValue}>{address.postalCode}</Text>
                            </View>
                        )}
                    </View>
                </View>
            )}

            {/* Error Section */}
            {error && (
                <View style={styles.section}>
                    <Text style={[styles.sectionTitle, { color: '#f44336' }]}>❌ Error</Text>
                    <View style={[styles.dataContainer, { borderColor: '#f44336' }]}>
                        <Text style={[styles.dataValue, { color: '#f44336' }]}>{error}</Text>
                    </View>
                </View>
            )}

            {/* Quick Actions */}
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>🔧 Quick Actions</Text>
                <TouchableOpacity
                    style={styles.actionButton}
                    onPress={() => {
                        if (coordinates) {
                            Alert.alert('Coordinates', coordinates);
                        }
                    }}
                    disabled={!coordinates}
                >
                    <Text style={styles.actionButtonText}>Show Coordinates</Text>
                </TouchableOpacity>
                
                <TouchableOpacity
                    style={styles.actionButton}
                    onPress={() => {
                        const addressText = getFormattedAddress();
                        Alert.alert('Current Address', addressText);
                    }}
                    disabled={!address}
                >
                    <Text style={styles.actionButtonText}>Show Address</Text>
                </TouchableOpacity>
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f8f9fa',
    },
    header: {
        padding: 20,
        backgroundColor: '#4CAF50',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: 'white',
        marginBottom: 5,
    },
    subtitle: {
        fontSize: 14,
        color: 'rgba(255,255,255,0.8)',
    },
    buttonContainer: {
        padding: 20,
    },
    button: {
        backgroundColor: '#4CAF50',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 15,
        borderRadius: 10,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    buttonDisabled: {
        backgroundColor: '#a5d6a7',
    },
    buttonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: '600',
        marginLeft: 8,
    },
    statusContainer: {
        paddingHorizontal: 20,
        marginBottom: 10,
    },
    statusIndicator: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 10,
        borderRadius: 8,
    },
    statusText: {
        color: 'white',
        marginLeft: 8,
        fontWeight: '500',
    },
    section: {
        margin: 20,
        marginTop: 10,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 10,
    },
    dataContainer: {
        backgroundColor: 'white',
        borderRadius: 10,
        padding: 15,
        borderWidth: 1,
        borderColor: '#e9ecef',
        elevation: 1,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
    },
    dataRow: {
        flexDirection: 'row',
        marginBottom: 8,
        alignItems: 'flex-start',
    },
    dataLabel: {
        fontSize: 14,
        fontWeight: '600',
        color: '#666',
        width: 100,
        marginRight: 10,
    },
    dataValue: {
        fontSize: 14,
        color: '#333',
        flex: 1,
        lineHeight: 20,
    },
    actionButton: {
        backgroundColor: '#2196F3',
        padding: 12,
        borderRadius: 8,
        marginBottom: 10,
        alignItems: 'center',
    },
    actionButtonText: {
        color: 'white',
        fontWeight: '500',
    },
});

export default LocationTestScreen;