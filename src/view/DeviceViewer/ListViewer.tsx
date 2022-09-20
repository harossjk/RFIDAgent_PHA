import React, { useRef, useEffect, useState } from 'react';
import {
  Text,
  View,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  BackHandler,
  Alert,
  ScrollView,
} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import { observer } from 'mobx-react';
import stores from '../../stores';
import ProgressBar from '../../components/Progress/ProgressBar';

const BluetoothItemList = ({ navigation }: { navigation: any }) => {

  const wait = (timeToDelay: any) => new Promise((resolve) => setTimeout(resolve, timeToDelay))

  const [userColor, setUserColor] = useState();


  if (stores.RFIDStore.getBluetoothInfo === undefined) {
    return <></>;
  } else if (stores.RFIDStore.getBluetoothInfo === 'BLUETOOTH_NONE') {
    return (
      <SafeAreaView style={styles.container}>
        <View
          style={{
            marginTop: 70,
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#52AFE0',
          }}>
          <Text style={styles.fadingContainer}> Bluetooth Device 선택</Text>
          <ScrollView>
            <View style={styles.RectContainer}>
              <Text
                style={{
                  textAlign: 'center',
                  color: '#F30000',
                  fontSize: 25,
                  fontFamily: 'NanumSquareEB',
                }}>
                RFID 블루투스{'\n'} 정보가 없습니다{'\n\n'}
                블루투스 전원을 {'\n'}확인 하여 주십시오.
              </Text>

              <Text
                style={{
                  textAlign: 'center',
                  color: '#fff',
                  fontSize: 25,
                  fontFamily: 'NanumSquareEB',
                }}>
                {'\n'}
                뒤로가기를 눌러 {'\n'}다시한번 시도하여 주십시오.
              </Text>
            </View>
          </ScrollView>
        </View>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            marginHorizontal: 30,
          }}>
          <TouchableOpacity
            onPress={() => {
              navigation.popToTop();
              navigation.navigate('DrawerOption');
            }}>
            <Text
              style={{
                textAlign: 'center',
                color: '#fff',
                fontSize: 25,
                fontFamily: 'NanumSquareEB',
              }}>
              {'<'} BACK
            </Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  } else {
    const onBLEConnect = (key: any, value: any) => {
      const strInfo: string =
        key + '\n' + value + '\n\n' + '연결을 진행하시겠습니까?';
      Alert.alert('Bluetooth', strInfo, [
        {
          text: '취소',
          onPress: () => null,
          style: 'cancel',
        },
        {
          text: '연결',
          onPress: async () => {
            let isMount = true;
            try {
              if (isMount) {
                stores.StepStore.SetNoticeVisible(true);
                await stores.RFIDStore.VerifyBluetooth();
                if (stores.RFIDStore.isSearch) {
                  await stores.RFIDStore.onSearchStop();
                  console.log('0.브로드캐스트 종료');
                  await wait(1000);

                  await stores.RFIDStore.SendSetRFIDHandler();
                  console.log('1.RFID 핸들러 연결');
                  await wait(1000);

                  await stores.RFIDStore.onDeviceConnect(key, value);
                  console.log('2.블루투스 연결');
                  await wait(1000);

                  await stores.RFIDStore.SendSetScanMode(0);
                  console.log('3.RFID 모드선택');
                  await wait(1000);

                  await stores.RFIDStore.VerifyConnect();
                  console.log('4.블루투스 연결 확인');
                  await wait(3000);

                  await stores.RFIDStore.RequestDeviceConfig().then().catch();
                  await wait(1000);
                  if (stores.RFIDStore.isConnect && stores.RFIDStore.getDeviceInfo.toString() !== "CONFIG_NONE") {
                    await stores.StepStore.SetNoticeVisible(false);
                    navigation.navigate('StackBLECompltion');
                  }
                  else {
                    await stores.StepStore.SetNoticeVisible(false);
                    await stores.RFIDStore.SendToastMessage("Connect error 연결을 다시 시도하여주십시오.")
                    await stores.RFIDStore.SetConnect(false)
                    await wait(1000);
                    navigation.reset({ routes: [{ name: 'DrawerOption' }] });
                  }
                }
              }
            } catch (error) {
              console.log("Connect error", error);
              await stores.StepStore.SetNoticeVisible(false);
              await stores.RFIDStore.SendToastMessage("Connect error 연결을 다시 시도하여주십시오.")
              await stores.RFIDStore.SetConnect(false)
              navigation.navigate('StackBLEList');
            }

            return () => {
              isMount = false;
            };

            // stores.StepStore.SetNoticeVisible(true);
            // await Connect(key, value);
            // setTimeout(async () => {
            //   if (stores.RFIDStore.isConnect) {
            //     await stores.StepStore.SetNoticeVisible(false);
            //     navigation.navigate('StackBLECompltion');
            //   }
            // }, 2000);
          },
        },
      ]);
    };




    // //jjk, 21.12.22
    // async function Connect(key: any, value: any) {
    //   await stores.RFIDStore.VerifyBluetooth();
    //   if (stores.RFIDStore.isSearch) {
    //     function onSearchStop() {
    //       return new Promise<void>((resolve, reject) => {
    //         setTimeout(async () => {
    //           console.log('0.브로드캐스트 종료');
    //           await stores.RFIDStore.onSearchStop();
    //           resolve();
    //         }, 1000);
    //       });
    //     }

    //     function SendSetRFIDHandler() {
    //       return new Promise<void>((resolve, reject) => {
    //         setTimeout(async () => {
    //           console.log('1.RFID 핸들러 연결');
    //           await stores.RFIDStore.SendSetRFIDHandler();
    //           resolve();
    //         }, 1000);
    //       });
    //     }

    //     function onDeviceConnect() {
    //       return new Promise<void>((resolve, reject) => {
    //         console.log('2.블루투스 연결');
    //         setTimeout(async () => {
    //           await stores.RFIDStore.onDeviceConnect(key, value);
    //         }, 1000);
    //         resolve();
    //       });
    //     }

    //     function SendSetScanMode() {
    //       return new Promise<void>((resolve, reject) => {
    //         setTimeout(async () => {
    //           console.log('3.RFID 모드선택');
    //           await stores.RFIDStore.SendSetScanMode(0);
    //           resolve();
    //         }, 4000);
    //       });
    //     }

    //     function VerifyConnect() {
    //       return new Promise<void>((resolve, reject) => {
    //         setTimeout(async () => {
    //           console.log('4.블루투스 연결 확인');
    //           const result = await stores.RFIDStore.VerifyConnect().then();
    //           console.log("ListView|VerifyConnect", result);

    //           resolve();
    //         }, 1000);
    //       });
    //     }

    //     console.log('-------Start ------');
    //     await onSearchStop();
    //     await SendSetRFIDHandler();
    //     await onDeviceConnect();
    //     await SendSetScanMode();
    //     await VerifyConnect();
    //     console.log('-------End ------');
    //   }
    // }

    return (

      <SafeAreaView style={styles.container}>
        <ObservedProgressBar visible={stores.StepStore.getNoticeVisible} />
        <View
          style={{
            marginTop: 70,
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#52AFE0',
          }}>
          <Text style={styles.fadingContainer}> Bluetooth Device 선택</Text>
          <ScrollView>
            <View style={styles.RectContainer}>
              {Object.keys(stores.RFIDStore.getBluetoothInfo).map(
                (key, idx) => {
                  const rfidvalue = stores.RFIDStore.getBluetoothInfo[key];
                  return (
                    <View style={{ paddingVertical: 10 }} key={idx}>
                      <TouchableOpacity
                        onPress={() => onBLEConnect(key, rfidvalue)}>
                        <Text style={styles.textStyle}>{key}</Text>
                        <Text style={styles.subtextStyle}>{rfidvalue}</Text>
                      </TouchableOpacity>
                    </View>
                  );
                },
              )}
            </View>
          </ScrollView>
        </View>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginHorizontal: 30, }}>
          <TouchableOpacity
            onPress={() => {
              navigation.popToTop();
              navigation.navigate('DrawerOption');
            }}>
            <Text style={{ textAlign: 'center', color: '#fff', fontSize: 25, fontFamily: 'NanumSquareEB', }}>
              {'<'} BACK
            </Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }
};

