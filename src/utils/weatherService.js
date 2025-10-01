import { getApiUrl } from '../config/api';
import { authStorage } from './authStorage';

class WeatherService {
    constructor() {
        this.baseUrl = getApiUrl(''); // Use your API base URL
        this.cache = new Map();
        this.cacheTimeout = 10 * 60 * 1000; // 10 minutes cache
    }

    // Get authorization headers
    async getHeaders() {
        const token = await authStorage.getToken();
        return {
            'Content-Type': 'application/json',
            ...(token && { 'Authorization': `Bearer ${token}` })
        };
    }

    // Check if cached data is still valid
    isCacheValid(cacheKey) {
        const cached = this.cache.get(cacheKey);
        if (!cached) return false;
        
        const now = Date.now();
        return (now - cached.timestamp) < this.cacheTimeout;
    }

    // Get cached data
    getCachedData(cacheKey) {
        const cached = this.cache.get(cacheKey);
        return cached ? cached.data : null;
    }

    // Set cache data
    setCacheData(cacheKey, data) {
        this.cache.set(cacheKey, {
            data,
            timestamp: Date.now()
        });
    }

    /**
     * Get current weather for given coordinates
     */
    async getCurrentWeather(latitude, longitude) {
        const cacheKey = `current_${latitude}_${longitude}`;
        
        // Return cached data if valid
        if (this.isCacheValid(cacheKey)) {
            console.log('Returning cached current weather');
            return this.getCachedData(cacheKey);
        }

        try {
            console.log(`Fetching current weather for ${latitude}, ${longitude}`);
            
            const headers = {
                'Content-Type': 'application/json',
                // No authentication required as per your curl tests
            };
            const url = `${this.baseUrl}/api/v1/weather/current?latitude=${latitude}&longitude=${longitude}`;
            
            const response = await fetch(url, {
                method: 'GET',
                headers
            });

            if (!response.ok) {
                throw new Error(`Weather API error: ${response.status} ${response.statusText}`);
            }

            const weatherData = await response.json();
            
            // Transform the data to a more frontend-friendly format
            const transformedData = this.transformCurrentWeather(weatherData);
            
            // Cache the result
            this.setCacheData(cacheKey, transformedData);
            
            console.log('Current weather fetched successfully:', transformedData);
            return transformedData;

        } catch (error) {
            console.error('Error fetching current weather:', error);
            throw new Error(`Failed to get current weather: ${error.message}`);
        }
    }

    /**
     * Get daily forecast for next N days
     */
    async getDailyForecast(latitude, longitude, days = 5) {
        const cacheKey = `daily_${latitude}_${longitude}_${days}`;
        
        if (this.isCacheValid(cacheKey)) {
            console.log('Returning cached daily forecast');
            return this.getCachedData(cacheKey);
        }

        try {
            console.log(`Fetching ${days}-day forecast for ${latitude}, ${longitude}`);
            
            const headers = {
                'Content-Type': 'application/json',
            };
            const url = `${this.baseUrl}/api/v1/weather/daily?latitude=${latitude}&longitude=${longitude}&days=${days}`;
            
            const response = await fetch(url, {
                method: 'GET',
                headers
            });

            if (!response.ok) {
                throw new Error(`Weather API error: ${response.status} ${response.statusText}`);
            }

            const weatherData = await response.json();
            const transformedData = this.transformDailyForecast(weatherData);
            
            this.setCacheData(cacheKey, transformedData);
            
            console.log('Daily forecast fetched successfully');
            return transformedData;

        } catch (error) {
            console.error('Error fetching daily forecast:', error);
            throw new Error(`Failed to get daily forecast: ${error.message}`);
        }
    }

    /**
     * Get soil data for agriculture
     */
    async getSoilData(latitude, longitude) {
        const cacheKey = `soil_${latitude}_${longitude}`;
        
        if (this.isCacheValid(cacheKey)) {
            console.log('Returning cached soil data');
            return this.getCachedData(cacheKey);
        }

        try {
            console.log(`Fetching soil data for ${latitude}, ${longitude}`);
            
            const headers = {
                'Content-Type': 'application/json',
            };
            const url = `${this.baseUrl}/api/v1/weather/soil?latitude=${latitude}&longitude=${longitude}`;
            
            const response = await fetch(url, {
                method: 'GET',
                headers
            });

            if (!response.ok) {
                throw new Error(`Weather API error: ${response.status} ${response.statusText}`);
            }

            const soilData = await response.json();
            const transformedData = this.transformSoilData(soilData);
            
            this.setCacheData(cacheKey, transformedData);
            
            console.log('Soil data fetched successfully');
            return transformedData;

        } catch (error) {
            console.error('Error fetching soil data:', error);
            throw new Error(`Failed to get soil data: ${error.message}`);
        }
    }

    /**
     * Transform current weather response to frontend format
     */
    transformCurrentWeather(data) {
        if (!data || !data.current_weather) {
            return null;
        }

        const current = data.current_weather;
        
        return {
            temperature: Math.round(current.temperature),
            condition: current.message || 'Unknown',
            weatherCode: current.weathercode,
            windSpeed: current.windspeed,
            windDirection: current.winddirection,
            isDay: current.is_day === 1,
            time: current.time,
            location: {
                latitude: data.latitude,
                longitude: data.longitude,
                timezone: data.timezone
            },
            // Additional derived data
            temperatureF: Math.round((current.temperature * 9/5) + 32),
            windSpeedMph: Math.round(current.windspeed * 0.621371),
            icon: this.getWeatherIcon(current.weathercode, current.is_day === 1)
        };
    }

