import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const WeatherDisplay = ({ 
    weather, 
    loading = false, 
    error = null, 
    onRefresh = null,
    showForecast = true,
    showSoil = true,
    compact = false 
}) => {
    
    // Get icon name for Ionicons
    const getIoniconsName = (iconType) => {
        const iconMap = {
            'sunny': 'sunny',
            'moon': 'moon',
            'partly-sunny': 'partly-sunny',
            'cloudy-night': 'cloudy-night',
            'cloudy': 'cloudy',
            'rainy': 'rainy',
            'snow': 'snow',
            'thunderstorm': 'thunderstorm',
            'thermometer': 'thermometer',
            'water': 'water',
            'leaf': 'leaf-outline',
            'checkmark-circle': 'checkmark-circle'
        };
        return iconMap[iconType] || 'cloudy';
    };

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#4A90E2" />
                <Text style={styles.loadingText}>Loading weather data...</Text>
            </View>
        );
    }

    if (error) {
        return (
            <View style={styles.errorContainer}>
                <Ionicons name="warning" size={40} color="#E74C3C" />
                <Text style={styles.errorText}>{error}</Text>
                {onRefresh && (
                    <TouchableOpacity style={styles.retryButton} onPress={onRefresh}>
                        <Text style={styles.retryButtonText}>Try Again</Text>
                    </TouchableOpacity>
                )}
            </View>
        );
    }

    if (!weather || !weather.current) {
        return (
            <View style={styles.noDataContainer}>
                <Ionicons name="cloudy-outline" size={40} color="#95A5A6" />
                <Text style={styles.noDataText}>No weather data available</Text>
            </View>
        );
    }

    const { current, forecast, soil } = weather;

    if (compact) {
        return (
            <View style={styles.compactContainer}>
                <View style={styles.compactMain}>
                    <Ionicons 
                        name={getIoniconsName(current.icon)} 
                        size={32} 
                        color="#4A90E2" 
                    />
                    <View style={styles.compactInfo}>
                        <Text style={styles.compactTemp}>{current.temperature}°C</Text>
                        <Text style={styles.compactCondition}>{current.condition}</Text>
                    </View>
                </View>
                {onRefresh && (
                    <TouchableOpacity onPress={onRefresh}>
                        <Ionicons name="refresh" size={20} color="#4A90E2" />
                    </TouchableOpacity>
                )}
            </View>
        );
    }

    return (
        <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
            {/* Current Weather */}
            <View style={styles.currentWeatherCard}>
                <View style={styles.currentHeader}>
                    <View style={styles.currentMain}>
                        <Ionicons 
                            name={getIoniconsName(current.icon)} 
                            size={64} 
                            color="#4A90E2" 
                        />
                        <View style={styles.currentTemp}>
                            <Text style={styles.temperature}>{current.temperature}°</Text>
                            <Text style={styles.condition}>{current.condition}</Text>
                        </View>
                    </View>
                    {onRefresh && (
                        <TouchableOpacity onPress={onRefresh} style={styles.refreshButton}>
                            <Ionicons name="refresh" size={24} color="#4A90E2" />
                        </TouchableOpacity>
                    )}
                </View>

                <View style={styles.currentDetails}>
                    <View style={styles.detailItem}>
                        <Ionicons name="eye" size={16} color="#7F8C8D" />
                        <Text style={styles.detailText}>Wind: {current.windSpeed} km/h</Text>
                    </View>
                    <View style={styles.detailItem}>
                        <Ionicons name="thermometer" size={16} color="#7F8C8D" />
                        <Text style={styles.detailText}>Feels like {current.temperatureF}°F</Text>
                    </View>
                    <View style={styles.detailItem}>
                        <Ionicons name={current.isDay ? "sunny" : "moon"} size={16} color="#7F8C8D" />
                        <Text style={styles.detailText}>{current.isDay ? "Day" : "Night"}</Text>
                    </View>
                </View>
            </View>

            {/* Daily Forecast */}
            {showForecast && forecast && forecast.length > 0 && (
                <View style={styles.forecastCard}>
                    <Text style={styles.sectionTitle}>5-Day Forecast</Text>
                    <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                        {forecast.map((day, index) => (
                            <View key={index} style={styles.forecastDay}>
                                <Text style={styles.forecastDate}>
                                    {new Date(day.date).toLocaleDateString('en', { 
                                        weekday: 'short', 
                                        month: 'short', 
                                        day: 'numeric' 
                                    })}
                                </Text>
                                <Ionicons 
                                    name={getIoniconsName(day.icon)} 
                                    size={32} 
                                    color="#4A90E2" 
                                />
                                <Text style={styles.forecastCondition}>{day.condition}</Text>
                                <View style={styles.forecastTemps}>
                                    <Text style={styles.forecastHigh}>{day.maxTemp}°</Text>
                                    <Text style={styles.forecastLow}>{day.minTemp}°</Text>
                                </View>
                                {day.precipitation > 0 && (
                                    <View style={styles.precipitationInfo}>
                                        <Ionicons name="rainy" size={12} color="#3498DB" />
                                        <Text style={styles.precipitationText}>
                                            {day.precipitationMm.toFixed(1)}mm
                                        </Text>
                                    </View>
                                )}
                            </View>
                        ))}
                    </ScrollView>
                </View>
            )}

            {/* Soil Data */}
            {showSoil && soil && (
                <View style={styles.soilCard}>
                    <Text style={styles.sectionTitle}>Soil Conditions</Text>
                    
                    <View style={styles.soilCurrent}>
                        <View style={styles.soilMetric}>
                            <Ionicons name="thermometer" size={24} color="#E67E22" />
                            <Text style={styles.soilLabel}>Soil Temperature</Text>
                            <Text style={styles.soilValue}>{soil.current.temperature.toFixed(1)}°C</Text>
                        </View>
                        
                        <View style={styles.soilMetric}>
                            <Ionicons name="water" size={24} color="#3498DB" />
                            <Text style={styles.soilLabel}>Soil Moisture</Text>
                            <Text style={styles.soilValue}>{soil.current.moisture.toFixed(1)}%</Text>
                        </View>
                    </View>

                    {/* Soil Insights */}
                    {soil.insights && soil.insights.length > 0 && (
                        <View style={styles.soilInsights}>
                            <Text style={styles.insightsTitle}>Agricultural Insights</Text>
                            {soil.insights.map((insight, index) => (
                                <View key={index} style={[
                                    styles.insightItem,
                                    insight.type === 'success' && styles.insightSuccess,
                                    insight.type === 'warning' && styles.insightWarning,
                                    insight.type === 'info' && styles.insightInfo
                                ]}>
                                    <Ionicons 
                                        name={getIoniconsName(insight.icon)} 
                                        size={16} 
                                        color={
                                            insight.type === 'success' ? '#27AE60' :
                                            insight.type === 'warning' ? '#F39C12' :
                                            '#3498DB'
                                        } 
                                    />
                                    <Text style={styles.insightText}>{insight.message}</Text>
                                </View>
                            ))}
                        </View>
                    )}
                </View>
            )}
        </ScrollView>
    );
};
export default WeatherDisplay;

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    
    // Loading state
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    loadingText: {
        marginTop: 10,
        fontSize: 16,
        color: '#7F8C8D',
    },
    
    // Error state
    errorContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    errorText: {
        marginTop: 10,
        fontSize: 16,
        color: '#E74C3C',
        textAlign: 'center',
    },
    retryButton: {
        marginTop: 15,
        paddingHorizontal: 20,
        paddingVertical: 10,
        backgroundColor: '#4A90E2',
        borderRadius: 5,
    },
    retryButtonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: '500',
    },
    
    // No data state
    noDataContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    noDataText: {
        marginTop: 10,
        fontSize: 16,
        color: '#95A5A6',
    },
    
    // Compact view
    compactContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 15,
        paddingVertical: 10,
        backgroundColor: 'rgba(74, 144, 226, 0.1)',
        borderRadius: 8,
        marginVertical: 5,
    },
    compactMain: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    compactInfo: {
        marginLeft: 10,
    },
    compactTemp: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#2C3E50',
    },
    compactCondition: {
        fontSize: 12,
        color: '#7F8C8D',
    },
    
    // Current weather card
    currentWeatherCard: {
        backgroundColor: 'white',
        borderRadius: 12,
        padding: 20,
        margin: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    currentHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    currentMain: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    currentTemp: {
        marginLeft: 15,
    },
    temperature: {
        fontSize: 48,
        fontWeight: 'bold',
        color: '#2C3E50',
    },
    condition: {
        fontSize: 18,
        color: '#7F8C8D',
        marginTop: -5,
    },
    refreshButton: {
        padding: 5,
    },
    currentDetails: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginTop: 20,
        paddingTop: 15,
        borderTopWidth: 1,
        borderTopColor: '#ECF0F1',
    },
    detailItem: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    detailText: {
        marginLeft: 5,
        fontSize: 14,
        color: '#7F8C8D',
    },
    
    // Forecast card
    forecastCard: {
        backgroundColor: 'white',
        borderRadius: 12,
        padding: 20,
        margin: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#2C3E50',
        marginBottom: 15,
    },
    forecastDay: {
        alignItems: 'center',
        marginRight: 15,
        padding: 10,
        minWidth: 80,
    },
    forecastDate: {
        fontSize: 12,
        color: '#7F8C8D',
        marginBottom: 8,
    },
    forecastCondition: {
        fontSize: 10,
        color: '#7F8C8D',
        textAlign: 'center',
        marginTop: 5,
        marginBottom: 5,
    },
    forecastTemps: {
        alignItems: 'center',
    },
    forecastHigh: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#2C3E50',
    },
    forecastLow: {
        fontSize: 14,
        color: '#95A5A6',
    },
    precipitationInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 5,
    },
    precipitationText: {
        fontSize: 10,
        color: '#3498DB',
        marginLeft: 2,
    },
    
    // Soil card
    soilCard: {
        backgroundColor: 'white',
        borderRadius: 12,
        padding: 20,
        margin: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    soilCurrent: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginBottom: 20,
    },
    soilMetric: {
        alignItems: 'center',
    },
    soilLabel: {
        fontSize: 12,
        color: '#7F8C8D',
        marginTop: 5,
        marginBottom: 2,
    },
    soilValue: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#2C3E50',
    },
    
    // Insights
    soilInsights: {
        borderTopWidth: 1,
        borderTopColor: '#ECF0F1',
        paddingTop: 15,
    },
    insightsTitle: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#2C3E50',
        marginBottom: 10,
    },
    insightItem: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 10,
        borderRadius: 8,
        marginBottom: 5,
    },
    insightSuccess: {
        backgroundColor: 'rgba(39, 174, 96, 0.1)',
    },
    insightWarning: {
        backgroundColor: 'rgba(243, 156, 18, 0.1)',
    },
    insightInfo: {
        backgroundColor: 'rgba(52, 152, 219, 0.1)',
    },
    insightText: {
        fontSize: 12,
        color: '#2C3E50',
        marginLeft: 8,
        flex: 1,
    },
});
