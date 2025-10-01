import React, { useState } from 'react';
import { 
    View, 
    Text, 
    TouchableOpacity, 
    StyleSheet, 
    ScrollView, 
    Alert,
    SafeAreaView,
    StatusBar
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import useLocation from '../../hooks/useLocation';
import { useWeather } from '../../hooks/useWeather';
import WeatherDisplay from '../../components/WeatherDisplay';

const WeatherTestScreen = ({ navigation }) => {
    const [testResults, setTestResults] = useState([]);

    // Location hook
    const {
        location,
        address,
        loading: locationLoading,
        error: locationError,
        getCurrentLocation,
        isLocationAvailable
    } = useLocation();

    // Weather hook
    const {
        weather,
        loading: weatherLoading,
        error: weatherError,
        fetchWeather,
        fetchCurrentWeather,
        fetchForecast,
        fetchSoilData,
        refreshWeather,
        clearWeather
    } = useWeather();

    const addTestResult = (test, success, data) => {
        const result = {
            id: Date.now(),
            test,
            success,
            data,
            timestamp: new Date().toLocaleTimeString()
        };
        setTestResults(prev => [result, ...prev]);
    };

    const testLocationService = async () => {
        try {
            const locationData = await getCurrentLocation();
            addTestResult('Location Service', true, {
                latitude: locationData.latitude,
                longitude: locationData.longitude,
                accuracy: locationData.accuracy,
                address: locationData.address?.formattedAddress
            });
        } catch (error) {
            addTestResult('Location Service', false, error.message);
        }
    };

    const testCurrentWeather = async () => {
        if (!location) {
            Alert.alert('Error', 'Please get location first');
            return;
        }

        try {
            const currentWeather = await fetchCurrentWeather(location);
            addTestResult('Current Weather', true, {
                temperature: currentWeather.temperature,
                condition: currentWeather.condition,
                windSpeed: currentWeather.windSpeed,
                location: `${location.latitude}, ${location.longitude}`
            });
        } catch (error) {
            addTestResult('Current Weather', false, error.message);
        }
    };

    const testDailyForecast = async () => {
        if (!location) {
            Alert.alert('Error', 'Please get location first');
            return;
        }

        try {
            const forecast = await fetchForecast(5, location);
            addTestResult('5-Day Forecast', true, {
                days: forecast.length,
                firstDay: forecast[0],
                location: `${location.latitude}, ${location.longitude}`
            });
        } catch (error) {
            addTestResult('5-Day Forecast', false, error.message);
        }
    };

    const testSoilData = async () => {
        if (!location) {
            Alert.alert('Error', 'Please get location first');
            return;
        }

        try {
            const soilData = await fetchSoilData(location);
            addTestResult('Soil Data', true, {
                temperature: soilData.current.temperature,
                moisture: soilData.current.moisture,
                insights: soilData.insights.length,
                location: `${location.latitude}, ${location.longitude}`
            });
        } catch (error) {
            addTestResult('Soil Data', false, error.message);
        }
    };

    const testFullWeather = async () => {
        if (!location) {
            Alert.alert('Error', 'Please get location first');
            return;
        }

        try {
            await fetchWeather(location);
            addTestResult('Full Weather Package', true, {
                hasCurrent: !!weather?.current,
                hasForecast: !!weather?.forecast,
                hasSoil: !!weather?.soil,
                location: `${location.latitude}, ${location.longitude}`
            });
        } catch (error) {
            addTestResult('Full Weather Package', false, error.message);
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar backgroundColor="white" barStyle="dark-content" />
            
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Ionicons name="arrow-back" size={24} color="#2C3E50" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Weather System Test</Text>
                <TouchableOpacity onPress={() => setTestResults([])}>
                    <Ionicons name="trash" size={24} color="#E74C3C" />
                </TouchableOpacity>
            </View>

            <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
                {/* Location Status */}
                <View style={styles.statusCard}>
                    <Text style={styles.statusTitle}>Location Status</Text>
                    <Text style={styles.statusText}>
                        Available: {isLocationAvailable ? '✅' : '❌'}
                    </Text>
                    {location && (
                        <Text style={styles.statusDetail}>
                            Lat: {location.latitude.toFixed(6)}, Lon: {location.longitude.toFixed(6)}
                        </Text>
                    )}
                    {address && (
                        <Text style={styles.statusDetail}>
                            Address: {address.formattedAddress}
                        </Text>
                    )}
                    {locationError && (
                        <Text style={[styles.statusDetail, { color: '#E74C3C' }]}>
                            Error: {locationError}
                        </Text>
                    )}
                </View>

                {/* Test Buttons */}
                <View style={styles.testSection}>
                    <Text style={styles.sectionTitle}>Run Tests</Text>
                    
                    <TouchableOpacity 
                        style={[styles.testButton, locationLoading && styles.testButtonLoading]} 
                        onPress={testLocationService}
                        disabled={locationLoading}
                    >
                        <Ionicons name="location" size={20} color="white" />
                        <Text style={styles.testButtonText}>
                            {locationLoading ? 'Getting Location...' : 'Test Location'}
                        </Text>
                    </TouchableOpacity>

                    <TouchableOpacity 
                        style={[styles.testButton, { backgroundColor: '#FF9800' }, weatherLoading && styles.testButtonLoading]} 
                        onPress={testCurrentWeather}
                        disabled={weatherLoading || !location}
                    >
                        <Ionicons name="sunny" size={20} color="white" />
                        <Text style={styles.testButtonText}>
                            {weatherLoading ? 'Loading...' : 'Test Current Weather'}
                        </Text>
                    </TouchableOpacity>

                    <TouchableOpacity 
                        style={[styles.testButton, { backgroundColor: '#9C27B0' }, weatherLoading && styles.testButtonLoading]} 
                        onPress={testDailyForecast}
                        disabled={weatherLoading || !location}
                    >
                        <Ionicons name="calendar" size={20} color="white" />
                        <Text style={styles.testButtonText}>
                            {weatherLoading ? 'Loading...' : 'Test 5-Day Forecast'}
                        </Text>
                    </TouchableOpacity>

                    <TouchableOpacity 
                        style={[styles.testButton, { backgroundColor: '#795548' }, weatherLoading && styles.testButtonLoading]} 
                        onPress={testSoilData}
                        disabled={weatherLoading || !location}
                    >
                        <Ionicons name="leaf" size={20} color="white" />
                        <Text style={styles.testButtonText}>
                            {weatherLoading ? 'Loading...' : 'Test Soil Data'}
                        </Text>
                    </TouchableOpacity>

                    <TouchableOpacity 
                        style={[styles.testButton, { backgroundColor: '#607D8B' }, weatherLoading && styles.testButtonLoading]} 
                        onPress={testFullWeather}
                        disabled={weatherLoading || !location}
                    >
                        <Ionicons name="cloudy" size={20} color="white" />
                        <Text style={styles.testButtonText}>
                            {weatherLoading ? 'Loading...' : 'Test Full Weather'}
                        </Text>
                    </TouchableOpacity>
                </View>

                {/* Weather Display */}
                {weather && (
                    <View style={styles.weatherSection}>
                        <Text style={styles.sectionTitle}>Live Weather Data</Text>
                        <WeatherDisplay 
                            weather={weather}
                            loading={weatherLoading}
                            error={weatherError}
                            onRefresh={refreshWeather}
                            showForecast={true}
                            showSoil={true}
                            compact={false}
                        />
                    </View>
                )}

                {/* Test Results */}
                {testResults.length > 0 && (
                    <View style={styles.resultsSection}>
                        <Text style={styles.sectionTitle}>Test Results</Text>
                        {testResults.map(result => (
                            <View key={result.id} style={styles.resultCard}>
                                <View style={styles.resultHeader}>
                                    <Ionicons 
                                        name={result.success ? 'checkmark-circle' : 'close-circle'} 
                                        size={20} 
                                        color={result.success ? '#4CAF50' : '#E74C3C'} 
                                    />
                                    <Text style={styles.resultTest}>{result.test}</Text>
                                    <Text style={styles.resultTime}>{result.timestamp}</Text>
                                </View>
                                <Text style={styles.resultData}>
                                    {typeof result.data === 'string' 
                                        ? result.data 
                                        : JSON.stringify(result.data, null, 2)
                                    }
                                </Text>
                            </View>
                        ))}
                    </View>
                )}
            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f8f9fa',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingVertical: 15,
        backgroundColor: 'white',
        borderBottomWidth: 1,
        borderBottomColor: '#ECF0F1',
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#2C3E50',
    },
    content: {
        flex: 1,
        paddingHorizontal: 20,
    },
    statusCard: {
        backgroundColor: 'white',
        borderRadius: 8,
        padding: 15,
        marginTop: 15,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        elevation: 2,
    },
    statusTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#2C3E50',
        marginBottom: 8,
    },
    statusText: {
        fontSize: 14,
        color: '#2C3E50',
        marginBottom: 4,
    },
    statusDetail: {
        fontSize: 12,
        color: '#7F8C8D',
        marginBottom: 2,
    },
    testSection: {
        marginTop: 20,
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#2C3E50',
        marginBottom: 15,
    },
    testButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#4A90E2',
        borderRadius: 8,
        paddingHorizontal: 20,
        paddingVertical: 12,
        marginBottom: 10,
    },
    testButtonLoading: {
        opacity: 0.6,
    },
    testButtonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: '500',
        marginLeft: 10,
    },
    weatherSection: {
        marginTop: 20,
    },
    resultsSection: {
        marginTop: 20,
        marginBottom: 30,
    },
    resultCard: {
        backgroundColor: 'white',
        borderRadius: 8,
        padding: 15,
        marginBottom: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        elevation: 2,
    },
    resultHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8,
    },
    resultTest: {
        fontSize: 14,
        fontWeight: '600',
        color: '#2C3E50',
        marginLeft: 8,
        flex: 1,
    },
    resultTime: {
        fontSize: 12,
        color: '#7F8C8D',
    },
    resultData: {
        fontSize: 12,
        color: '#7F8C8D',
        fontFamily: 'monospace',
        backgroundColor: '#F8F9FA',
        padding: 8,
        borderRadius: 4,
    },
});

export default WeatherTestScreen;