import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Image,
  BackHandler,
} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

import BarcodeSvg from '../../assets/img/connect_barcode.svg';
import stores from '../../stores';
import { useIsFocused } from '@react-navigation/native';
const StepViewer_BarCode = ({
  navigation,
  onPressHandler,
}: {
  navigation: any;
  onPressHandler: any;
}) => {
  async function init() {
    await stores.StepStore.SetStepState(2);
    await stores.RFIDStore.SendSetScanMode(0);
    await stores.RFIDStore.SendDisRFIDHandler();
    await stores.RFIDStore.SendDisBarcodeHandler();
  }

  const isFocused = useIsFocused();
  React.useEffect(() => {
    if (isFocused) {
      init();
      const backAction = () => {
        console.log('BarCode 백버튼 반응');
        navigation.navigate('StackTag');
        return true;
      };

      const backHandler = BackHandler.addEventListener(
        'hardwareBackPress',
        backAction,
      );
      return () => backHandler.remove();
    }
  }, [isFocused]);

  async function moveTagPage() {
    const isConnect = await stores.RFIDStore.isConnect;

    if (isConnect) {
      await stores.RFIDStore.SendSetScanMode(1);
      navigation.navigate('StackBarcodeDetail');
    }
  }
  const onPress = () => {
    moveTagPage();
  };

  return (
    <SafeAreaView style={styles.container}>
      <View
        style={{
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          width: wp('100%'),
          height: hp('58%'),
        }}>
        <TouchableOpacity onPress={() => onPress()}>
          <BarcodeSvg height={180} width={180} />
        </TouchableOpacity>
        <Text
          style={{
            paddingTop: 30,
            fontFamily: 'NanumSquareB',
            fontSize: 25,
            textAlign: 'center',
          }}>
          버튼을 누르면 바코드 스캔을 {'\n'}시작합니다.
        </Text>

        <Text
          style={{
            paddingTop: 20,
            fontFamily: 'NanumSquareR',
            fontSize: 18,
            color: 'red',
            textAlign: 'center',
          }}>
          RFID 리더기 왼쪽 (S) LED 빨간색이{'\n'} 켜져 있는지 확인 하여
          주십시오.
          {'\n\n'}
          비활성화: RFID {'   '}활성화: Barcode
        </Text>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#F9F9F9',
  },
  buttonContainer: {
    flexShrink: 1,
    flexDirection: 'row',
  },
});

export default StepViewer_BarCode;
