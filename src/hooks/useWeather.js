import { useState, useEffect, useCallback } from 'react';
import weatherService from '../utils/weatherService';

export const useWeather = (location = null, autoFetch = false) => {
    const [weather, setWeather] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // Fetch weather data
    const fetchWeather = useCallback(async (targetLocation = null) => {
        const locationToUse = targetLocation || location;
        
        if (!locationToUse || !locationToUse.latitude || !locationToUse.longitude) {
            setError('Location is required to fetch weather data');
            return;
        }

        setLoading(true);
        setError(null);

        try {
            console.log('Fetching weather for location:', locationToUse);
            const weatherData = await weatherService.getWeatherForLocation(locationToUse);
            setWeather(weatherData);
            console.log('Weather data fetched successfully:', weatherData);
        } catch (err) {
            console.error('Error fetching weather:', err);
            setError(err.message || 'Failed to fetch weather data');
            setWeather(null);
        } finally {
            setLoading(false);
        }
    }, [location]);

    // Fetch current weather only
    const fetchCurrentWeather = useCallback(async (targetLocation = null) => {
        const locationToUse = targetLocation || location;
        
        if (!locationToUse || !locationToUse.latitude || !locationToUse.longitude) {
            setError('Location is required to fetch weather data');
            return null;
        }

        setLoading(true);
        setError(null);

        try {
            const currentWeather = await weatherService.getCurrentWeather(
                locationToUse.latitude, 
                locationToUse.longitude
            );
            
            setWeather(prevWeather => ({
                ...prevWeather,
                current: currentWeather,
                location: locationToUse
            }));
            
            return currentWeather;
        } catch (err) {
            console.error('Error fetching current weather:', err);
            setError(err.message || 'Failed to fetch current weather');
            return null;
        } finally {
            setLoading(false);
        }
    }, [location]);

    // Fetch daily forecast only
    const fetchForecast = useCallback(async (days = 5, targetLocation = null) => {
        const locationToUse = targetLocation || location;
        
        if (!locationToUse || !locationToUse.latitude || !locationToUse.longitude) {
            setError('Location is required to fetch forecast data');
            return null;
        }

        setLoading(true);
        setError(null);

        try {
            const forecast = await weatherService.getDailyForecast(
                locationToUse.latitude, 
                locationToUse.longitude, 
                days
            );
            
            setWeather(prevWeather => ({
                ...prevWeather,
                forecast,
                location: locationToUse
            }));
            
            return forecast;
        } catch (err) {
            console.error('Error fetching forecast:', err);
            setError(err.message || 'Failed to fetch forecast data');
            return null;
        } finally {
            setLoading(false);
        }
    }, [location]);

    // Fetch soil data only
    const fetchSoilData = useCallback(async (targetLocation = null) => {
        const locationToUse = targetLocation || location;
        
        if (!locationToUse || !locationToUse.latitude || !locationToUse.longitude) {
            setError('Location is required to fetch soil data');
            return null;
        }

        setLoading(true);
        setError(null);

        try {
            const soilData = await weatherService.getSoilData(
                locationToUse.latitude, 
                locationToUse.longitude
            );
            
            setWeather(prevWeather => ({
                ...prevWeather,
                soil: soilData,
                location: locationToUse
            }));
            
            return soilData;
        } catch (err) {
            console.error('Error fetching soil data:', err);
            setError(err.message || 'Failed to fetch soil data');
            return null;
        } finally {
            setLoading(false);
        }
    }, [location]);

    // Refresh all weather data
    const refreshWeather = useCallback(() => {
        if (location) {
            fetchWeather(location);
        }
    }, [location, fetchWeather]);

    // Clear weather data and cache
    const clearWeather = useCallback(() => {
        setWeather(null);
        setError(null);
        weatherService.clearCache();
    }, []);

    // Auto-fetch when location changes
    useEffect(() => {
        if (autoFetch && location && location.latitude && location.longitude) {
            fetchWeather(location);
        }
    }, [location, autoFetch, fetchWeather]);

    // Return hook interface
    return {
        // State
        weather,
        loading,
        error,
        
        // Actions
        fetchWeather,
        fetchCurrentWeather,
        fetchForecast,
        fetchSoilData,
        refreshWeather,
        clearWeather,
        
        // Computed properties
        hasWeatherData: !!weather,
        hasCurrentWeather: !!(weather && weather.current),
        hasForecast: !!(weather && weather.forecast && weather.forecast.length > 0),
        hasSoilData: !!(weather && weather.soil),
        
        // Quick access to weather components
        current: weather?.current || null,
        forecast: weather?.forecast || [],
        soil: weather?.soil || null,
        weatherLocation: weather?.location || null
    };
};