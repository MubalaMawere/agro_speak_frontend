
import React, { useEffect, useState } from 'react';
import { Alert } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import * as SplashScreenExpo from 'expo-splash-screen';
import * as Audio from 'expo-av';
import { Camera } from 'expo-camera';

// Screens
import VoiceAssistantScreen from './src/screens/VoiceAssistant';
import SplashScreen from './src/screens/Splash/SplashScreen';
import OnboardingScreens from './src/screens/Splash/Onboard';
import LoginScreen from './src/screens/Auth/LoginScreen';
import RegisterScreen from './src/screens/Auth/RegisterScreen';
import WeatherTestScreen from './src/screens/WeatherTestScreen';
import VoiceRecording from './src/components/voiceRecording';
import ResultsScreen from './src/screens/resultsScreen'
import ConnectionDashboard from './src/screens/ConnectionDashboard';
import ChatScreen from './src/screens/ChatScreen';
import ProfileDetails from './src/screens/Profile';
import VoiceTranscriptionScreen from './src/screens/VoiceTranscriptionScreen';


// Tabs navigator
import TabsNavigator from './app/(tabs)/tabsNavigator';

// Prevent splash screen auto-hide
SplashScreenExpo.preventAutoHideAsync().then(() => {});

const Stack = createNativeStackNavigator();

export default function App() {
  const [appIsReady, setAppIsReady] = useState(false);

  useEffect(() => {
    async function prepare() {
      try {
        const audioStatus = await Audio.Audio.requestPermissionsAsync();
        if (audioStatus.status !== 'granted') {
          Alert.alert('Permission required', 'Microphone permission is needed to record audio.');
        }

        const cameraStatus = await Camera.requestCameraPermissionsAsync();
        if (cameraStatus.status !== 'granted') {
          Alert.alert('Permission required', 'Camera permission is needed.');
        }

        // Simulate preload tasks
        await new Promise(resolve => setTimeout(resolve, 2000));
      } catch (e) {
        console.warn(e);
      } finally {
        setAppIsReady(true);
        await SplashScreenExpo.hideAsync();
      }
    }

    prepare();
  }, []);

  if (!appIsReady) return null;

  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Splash"
        screenOptions={{ headerShown: false, animation: 'slide_from_right', gestureEnabled: true }}
      >
        <Stack.Screen name="Splash" component={SplashScreen} options={{ animation: 'fade' }} />
        <Stack.Screen name="Onboard" component={OnboardingScreens} options={{ animation: 'slide_from_right' }} />
        <Stack.Screen name="Login" component={LoginScreen} options={{ animation: 'slide_from_right' }} />
        <Stack.Screen name="Register" component={RegisterScreen} options={{ animation: 'slide_from_right' }} />
        
        {/* Replace HomeScreen with TabsNavigator */}
        
        <Stack.Screen name="tabsNavigator" component={TabsNavigator} options={{ animation: 'fade' }} />
        
        <Stack.Screen name="WeatherTest" component={WeatherTestScreen} options={{ animation: 'slide_from_right' }} />
        <Stack.Screen name="voiceRecording" component={VoiceRecording} options={{ animation: 'slide_from_right' }} />
        <Stack.Screen name="resultsScreen" component={ResultsScreen} options={{ animation: 'slide_from_right' }} />
          
        <Stack.Screen name="Connections" component={ConnectionDashboard} />
        <Stack.Screen name="ProfileDetails" component={ProfileDetails} />
        <Stack.Screen name="ChatScreen" component={ChatScreen} />
        <Stack.Screen name="VoiceTranscription" component={VoiceTranscriptionScreen} />
        
        <Stack.Screen 
  name="VoiceAssistant" 
  component={VoiceAssistantScreen}
  options={{ 
    headerShown: false,
    title: 'Voice Assistant'
  }}
/>

      </Stack.Navigator>
    </NavigationContainer>
  );
}
