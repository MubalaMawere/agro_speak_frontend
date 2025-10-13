import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Dimensions, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAudioPlayer } from 'expo-audio';
import Slider from '@react-native-community/slider';
import { useNavigation } from '@react-navigation/native';
import { GestureHandlerRootView, ScrollView } from 'react-native-gesture-handler';


import { Audio } from "expo-av";
import * as FileSystem from "expo-file-system";

const MODEL = "espnet/kan-bayashi_ljspeech_vits"; 

const Swidth = Dimensions.get('window').width;

const ResultsScreen = ({ route }) => {
  const { audioUri, userId,text, from } = route.params;
  const navigation = useNavigation();
 
  const player = useAudioPlayer(audioUri ? { uri: audioUri } : null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [position, setPosition] = useState(0); // seconds
  const [duration, setDuration] = useState(1); // seconds, avoid divide by zero
const [isReading,setReading]=useState(false)
  useEffect(() => {
    
    const interval = setInterval(async () => {
      if (isPlaying && player) {
        setPosition(player.currentStatus.currentTime ?? 0);
      setDuration(player.currentStatus.duration ?? 1);
      
       
      }
    }, 500);
    return () => clearInterval(interval);
  }, [isPlaying, player]);

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

  const seekAudio = async (value) => {
    if (player?.seekTo) {
      await player.seekTo(value);
      setPosition(value);
    }
  };

  const goToHome = () => navigation.navigate('tabsNavigator');
 





const speak=async (text) =>{
 


  try {
    setReading(true)
    const response = await fetch(
     'https://api-inference.huggingface.co/models/facebook/blenderbot-400M-distill',
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
          Accept: "audio/wav", // Request audio output
        },
        body: JSON.stringify({ inputs: text }),
      }
    );

    if (!response.ok) {
      console.log("Error:", response.status, await response.text());
      return;
    }
console.log('rech here')
    const arrayBuffer = await response.arrayBuffer();
    const base64Audio = Buffer.from(arrayBuffer).toString("base64");

    // Play the audio in React Native
    const { Sound } = require("expo-av");
    const sound = new Sound();
    await sound.loadAsync({ uri: `data:audio/wav;base64,${base64Audio}` });

    await sound.playAsync();
  } catch (err) {
    console.error("TTS Error:", err);
  }finally{
    setReading(false);
  }


}

 

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

        {/* Slider */}
        <View style={styles.audioContainer}>
          {audioUri ? (
            <>
              <Slider
                style={{ width: '90%', height: 40 }}
                minimumValue={0}
                maximumValue={duration}
                value={position}
                onSlidingComplete={seekAudio}
                minimumTrackTintColor="#1DB954"
                maximumTrackTintColor="#ccc"
                thumbTintColor="#1DB954"
              />

               <TouchableOpacity style={styles.playButton} onPress={handlePlayPause} disabled={isLoading}>
                {isLoading ? (
                  <ActivityIndicator color="#1DB954" />
                ) : (
                  <Ionicons name={isPlaying ? 'pause-circle' : 'play-circle'} size={28} color="#1DB954" />
                )}
                <Text>Play{'  '}</Text>
              </TouchableOpacity>

              <View style={styles.timeContainer}>
                <Text>{position.toFixed(1)}s</Text>
                <Text>{duration.toFixed(1)}s</Text>
              </View>
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
          <TouchableOpacity onPress={()=>speak(text)} style={styles.speakText} >
            {!isReading? (
               <Ionicons  name='play' size={30} color={'green'}/>     
            ) 
            :(<Ionicons  name='pause-circle' size={30} color={'green'}/>

            )
           

          }
            
            <Text> Speak </Text>
          </TouchableOpacity>
        </ScrollView>
      </View>
    </SafeAreaView>
    </GestureHandlerRootView>
  );
};

export default ResultsScreen;

const styles = StyleSheet.create({
  safeArea: { 
    flex: 1, 
    backgroundColor: 'white' 
  },
  main_container: {
     flex: 1,
     backgroundColor: 'white' 
    },
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
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor:'#f3fff7ff',
    borderRadius:15,
    elevation:5,
    shadowColor:'#1d1d1dff',
    shadowOffset:5,
  },
  playButton: { 
    position: 'absolute',
     bottom: -20, 
     width:90,
     height:50,
     backgroundColor:'#e1ffeaff',
     right:20,
     alignItems:'center',
     borderRadius:30,
     justifyContent:'space-around',
     display:'flex',
     flexDirection:'row',
      
  },
  timeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '90%',
    marginTop: 5,
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
  speakText:{
    width:100,
    height:40,
    backgroundColor:'#f3fff7',
    display:'flex',
    flexDirection:'row',
   alignItems:'center',
   justifyContent:'center',marginTop:10,
   borderRadius:25,
  overflow:'hidden',
  elevation:5,
  shadowColor:'#656565ff'
  
  },
});
