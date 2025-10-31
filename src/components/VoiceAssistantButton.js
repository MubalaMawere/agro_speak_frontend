import React from 'react';
import { TouchableOpacity, StyleSheet } from 'react-native';
import { Feather } from '@expo/vector-icons';

/**
 * Floating Voice Assistant Button
 * Can be added to any screen to quickly access voice commands
 * 
 * Usage:
 * <VoiceAssistantButton onPress={() => navigation.navigate('VoiceAssistant')} />
 */
const VoiceAssistantButton = ({ onPress, style }) => {
  return (
    <TouchableOpacity
      style={[styles.floatingButton, style]}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <Feather name="mic" size={28} color="#fff" />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  floatingButton: {
    position: 'absolute',
    bottom: 30,
    right: 30,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#6B8CFF',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#6B8CFF',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.6,
    shadowRadius: 12,
    elevation: 8,
    zIndex: 1000,
  },
});

export default VoiceAssistantButton;