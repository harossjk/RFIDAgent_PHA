import React, {useRef} from 'react';
import {
  View,
  StyleSheet,
  Animated,
  SafeAreaView,
  Text,
  TouchableOpacity,
} from 'react-native';
import {margin, marginRight} from 'styled-system';

import BLECompletoinSvg from '../../assets/img/bluetooth_true.svg';
import stores from '../../stores';
import {observer} from 'mobx-react';
import ProgressBar from '../../components/Progress/ProgressBar';

const Completation = ({
  propy: fadeAnim,
  navigation,
}: {
  propy: any;
  navigation: any;
}) => {
  const onPressClose = () => {
    //navigation.navigate('DrawerHome')
    //navigation.reset({routes: [{name: "welcome", params: { email:any, password }}]})
    //stores.RFIDStore.InitDevice();
    //stores.RFIDStore.RequestDeviceConfig();
    //console.log(stores.RFIDStore.getDeviceInfo);
    //navigation.reset({routes: [{name: 'DrawerOption'}]});
  };
  if (!stores.RFIDStore.isConnect) {
    return <></>;
  } else {
    return (
      <SafeAreaView style={styles.container}>
        <Animated.View
          style={[
            styles.fadingContainer,
            {
              opacity: fadeAnim,
            },
          ]}>
          <TouchableOpacity onPress={() => onPressClose()}>
            <BLECompletoinSvg height={300} width={300} />
          </TouchableOpacity>

          <View style={{height: 60}} />

          <Text style={styles.textStyle}>
            {stores.RFIDStore.deviceInfo.devName}
          </Text>
          <Text style={styles.subtextStyle}>
            {stores.RFIDStore.deviceInfo.devMacAdrr}
          </Text>
          <Text
            style={{
              textAlign: 'center',
              color: '#fff',
              fontSize: 25,
              fontFamily: 'NanumSquareEB',
            }}>
            정상 적으로 연결 되었습니다.{'\n'}잠시만 기다려주세요.
          </Text>
        </Animated.View>
      </SafeAreaView>
    );
  }
};

const ObservedCompletation = observer(Completation);

const CompletionViewer = ({navigation}: {navigation: any}) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;

  async function GetDeviceInfo() {
    return new Promise<void>((resolve, reject) => {
      setTimeout(() => {
        if (!stores.RFIDStore.isConnect) {
          console.log('CompletionViewer : 연결실패');
        }
        navigation.reset({routes: [{name: 'DrawerOption'}]});
        resolve();
      }, 1000);
    });
  }

  React.useEffect(() => {
    GetDeviceInfo();
  }, []);

  React.useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
      ]),
    ).start();
  }, [fadeAnim]);

  return (
    <>
      <ObservedCompletation propy={fadeAnim} navigation={navigation} />
    </>
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
    color: '#2E3192',
    fontSize: 25,
    fontFamily: 'NanumSquareEB',
  },
  subtextStyle: {
    textAlign: 'center',
    color: '#2E3192',
    fontSize: 20,
    fontFamily: 'NanumSquareB',
    marginBottom: 20,
  },
});

export default CompletionViewer;
