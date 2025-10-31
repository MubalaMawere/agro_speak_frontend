import React, { useState, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert, Animated } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Audio } from 'expo-av';
import * as Speech from 'expo-speech';

export default function VoiceTranscriptionScreen({ navigation }) {
  const [isRecording, setIsRecording] = useState(false);
  const [transcription, setTranscription] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [recordingDuration, setRecordingDuration] = useState(0);
  const [recording, setRecording] = useState(null);
  const [response, setResponse] = useState('');
  const [isSpeaking, setIsSpeaking] = useState(false);
  
  const timerRef = useRef(null);
  const recordingRef = useRef(null);
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const MAX_DURATION = 60; // 60 seconds limit

  // TODO: Replace with backend API configuration
  const API_CONFIG = {
    baseUrl: 'http://4.204.24.13:5000', // TODO: Move to environment variables
    endpoints: {
      transcribe: '/transcribe',
      processCommand: '/process-command', // TODO: Add command processing endpoint
      getResponse: '/get-response' // TODO: Add response generation endpoint
    }
  };

  const recordingOptions = {
    android: {
      extension: '.wav',
      outputFormat: Audio.RECORDING_OPTION_ANDROID_OUTPUT_FORMAT_PCM_16BIT,
      audioEncoder: Audio.RECORDING_OPTION_ANDROID_AUDIO_ENCODER_PCM_16BIT,
      sampleRate: 16000,
      numberOfChannels: 1,
      bitRate: 128000,
    },
    ios: {
      extension: '.wav',
      audioQuality: Audio.RECORDING_OPTION_IOS_AUDIO_QUALITY_HIGH,
      sampleRate: 16000,
      numberOfChannels: 1,
      bitRate: 128000,
      linearPCMBitDepth: 16,
      linearPCMIsBigEndian: false,
      linearPCMIsFloat: false,
    },
  };

  // TODO: Replace with backend API call for transcription
  const transcribeAudio = async (audioUri) => {
    try {
      // TODO: Implement actual API call
      // const formData = new FormData();
      // formData.append('audio', {
      //   uri: audioUri,
      //   type: 'audio/wav',
      //   name: 'recording.wav',
      // });
      // 
      // const response = await fetch(`${API_CONFIG.baseUrl}${API_CONFIG.endpoints.transcribe}`, {
      //   method: 'POST',
      //   body: formData,
      //   headers: {
      //     'Content-Type': 'multipart/form-data',
      //   },
      // });
      // 
      // const result = await response.json();
      // return result.transcription;

      // Mock transcription for development
      const mockTranscriptions = [
        "Find buyers in Lusaka for my maize crop",
        "Show me suppliers of fertilizer in Ndola",
        "Connect me with cooperatives in Kitwe",
        "I need to sell my groundnuts, who can buy them?",
        "Where can I get quality seeds for planting?"
      ];
      
      return mockTranscriptions[Math.floor(Math.random() * mockTranscriptions.length)];
    } catch (error) {
      console.error('Transcription error:', error);
      throw new Error('Failed to transcribe audio');
    }
  };

  // TODO: Replace with backend API call for command processing
  const processVoiceCommand = async (command) => {
    try {
      // TODO: Implement actual API call
      // const response = await fetch(`${API_CONFIG.baseUrl}${API_CONFIG.endpoints.processCommand}`, {
      //   method: 'POST',
      //   headers: {
      //     'Content-Type': 'application/json',
      //   },
      //   body: JSON.stringify({ command: command }),
      // });
      // 
      // const result = await response.json();
      // return result.response;

      // Mock response for development
      const mockResponses = {
        "find buyers": "I found 3 buyers in Lusaka who purchase maize. Would you like me to show you their details?",
        "suppliers": "Here are 4 suppliers in Ndola who provide fertilizer. I can connect you with them.",
        "cooperatives": "I found 2 cooperatives in Kitwe that you can join. They have 45 and 32 members respectively.",
        "sell": "I can help you find buyers for your groundnuts. There are several options available in your area.",
        "seeds": "I found 3 seed suppliers near you. They offer quality seeds for various crops."
      };

      const lowerCommand = command.toLowerCase();
      for (const [key, value] of Object.entries(mockResponses)) {
        if (lowerCommand.includes(key)) {
          return value;
        }
      }
      
      return "I understand you're looking for agricultural connections. Let me help you find the right buyers, suppliers, or cooperatives.";
    } catch (error) {
      console.error('Command processing error:', error);
      throw new Error('Failed to process command');
    }
  };

  const startRecording = async () => {
    try {
      const permission = await Audio.requestPermissionsAsync();
      if (!permission.granted) {
        Alert.alert('Permission required', 'Microphone permission is needed to record audio');
        return;
      }

      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
        staysActiveInBackground: false,
      });

      const rec = new Audio.Recording();
      await rec.prepareToRecordAsync(recordingOptions);
      await rec.startAsync();
      
      setRecording(rec);
      recordingRef.current = rec;
      setIsRecording(true);
      setRecordingDuration(0);
      setTranscription('');
      setResponse('');

      // Start pulse animation
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.2,
            duration: 800,
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 800,
            useNativeDriver: true,
          }),
        ])
      ).start();

      // Update recording duration
      timerRef.current = setInterval(() => {
        setRecordingDuration((prev) => {
          if (prev >= MAX_DURATION - 1) {
            stopRecording();
            return MAX_DURATION;
          }
          return prev + 1;
        });
      }, 1000);

    } catch (err) {
      console.error('Start recording error:', err);
      Alert.alert('Error', 'Failed to start recording. Please try again.');
    }
  };

  const stopRecording = async () => {
    if (!recordingRef.current) return;

    // Clear timer and animation
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    pulseAnim.stopAnimation();

    setIsProcessing(true);
    
    try {
      await recordingRef.current.stopAndUnloadAsync();
      const uri = recordingRef.current.getURI();
      
      setRecording(null);
      recordingRef.current = null;
      setIsRecording(false);

      if (!uri) {
        throw new Error('No audio file recorded');
      }

      // TODO: Process transcription with backend API
      const transcribedText = await transcribeAudio(uri);
      setTranscription(transcribedText);

      // TODO: Process command and get response from backend API
      const commandResponse = await processVoiceCommand(transcribedText);
      setResponse(commandResponse);

      // TODO: Speak response using TTS
      if (commandResponse) {
        setIsSpeaking(true);
        await Speech.speak(commandResponse, {
          language: 'en',
          pitch: 1.0,
          rate: 0.8,
        });
        setIsSpeaking(false);
      }

    } catch (err) {
      console.error('Stop recording error:', err);
      Alert.alert('Error', 'Failed to process audio. Please try again.');
      setTranscription('Error: Failed to process audio');
    } finally {
      setIsProcessing(false);
      setRecordingDuration(0);
    }
  };

  const cancelRecording = async () => {
    if (recordingRef.current) {
      try {
        await recordingRef.current.stopAndUnloadAsync();
      } catch (err) {
        console.error('Cancel recording error:', err);
      }
    }
    
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    
    pulseAnim.stopAnimation();
    setRecording(null);
    recordingRef.current = null;
    setIsRecording(false);
    setIsProcessing(false);
    setRecordingDuration(0);
  };

  const clearSession = () => {
    setTranscription('');
    setResponse('');
    setIsSpeaking(false);
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="arrow-back" size={24} color="#2E7D32" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Voice Assistant</Text>
          <TouchableOpacity 
            style={styles.clearButton}
            onPress={clearSession}
            disabled={!transcription && !response}
          >
            <Ionicons name="refresh" size={20} color="#2E7D32" />
          </TouchableOpacity>
        </View>

        {/* Recording Section */}
        <View style={styles.recordingSection}>
          <Animated.View style={[styles.recordingButton, { transform: [{ scale: pulseAnim }] }]}>
            <TouchableOpacity
              style={[
                styles.recordButton,
                isRecording && styles.recordingActive,
                isProcessing && styles.processingActive
              ]}
              onPress={isRecording ? stopRecording : startRecording}
              disabled={isProcessing}
            >
              <Ionicons 
                name={isRecording ? "stop" : isProcessing ? "hourglass" : "mic"} 
                size={40} 
                color="#FFFFFF" 
              />
            </TouchableOpacity>
          </Animated.View>

          {isRecording && (
            <View style={styles.recordingInfo}>
              <Text style={styles.recordingText}>Recording...</Text>
              <Text style={styles.timerText}>{formatTime(recordingDuration)}</Text>
              <TouchableOpacity style={styles.cancelButton} onPress={cancelRecording}>
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          )}

          {isProcessing && (
            <View style={styles.processingInfo}>
              <Text style={styles.processingText}>Processing your request...</Text>
            </View>
          )}
        </View>

        {/* Results Section */}
        <ScrollView style={styles.resultsSection} showsVerticalScrollIndicator={false}>
          {transcription && (
            <View style={styles.resultCard}>
              <View style={styles.resultHeader}>
                <Ionicons name="chatbubble" size={20} color="#2E7D32" />
                <Text style={styles.resultTitle}>You said:</Text>
              </View>
              <Text style={styles.transcriptionText}>{transcription}</Text>
            </View>
          )}

          {response && (
            <View style={styles.resultCard}>
              <View style={styles.resultHeader}>
                <Ionicons name="bulb" size={20} color="#2E7D32" />
                <Text style={styles.resultTitle}>Assistant response:</Text>
                {isSpeaking && (
                  <Ionicons name="volume-high" size={16} color="#2E7D32" />
                )}
              </View>
              <Text style={styles.responseText}>{response}</Text>
            </View>
          )}
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#FAF8F1' },
  container: { flex: 1, paddingHorizontal: 20 },
  
  // Header
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    marginBottom: 20,
  },
  backButton: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: '#F1F8E9',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#2E7D32',
  },
  clearButton: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: '#F1F8E9',
  },
  
  // Recording section
  recordingSection: {
    alignItems: 'center',
    marginBottom: 30,
  },
  recordingButton: {
    marginBottom: 20,
  },
  recordButton: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#2E7D32',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 15,
    shadowOffset: { width: 0, height: 8 },
    elevation: 6,
  },
  recordingActive: {
    backgroundColor: '#F44336',
  },
  processingActive: {
    backgroundColor: '#FF9800',
  },
  recordingInfo: {
    alignItems: 'center',
  },
  recordingText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#F44336',
    marginBottom: 8,
  },
  timerText: {
    fontSize: 24,
    fontWeight: '700',
    color: '#2E7D32',
    marginBottom: 12,
  },
  cancelButton: {
    backgroundColor: '#FF6B6B',
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 20,
  },
  cancelButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  processingInfo: {
    alignItems: 'center',
  },
  processingText: {
    fontSize: 16,
    color: '#FF9800',
    fontWeight: '600',
  },
  
  // Results section
  resultsSection: { flex: 1 },
  resultCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    elevation: 3,
  },
  resultHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  resultTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#2E7D32',
    marginLeft: 8,
  },
  transcriptionText: {
    fontSize: 16,
    color: '#2E2E2E',
    lineHeight: 24,
  },
  responseText: {
    fontSize: 16,
    color: '#2E2E2E',
    lineHeight: 24,
  },
});
