import { useState, useEffect, useCallback } from 'react';
import { Alert } from 'react-native';
import locationService from '../utils/locationService';

export const useLocation = (options = {}) => {
    const {
        autoStart = false,
        watchLocation = false,
        onLocationUpdate = null,
        onError = null
    } = options;

    const [location, setLocation] = useState(null);
    const [address, setAddress] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [permissionGranted, setPermissionGranted] = useState(false);

    // Get current location
    const getCurrentLocation = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);

            const locationData = await locationService.getCurrentLocation();
            
            setLocation({
                latitude: locationData.latitude,
                longitude: locationData.longitude,
                accuracy: locationData.accuracy,
                timestamp: locationData.timestamp
            });
            
            setAddress(locationData.address);
            setPermissionGranted(true);

            // Log complete location data for debugging
            console.log('=== COMPLETE LOCATION DATA ===');
            console.log('📍 COORDINATES:');
            console.log('  Latitude:', locationData.latitude);
            console.log('  Longitude:', locationData.longitude);
            console.log('  Accuracy:', locationData.accuracy + 'm');
            console.log('  Timestamp:', new Date(locationData.timestamp).toLocaleString());
            
            if (locationData.address) {
                console.log('🏠 ADDRESS:');
                console.log('  Full Address:', locationData.address.formattedAddress);
                console.log('  Street:', locationData.address.street || 'N/A');
                console.log('  City:', locationData.address.city || 'N/A');
                console.log('  Region:', locationData.address.region || 'N/A');
                console.log('  Country:', locationData.address.country || 'N/A');
                console.log('  Postal Code:', locationData.address.postalCode || 'N/A');
            } else {
                console.log('🏠 ADDRESS: Not available');
            }
            console.log('===============================');

            if (onLocationUpdate) {
                onLocationUpdate(locationData);
            }

            return locationData;

        } catch (err) {
            const errorMessage = err.message || 'Failed to get location';
            setError(errorMessage);
            
            if (onError) {
                onError(err);
            } else {
                Alert.alert('Location Error', errorMessage);
            }
            
            throw err;
        } finally {
            setLoading(false);
        }
    }, [onLocationUpdate, onError]);

    // Check permissions
    const checkPermissions = useCallback(async () => {
        try {
            const hasPermission = await locationService.requestPermissions();
            setPermissionGranted(hasPermission);
            return hasPermission;
        } catch (err) {
            setError(err.message);
            setPermissionGranted(false);
            return false;
        }
    }, []);

    // Start watching location
    const startWatching = useCallback(async () => {
        try {
            await locationService.startWatchingLocation((newLocation) => {
                setLocation(newLocation);
                if (onLocationUpdate) {
                    onLocationUpdate(newLocation);
                }
            });
        } catch (err) {
            setError(err.message);
            if (onError) {
                onError(err);
            }
        }
    }, [onLocationUpdate, onError]);

    // Stop watching location
    const stopWatching = useCallback(() => {
        locationService.stopWatchingLocation();
    }, []);

    // Get formatted address
    const getFormattedAddress = useCallback(() => {
        if (!address) return 'Location not available';
        return address.formattedAddress;
    }, [address]);

    // Get coordinates as string
    const getCoordinatesString = useCallback(() => {
        if (!location) return 'Coordinates not available';
        return locationService.formatCoordinates(location.latitude, location.longitude);
    }, [location]);

    // Auto-start location if requested
    useEffect(() => {
        if (autoStart) {
            getCurrentLocation();
        }
    }, [autoStart, getCurrentLocation]);

    // Auto-watch location if requested
    useEffect(() => {
        if (watchLocation && permissionGranted) {
            startWatching();
            
            // Cleanup on unmount
            return () => {
                stopWatching();
            };
        }
    }, [watchLocation, permissionGranted, startWatching, stopWatching]);

    return {
        // Location data
        location,
        address,
        loading,
        error,
        permissionGranted,
        
        // Methods
        getCurrentLocation,
        checkPermissions,
        startWatching,
        stopWatching,
        getFormattedAddress,
        getCoordinatesString,
        
        // Computed values
        isLocationAvailable: !!location,
        hasAddress: !!address,
        coordinates: location ? `${location.latitude}, ${location.longitude}` : null
    };
};

export default useLocation;