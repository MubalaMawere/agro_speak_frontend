import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Text, Alert, TouchableOpacity } from 'react-native';
import {
  useAudioRecorder,
  AudioModule,
  RecordingPresets,
  setAudioModeAsync,
  useAudioRecorderState,
} from 'expo-audio';
import { Ionicons } from '@expo/vector-icons';

const VoiceRecording = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [recordingFile, setRecordingFile] = useState(null);

  const audioRecorder = useAudioRecorder(RecordingPresets.HIGH_QUALITY);
  const recorderState = useAudioRecorderState(audioRecorder);

  useEffect(() => {
    (async () => {
      try {
        const status = await AudioModule.requestRecordingPermissionsAsync();
        if (!status.granted) {
          Alert.alert('Permission denied', 'Microphone access is required to record audio.');
          return;
        }

        await setAudioModeAsync({
          playsInSilentMode: true,
          allowsRecording: true,
        });
      } catch (error) {
        console.error('Error setting audio mode:', error);
      }
    })();
  }, []);

  const startRecording = async () => {
    try {
      await audioRecorder.prepareToRecordAsync();
      await audioRecorder.record();
      setIsRecording(true);
      console.log('Recording started...');
    } catch (error) {
      console.error('Error starting recording:', error);
    }
  };

  const stopRecording = async () => {
    try {
      await audioRecorder.stop();
      setRecordingFile(audioRecorder.uri);
      setIsRecording(false);
      console.log('Recording saved at:', audioRecorder.uri);
    } catch (error) {
      console.error('Error stopping recording:', error);
    }
  };

  const handleRecording = () => {
    if (isRecording) {
      stopRecording();
    } else {
      startRecording();
    }
  };

  return (<View>
    <TouchableOpacity
      style={[styles.container, { backgroundColor: isRecording ? 'red' : 'green' }]}
      onPress={handleRecording}
    >
      <Ionicons
        name={isRecording ? 'mic' : 'mic-outline'}
        size={80}
        color="white"
      />
      
    </TouchableOpacity>
    
    <Text>Recording</Text>
    </View>
  );
};

export default VoiceRecording;

const styles = StyleSheet.create({
  container: {
    width: 150,
    height: 150,
    borderRadius: 75,
    alignItems: 'center',
    justifyContent: 'center',
  },
  fileText: {
    fontSize: 12,
    color: '#fff',
    marginTop: 10,
    textAlign: 'center',
    width: 120,
  },
});
