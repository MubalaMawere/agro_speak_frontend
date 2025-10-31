import { useState, useEffect, useCallback } from 'react';
import voiceAssistantService from '../utils/voiceAssistantService';

/**
 * Voice Assistant Hook
 * Provides voice recording, speech synthesis, and command processing
 * 
 * Usage:
 * const { isListening, transcript, startListening, stopListening, speak } = useVoiceAssistant();
 */
export const useVoiceAssistant = () => {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [error, setError] = useState(null);
  const [isSpeaking, setIsSpeaking] = useState(false);

  useEffect(() => {
    // Cleanup on unmount
    return () => {
      if (isListening) {
        voiceAssistantService.stopRecording();
      }
      voiceAssistantService.stop();
    };
  }, [isListening]);

  const startListening = useCallback(async () => {
    try {
      setError(null);
      await voiceAssistantService.startRecording();
      setIsListening(true);
    } catch (err) {
      setError(err.message);
      console.error('Error starting voice recording:', err);
    }
  }, []);

  const stopListening = useCallback(async () => {
    try {
      const audioUri = await voiceAssistantService.stopRecording();
      setIsListening(false);
      return audioUri; // Return recorded audio
    } catch (err) {
      setError(err.message);
      console.error('Error stopping voice recording:', err);
    }
  }, []);

  // pdated speak to use TTS API and fallback to device TTS
  const speak = useCallback(async (text, language = 'bemba') => {
    try {
      setIsSpeaking(true);
      await voiceAssistantService.speakText(text, language); // unified service handler
    } catch (error) {
      console.error('Speak error:', error);
    } finally {
      setIsSpeaking(false);
    }
  }, []);

  const stopSpeaking = useCallback(() => {
    voiceAssistantService.stop();
    setIsSpeaking(false);
  }, []);

  const processCommand = useCallback((text) => {
    setTranscript(text);
    return voiceAssistantService.processCommand(text);
  }, []);

  return {
    isListening,
    transcript,
    error,
    isSpeaking,
    startListening,
    stopListening,
    speak,
    stopSpeaking,
    processCommand,
  };
};
