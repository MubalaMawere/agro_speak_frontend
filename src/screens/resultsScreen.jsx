import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  Animated,
  Easing,
  ActivityIndicator,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAudioPlayer } from 'expo-audio';
import { GestureHandlerRootView, ScrollView } from 'react-native-gesture-handler';

const Swidth = Dimensions.get('window').width;
const Sheight = Dimensions.get('window').height;

const ResultsScreen = ({ route }) => {
  const { audioUri, userId,text, from } = route.params;
  const navigation = useNavigation();

  const player = useAudioPlayer(audioUri ? { uri: audioUri } : null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Create 30 animated bars
  const bars = useRef([...Array(30)].map(() => new Animated.Value(Math.random() * 0.5 + 0.5))).current;

  // Animate waveform bars
  useEffect(() => {
    let anims = [];

    if (isPlaying) {
      anims = bars.map((bar) => {
        const loopAnim = Animated.loop(
          Animated.sequence([
            Animated.timing(bar, {
              toValue: Math.random() * 0.8 + 0.2,
              duration: Math.random() * 200 + 100,
              easing: Easing.linear,
              useNativeDriver: true,
            }),
            Animated.timing(bar, {
              toValue: Math.random() * 0.8 + 0.2,
              duration: Math.random() * 200 + 100,
              easing: Easing.linear,
              useNativeDriver: true,
            }),
          ])
        );
        loopAnim.start();
        return loopAnim;
      });
    }

    return () => {
      anims.forEach((anim) => anim.stop());
      bars.forEach((bar) => bar.setValue(0.5)); // reset bars when stopped
    };
  }, [isPlaying]);

  useEffect(() => {
    return () => {
      if (player?.pause) player.pause();
    };
  }, [player]);

  const handlePlayPause = async () => {
    if (!audioUri) return;

    setIsLoading(true);
    try {
      if (isPlaying) {
        await player.pause();
        setIsPlaying(false);
      } else {
        await player.play();
        setIsPlaying(true);
      }
    } catch (e) {
      console.error('Playback error:', e);
    } finally {
      setIsLoading(false);
    }
  };

  const goToHome = () => navigation.navigate('tabsNavigator');

  return (
    <GestureHandlerRootView>
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.main_container}>
        {/* Top bar */}
        <View style={styles.topContainer}>
          <TouchableOpacity onPress={goToHome} style={styles.backButton}>
            <Ionicons name="arrow-back-circle-sharp" size={36} color="green" />
          </TouchableOpacity>
        </View>

        {/* Waveform */}
        <View style={styles.audioContainer}>
          {audioUri ? (
            <>
              <View style={styles.waveform}>
                {bars.map((b, i) => (
                  <Animated.View
                    key={i}
                    style={[
                      styles.bar,
                      {
                        transform: [{ scaleY: b }],
                      },
                    ]}
                  />
                ))}
              </View>

              <TouchableOpacity style={styles.playButton} onPress={handlePlayPause} disabled={isLoading}>
                {isLoading ? (
                  <ActivityIndicator color="#1DB954" />
                ) : (
                  <Ionicons name={isPlaying ? 'pause-circle' : 'play-circle'} size={28} color="#1DB954" />
                )}
                <Text>Play{'  '}</Text>
              </TouchableOpacity>
            </>
          ) : (
            <Text style={styles.noAudioText}>No audio file available</Text>
          )}
        </View>

        {/* Info */}
        
          <Text style={styles.textLabel}> Read Text:</Text>
          <ScrollView style={styles.textContainer}>
                <Text>{text? text: 'Reading'}</Text>
          {userId && (
            <>
              <Text style={styles.textLabel}>User ID:</Text>
              <Text style={styles.textValue}>{userId}</Text>
            </>
          )}
        </ScrollView>
      </View>
    </SafeAreaView>
    </GestureHandlerRootView>
  );
};

export default ResultsScreen;

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: 'white' },
  main_container: { flex: 1, backgroundColor: 'white' },
  topContainer: {
    width: Swidth,
    height: 50,
    backgroundColor: '#f3fff7ff',
    borderTopWidth: 1,
    borderColor: 'grey',
    elevation: 5,
    justifyContent: 'flex-start',
    paddingHorizontal: 20,
  },
  backButton: { width: 40, height: 40, marginTop: 10 },
  audioContainer: {
    width: Swidth * 0.9,
    height: 150,
    alignSelf: 'center',
    marginTop: 50,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  waveform: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    width: '100%',
    height: 100,
    backgroundColor: '#f3fff7',
    paddingHorizontal: 5,
    borderRadius: 10,
  },
  bar: {
    width: 6,
    backgroundColor: '#1DB954',
    borderRadius: 3,
  },
  playButton: { 
    position: 'absolute',
     bottom: -30, 
     width:90,
     height:50,
     backgroundColor:'#ddfce7ff',
     right:0,
     alignItems:'center',
     borderRadius:30,
     justifyContent:'space-around',
     display:'flex',
     flexDirection:'row',
    
    
    },
  noAudioText: { color: 'gray', fontSize: 14 },
  textContainer: {
     marginTop: 40, 
    paddingHorizontal: 20,
    width:Swidth *.9,
   
    backgroundColor:'#f3fff7',
    alignSelf:'center',
    borderRadius:15,
    elevation:7,
    shadowColor:'gray',
    shadowOffset:5,
  
  },
  textLabel: { fontWeight: 'bold', fontSize: 16, marginTop: 10 },
  textValue: { fontSize: 15, color: '#555' },
});
