import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  TouchableOpacity,
  StyleSheet,
  Animated,
  Easing,
  Alert,
  Text,
} from 'react-native';
import {
  useAudioRecorder,
  useAudioRecorderState,
  useAudioPlayer,
  AudioModule,
  RecordingPresets,
  setAudioModeAsync,
} from 'expo-audio';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';


export default function VoiceRecording() {
  const navigation = useNavigation();
  const recorder = useAudioRecorder(RecordingPresets.HIGH_QUALITY);
  const recorderState = useAudioRecorderState(recorder);
  const [recordingUri, setRecordingUri] = useState(null);

  // create a player that auto-loads when recordingUri changes (pass null when none)
  const player = useAudioPlayer(recordingUri ? { uri: recordingUri } : null);

  // animations
  const micScale = useRef(new Animated.Value(1)).current;
  const wave = useRef(new Animated.Value(0)).current;
  const pulseRef = useRef(null);
  const waveRef = useRef(null);

  useEffect(() => {
    (async () => {
      const { granted } = await AudioModule.requestRecordingPermissionsAsync();
      if (!granted) {
        Alert.alert('Permission required', 'Microphone access is needed.');
        return;
      }
      await setAudioModeAsync({ allowsRecording: true, playsInSilentMode: true });
    })();
  }, []);

  const startRecording = async () => {
    try {
      await recorder.prepareToRecordAsync();
      recorder.record();
      // pulse mic
      pulseRef.current = Animated.loop(
        Animated.sequence([
          Animated.timing(micScale, { toValue: 1.25, duration: 350, easing: Easing.ease, useNativeDriver: true }),
          Animated.timing(micScale, { toValue: 1, duration: 350, easing: Easing.ease, useNativeDriver: true }),
        ])
      );
      pulseRef.current.start();
      // wave animation
      waveRef.current = Animated.loop(
        Animated.sequence([
          Animated.timing(wave, { toValue: 1, duration: 350, useNativeDriver: false }),
          Animated.timing(wave, { toValue: 0, duration: 350, useNativeDriver: false }),
        ])
      );
      waveRef.current.start();
    } catch (e) {
      console.error('startRecording', e);
      Alert.alert('Recording error', String(e));
    }
  };

  const stopRecording = async () => {
    try {
      await recorder.stop();
      // recorder.uri is documented — recording URL becomes available after stop.
      setRecordingUri(recorder.uri || null);
    } catch (e) {
      console.error('stopRecording', e);
    } finally {
      pulseRef.current?.stop();
      waveRef.current?.stop();
      micScale.setValue(1);
      wave.setValue(0);
    }
  };

  const toggleRecord = () => {
    // use recorderState.isRecording which is polled by useAudioRecorderState
    if (recorderState.isRecording) stopRecording();
    else startRecording();
  };

  const play = async () => {
    if (!recordingUri) return Alert.alert('No recording', 'Record something first.');
    try {
      await player.play(); // expo-audio player.play() — no loadAsync required. :contentReference[oaicite:1]{index=1}
    } catch (e) {
      console.error('Playback error', e);
      Alert.alert('Playback error', String(e));
    }
  };

  const clear = async () => {
    try {
      // pause/seek to start (if player supports these)
      if (player?.pause) await player.pause();
      if (player?.seekTo) await player.seekTo(0);
    } catch (e) {
      // ignore if method not available
    }
    setRecordingUri(null);
  };
const userText = 'I’m a passionate logo designer '
  const sendAudionRequest=()=>{

    console.log("Recorded audio ====>",recordingUri)
    navigation.navigate('resultsScreen',{
      audioUri:recordingUri,
      id:12,
      text:userText,
      from:'voice screen'
    })
    
  }

  const waveWidth = wave.interpolate({ inputRange: [0, 1], outputRange: ['20%', '100%'] });

  return (
    <View style={s.wrapper}>
      <Animated.View style={[s.micCircle, { transform: [{ scale: micScale }] }]}>
        <TouchableOpacity onPress={toggleRecord} activeOpacity={0.8}>
          <Ionicons name={recorderState.isRecording ? 'mic' : 'mic-outline'} size={68} color="#fff" />
        </TouchableOpacity>
      </Animated.View>

      {recorderState.isRecording && <Animated.View style={[s.wave, { width: waveWidth }]} />}

      {recordingUri && (
        <View style={s.controls}>
          <TouchableOpacity onPress={play} style={s.controlBtn}><Ionicons name="play" size={28} color="green" /></TouchableOpacity>
          <TouchableOpacity onPress={clear} style={s.controlBtn}><Ionicons name="trash" size={24} color="grey" /></TouchableOpacity>
          <TouchableOpacity onPress={sendAudionRequest} style={s.controlBtn}><Ionicons name="send" size={28} color="red" /></TouchableOpacity>
          {/* <Text style={s.uriText} numberOfLines={1}>{recordingUri}</Text> */}
        </View>
      )}
    </View>
  );
}

const s = StyleSheet.create({
  wrapper: { alignItems: 'center', gap: 12 },
  micCircle: {
    width: 110,
    height: 110,
    borderRadius: 65,
    backgroundColor: '#0fb400ff',
    alignItems: 'center',
    justifyContent: 'center',
   
  },
  wave: { height: 4, borderRadius: 2, backgroundColor: 'red', marginTop: 10 },

  controls: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    marginTop: 7,
    width: 320,
    justifyContent: 'space-around',
    backgroundColor: '#ffff',
    borderRadius: 8,
    opacity: .7,
marginBottom:50,
  },

  controlBtn: { padding: 6 },
  uriText: { flex: 1, marginLeft: 6, color: '#444', fontSize: 12 },
});
