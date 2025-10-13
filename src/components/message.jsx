import { StyleSheet, Text, TouchableOpacity,Dimensions,TextInput,View } from 'react-native'
import React, { useState } from 'react'
import { Ionicons } from '@expo/vector-icons';
const screenWidth = Dimensions.get('window').width;
const screeHeight = Dimensions.get('window').height;

const Message = () => {
 
  const [text,setText]=useState('')

  //sending a message
const sendeMessage= async()=>{

 try {

if((text.trim()).length <=2){
 // error.Message('message length too small')
  console.log('message length must be atleast 3 characters long')
}else{

  console.log('the message is ====>',text)
}

  //sending a message request
} catch (error) {
  //catching errors
}
}
  return (
    <View style={styles.container}>
      <TextInput 
      value={text}
      onChangeText={setText}
      style={styles.msg}
      placeholder='Write a search message'
      />
      <TouchableOpacity onPress={sendeMessage}>
      <Ionicons 
      name='send'
      size={28}
      color={'green'}
      
      />
      </TouchableOpacity>
    </View>
  )
}

export default Message

const styles = StyleSheet.create({
container:{
  
  height:60,
  borderRadius:8,
  
 width:screenWidth* .94,
 marginVertical:8,
  alignSelf:'center',
  display:'flex',
  flexDirection:'row',
  alignItems:'center',
  justifyContent:'space-evenly',


},
msg:{
  width:screenWidth* .8,
  height:50,
  backgroundColor:'#f4f2f2ff',
  color:'#0000',
  borderRadius:8,
  overflow:'scroll'


},


})