    /**
     * Transform daily forecast response
     */
    transformDailyForecast(data) {
        if (!data || !data.daily) {
            return [];
        }

        const daily = data.daily;
        const forecast = [];
        
        for (let i = 0; i < daily.time.length; i++) {
            forecast.push({
                date: daily.time[i],
                maxTemp: Math.round(daily.temperature_2m_max[i]),
                minTemp: Math.round(daily.temperature_2m_min[i]),
                precipitation: daily.precipitation_sum[i],
                condition: daily.messages[i] || 'Unknown',
                weatherCode: daily.weathercode[i],
                icon: this.getWeatherIcon(daily.weathercode[i], true),
                // Additional calculations
                tempRange: Math.round(daily.temperature_2m_max[i] - daily.temperature_2m_min[i]),
                precipitationMm: daily.precipitation_sum[i],
                precipitationInches: Math.round(daily.precipitation_sum[i] * 0.0394 * 100) / 100
            });
        }

        return forecast;
    }

    /**
     * Transform soil data response
     */
    transformSoilData(data) {
        if (!data || !data.hourly || !data.hourly.soil_temperature_0_to_7cm) {
            return null;
        }

        const hourly = data.hourly;
        const currentHour = new Date().getHours();
        
        // Get current soil conditions (approximate)
        const currentIndex = Math.min(currentHour, hourly.time.length - 1);
        
        return {
            current: {
                temperature: hourly.soil_temperature_0_to_7cm[currentIndex] || 0,
                moisture: hourly.soil_moisture_0_to_7cm[currentIndex] || 0,
                time: hourly.time[currentIndex]
            },
            hourly: hourly.time.map((time, index) => ({
                time,
                temperature: hourly.soil_temperature_0_to_7cm[index] || 0,
                moisture: hourly.soil_moisture_0_to_7cm[index] || 0
            })),
            // Agricultural insights
            insights: this.generateSoilInsights(
                hourly.soil_temperature_0_to_7cm[currentIndex] || 0, 
                hourly.soil_moisture_0_to_7cm[currentIndex] || 0
            )
        };
    }

    /**
     * Get appropriate weather icon based on weather code and time of day
     */
    getWeatherIcon(weatherCode, isDay = true) {
        const iconMap = {
            0: isDay ? 'sunny' : 'moon',           // Clear sky
            1: isDay ? 'partly-sunny' : 'cloudy-night',  // Mainly clear
            2: 'partly-sunny',                      // Partly cloudy
            3: 'cloudy',                           // Overcast (like your current weather)
            45: 'cloudy',                          // Fog
            48: 'cloudy',                          // Depositing rime fog
            51: 'rainy',                           // Light drizzle
            53: 'rainy',                           // Moderate drizzle
            55: 'rainy',                           // Dense drizzle
            61: 'rainy',                           // Slight rain
            63: 'rainy',                           // Moderate rain
            65: 'rainy',                           // Heavy rain
            66: 'snow',                            // Freezing rain
            67: 'snow',                            // Heavy freezing rain
            71: 'snow',                            // Slight snow fall
            73: 'snow',                            // Moderate snow fall
            75: 'snow',                            // Heavy snow fall
            77: 'snow',                            // Snow grains
            80: 'rainy',                           // Rain showers
            81: 'rainy',                           // Moderate rain showers
            82: 'rainy',                           // Violent rain showers
            95: 'thunderstorm',                    // Thunderstorm
            96: 'thunderstorm',                    // Thunderstorm with hail
            99: 'thunderstorm'                     // Thunderstorm with heavy hail
        };

        return iconMap[weatherCode] || 'cloudy';
    }

    /**
     * Generate agricultural insights based on soil conditions
     */
    generateSoilInsights(temperature, moisture) {
        const insights = [];
        
        if (temperature < 5) {
            insights.push({
                type: 'warning',
                message: 'Soil temperature too low for most crops',
                icon: 'snow'
            });
        } else if (temperature > 35) {
            insights.push({
                type: 'warning',
                message: 'Soil temperature very high - consider irrigation',
                icon: 'thermometer'
            });
        } else if (temperature >= 15 && temperature <= 25) {
            insights.push({
                type: 'success',
                message: 'Optimal soil temperature for most crops',
                icon: 'checkmark-circle'
            });
        }

        if (moisture < 20) {
            insights.push({
                type: 'warning',
                message: 'Low soil moisture - irrigation recommended',
                icon: 'water'
            });
        } else if (moisture > 80) {
            insights.push({
                type: 'info',
                message: 'High soil moisture - monitor for waterlogging',
                icon: 'rainy'
            });
        } else {
            insights.push({
                type: 'success',
                message: 'Good soil moisture levels',
                icon: 'leaf'
            });
        }

        return insights;
    }

    /**
     * Clear all cached data
     */
    clearCache() {
        this.cache.clear();
        console.log('Weather cache cleared');
    }

    /**
     * Get weather data for location (convenience method)
     */
    async getWeatherForLocation(location) {
        if (!location || !location.latitude || !location.longitude) {
            throw new Error('Invalid location data');
        }

        const [current, forecast, soil] = await Promise.all([
            this.getCurrentWeather(location.latitude, location.longitude),
            this.getDailyForecast(location.latitude, location.longitude, 5),
            this.getSoilData(location.latitude, location.longitude).catch(() => null) // Soil data is optional
        ]);

        return {
            current,
            forecast,
            soil,
            location
        };
    }
}

// Export singleton instance
export const weatherService = new WeatherService();
export default weatherService;