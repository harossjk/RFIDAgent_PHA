import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Alert,
  Modal,
} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import { observer } from 'mobx-react';
import { Button } from 'react-native-elements';
import stores from '../../stores';

import BluetoothSvgRed from '../../assets/img/bluetooth_red.svg';
import BluettothSvgGreen from '../../assets/img/bluetooth_green.svg';
import DeviceNameSvg from '../../assets/img/device_name.svg';
import DeviceAddressSvg from '../../assets/img/device_address.svg';
import DeviceBeepVolumeSvg from '../../assets/img/device_sound.svg';
import DeviceVibratorSvg from '../../assets/img/device_vibrator.svg';
import DeviceRadioPowerSvg from '../../assets/img/device_radiopower.svg';
import ContinuousReadSvg from '../../assets/img/continuous_Read.svg';
import DeviceResetSvg from '../../assets/img/device_resetsetting.svg';
import { BuzzerDialog, RadioDialog } from '../../components/Dialog';

import ToggleButton from '../../components/ToggleButton/ToggleButton';
import { DeviceConfig } from '../../components/DeviceObject';
import ProgressBar from '../../components/Progress/ProgressBar';
import { useIsFocused } from '@react-navigation/native';

const wait = (timeToDelay: any) => new Promise((resolve) => setTimeout(resolve, timeToDelay))
const RFIDInfoViwer = (props: { onBluetoothConnect: any, onBluetoothDisconnet: any }) => {
  const onBluetoothConnect = () => {
    props.onBluetoothConnect();
  };

  const onBluetoothDisconnet = () => {
    props.onBluetoothDisconnet();
  };

  return (
    <View>
      <View>
        <Text style={styles.labelStyle}>RFID 연결</Text>
      </View>
      <View style={styles.viewContainer}>
        <View style={styles.rfidDeviceContainer}>
          {stores.RFIDStore.isConnect ?
            (<BluettothSvgGreen style={styles.bluetoothSvg} height={45} width={45} />) :
            (<BluetoothSvgRed style={styles.bluetoothSvg} height={45} width={45} />
            )}
          <Text
            style={{
              marginLeft: 50,
              marginTop: 10,
              fontFamily: 'NanumSquareEB',
            }}>
            Connect to RFID Reader
          </Text>
          <View style={styles.btncontainer}>
            <Button
              disabled={stores.RFIDStore.isConnect ? true : false}
              buttonStyle={
                stores.RFIDStore.isConnect
                  ? styles.btnfalseStyle
                  : styles.btnStyle
              }
              titleStyle={styles.btntitleStyle}
              type="solid"
              title="Connect"
              onPress={onBluetoothConnect}
            />
            <Button
              disabled={stores.RFIDStore.isConnect ? false : true}
              buttonStyle={
                stores.RFIDStore.isConnect
                  ? styles.btnStyle
                  : styles.btnfalseStyle
              }
              titleStyle={styles.btntitleStyle}
              type="solid"
              title="Disconnect"
              onPress={onBluetoothDisconnet}
            />
          </View>
        </View>
      </View>
    </View>
  );
};

