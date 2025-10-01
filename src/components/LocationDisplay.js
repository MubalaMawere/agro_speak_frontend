import React from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import useLocation from '../hooks/useLocation';

const LocationDisplay = ({ style, onLocationPress }) => {
    const {
        location,
        address,
        loading,
        error,
        getCurrentLocation,
        isLocationAvailable,
        getFormattedAddress
    } = useLocation();

    const handlePress = async () => {
        try {
            await getCurrentLocation();
            if (onLocationPress) {
                onLocationPress({ location, address });
            }
        } catch (err) {
            console.log('Location error:', err);
        }
    };

    return (
        <TouchableOpacity
            style={[{
                flexDirection: 'row',
                alignItems: 'center',
                padding: 10,
                backgroundColor: '#f8f9fa',
                borderRadius: 8,
                borderWidth: 1,
                borderColor: '#e9ecef'
            }, style]}
            onPress={handlePress}
            activeOpacity={0.7}
        >
            {loading ? (
                <ActivityIndicator size="small" color="#4CAF50" />
            ) : (
                <Ionicons
                    name={isLocationAvailable ? "location" : "location-outline"}
                    size={16}
                    color={isLocationAvailable ? "#4CAF50" : "#666"}
                    style={{ marginRight: 8 }}
                />
            )}
            
            <View style={{ flex: 1 }}>
                <Text style={{
                    fontSize: 14,
                    color: '#333',
                    fontWeight: '500'
                }}>
                    {loading ? 'Getting location...' :
                     error ? 'Tap to get location' :
                     address ? address.city || address.region || 'Current location' :
                     'Tap for location'}
                </Text>
                
                {address && !loading && (
                    <Text style={{
                        fontSize: 12,
                        color: '#666',
                        marginTop: 2
                    }} numberOfLines={1}>
                        {address.formattedAddress}
                    </Text>
                )}
                
                {error && !loading && (
                    <Text style={{
                        fontSize: 12,
                        color: '#f44336',
                        marginTop: 2
                    }}>
                        Location unavailable
                    </Text>
                )}
            </View>

            {isLocationAvailable && (
                <Ionicons name="checkmark-circle" size={16} color="#4CAF50" />
            )}
        </TouchableOpacity>
    );
};

export default LocationDisplay;