const ObservedBluetoothListItems = observer(BluetoothItemList);
const ObservedProgressBar = observer(ProgressBar);

const ListViewer = ({ navigation }: { navigation: any }) => {
  React.useEffect(() => {
    const backAction = () => {
      navigation.popToTop();
      navigation.navigate('DrawerOption');
      console.log("백버튼 이벤트가 여기서 타는거야 ?");

      return true;
    };

    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      backAction,
    );
    return () => backHandler.remove();
  }, []);

  return (
    <View style={styles.container}>

      <ObservedBluetoothListItems navigation={navigation} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: '#52AFE0',
  },
  fadingContainer: {
    textAlign: 'center',
    color: '#fff',
    fontSize: 28,
    fontFamily: 'NanumSquareEB',
  },
  textStyle: {
    textAlign: 'center',
    color: '#fff',
    fontSize: 25,
    fontFamily: 'NanumSquareEB',
  },
  subtextStyle: {
    textAlign: 'center',
    color: '#fff',
    fontSize: 20,
    fontFamily: 'NanumSquareB',
    marginBottom: 20,
  },
  RectContainer: {
    width: wp('88%'),
    height: hp('48%'),

    borderRadius: 10,
    borderTopEndRadius: 10,
    borderTopStartRadius: 10,
    borderBottomStartRadius: 10,
    borderBottomEndRadius: 10,
    backgroundColor: '#79C1E6',

    flexDirection: 'column',
    alignItems: 'center',
    marginVertical: 60,
    paddingVertical: 30,
  },
});

export default ListViewer;
