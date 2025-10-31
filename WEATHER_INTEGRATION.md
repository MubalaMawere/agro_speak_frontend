# Weather System Integration

## Overview
This document describes the integration between the React Native frontend weather system and the Spring Boot backend weather service. The system provides real-time weather data, forecasts, and agricultural soil insights.

## Backend Integration Required

### 1. Weather Service Endpoints

Your Spring Boot backend already has the `WeatherService` class. You need to create the following REST endpoints:

```java
@RestController
@RequestMapping("/api/v1/weather")
@RequiredArgsConstructor
public class WeatherController {

    private final WeatherService weatherService;

    @GetMapping("/current")
    public ResponseEntity<WeatherResponse> getCurrentWeather(
            @RequestParam double latitude,
            @RequestParam double longitude) {
        
        WeatherResponse weather = weatherService.getCurrentWeather(latitude, longitude);
        return ResponseEntity.ok(weather);
    }

    @GetMapping("/daily")
    public ResponseEntity<WeatherResponse> getDailyForecast(
            @RequestParam double latitude,
            @RequestParam double longitude,
            @RequestParam(defaultValue = "5") int days) {
        
        WeatherResponse forecast = weatherService.getDailyForecast(latitude, longitude, days);
        return ResponseEntity.ok(forecast);
    }

    @GetMapping("/hourly")
    public ResponseEntity<WeatherResponse> getHourlyForecast(
            @RequestParam double latitude,
            @RequestParam double longitude,
            @RequestParam(defaultValue = "24") int hours) {
        
        WeatherResponse forecast = weatherService.getHourlyForecast(latitude, longitude, hours);
        return ResponseEntity.ok(forecast);
    }

    @GetMapping("/soil")
    public ResponseEntity<WeatherResponse> getSoilData(
            @RequestParam double latitude,
            @RequestParam double longitude) {
        
        WeatherResponse soilData = weatherService.getSoilData(latitude, longitude);
        return ResponseEntity.ok(soilData);
    }
}
```

### 2. Add RestTemplate Bean

In your main application class or configuration, add:

```java
@Bean
public RestTemplate restTemplate() {
    return new RestTemplate();
}
```

### 3. CORS Configuration

Add CORS configuration to allow frontend requests:

```java
@Configuration
@EnableWebMvc
public class WebConfig implements WebMvcConfigurer {

    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/api/**")
                .allowedOrigins("*")
                .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")
                .allowedHeaders("*");
    }
}
```

## Frontend Components

### 1. Weather Service (`src/utils/weatherService.js`)
- **Purpose**: Handles API communication with backend weather endpoints
- **Features**: 
  - Caching with 10-minute timeout
  - Error handling and retry logic
  - Data transformation for frontend use
  - Authentication header support

### 2. Weather Hook (`src/hooks/useWeather.js`)
- **Purpose**: React hook for weather state management
- **Features**:
  - Automatic weather fetching when location changes
  - Loading and error states
  - Individual weather component access (current, forecast, soil)
  - Refresh and cache clearing

### 3. Weather Display Component (`src/components/WeatherDisplay.js`)
- **Purpose**: Comprehensive weather data visualization
- **Features**:
  - Current weather with temperature, condition, wind
  - 5-day forecast with temperatures and precipitation
  - Soil data with agricultural insights
  - Compact and full display modes
  - Error handling with retry options

### 4. Location Integration
- **Location Service**: Gets GPS coordinates and reverse geocoding
- **Auto-fetch**: Weather data automatically updates when location changes
- **Accuracy**: Uses device GPS for precise weather data

## Usage Examples

### Basic Weather in Component

```javascript
import { useWeather } from '../hooks/useWeather';
import useLocation from '../hooks/useLocation';

const MyComponent = () => {
    const { location } = useLocation({ autoStart: true });
    const { weather, loading, error, refreshWeather } = useWeather(location, true);

    if (loading) return <Text>Loading weather...</Text>;
    if (error) return <Text>Error: {error}</Text>;

    return (
        <WeatherDisplay 
            weather={weather}
            onRefresh={refreshWeather}
            showForecast={true}
            showSoil={true}
        />
    );
};
```

### Manual Weather Fetching

```javascript
const { fetchCurrentWeather, fetchForecast } = useWeather();

const handleGetWeather = async () => {
    const currentLocation = await getCurrentLocation();
    await fetchCurrentWeather(currentLocation);
};
```

## Data Flow

1. **Location Service** → Gets GPS coordinates + address
2. **Weather Service** → Sends coordinates to backend API
3. **Backend API** → Calls Open-Meteo API with coordinates
4. **Weather Hook** → Manages state and auto-updates
5. **Weather Display** → Shows formatted weather data

## Testing

Use the **WeatherTestScreen** (`src/screens/WeatherTestScreen.js`) to test all weather functionality:

- Location service testing
- Current weather API calls
- Daily forecast testing
- Soil data testing
- Full weather package testing
- Live weather display

Access via the cloud icon in the HomeScreen header.

## Configuration

### API Base URL
Update in `src/config/api.js`:
```javascript
export const API_BASE_URL = 'http://YOUR_IP:8080';
```

