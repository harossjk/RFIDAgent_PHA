import React, {useState, useEffect} from 'react';

import Modal from 'react-native-modal';
import {View, StyleSheet, Alert, BackHandler} from 'react-native';
import RadioButtonGroup from '../RadioButton/RadioButtonGroup';
import {Button} from 'react-native-elements';
import stores from '../../stores';

import {DeviceConfig} from '../DeviceObject';
import AppSlider from '../../components/AppSlider';

const RadioDialog = ({
  modalVisible,
  SendDailogState,
  setData,
}: {
  modalVisible: boolean;
  SendDailogState: any;
  setData: any;
}): React.ReactElement => {
  const onPressOk = (isVisible: boolean) => {
    stores.RFIDStore.setRadioPower(DeviceConfig.devRadio);
    stores.RFIDStore.SendSetRadioPower(DeviceConfig.devRadio);
    SendDailogState(isVisible);
  };

  const onPressCancel = (isVisible: boolean) => {
    SendDailogState(isVisible);
  };

  const requestRadioData = (value: any) => {
    DeviceConfig.devRadio = value;
  };

  return (
    <Modal
      isVisible={modalVisible}
      useNativeDriver={true}
      hideModalContentWhileAnimating={true}
      onBackButtonPress={() => {
        SendDailogState(false);
      }}
      onBackdropPress={() => {
        SendDailogState(false);
      }}
      style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
      <View
        style={{
          flexDirection: 'column',
          width: 320,
          height: 250,
          backgroundColor: '#F9F9F9',
          borderRadius: 10,
          borderTopEndRadius: 10,
          borderTopStartRadius: 10,
          borderBottomStartRadius: 10,
          borderBottomEndRadius: 10,
          borderColor: '#707070',
          borderWidth: 2,
        }}>
        <View
          style={{
            flex: 3,
            backgroundColor: 'transparent',
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <AppSlider setData={setData} sendRadioData={requestRadioData} />
        </View>
        <View
          style={{
            flex: 1,
            flexDirection: 'row',
            justifyContent: 'space-between',
            marginHorizontal: 20,
            bottom: 20,
          }}>
          <Button
            buttonStyle={styles.btnStyle}
            titleStyle={{
              fontSize: 24,
              fontFamily: 'NanumSquareB',
            }}
            type="solid"
            title="확인"
            onPress={() => {
              onPressOk(false);
            }}
          />
          <Button
            buttonStyle={styles.btnStyle}
            titleStyle={{
              fontSize: 24,
              fontFamily: 'NanumSquareB',
            }}
            type="solid"
            title="취소"
            onPress={() => {
              onPressCancel(false);
            }}
          />
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  btnStyle: {
    borderRadius: 100,
    borderTopEndRadius: 100,
    borderTopStartRadius: 100,
    borderBottomStartRadius: 100,
    borderBottomEndRadius: 100,
    backgroundColor: '#428BCA', //
    width: 100,
    height: 50,
  },
});
export default RadioDialog;
