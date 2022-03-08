import React, {useRef} from 'react';
import {Animated, Text, View, StyleSheet, SafeAreaView} from 'react-native';

import BluetoothSearchSvg from '../../assets/img/bluetooth_search.svg';
import stores from '../../stores';
import {useIsFocused} from '@react-navigation/native';

const SearchViewer = ({navigation}: {navigation: any}) => {
  const isFocused = useIsFocused();
  const fadeAnim = useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }),
      ]),
    ).start();
  }, [fadeAnim]);

  React.useEffect(() => {
    if (isFocused) {
      stores.RFIDStore.onSearchBluetooth();

      console.log('5초뒤 페이지 이동!!');
      setTimeout(async () => {
        await stores.RFIDStore.RequestBluetoothList();
        navigation.navigate('StackBLEList');
      }, 3000);
    }
  }, [isFocused]);

  return (
    <SafeAreaView style={styles.container}>
      <Animated.View
        style={[
          styles.fadingContainer,
          {
            opacity: fadeAnim,
          },
        ]}>
        <Text style={styles.textStyle}> Bluetooth 찾는 중...</Text>
        <View style={{height: 60}} />
        <BluetoothSearchSvg height={300} width={300} />
      </Animated.View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: '#52AFE0',
  },
  fadingContainer: {
    top: 70,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent', //transparent
  },
  textStyle: {
    textAlign: 'center',
    color: '#fff',
    fontSize: 30,
    fontFamily: 'NanumSquareEB',
  },
});

export default SearchViewer;