### Weather Endpoints
The following endpoints are configured:
- `/api/v1/weather/current` - Current weather
- `/api/v1/weather/daily` - Daily forecast
- `/api/v1/weather/hourly` - Hourly forecast  
- `/api/v1/weather/soil` - Soil data

## Error Handling

The system includes comprehensive error handling:

- **Network Errors**: Automatic retry with user notification
- **Location Errors**: Fallback to manual location entry
- **API Errors**: Error messages with retry options
- **Cache Failures**: Automatic cache clearing and refresh

## Agricultural Features

### Soil Data Insights
- Soil temperature monitoring (0-7cm depth)
- Soil moisture levels
- Automated agricultural recommendations
- Optimal planting condition alerts

### Weather Insights
- Real-time weather conditions
- 5-day agricultural forecast
- Precipitation tracking for irrigation planning
- Wind conditions for spraying operations

## Performance Optimizations

- **Caching**: 10-minute cache reduces API calls
- **Auto-refresh**: Only when location changes significantly
- **Lazy Loading**: Weather components load on demand
- **Error Recovery**: Graceful fallbacks for offline scenarios

## Next Steps

1. **Implement Backend Endpoints**: Add the REST controller endpoints
2. **Test Integration**: Use WeatherTestScreen to verify API connectivity
3. **Configure CORS**: Ensure frontend can access backend APIs
4. **Deploy Backend**: Make sure weather endpoints are accessible
5. **Test Real Weather**: Verify weather data shows real conditions

## Troubleshooting

### Common Issues:

1. **"Network Error"**: Check API_BASE_URL configuration
2. **"Location Required"**: Ensure location permissions granted
3. **"Weather API Error"**: Verify backend endpoints are running
4. **Empty Weather Data**: Check backend Open-Meteo API integration

### Debug Steps:

1. Test location service first
2. Check network connectivity
3. Verify backend endpoint responses
4. Use WeatherTestScreen for systematic testing
5. Check console logs for detailed error messages



# Backend Integration Guide

## Overview
backend integration points for the Connections Dashboard feature.

## API Endpoints Required

### 1. Connections Dashboard
- **GET /api/connections/dashboard** - Get counts for buyers, cooperatives, suppliers
- **GET /api/connections/buyers** - Get list of buyers with search/filter
- **GET /api/connections/cooperatives** - Get list of cooperatives with search/filter  
- **GET /api/connections/suppliers** - Get list of suppliers with search/filter

### 2. Profile Details
- **GET /api/connections/{type}/{id}** - Get detailed profile information
- **POST /api/connections/connect** - Connect with buyer/supplier
- **POST /api/connections/join** - Join cooperative

### 3. Chat System
- **GET /api/chat/conversations/{contactId}** - Get conversation history
- **POST /api/chat/messages** - Send text message
- **POST /api/chat/voice-messages** - Send voice message
- **GET /api/chat/voice-messages/{messageId}/play** - Get voice message audio

### 4. Voice Assistant Integration
- **POST /api/voice/transcribe** - Transcribe voice input
- **POST /api/voice/process-command** - Process voice commands for connections

## Data Models

### Buyer/Supplier Profile
```json
{
  "id": "string",
  "businessName": "string",
  "fullName": "string", 
  "phone": "string",
  "email": "string",
  "location": "string",
  "category": "Buyer|Supplier",
  "rating": "number",
  "reviews": "number",
  "established": "string",
  "description": "string",
  "services": ["string"],
  "isConnected": "boolean"
}
```

### Cooperative Profile
```json
{
  "id": "string",
  "name": "string",
  "location": "string",
  "category": "Cooperative",
  "members": "number",
  "established": "string",
  "description": "string",
  "isJoined": "boolean"
}
```

### Chat Message
```json
{
  "id": "string",
  "conversationId": "string",
  "sender": "user|contact",
  "text": "string",
  "type": "text|voice",
  "audioUri": "string",
  "timestamp": "datetime"
}
```

## Integration Points in Code

### ConnectionsDashboard.js
- Line 12: Replace SAMPLE_DATA with API calls
- Line 147: Integrate voice assistant with backend
- Line 155: Implement filter functionality
- Line 160: Replace with backend API call
- Line 172: Replace with backend API call

### ProfileDetails.js  
- Line 15: Replace with backend API call
- Line 35: Integrate with phone calling
- Line 42: Navigate to chat with backend data
- Line 48: Replace with backend API call

### ChatScreen.js
- Line 25: Load conversation history from backend
- Line 40: Send message to backend API
- Line 60: Send voice message to backend API
- Line 85: Play voice messages from backend

## Authentication
All API calls should include authentication headers:
```
Authorization: Bearer {token}
Content-Type: application/json
```

## Error Handling
Implement proper error handling for:
- Network connectivity issues
- Authentication failures
- API rate limiting
- Voice recording/playback errors

## Real-time Features
Consider implementing WebSocket connections for:
- Real-time chat messages
- Connection status updates
- Voice message notifications

## File Upload
For voice messages, implement file upload to cloud storage:
- AWS S3, Google Cloud Storage, or Azure Blob Storage
- Generate signed URLs for audio playback
- Handle file cleanup and expiration
