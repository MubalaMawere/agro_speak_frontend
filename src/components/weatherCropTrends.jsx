import React, { useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View, Image, Dimensions, Modal, Pressable } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

const { width } = Dimensions.get('window');

const WeatherCropTrends = ({ name, picture, details }) => {
  const [modalVisible, setModalVisible] = useState(false);

  const handleOpen = () => setModalVisible(true);
  const handleClose = () => setModalVisible(false);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      {/* Touchable card */}
      <TouchableOpacity style={styles.container} onPress={handleOpen}>
        <View style={styles.imgContainer}>
          <Image source={picture} resizeMode="cover" style={styles.img} />
        </View>
        <View style={styles.detailsContainer}>
          <Text style={styles.title}>{name}</Text>
          <Text numberOfLines={1} ellipsizeMode="tail" style={styles.details}>
            {details}
          </Text>
        </View>
      </TouchableOpacity>

      {/* Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={handleClose}
      >
        <View style={styles.modalBackground}>
          <View style={styles.modalContent}>
            <Image source={picture} resizeMode="cover" style={styles.bigImage} />
            <Text style={styles.sheetTitle}>{name}</Text>
            <Text style={styles.sheetDetails}>{details}</Text>

            <Pressable style={styles.closeButton} onPress={handleClose}>
              <Text style={styles.closeButtonText}>Close</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </GestureHandlerRootView>
  );
};

export default WeatherCropTrends;

const styles = StyleSheet.create({
  container: {
    width: width * 0.5,
    height: 60,
    backgroundColor: 'rgba(236, 255, 231, 0.6)',
    flexDirection: 'row',
    margin: 5,
    padding: 8,
    borderRadius: 10,
    alignItems: 'center',
  },
  detailsContainer: {
    flex: 1,
    paddingHorizontal: 5,
  },
  img: {
    width: 50,
    height: 50,
    borderRadius: 10,
  },
  imgContainer: {
    width: 60,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    color: 'rgba(1, 99, 1, 1)',
    fontWeight: '600',
  },
  details: {
    color: '#333',
    fontSize: 12,
  },
  modalBackground: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '90%',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
  },
  bigImage: {
    width: '100%',
    height: 200,
    borderRadius: 12,
    marginBottom: 16,
  },
  sheetTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: 'rgba(1, 99, 1, 1)',
    marginBottom: 8,
  },
  sheetDetails: {
    fontSize: 15,
    color: '#444',
    lineHeight: 22,
    textAlign: 'center',
  },
  closeButton: {
    marginTop: 16,
    backgroundColor: 'rgba(1, 99, 1, 1)',
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  closeButtonText: {
    color: '#fff',
    fontWeight: '600',
  },
});
