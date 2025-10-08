import React, { useEffect, useState } from 'react';
import { Alert } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import SplashScreen from './src/screens/Splash/SplashScreen';
import LoginScreen from './src/screens/Auth/LoginScreen';
import RegisterScreen from './src/screens/Auth/RegisterScreen';
import HomeScreen from './src/screens/Home/HomeScreen';
import WeatherTestScreen from './src/screens/WeatherTestScreen';
import * as SplashScreenExpo from 'expo-splash-screen';
import OnboardingScreens from "./src/screens/Splash/Onboard";

//  import permission APIs for modules you use
import * as Audio from 'expo-av';
import { Camera } from 'expo-camera';
import *as MediaLibrary from 'expo-media-library';

// Prevent the splash screen from auto-hiding
SplashScreenExpo.preventAutoHideAsync().then(() => {});

const Stack = createNativeStackNavigator();

export default function App() {
    const [appIsReady, setAppIsReady] = useState(false);

    useEffect(() => {
        async function prepare() {
            try {
                // Request permissions before showing the app
                const audioStatus = await Audio.Audio.requestPermissionsAsync();
                if (audioStatus.status !== 'granted') {
                    Alert.alert('Permission required', 'Microphone permission is needed to record audio.');
                }

                const cameraStatus = await Camera.requestCameraPermissionsAsync();
                if (cameraStatus.status !== 'granted') {
                    Alert.alert('Permission required', 'Camera permission is needed.');
                }

                // const mediaStatus = await MediaLibrary.requestPermissionsAsync();
                // if (mediaStatus.status !== 'granted') {
                //     Alert.alert('Permission required', 'Storage permission is needed to save or pick files.');
                // }

                //  Simulate any pre-load tasks you had
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

    if (!appIsReady) {
        return null; // keep splash visible  C?n%XyB2rDNm3-8
    }

    return (
        <NavigationContainer>
            <Stack.Navigator
                initialRouteName="Splash"
                screenOptions={{headerShown: false, animation: 'slide_from_right', gestureEnabled: true,}}>
                <Stack.Screen name="Splash" component={SplashScreen} options={{ animation: 'fade' }} />
                <Stack.Screen name="Onboard" component={OnboardingScreens} options={{ animation: 'slide_from_right' }} />
                <Stack.Screen name="Login" component={LoginScreen} options={{ animation: 'slide_from_right' }} />
                <Stack.Screen name="Register" component={RegisterScreen} options={{ animation: 'slide_from_right' }} />
                <Stack.Screen name="Home" component={HomeScreen} options={{ animation: 'fade' }} />
                <Stack.Screen name="WeatherTest" component={WeatherTestScreen} options={{ animation: 'slide_from_right' }} />
            </Stack.Navigator>
        </NavigationContainer>
    );
}