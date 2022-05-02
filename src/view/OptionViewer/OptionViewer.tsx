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

function DisConnect() {
  return new Promise<void>((resolve, reject) => {
    stores.StepStore.SetNoticeVisible(true);
    stores.RFIDStore.onDeviceDisConnect();
    console.log('1.디바이스 연결해제');
    stores.RFIDStore.SendDisRFIDHandler();
    console.log('2.RFID 핸들러 연결해제');
    stores.RFIDStore.SendDisBarcodeHandler();
    console.log('3.Barcode 핸들러 연결해제');
    stores.RFIDStore.VerifyConnect();
    console.log('4.연결해제');
    setTimeout(() => {
      stores.StepStore.SetNoticeVisible(false);
      resolve();
    }, 5000);
  });
}

const RFIDInfoViwer = ({ navigation }: { navigation: any }) => {
  const onBluetoothConnect = () => {
    navigation.navigate('DrawerBluetooth');
  };

  const onBluetoothDisconnet = async () => {
    await DisConnect();
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

const RFIDSettingViewer = () => {



  //popup visible control
  const [buzzerVisible, setBuzzerVisible] = useState<boolean>(false);
  const [radioVisible, setRadioVisible] = useState<boolean>(false);

  const [toggleVibrator, setToggleVibrator] = useState<boolean>(false);
  const [toggleReadMode, setToggleReadMode] = useState<boolean>(false);


  //jjk, 21.12.22
  function RequestDeviceConfig() {
    return new Promise<void>((resolve, reject) => {
      stores.RFIDStore.RequestDeviceConfig().then();
      const isVibrator: boolean = Boolean(
        stores.RFIDStore.getDeviceInfo['devVibState'],
      );
      const isReadMode: boolean =
        stores.RFIDStore.getDeviceInfo['devContinue'] == 0;

      setTimeout(() => {
        console.log(isVibrator, isReadMode);

        setToggleVibrator(isVibrator);
        setToggleReadMode(isReadMode);
        stores.StepStore.SetNoticeVisible(false);
        resolve();
      }, 2000);
    });
  }
  const RequestDeviceLogic = async () => {
    const isConnect = stores.RFIDStore.isConnect;
    if (isConnect) {
      stores.StepStore.SetNoticeVisible(true);
      await RequestDeviceConfig();
    }
  };

  useEffect(() => {
    RequestDeviceLogic();
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
    DeviceConfig.devContinue = Number(toggleReadMode); // 0 이면 Continuous Read Mode , 1 이면 한번만 읽기
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

  const onApplay = () => {
    console.log('설정 초기화 ');
  };

  return (
    <View>
      <View>
        <ProgressBar visible={stores.StepStore.getNoticeVisible} />
        <Text style={styles.labelStyle}>RFID 설정</Text>
      </View>
      <View style={styles.viewContainer}>
        <TouchableOpacity activeOpacity={0.5} onPress={() => onBuzzer()}>
          <View style={styles.rfidSettingcontainer}>
            <DeviceBeepVolumeSvg
              fill={'#000'}
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
        <TouchableOpacity activeOpacity={0.8} onPress={() => setVibrator()}>
          <View style={styles.rfidSettingcontainer}>
            <DeviceVibratorSvg
              fill={'#000'}
              style={styles.deviceSettingSvgs}
              height={25}
              width={25}
            />
            <View style={styles.rectangleLayoutcontainer}>
              <Text style={styles.lbLefttitle}>Vibrator</Text>
              <View style={{ top: 5 }}>
                <ToggleButton setToggle={toggleVibrator} getToggle={getVibrator} />
              </View>
            </View>
          </View>
        </TouchableOpacity>
        <TouchableOpacity activeOpacity={0.8} onPress={() => setReadMode()}>
          <View style={styles.rfidSettingcontainer}>
            <ContinuousReadSvg
              fill={'#000'}
              style={styles.deviceSettingSvgs}
              height={25}
              width={25}
            />
            <View style={styles.rectangleLayoutcontainer}>
              <Text style={styles.lbLefttitle}>Continuous Read Mode</Text>
              <View style={{ top: 5 }}>
                <ToggleButton setToggle={toggleReadMode} getToggle={getReadMode} />
              </View>
            </View>
          </View>
        </TouchableOpacity>
        <TouchableOpacity activeOpacity={0.5} onPress={() => onRadio()}>
          <View style={styles.rfidSettingcontainer}>
            <DeviceRadioPowerSvg
              fill={'#000'}
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

const OptionViewer = ({ navigation }: { navigation: any }) => {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={{ flex: 1 }}>
        <View style={{ flex: 1, backgroundColor: '#F7F8FA' }}>
          <ObservedRFIDInfo navigation={navigation} />
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
    backgroundColor: '#428BCA', //#428BCA
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
    backgroundColor: '#EEEEEE',
  },
  radioStyle: {
    width: wp('50%'),
    //backgroundColor:'#000'
  },
});

export default OptionViewer;
