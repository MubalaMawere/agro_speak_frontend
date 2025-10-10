import React, { useRef, useMemo, useCallback, useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View, Image, Dimensions } from 'react-native';
import BottomSheet, { BottomSheetScrollView } from '@gorhom/bottom-sheet';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

const { width } = Dimensions.get('window');

const WeatherCropTrends = ({ name, picture, details }) => {
  const bottomSheetRef = useRef(null);
  const snapPoints = useMemo(() => ['50%', '90%'], []);
  const [open, setOpen] = useState(false);

  const handleOpen = useCallback(() => {
    setOpen(true);
    bottomSheetRef.current?.expand();
  }, []);

  const handleClose = useCallback(() => {
    setOpen(false);
    bottomSheetRef.current?.close();
  }, []);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <TouchableOpacity style={styles.container} onPress={handleOpen}>
        <View style={styles.imgContainer}>
          <Image source={picture} resizeMode='cover' style={styles.img} />
        </View>
        <View style={styles.detailsContainer}>
          <Text style={styles.title}>{name}</Text>
          <Text numberOfLines={1} ellipsizeMode='tail' style={styles.details}>
            {details}
          </Text>
        </View>
      </TouchableOpacity>

      {open && (
        <BottomSheet
          ref={bottomSheetRef}
          index={1}
          snapPoints={snapPoints}
          enablePanDownToClose
          onClose={handleClose}
          backgroundStyle={{ backgroundColor: '#fff' }}
        >
          <BottomSheetScrollView contentContainerStyle={styles.sheetContent}>
            <Image source={picture} resizeMode='cover' style={styles.bigImage} />
            <Text style={styles.sheetTitle}>{name}</Text>
            <Text style={styles.sheetDetails}>{details}</Text>
          </BottomSheetScrollView>
        </BottomSheet>
      )}
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
  sheetContent: {
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
  },
});
