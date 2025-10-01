// API Configuration
// Update this URL to match your backend server

// IMPORTANT: Change this based on your setup
// For Android Emulator: use 'http://10.0.2.2:8080'
// For iOS Simulator: use 'http://localhost:8080' 
// For Physical Device: use 'http://YOUR_COMPUTER_IP:8080'
// For Production: use your actual server URL

// Current configuration for your setup:
export const API_BASE_URL = 'http://192.168.43.123:8080'; // Physical device (your computer IP)

// Alternative configurations (uncomment the one you need):
// export const API_BASE_URL = 'http://10.0.2.2:8080';           // Android Emulator
// export const API_BASE_URL = 'http://192.168.43.123:8080';     // Physical device (your computer IP)
// export const API_BASE_URL = 'https://your-server.com';        // Production server

// API Endpoints
export const API_ENDPOINTS = {
  LOGIN: '/api/v1/auth/login',
  REGISTER: '/api/v1/auth/register',
  PROFILE: '/api/v1/user/profile',
  UPDATE_PROFILE: '/api/v1/user/profile',
  UPLOAD_AVATAR: '/api/v1/user/avatar',
  
  // Weather endpoints
  WEATHER_CURRENT: '/api/v1/weather/current',
  WEATHER_DAILY: '/api/v1/weather/daily',
  WEATHER_HOURLY: '/api/v1/weather/hourly',
  WEATHER_SOIL: '/api/v1/weather/soil',
};

// Helper function to get full API URL
export const getApiUrl = (endpoint) => `${API_BASE_URL}${endpoint}`;

// Helper function to get your computer's IP for physical device testing
export const getLocalNetworkIP = () => {
  // Run this command in terminal to get your IP: hostname -I | awk '{print $1}'
  // Then update the API_BASE_URL above with: http://YOUR_IP:8080
  console.log('To test on physical device, update API_BASE_URL with your computer IP');
  console.log('Run: hostname -I | awk \'{print $1}\' to get your IP address');
};
