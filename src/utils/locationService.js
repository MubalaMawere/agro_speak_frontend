import * as Location from 'expo-location';
import { Alert } from 'react-native';

class LocationService {
    constructor() {
        this.currentLocation = null;
        this.watchId = null;
    }

    // Request location permissions
    async requestPermissions() {
        try {
            const { status: foregroundStatus } = await Location.requestForegroundPermissionsAsync();
            
            if (foregroundStatus !== 'granted') {
                Alert.alert(
                    'Location Permission Required',
                    'AGRO SPEAK needs location access to provide weather updates and local farming information.',
                    [
                        { text: 'Cancel', style: 'cancel' },
                        { text: 'Open Settings', onPress: () => Location.requestForegroundPermissionsAsync() }
                    ]
                );
                return false;
            }
            
            return true;
        } catch (error) {
            console.error('Error requesting location permissions:', error);
            return false;
        }
    }

    // Get current location once
    async getCurrentLocation() {
        try {
            const hasPermission = await this.requestPermissions();
            if (!hasPermission) {
                throw new Error('Location permission denied');
            }

            console.log('Getting current location...');
            
            const location = await Location.getCurrentPositionAsync({
                accuracy: Location.Accuracy.Balanced,
                timeout: 10000,
                maximumAge: 60000, // Cache for 1 minute
            });

            this.currentLocation = {
                latitude: location.coords.latitude,
                longitude: location.coords.longitude,
                accuracy: location.coords.accuracy,
                timestamp: location.timestamp,
            };

            // Get address from coordinates
            const address = await this.reverseGeocode(
                location.coords.latitude, 
                location.coords.longitude
            );

            return {
                ...this.currentLocation,
                address
            };

        } catch (error) {
            console.error('Error getting current location:', error);
            throw this.handleLocationError(error);
        }
    }

    // Convert coordinates to address
    async reverseGeocode(latitude, longitude) {
        try {
            const result = await Location.reverseGeocodeAsync({
                latitude,
                longitude
            });

            if (result && result.length > 0) {
                const address = result[0];
                return {
                    street: address.street || '',
                    city: address.city || address.district || '',
                    region: address.region || address.subregion || '',
                    country: address.country || '',
                    postalCode: address.postalCode || '',
                    formattedAddress: this.formatAddress(address)
                };
            }

            return null;
        } catch (error) {
            console.error('Error reverse geocoding:', error);
            return null;
        }
    }

    // Format address for display
    formatAddress(address) {
        const parts = [];
        
        if (address.street) parts.push(address.street);
        if (address.city || address.district) parts.push(address.city || address.district);
        if (address.region || address.subregion) parts.push(address.region || address.subregion);
        if (address.country) parts.push(address.country);
        
        return parts.join(', ') || 'Unknown location';
    }

    // Watch location changes (for real-time updates)
    async startWatchingLocation(callback) {
        try {
            const hasPermission = await this.requestPermissions();
            if (!hasPermission) {
                throw new Error('Location permission denied');
            }

            this.watchId = await Location.watchPositionAsync(
                {
                    accuracy: Location.Accuracy.Balanced,
                    timeInterval: 30000, // Update every 30 seconds
                    distanceInterval: 100, // Update when moved 100 meters
                },
                (location) => {
                    this.currentLocation = {
                        latitude: location.coords.latitude,
                        longitude: location.coords.longitude,
                        accuracy: location.coords.accuracy,
                        timestamp: location.timestamp,
                    };
                    
                    if (callback) {
                        callback(this.currentLocation);
                    }
                }
            );

            console.log('Started watching location changes');
            return this.watchId;

        } catch (error) {
            console.error('Error starting location watch:', error);
            throw this.handleLocationError(error);
        }
    }

    // Stop watching location
    stopWatchingLocation() {
        if (this.watchId) {
            this.watchId.remove();
            this.watchId = null;
            console.log('Stopped watching location changes');
        }
    }

    // Check if location services are enabled
    async isLocationEnabled() {
        try {
            return await Location.hasServicesEnabledAsync();
        } catch (error) {
            console.error('Error checking location services:', error);
            return false;
        }
    }

    // Get cached location
    getCachedLocation() {
        return this.currentLocation;
    }

    // Handle location errors
    handleLocationError(error) {
        if (error.code === 'E_LOCATION_SERVICES_DISABLED') {
            return new Error('Location services are disabled. Please enable them in your device settings.');
        } else if (error.code === 'E_LOCATION_TIMEOUT') {
            return new Error('Location request timed out. Please try again.');
        } else if (error.code === 'E_LOCATION_UNAVAILABLE') {
            return new Error('Location is currently unavailable. Please try again later.');
        } else {
            return new Error('Unable to get your location. Please check your settings and try again.');
        }
    }

    // Calculate distance between two points (in kilometers)
    calculateDistance(lat1, lon1, lat2, lon2) {
        const R = 6371; // Earth's radius in kilometers
        const dLat = this.toRadians(lat2 - lat1);
        const dLon = this.toRadians(lon2 - lon1);
        
        const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
                Math.cos(this.toRadians(lat1)) * Math.cos(this.toRadians(lat2)) * 
                Math.sin(dLon/2) * Math.sin(dLon/2);
        
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
        const distance = R * c;
        
        return Math.round(distance * 100) / 100; // Round to 2 decimal places
    }

    // Convert degrees to radians
    toRadians(degrees) {
        return degrees * (Math.PI / 180);
    }

    // Format coordinates for display
    formatCoordinates(latitude, longitude) {
        const lat = Math.abs(latitude);
        const lon = Math.abs(longitude);
        const latDir = latitude >= 0 ? 'N' : 'S';
        const lonDir = longitude >= 0 ? 'E' : 'W';
        
        return `${lat.toFixed(6)}°${latDir}, ${lon.toFixed(6)}°${lonDir}`;
    }
}

// Export singleton instance
export const locationService = new LocationService();
export default locationService;