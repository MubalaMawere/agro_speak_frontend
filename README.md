# 🌾 AGRO SPEAK - Frontend

A comprehensive React Native mobile application for farmers, built with Expo. This app provides authentication, user management, and a foundation for agricultural communication and management features.

## 📱 Features

### ✅ Completed Features
- **Authentication System**
  - User registration with email validation
  - Secure login with JWT token management  
  - Password visibility toggle
  - Form validation and error handling
  - Automatic navigation between auth screens

- **Splash & Onboarding**
  - Animated splash screen
  - Multi-screen onboarding experience
  - Smooth transitions and animations

- **User Interface**
  - Adaptive authentication styles
  - Responsive design for different screen sizes
  - Clean, farmer-friendly UI with agricultural theming
  - Loading states and user feedback

- **Backend Integration**
  - REST API integration with Spring Boot backend
  - Secure token storage using AsyncStorage
  - Centralized error handling
  - Network request management

## 🏗️ Project Structure

```
agro_speak_frontend/
├── App.js                     # Main app component with navigation
├── index.js                   # Entry point
├── package.json              # Dependencies and scripts
├── assets/                   # Images and app assets
│   ├── adaptive-icon.png
│   ├── favicon.png
│   ├── icon.png
│   ├── splash-icon.png
│   └── splash.png
└── src/
    ├── config/
    │   └── api.js            # API configuration and endpoints
    ├── screens/
    │   ├── Auth/
    │   │   ├── AdaptiveAuthStyles.js  # Shared auth screen styles
    │   │   ├── LoginScreen.js         # Login functionality
    │   │   └── RegisterScreen.js      # Registration functionality
    │   ├── Home/
    │   │   ├── HomeScreen.js         # Main home screen
    │   │   └── Styles.js             # Home screen styles
    │   └── Splash/
    │       ├── Onboard.js            # Onboarding screens
    │       ├── onboardStyles.js      # Onboarding styles
    │       ├── SplashScreen.js       # App splash screen
    │       └── Styles.js             # Splash screen styles
    ├── types/
    │   └── user.js           # API structure documentation
    └── utils/
        ├── authStorage.js    # Secure token and user data storage
        └── errorHandler.js   # Centralized error handling
```

## 🚀 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- Expo CLI
- Android Studio (for Android development) or Xcode (for iOS development)
- Spring Boot backend running (see Backend Integration section)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/SilasChalwe/agro_speak_frontend.git
   cd agro_speak_frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure backend URL**
   
   Edit `src/config/api.js` and update the API base URL:
   ```javascript
   export const API_BASE_URL = 'http://your-backend-url:8080';
   ```

   For local development:
   - **Android Emulator**: `http://10.0.2.2:8080`
   - **iOS Simulator**: `http://localhost:8080`
   - **Physical Device**: `http://YOUR_COMPUTER_IP:8080`

4. **Start the development server**
   ```bash
   npx expo start
   ```

5. **Run on device/emulator**
   - Scan QR code with Expo Go app
   - Press `a` for Android emulator
   - Press `i` for iOS simulator
   - Press `w` for web browser

## 🔧 Technical Stack

### Frontend Technologies
- **React Native** - Mobile app framework
- **Expo** - Development platform and tools
- **React Navigation** - Screen navigation
- **AsyncStorage** - Local data persistence
- **Expo Vector Icons** - Icon library

### Key Libraries
```json
{
  "@expo/vector-icons": "^15.0.2",
  "@react-navigation/native": "^7.1.17",
  "@react-navigation/native-stack": "^7.3.26",
  "@react-native-async-storage/async-storage": "^2.1.0",
  "expo": "~54.0.10",
  "react": "19.1.0",
  "react-native": "0.81.4"
}
```

### Backend Integration
- **Spring Boot REST API** integration
- **JWT token authentication**
- **JSON request/response handling**
- **Error handling and validation**

## 🔐 Authentication Flow

### Registration Process
1. User enters name, email, password, and optional phone
2. Frontend validates input (email format, password length)
3. API call to `/api/v1/auth/register`
4. Success leads to login screen

### Login Process
1. User enters email and password
2. Frontend validates required fields
3. API call to `/api/v1/auth/login`
4. JWT token stored securely
5. Navigation to home screen

### Security Features
- Password visibility toggle
- Secure token storage with AsyncStorage
- Input validation and sanitization
- Network error handling
- Session management

## 🎨 UI/UX Features

### Design System
- **Agricultural Theme**: Green color palette (#4CAF50)
- **Consistent Styling**: Shared components and styles
- **Responsive Layout**: Adapts to different screen sizes
- **Accessibility**: Proper contrast and touch targets

### Animations
- Fade-in animations on screen load
- Slide-up transitions for form elements
- Loading indicators for async operations
- Smooth navigation transitions

### User Experience
- Clear error messages and validation
- Loading states for all async operations
- Keyboard-aware scrolling
- Auto-focus on appropriate inputs

## 📱 Screens Overview

### Splash & Onboarding
- **SplashScreen**: App logo and loading
- **Onboard**: Multi-step introduction to app features

### Authentication
- **LoginScreen**: Email/password login with validation
- **RegisterScreen**: User registration with optional phone

### Main App
- **HomeScreen**: Dashboard (ready for agricultural features)

## 🔄 API Integration

### Endpoints Used
```javascript
// Registration
POST /api/v1/auth/register
{
  "name": "John Farmer",
  "email": "john@example.com",
  "password": "securepassword",
  "phone": "+1234567890"  // optional
}

// Login  
POST /api/v1/auth/login
{
  "email": "john@example.com",
  "password": "securepassword"
}
```

### Response Handling
- Success responses with JWT tokens
- Error responses with user-friendly messages
- Network error detection and handling
- Loading states during API calls

## 🛠️ Development

### Available Scripts
```bash
npm start          # Start Expo development server
npm run android    # Run on Android
npm run ios        # Run on iOS  
npm run web        # Run in web browser
```

### Code Quality
- Consistent code formatting
- Component-based architecture
- Proper error boundaries
- Comprehensive documentation

### File Organization
- Screens organized by feature
- Shared utilities and configurations
- Consistent naming conventions
- Clear separation of concerns

## 📋 TODO & Future Features

### Planned Features
- [ ] Password reset functionality
- [ ] Biometric authentication
- [ ] Profile management
- [ ] Agricultural tools and calculators
- [ ] Weather integration
- [ ] Crop management features
- [ ] Market price tracking
- [ ] Community forums
- [ ] Push notifications
- [ ] Offline data sync

### Technical Improvements
- [ ] Unit and integration tests
- [ ] Error boundary components
- [ ] Performance optimization
- [ ] Code splitting
- [ ] Accessibility improvements
- [ ] Internationalization (i18n)
- [ ] Dark theme support

## 🔧 Troubleshooting

### Common Issues

1. **File watcher limit exceeded (Linux)**
   ```bash
   echo fs.inotify.max_user_watches=524288 | sudo tee -a /etc/sysctl.conf
   sudo sysctl -p
   ```

2. **Network requests failing**
   - Check backend URL in `src/config/api.js`
   - Ensure backend server is running
   - Verify CORS configuration on backend

3. **AsyncStorage issues**
   - Clear Expo cache: `expo start -c`
   - Reinstall node_modules if needed

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is private and proprietary.

## 👥 Team

- **Developer**: Silas Chalwe
- **Backend**: Spring Boot API integration
- **Frontend**: React Native with Expo

## 📞 Support

For issues and questions:
- Check the troubleshooting section
- Review the BACKEND_INTEGRATION.md file
- Create an issue in the repository

---

**Built with ❤️ for the farming community** 🌾
