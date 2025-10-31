import React from 'react';
import { TouchableOpacity, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

const MicrophoneButton = ({ isListening, onPress }) => {
    return (
        <TouchableOpacity
            style={[styles.microphoneButton, isListening && styles.microphoneButtonActive]}
            onPress={onPress}
        >
            <Icon name="mic" size={50} color="#FFFFFF" />
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    microphoneButton: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: '#4CAF50',
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 5,
    },
    microphoneButtonActive: {
        backgroundColor: '#388E3C',
    },
});

export default MicrophoneButton;