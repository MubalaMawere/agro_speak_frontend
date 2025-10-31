import React, { useState, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, FlatList, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Audio } from 'expo-av';
import * as Speech from 'expo-speech';

export default function ChatScreen({ route, navigation }) {
  const { contact, type } = route.params;
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [recording, setRecording] = useState(null);
  const [isRecording, setIsRecording] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const flatListRef = useRef(null);

  // TODO: Replace with backend API calls to load conversation history
  useEffect(() => {
    // Load initial messages from backend
    const initialMessages = [
      {
        id: '1',
        text: `Hello! I'm interested in ${type === 'buyers' ? 'selling my crops' : 'your products'}. Can we discuss?`,
        sender: 'user',
        timestamp: new Date(Date.now() - 3600000),
        type: 'text'
      },
      {
        id: '2',
        text: `Hi! Yes, I'd be happy to help. What ${type === 'buyers' ? 'crops do you have available' : 'products are you looking for'}?`,
        sender: 'contact',
        timestamp: new Date(Date.now() - 3000000),
        type: 'text'
      }
    ];
    setMessages(initialMessages);
  }, []);

  // TODO: Integrate with backend API to send messages
  const sendMessage = async () => {
    if (!newMessage.trim()) return;

    const message = {
      id: Date.now().toString(),
      text: newMessage.trim(),
      sender: 'user',
      timestamp: new Date(),
      type: 'text'
    };

    setMessages(prev => [...prev, message]);
    setNewMessage('');

    // TODO: Send message to backend API
    // await sendMessageToBackend(message);

    // Auto-scroll to bottom
    setTimeout(() => {
      flatListRef.current?.scrollToEnd({ animated: true });
    }, 100);
  };

  // TODO: Integrate with backend API to send voice messages
  const startVoiceRecording = async () => {
    try {
      const permission = await Audio.requestPermissionsAsync();
      if (!permission.granted) {
        Alert.alert('Permission required', 'Microphone permission is needed to record voice messages');
        return;
      }

      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
        staysActiveInBackground: false,
      });

      const recording = new Audio.Recording();
      await recording.prepareToRecordAsync({
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
      });

      await recording.startAsync();
      setRecording(recording);
      setIsRecording(true);
    } catch (err) {
      console.error('Failed to start recording:', err);
      Alert.alert('Error', 'Failed to start recording');
    }
  };

  const stopVoiceRecording = async () => {
    if (!recording) return;

    try {
      await recording.stopAndUnloadAsync();
      const uri = recording.getURI();
      
      if (uri) {
        const voiceMessage = {
          id: Date.now().toString(),
          text: 'Voice message',
          sender: 'user',
          timestamp: new Date(),
          type: 'voice',
          audioUri: uri
        };

        setMessages(prev => [...prev, voiceMessage]);
        
        // TODO: Send voice message to backend API
        // await sendVoiceMessageToBackend(voiceMessage);
      }

      setRecording(null);
      setIsRecording(false);
    } catch (err) {
      console.error('Failed to stop recording:', err);
      Alert.alert('Error', 'Failed to stop recording');
    }
  };

  // TODO: Integrate with backend API to play received voice messages
  const playVoiceMessage = async (audioUri) => {
    try {
      if (isPlaying) return;

      setIsPlaying(true);
      const { sound } = await Audio.Sound.createAsync({ uri: audioUri });
      
      sound.setOnPlaybackStatusUpdate((status) => {
        if (status.didJustFinish) {
          setIsPlaying(false);
        }
      });

      await sound.playAsync();
    } catch (err) {
      console.error('Failed to play audio:', err);
      setIsPlaying(false);
      Alert.alert('Error', 'Failed to play voice message');
    }
  };

  const renderMessage = ({ item }) => (
    <View style={[
      styles.messageContainer,
      item.sender === 'user' ? styles.userMessage : styles.contactMessage
    ]}>
      {item.type === 'voice' ? (
        <TouchableOpacity 
          style={styles.voiceMessage}
          onPress={() => item.sender === 'user' && item.audioUri ? playVoiceMessage(item.audioUri) : null}
        >
          <Ionicons 
            name={isPlaying ? "pause" : "play"} 
            size={20} 
            color={item.sender === 'user' ? '#FFFFFF' : '#2E7D32'} 
          />
          <Text style={[
            styles.voiceText,
            { color: item.sender === 'user' ? '#FFFFFF' : '#2E7D32' }
          ]}>
            {item.sender === 'user' ? 'Tap to play' : 'Voice message'}
          </Text>
        </TouchableOpacity>
      ) : (
        <Text style={[
          styles.messageText,
          { color: item.sender === 'user' ? '#FFFFFF' : '#2E2E2E' }
        ]}>
          {item.text}
        </Text>
      )}
      <Text style={[
        styles.timestamp,
        { color: item.sender === 'user' ? '#E8F5E9' : '#6B7A6F' }
      ]}>
        {item.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
      </Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.safe}>
      <KeyboardAvoidingView 
        style={styles.container} 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="arrow-back" size={24} color="#2E7D32" />
          </TouchableOpacity>
          <View style={styles.headerInfo}>
            <Text style={styles.contactName}>{contact.fullName}</Text>
            <Text style={styles.contactBusiness}>{contact.businessName}</Text>
          </View>
          <TouchableOpacity style={styles.callButton}>
            <Ionicons name="call" size={20} color="#2E7D32" />
          </TouchableOpacity>
        </View>

        {/* Messages */}
        <FlatList
          ref={flatListRef}
          data={messages}
          keyExtractor={(item) => item.id}
          renderItem={renderMessage}
          style={styles.messagesList}
          contentContainerStyle={styles.messagesContent}
          showsVerticalScrollIndicator={false}
        />

        {/* Input Area */}
        <View style={styles.inputContainer}>
          <View style={styles.inputRow}>
            <TextInput
              style={styles.textInput}
              value={newMessage}
              onChangeText={setNewMessage}
              placeholder="Type a message..."
              placeholderTextColor="#6B7A6F"
              multiline
              maxLength={500}
            />
            <TouchableOpacity 
              style={styles.voiceButton}
              onPress={isRecording ? stopVoiceRecording : startVoiceRecording}
            >
              <Ionicons 
                name={isRecording ? "stop" : "mic"} 
                size={20} 
                color={isRecording ? "#F44336" : "#2E7D32"} 
              />
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.sendButton, !newMessage.trim() && styles.sendButtonDisabled]}
              onPress={sendMessage}
              disabled={!newMessage.trim()}
            >
              <Ionicons name="send" size={20} color="#FFFFFF" />
            </TouchableOpacity>
          </View>
          {isRecording && (
            <View style={styles.recordingIndicator}>
              <Ionicons name="radio" size={16} color="#F44336" />
              <Text style={styles.recordingText}>Recording... Tap to stop</Text>
            </View>
          )}
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#FAF8F1' },
  container: { flex: 1 },
  
  // Header
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E2D6',
  },
  backButton: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: '#F1F8E9',
    marginRight: 12,
  },
  headerInfo: { flex: 1 },
  contactName: {
    fontSize: 18,
    fontWeight: '700',
    color: '#2E2E2E',
  },
  contactBusiness: {
    fontSize: 14,
    color: '#6B7A6F',
    marginTop: 2,
  },
  callButton: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: '#F1F8E9',
  },
  
  // Messages
  messagesList: { flex: 1 },
  messagesContent: { padding: 20 },
  messageContainer: {
    maxWidth: '80%',
    marginBottom: 16,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 20,
  },
  userMessage: {
    alignSelf: 'flex-end',
    backgroundColor: '#2E7D32',
    borderBottomRightRadius: 4,
  },
  contactMessage: {
    alignSelf: 'flex-start',
    backgroundColor: '#FFFFFF',
    borderBottomLeftRadius: 4,
    borderWidth: 1,
    borderColor: '#E5E2D6',
  },
  messageText: {
    fontSize: 16,
    lineHeight: 22,
  },
  voiceMessage: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  voiceText: {
    fontSize: 16,
    marginLeft: 8,
    fontWeight: '500',
  },
  timestamp: {
    fontSize: 12,
    marginTop: 4,
    alignSelf: 'flex-end',
  },
  
  // Input area
  inputContainer: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderTopWidth: 1,
    borderTopColor: '#E5E2D6',
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
  },
  textInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#E5E2D6',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: '#2E2E2E',
    maxHeight: 100,
    marginRight: 8,
  },
  voiceButton: {
    padding: 12,
    borderRadius: 20,
    backgroundColor: '#F1F8E9',
    marginRight: 8,
  },
  sendButton: {
    padding: 12,
    borderRadius: 20,
    backgroundColor: '#2E7D32',
  },
  sendButtonDisabled: {
    backgroundColor: '#B0B8B1',
  },
  recordingIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
    paddingHorizontal: 16,
  },
  recordingText: {
    fontSize: 14,
    color: '#F44336',
    marginLeft: 8,
    fontWeight: '500',
  },
});
