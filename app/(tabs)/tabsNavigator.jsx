// app/(tabs)/TabsNavigator.jsx
import React from 'react';
import { View } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';

// Import your screens
import HomeScreen from './HomeScreen';
import MarketScreen from './market';
import SubscriptionScreen from './subscription';
import SettingsScreen from './settings';

const Tab = createBottomTabNavigator();

export default function TabsNavigator() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: true,
        tabBarActiveTintColor: '#2ab400ff',
        tabBarInactiveTintColor: '#a8a8a8ff',
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          tabBarIcon: ({ focused, color, size }) => (
            <Ionicons name="home" size={24} color={focused ? '#2ab400ff' : '#a8a8a8ff'} />
          ),
          headerShown: false, // if you want no header for home
        }}
      />
      <Tab.Screen
        name="Market"
        component={MarketScreen}
        options={{
          tabBarIcon: ({ focused, color, size }) => (
            <Ionicons name="storefront" size={24} color={focused ? '#2ab400ff' : '#a8a8a8ff'} />
          ),
        }}
      />
      <Tab.Screen
        name="Subscription"
        component={SubscriptionScreen}
        options={{
          tabBarIcon: ({ focused, color, size }) => (
            <Ionicons name="wallet" size={24} color={focused ? '#2ab400ff' : '#a8a8a8ff'} />
          ),
        }}
      />
      <Tab.Screen
        name="Settings"
        component={SettingsScreen}
        options={{
          tabBarIcon: ({ focused, color, size }) => (
            <Ionicons name="settings" size={24} color={focused ? '#2ab400ff' : '#a8a8a8ff'} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}