const RFIDConnectInfoViewer = () => {
  return (
    <View>
      <View>
        <Text style={styles.labelStyle}>RFID 연결 정보</Text>
      </View>
      <View style={styles.viewContainer}>
        <View style={styles.rfidConnectInfo}>
          <DeviceNameSvg
            fill={'#000'}
            style={styles.deviceNameSvg}
            height={25}
            width={25}
          />
          <View style={styles.rectangleLayoutcontainer}>
            <Text style={styles.lbLefttitle}> Name</Text>
            <Text style={styles.lbRighttitle}>
              {stores.RFIDStore.getDeviceInfo['devName']}
            </Text>
          </View>
        </View>
        <View style={styles.rfidConnectInfo}>
          <DeviceAddressSvg
            fill={'#000'}
            style={styles.deviceConnectInfoSvgs}
            height={25}
            width={25}
          />
          <View style={styles.rectangleLayoutcontainer}>
            <Text style={styles.lbLefttitle}> Mac Address</Text>
            <Text style={styles.lbRighttitle}>
              {stores.RFIDStore.getDeviceInfo['devMacAdrr']}
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
};

const RFIDSettingViewer = () => { // (props: { onSetVibrator: any; onSetReadMode: any }) => {
  //popup visible control
  const [buzzerVisible, setBuzzerVisible] = useState<boolean>(false);
  const [radioVisible, setRadioVisible] = useState<boolean>(false);

  const [toggleVibrator, setToggleVibrator] = useState<boolean>(false);
  const [toggleReadMode, setToggleReadMode] = useState<boolean>(false);

  // props.onSetVibrator((result: any) => {
  //   console.log("onSetVibrator", result);

  //   setToggleVibrator(result);
  // })

  // props.onSetReadMode((result: any) => {
  //   console.log("onSetReadMode", result);
  //   setToggleReadMode(result);
  // })

  React.useEffect(() => {
    let isMount = true;
    const GetDeviceOptions = async () => {
      try {
        if (stores.RFIDStore.isConnect) {
          if (isMount) {
            stores.StepStore.SetNoticeVisible(true);
            await stores.RFIDStore.RequestDeviceConfig().then().catch();
            setToggleVibrator(Boolean(stores.RFIDStore.getDeviceInfo.devVibState));
            stores.RFIDStore.getDeviceInfo.devContinue == 1 ? setToggleReadMode(!Boolean(stores.RFIDStore.getDeviceInfo.devContinue)) : setToggleReadMode(Boolean(stores.RFIDStore.getDeviceInfo.devContinue));
            stores.StepStore.SetNoticeVisible(false);
            console.log("OptionViewer");
          }
        }
      } catch (error) {
        console.log("error", error);
        stores.RFIDStore.SendToastMessage("디바이스 정보 불러오기 실패 다시시도해주세요.")
        stores.StepStore.SetNoticeVisible(false);
      }
    }
    GetDeviceOptions();


    return () => {
      isMount = false;
    };
  }, []);

  const onBuzzer = () => {
    setBuzzerVisible(true);
  };

  const onRadio = () => {
    setRadioVisible(true);
  };

  //BeepVolume
  const getBuzzerVisible = (visible: boolean) => {
    setBuzzerVisible(visible);
  };

  const getRadioVisible = (visible: boolean) => {
    setRadioVisible(visible);
  };

  const setVibrator = () => {
    if (!stores.RFIDStore.isConnect)
      return;
    DeviceConfig.devVibState = Number(!toggleVibrator);
    stores.RFIDStore.setVibrator(DeviceConfig.devVibState);
    stores.RFIDStore.SendSetVibrator(DeviceConfig.devVibState);
    setToggleVibrator(!toggleVibrator);
  };

  const getVibrator = (isOnOff: boolean) => {
    DeviceConfig.devVibState = Number(isOnOff);
    stores.RFIDStore.setVibrator(DeviceConfig.devVibState);
    stores.RFIDStore.SendSetVibrator(DeviceConfig.devVibState);
    setToggleVibrator(isOnOff);
  };

  const setReadMode = () => {
    if (!stores.RFIDStore.isConnect)
      return;
    DeviceConfig.devContinue = Number(toggleReadMode); // 0 이면 Continuous Read Mode , 1 이면 한번만 읽기
    console.log("반응 ", DeviceConfig.devContinue);

    stores.RFIDStore.setReadMode(DeviceConfig.devContinue);
    stores.RFIDStore.SendSetReadMode(DeviceConfig.devContinue);
    setToggleReadMode(!toggleReadMode);
  };

  const getReadMode = (isOnOff: boolean) => {
    DeviceConfig.devContinue = Number(!isOnOff);
    stores.RFIDStore.setReadMode(DeviceConfig.devContinue);
    stores.RFIDStore.SendSetReadMode(DeviceConfig.devContinue);
    setToggleReadMode(isOnOff);
  };

  return (
    <View>
      <ObservedProgressBar visible={stores.StepStore.getNoticeVisible} />
      <View>
        <Text style={styles.labelStyle}>RFID 설정</Text>
      </View>
      <View style={styles.viewContainer}>
        <TouchableOpacity activeOpacity={0.5} onPress={() => onBuzzer()}
          disabled={stores.RFIDStore.isConnect ? false : true}  >
          <View style={styles.rfidSettingcontainer}>
            <DeviceBeepVolumeSvg
              fill={stores.RFIDStore.isConnect ? '#000' : '#8A8A8A'}
              style={styles.deviceSettingSvgs}
              height={25}
              width={25}
            />
            <View style={styles.rectangleLayoutcontainer}>
              <Text style={styles.lbLefttitle}>Beep Volumne</Text>
              <BuzzerDialog
                modalVisible={buzzerVisible}
                SendDailogState={getBuzzerVisible}
                setData={Number(stores.RFIDStore.getDeviceInfo['devBuzzer'])}
              />
              <Text style={styles.lbRighttitle}>
                {Number(stores.RFIDStore.getDeviceInfo['devBuzzer']) === 0
                  ? 'Mute'
                  : Number(stores.RFIDStore.getDeviceInfo['devBuzzer']) === 1
                    ? 'Low'
                    : Number(stores.RFIDStore.getDeviceInfo['devBuzzer']) === 2
                      ? 'High'
                      : 'NONE'}
              </Text>
            </View>
          </View>
        </TouchableOpacity>
        <TouchableOpacity activeOpacity={0.8} onPress={() => setVibrator()}
          disabled={stores.RFIDStore.isConnect ? false : true}  >
          <View style={styles.rfidSettingcontainer}>
            <DeviceVibratorSvg
              fill={stores.RFIDStore.isConnect ? '#000' : '#8A8A8A'}
              style={styles.deviceSettingSvgs}
              height={25}
              width={25}
            />
            <View style={styles.rectangleLayoutcontainer}>
              <Text style={styles.lbLefttitle}>Vibrator</Text>
              <View style={{ top: 5 }}>
                <ToggleButton isConnect={stores.RFIDStore.isConnect} setToggle={toggleVibrator} getToggle={getVibrator} />
              </View>
            </View>
          </View>
        </TouchableOpacity>
        <TouchableOpacity activeOpacity={0.8} onPress={() => setReadMode()}
          disabled={stores.RFIDStore.isConnect ? false : true}  >
          <View style={styles.rfidSettingcontainer}>
            <ContinuousReadSvg
              fill={stores.RFIDStore.isConnect ? '#000' : '#8A8A8A'}
              style={styles.deviceSettingSvgs}
              height={25}
              width={25}
            />
            <View style={styles.rectangleLayoutcontainer}>
              <Text style={styles.lbLefttitle}>Continuous Read Mode</Text>
              <View style={{ top: 5 }}>
                <ToggleButton isConnect={stores.RFIDStore.isConnect} setToggle={toggleReadMode} getToggle={getReadMode} />
              </View>
            </View>
          </View>
        </TouchableOpacity>
        <TouchableOpacity activeOpacity={0.5} onPress={() => onRadio()}
          disabled={stores.RFIDStore.isConnect ? false : true}  >
          <View style={styles.rfidSettingcontainer}>
            <DeviceRadioPowerSvg
              fill={stores.RFIDStore.isConnect ? '#000' : '#8A8A8A'}
              style={styles.deviceSettingSvgs}
              height={25}
              width={25}
            />
            <View style={styles.rectangleLayoutcontainer}>
              <Text style={styles.lbLefttitle}>Radio Power</Text>
              <RadioDialog
                modalVisible={radioVisible}
                SendDailogState={getRadioVisible}
                setData={Number(stores.RFIDStore.getDeviceInfo['devRadio'])}
              />
              <Text style={styles.lbRighttitle}>
                {Number(stores.RFIDStore.getDeviceInfo['devRadio']) + 30} dBm
              </Text>
            </View>
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const ObservedRFIDInfo = observer(RFIDInfoViwer);
const ObservedRFIDConnectInfo = observer(RFIDConnectInfoViewer);
const ObservedRFIDSetting = observer(RFIDSettingViewer);
const ObservedProgressBar = observer(ProgressBar);
const OptionViewer = ({ navigation }: { navigation: any }) => {

  const onBluetoothConnect = () => {
    console.log("블루투스연결");
    navigation.navigate('DrawerBluetooth');
  }

  const onBluetoothDisconnet = async () => {
    console.log("블루투스해제");
    try {
      await stores.StepStore.SetNoticeVisible(true);
      console.log("0.ProgressBar", stores.StepStore.getNoticeVisible);
      await stores.RFIDStore.onDeviceDisConnect();
      await wait(1000)

      console.log('1.디바이스 연결해제');
      await stores.RFIDStore.SendDisRFIDHandler();
      await wait(1000)

      console.log('2.RFID 핸들러 연결해제');
      await stores.RFIDStore.SendDisBarcodeHandler();
      await wait(1000)

      console.log('3.Barcode 핸들러 연결해제');
      await stores.RFIDStore.VerifyConnect();
      await wait(1000)

      console.log('4.연결해제');
      await stores.StepStore.SetNoticeVisible(false);
      await wait(1000)

    } catch (error) {
      console.log("onBluetoothDisconnet error : ", error);
      await stores.StepStore.SetNoticeVisible(false);
    }
  }

  return (
    <SafeAreaView style={styles.container}>

      <ScrollView style={{ flex: 1 }}>
        <View style={{ flex: 1, backgroundColor: '#F7F8FA' }}>
          <ObservedRFIDInfo onBluetoothConnect={onBluetoothConnect} onBluetoothDisconnet={onBluetoothDisconnet} />
          <ObservedRFIDConnectInfo />
          <ObservedRFIDSetting />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  labelStyle: {
    left: 25,
    marginTop: 15,
    fontSize: 15,
    textAlign: 'left',
    width: 150,
    color: '#808080',
    fontFamily: 'NanumSquareB',
    fontWeight: 'bold',
  },
  viewContainer: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: '#F7F8FA',
    justifyContent: 'center',
    alignItems: 'center',
  },
  rfidDeviceContainer: {
    width: wp('88%'),
    height: hp('11%'),
    borderRadius: 10,
    borderTopEndRadius: 10,
    borderTopStartRadius: 10,
    borderBottomStartRadius: 10,
    borderBottomEndRadius: 10,
    borderColor: '#D7D8DA',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,

    flexDirection: 'column',
    alignItems: 'center',
  },
  bluetoothSvg: {
    position: 'absolute',
    top: 11,
    left: 20,
  },
  rfidConnectInfo: {
    width: wp('88%'),
    height: hp('9%'),

    borderRadius: 10,
    borderTopEndRadius: 10,
    borderTopStartRadius: 10,
    borderBottomStartRadius: 10,
    borderBottomEndRadius: 10,
    borderColor: '#D7D8DA',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    marginTop: 5,

    flexDirection: 'column',
    alignItems: 'center',
  },
  btncontainer: {
    flexDirection: 'row',
    marginTop: 3,
    marginLeft: 50,
    justifyContent: 'space-between',
    width: wp('48%'),
  },
  btnStyle: {
    borderRadius: 5,
    borderTopEndRadius: 5,
    borderTopStartRadius: 5,
    borderBottomStartRadius: 5,
    borderBottomEndRadius: 5,
    backgroundColor: '#428BCA',
    width: wp('22%'),
    height: 29,
  },
  btnfalseStyle: {
    borderRadius: 5,
    borderTopEndRadius: 5,
    borderTopStartRadius: 5,
    borderBottomStartRadius: 5,
    borderBottomEndRadius: 5,
    backgroundColor: '#8A8A8A',
    width: wp('22%'),
    height: 29,
  },
  btnApplyStype: {
    borderRadius: 5,
    borderTopEndRadius: 5,
    borderTopStartRadius: 5,
    borderBottomStartRadius: 5,
    borderBottomEndRadius: 5,
    backgroundColor: '#428BCA',
    width: wp('15%'),
    height: 31,
    top: 7.5,
    left: 5,
  },
  btntitleStyle: {
    fontSize: 12,
    textAlign: 'center',
    justifyContent: 'center',
    fontFamily: 'NanumSquareB',
  },
  rfidSettingcontainer: {
    width: wp('88%'),
    height: hp('9%'),
    borderRadius: 10,
    borderTopEndRadius: 10,
    borderTopStartRadius: 10,
    borderBottomStartRadius: 10,
    borderBottomEndRadius: 10,
    borderColor: '#D7D8DA',
    backgroundColor: '#EEEEEE',
    borderWidth: 1,
    marginTop: 5,
    flexDirection: 'column',
    alignItems: 'center',
  },
  rectangleLayoutcontainer: {
    paddingLeft: 35,
    width: wp('80%'),
    height: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  lbLefttitle: {
    textAlign: 'left',
    left: 10,
    top: 21,
    fontFamily: 'NanumSquareEB',
    fontSize: 15,
    color: '#000'
  },
  lbRighttitle: {
    textAlign: 'right',
    top: 21,
    fontFamily: 'NanumSquareR',
  },
  deviceNameSvg: {
    position: 'absolute',
    top: 16,
    left: 12,
  },
  deviceConnectInfoSvgs: {
    position: 'absolute',
    top: 16,
    left: 12,
    backgroundColor: 'white',
  },
  deviceSettingSvgs: {
    position: 'absolute',
    top: 16,
    left: 12,

    //backgroundColor: '#EEEEEE',
    // backgroundColor: 'red',


  },
  radioStyle: {
    width: wp('50%'),
    //backgroundColor:'#000'
  },
});

export default OptionViewer;
