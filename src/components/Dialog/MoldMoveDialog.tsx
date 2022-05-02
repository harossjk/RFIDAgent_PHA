import React, { useState, useEffect } from 'react';

import Modal from 'react-native-modal';
import { View, StyleSheet, Alert, BackHandler, Text } from 'react-native';
import RadioButtonGroup from '../RadioButton/RadioButtonGroup';
import { Button } from 'react-native-elements';
import stores from '../../stores';

import { DeviceConfig } from '../DeviceObject';
import AppSlider from '../../components/AppSlider';
import { inject, observer } from 'mobx-react'


const MoldMoveDialog = (props: { modalVisible: boolean, SendDailogState: any }): React.ReactElement => {
    const onPressOk = (isVisible: boolean) => {
        props.SendDailogState(isVisible);
    };

    const onPressCancel = (isVisible: boolean) => {
        props.SendDailogState(isVisible);
    };

    return (
        <Modal
            isVisible={props.modalVisible}
            useNativeDriver={true}
            hideModalContentWhileAnimating={true}
            onBackButtonPress={() => {
                props.SendDailogState(false);
            }}
            onBackdropPress={() => {
                props.SendDailogState(false);
            }}
            style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
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
                    <Text style={{ textAlign: 'left', fontFamily: 'NanumSquareEB', color: '#808080', fontSize: 20, }}>
                        TAG : {stores.MoldStore.getRackinfo.id}
                        {'\n'}
                        위치 : {stores.MoldStore.getRackinfo.pos}
                        {'\n'}
                    </Text>
                    <Text style={{ textAlign: 'left', fontFamily: 'NanumSquareEB', color: '#5CB85C', fontSize: 15, }}>
                        금형이동 정상완료 되었습니다.
                    </Text>
                    {/* <Text style={{ textAlign: 'left', fontFamily: 'NanumSquareEB', color: '#5CB85C', fontSize: 14, }}>
                        5(초) 후 [홈] 화면으로 이동합니다.
                    </Text> */}
                </View>
                <View
                    style={{
                        flex: 1,
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        marginHorizontal: 30,
                        bottom: 10,
                    }}>
                    <Button
                        buttonStyle={[styles.btnStyle, { backgroundColor: 'transparent' }]}
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
                        title="확인"
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
export default inject('modalVisible', 'SendDailogState')(observer(MoldMoveDialog));
