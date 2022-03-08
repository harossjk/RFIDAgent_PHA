import React, { useCallback } from 'react';
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
import { useIsFocused } from '@react-navigation/native';
import RFIDSvg from '../../assets/img/connect_rfid.svg';
import { observer } from 'mobx-react';
import stores from '../../stores';

const StepViewer_RFID = ({
  navigation,
  onPressHandler,
}: {
  navigation: any;
  onPressHandler: any;
}) => {
  const isFocused = useIsFocused();
  React.useEffect(() => {
    if (isFocused) {
      stores.StepStore.SetStepState(2);
      const backAction = () => {
        console.log('RFID 백버튼 반응');
        navigation.navigate('DrawerHome');
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
      await stores.StepStore.SetStepState(1);
      //await stores.RFIDStore.SendSetRFIDHandler();
      await navigation.navigate('StackMoldInfo');
    }
  }

  const onMoveToTag = () => {
    moveTagPage();
  };

  return (
    <SafeAreaView style={styles.container}>
      <View
        style={{
          top: 100,
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          width: wp('100%'),
          height: hp('58%'),
        }}>
        <TouchableOpacity onPress={() => onMoveToTag()}>
          <RFIDSvg height={180} width={180} />
        </TouchableOpacity>
        <Text
          style={{
            paddingTop: 30,
            fontFamily: 'NanumSquareB',
            fontSize: 25,
            textAlign: 'center',
          }}>
          버튼을 누르면 RFID 스캔을 {'\n'}시작합니다.
        </Text>
        <Text
          style={{
            paddingTop: 20,
            fontFamily: 'NanumSquareR',
            fontSize: 18,
            color: 'red',
            textAlign: 'center',
          }}>
          RFID 리더기 왼쪽 (S) LED 빨간색이{'\n'} 꺼져있는지 확인 하여 주십시오.
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

export default StepViewer_RFID;
