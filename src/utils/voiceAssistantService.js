import * as Speech from 'expo-speech';
import { Audio } from 'expo-av';

/**
 * Voice Assistant Service
 * Handles voice recording, speech synthesis, and command processing
 */
class VoiceAssistantService {
  constructor() {
    this.recording = null;
    this.isRecording = false;
  }

  /**
   * Start voice recording
   */
  async startRecording() {
    try {
      const permission = await Audio.requestPermissionsAsync();
      
      if (permission.status !== 'granted') {
        throw new Error('Permission to access microphone was denied');
      }

      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });

      const { recording } = await Audio.Recording.createAsync(
        Audio.RecordingOptionsPresets.HIGH_QUALITY
      );

      this.recording = recording;
      this.isRecording = true;
      
      console.log('Recording started');
      return recording;
    } catch (error) {
      console.error('Failed to start recording:', error);
      throw error;
    }
  }

  /**
   * Stop voice recording and return audio URI
   */
  async stopRecording() {
    try {
      if (!this.recording) {
        return null;
      }

      console.log('Stopping recording...');
      await this.recording.stopAndUnloadAsync();
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: false,
      });

      const uri = this.recording.getURI();
      this.recording = null;
      this.isRecording = false;

      console.log('Recording stopped, URI:', uri);
      return uri;
    } catch (error) {
      console.error('Failed to stop recording:', error);
      throw error;
    }
  }

  /**
   * Text-to-speech
   */
  speak(text, options = {}) {
    const defaultOptions = {
      language: 'en-US',
      pitch: 1.0,
      rate: 0.9,
      ...options,
    };

    console.log('Speaking:', text);
    return Speech.speak(text, defaultOptions);
  }

  /**
   * Stop speaking
   */
  stop() {
    Speech.stop();
  }

  /**
   * Check if currently speaking
   */
  async isSpeaking() {
    return await Speech.isSpeakingAsync();
  }

  /**
   * Process voice command and determine action
   * Returns: { action: string, data: any }
   */
  processCommand(transcript) {
    if (!transcript) {
      return { action: 'unknown', data: null };
    }

    const lowerTranscript = transcript.toLowerCase();

    // Weather commands
    if (lowerTranscript.includes('weather') || 
        lowerTranscript.includes('forecast') ||
        lowerTranscript.includes('temperature') ||
        lowerTranscript.includes('rain')) {
      return { action: 'weather', data: transcript };
    }

    // Crop commands
    if (lowerTranscript.includes('crop') || 
        lowerTranscript.includes('plant') ||
        lowerTranscript.includes('harvest') ||
        lowerTranscript.includes('trend')) {
      return { action: 'crops', data: transcript };
    }

    // Profile commands
    if (lowerTranscript.includes('profile') || 
        lowerTranscript.includes('farm') ||
        lowerTranscript.includes('my info') ||
        lowerTranscript.includes('account')) {
      return { action: 'profile', data: transcript };
    }

    // Market commands
    if (lowerTranscript.includes('price') || 
        lowerTranscript.includes('market') ||
        lowerTranscript.includes('sell') ||
        lowerTranscript.includes('buy')) {
      return { action: 'market', data: transcript };
    }

    // Soil commands
    if (lowerTranscript.includes('soil') || 
        lowerTranscript.includes('fertilizer') ||
        lowerTranscript.includes('nutrient')) {
      return { action: 'soil', data: transcript };
    }

    // Location commands
    if (lowerTranscript.includes('location') || 
        lowerTranscript.includes('where') ||
        lowerTranscript.includes('map')) {
      return { action: 'location', data: transcript };
    }

    return { action: 'unknown', data: transcript };
  }
}

export default new VoiceAssistantService();