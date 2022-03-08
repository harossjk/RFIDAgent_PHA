import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  BackHandler,
  StyleSheet,
  Dimensions,
  ScrollView,
  TouchableOpacity,
  Button,
  Alert,
} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import stores from '../../stores';
import { observer } from 'mobx-react';
import { Avatar, Title, Caption, Colors } from 'react-native-paper';
import { useIsFocused } from '@react-navigation/native';
import { Icon } from 'react-native-elements';
import { TAG_HAD_NUMBER } from '../../components/DeviceObject';
import ProgressBar from '../../components/Progress/ProgressBar';

const MoldItemOne = ({ navigation }: any) => {

  // const onMoldIn = () => {
  //   let bOK = 0;
  //   const rfidTag = stores.RFIDStore.getSelectedData[0]['value'];
  //   if (rfidTag !== null || rfidTag !== undefined) {
  //     const tagCode: string = TAG_HAD_NUMBER + rfidTag;
  //     const strInfo: string = 'TAG : ' + tagCode + '\n확인을 누르면 입고 처리 화면으로 이동합니다.\n\n이동 하시겠습니까?';
  //     Alert.alert('입고처리', strInfo, [
  //       {
  //         text: '취소',
  //         onPress: () => null,
  //         style: 'cancel',
  //       },
  //       {
  //         text: '확인',
  //         onPress: async () => {

  //           bOK = await stores.MoldStore.inAbleMolds(rfidTag);

  //           if (bOK === 0) {
  //             const strInfo: string = 'TAG : ' + tagCode + '\n입고실패!\n\n대상금형이 이미 입고 되었습니다.\n출고를 진행하여 주십시오.\n\n<확인을 누르면 홈화면으로 이동>';
  //             Alert.alert('선택 TAG', strInfo, [
  //               { text: '취소', onPress: () => null, style: 'cancel', },
  //               {
  //                 text: '확인', onPress: async () => {
  //                   navigation.navigate('DrawerHome', {});
  //                 },
  //               },
  //             ]);
  //           } else if (bOK === 1) {
  //             console.log('3. DB연결됨');
  //             await stores.RFIDStore.SendSetScanMode(1);
  //             await stores.StepStore.SetSelectTagId(rfidTag);
  //             await stores.StepStore.SetMoldPageInfo('Mold_Article');
  //             await navigation.navigate('StackBarcodeDetail');
  //           } else if (bOK === -1) {
  //             stores.RFIDStore.SendToastMessage('-Network Error\n DB연결정보를 확인하여주십시오.');
  //           }
  //         },
  //       },
  //     ]);
  //   }

  // };
  // const onMoldOut = () => {
  //   let bOK = 0;
  //   const rfidTag = stores.RFIDStore.getSelectedData[0]['value'];
  //   if (rfidTag !== null || rfidTag !== undefined) {
  //     const tagCode: string = TAG_HAD_NUMBER + rfidTag;
  //     const strInfo: string =
  //       'TAG : ' + rfidTag + '\n확인을 누르면 출고 처리 화면으로 이동합니다.\n\n이동 하시겠습니까?';

  //     Alert.alert('출고처리', strInfo, [
  //       { text: '취소', onPress: () => null, style: 'cancel', },
  //       {
  //         text: '확인',
  //         onPress: async () => {
  //           bOK = await stores.MoldStore.outAbleMolds(rfidTag);

  //           if (bOK === 0) {
  //             const strInfo: string = 'TAG : ' + rfidTag + '\n출고실패!\n\n대상금형이 이미 출고 되었습니다.\n입고를 진행하여 주십시오.\n\n<확인을 누르면 홈화면으로 이동>';
  //             Alert.alert('선택 TAG', strInfo, [
  //               { text: '취소', onPress: () => null, style: 'cancel', },
  //               { text: '확인', onPress: async () => { navigation.navigate('DrawerHome', {}); } },
  //             ]);
  //           } else if (bOK === 1) {
  //             console.log('3. DB연결됨');
  //             await stores.RFIDStore.SendSetScanMode(1);
  //             await stores.StepStore.SetSelectTagId(rfidTag);
  //             await stores.StepStore.SetMoldPageInfo('Mold_Release');
  //             await navigation.navigate('StackBarcodeDetail');
  //           } else if (bOK === -1) {
  //             stores.RFIDStore.SendToastMessage('-Network Error\n DB연결정보를 확인하여주십시오.',);
  //           }
  //         },
  //       },
  //     ]);
  //   };

  // };
  return (
    <ScrollView style={{ flex: 1 }}>
      <View style={styles.molditemContainer}>
        <View style={styles.moldItemRact}>
          <Text style={styles.lbLeftTitle}>금 형 코 드</Text>
          <Text style={styles.lbValue}>
            {stores.MoldStore.getMoldMasterData[0].rfid !== undefined ||
              stores.MoldStore.getMoldMasterData[0].rfid !== null
              ? stores.MoldStore.getMoldMasterData[0].rfid
              : 'NONE'}
          </Text>
        </View>
        <View style={styles.moldItemRact}>
          <Text style={styles.lbLeftTitle}>
            금{'    '}형{'   '}명
          </Text>
          <Text style={[styles.lbValue, { left: 45 }]}>
            {stores.MoldStore.getMoldMasterData[0] !== undefined ||
              stores.MoldStore.getMoldMasterData[0] !== null
              ? stores.MoldStore.getMoldMasterData[0].moldName
              : 'NONE'}
          </Text>
        </View>

        <View style={[styles.moldItemRact]}>
          <Text style={styles.lbLeftTitle}>프로젝트명</Text>
          <Text style={[styles.lbValue, { left: 45 }]}>
            {Object.keys(stores.MoldStore.getMoldMasterData[0].carMaps).map(
              (key, idx) => {
                return (
                  <Text key={key} style={[styles.lbValue, { left: 45 }]}>
                    {stores.MoldStore.getMoldMasterData[0].carMaps[key].projectName}
                  </Text>
                );
              },
            )}
          </Text>

          {/* <Text style={[styles.lbValue, { left: 45 }]}>
            {stores.MoldStore.getMoldMasterData[0].carMaps !== undefined ||
              stores.MoldStore.getMoldMasterData[0].carMaps !== null
              ? stores.MoldStore.getMoldMasterData[0].carMaps
              : 'NONE'}
          </Text> */}
        </View>
        <View style={[styles.moldItemRact]}>
          <Text style={styles.lbLeftTitle}>보 관 위 치</Text>
          <Text style={[styles.lbValue, { left: 48, color: 'red' }]}>
            {stores.MoldStore.getMoldMasterData[0] !== undefined ||
              stores.MoldStore.getMoldMasterData[0] !== null
              ? stores.MoldStore.getMoldMasterData[0].rack
              : 'NONE'}
          </Text>
        </View>
        <View style={[styles.moldItemRact]}>
          <Text style={styles.lbLeftTitle}>
            {'  '}CAVITY{'  '}
          </Text>
          <Text style={[styles.lbValue, { left: 46, color: '#000' }]}>
            {stores.MoldStore.getMoldMasterData[0].cavity !== undefined ||
              stores.MoldStore.getMoldMasterData[0].cavity !== null
              ? stores.MoldStore.getMoldMasterData[0].cavity
              : 'NONE'}
          </Text>
        </View>
        <View style={[styles.moldItemRact]}>
          <Text style={styles.lbLeftTitle}>S A P 코드</Text>
          <Text style={[styles.lbValue, { left: 45, color: '#000' }]}>
            {stores.MoldStore.getMoldMasterData[0].sapCode !== undefined ||
              stores.MoldStore.getMoldMasterData[0].sapCode !== null
              ? stores.MoldStore.getMoldMasterData[0].sapCode
              : 'NONE'}
          </Text>
        </View>
        <View style={[styles.moldItemRact]}>
          <Text style={styles.lbLeftTitle}>
            제{'   '}작{'   '}처
          </Text>
          <Text style={[styles.lbValue, { left: 49, color: '#000' }]}>
            {stores.MoldStore.getMoldMasterData[0] !== undefined ||
              stores.MoldStore.getMoldMasterData[0] !== null
              ? stores.MoldStore.getMoldMasterData[0].moldProductionSite
              : 'NONE'}
          </Text>
        </View>
        <View style={[styles.moldItemRact]}>
          <Text style={styles.lbLeftTitle}>수 명 타 수</Text>
          <Text style={[styles.lbValue, { left: 45, color: '#000' }]}>
            {stores.MoldStore.getMoldMasterData[0] !== undefined ||
              stores.MoldStore.getMoldMasterData[0] !== null
              ? stores.MoldStore.getMoldMasterData[0].lifeCnt
              : 'NONE'}
          </Text>
        </View>
        <View style={[styles.moldItemRact]}>
          <Text style={styles.lbLeftTitle}>
            총{'   '}타{'   '}수
          </Text>
          <Text style={[styles.lbValue, { left: 45, color: '#000' }]}>
            {stores.MoldStore.getMoldMasterData[0] !== undefined ||
              stores.MoldStore.getMoldMasterData[0] !== null
              ? stores.MoldStore.getMoldMasterData[0].totalCnt
              : 'NONE'}
          </Text>
        </View>
        {/* <View
          style={{ width: wp('90%'), height: 70, flexDirection: 'row', justifyContent: 'space-between', }}>
          <TouchableOpacity
            style={{ top: 10 }}
            activeOpacity={0.5}
            onPress={() => { }}>
            <View style={[styles.btnmoldin, { backgroundColor: '#5CB85C' }]}>
              <Icon name="inbox" size={50} color="#fff" />
              <Text style={{ fontSize: 21, color: '#fff', fontFamily: 'NanumSquareEB' }}>
                입 고 처 리
              </Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            style={{ top: 10 }}
            activeOpacity={0.5}
            onPress={() => { }}>
            <View style={styles.btnmoldin}>
              <Icon name="outbox" size={50} color="#fff" />
              <Text style={{ fontSize: 21, color: '#fff', fontFamily: 'NanumSquareEB' }}>
                출 고 처 리
              </Text>
            </View>
          </TouchableOpacity>
        </View> */}
      </View>
    </ScrollView>
  );
};

const ObserverMoldItemOne = observer(MoldItemOne);
const Mold_Info = (props: { navigation: any; pageinfo: string; }) => {


  const isFocused = useIsFocused();

  React.useEffect(() => {
    if (isFocused) {
      const backAction = () => {
        console.log(' Mold_Info 백버튼 반응');
        stores.StepStore.SetMoldPageInfo('MoldSearch')
        stores.RFIDStore.setTagDataClear();
        props.navigation.reset({ routes: [{ name: 'DrawerMold' }] });
        return true;
      };

      const backHandler = BackHandler.addEventListener(
        'hardwareBackPress',
        backAction,
      );
      return () => {
        backHandler.remove();
      };
    }

    console.log(stores.MoldStore.getMoldMasterData);

  }, [isFocused]);



  return (
    <>
      <View style={styles.container}>

        <Text style={{ textAlign: 'center', fontFamily: 'NanumSquareEB', color: '#808080', fontSize: 20, }}>
          금형정보
        </Text>
        <ObserverMoldItemOne navigation={props.navigation} />
      </View>
    </>
  );
};

export const { width, height } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9F9F9', //
    paddingTop: 10,
    //paddingBottom: 10,
  },
  molditemContainer: {
    //paddingTop: 10,
    paddingVertical: 10,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    width,
    backgroundColor: '#F9F9F9',
  },
  moldItemRact: {
    width: wp('90%'),
    height: 50,
    marginBottom: 5,
    borderRadius: 10,
    borderTopEndRadius: 10,
    borderTopStartRadius: 10,
    borderBottomStartRadius: 10,
    borderBottomEndRadius: 10,
    borderColor: '#E2E3E5',
    backgroundColor: '#EEEEEE',
    borderWidth: 2,
    flexDirection: 'row',
    alignItems: 'center',
  },
  text: {
    fontSize: width * 0.5,
    textAlign: 'center',
  },
  paginationStyleItemActive: {
    width: 20,
    height: 20,
    justifyContent: 'center',
  },
  paginationStyleItemInactive: {
    top: 3,
    width: 15,
    height: 15,
    justifyContent: 'center',
  },
  lbLeftTitle: {
    left: 15,
    textAlign: 'left',
    fontFamily: 'NanumSquareB',
    fontSize: 17,
  },
  lbValue: {
    left: 50,
    textAlign: 'center',
    fontFamily: 'NanumSquareB',
    fontSize: 15,
    color: '#1082DA',
  },
  btnmoldin: {
    paddingHorizontal: 5,
    width: wp('44%'),
    height: 70,
    backgroundColor: '#D9534F',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    borderRadius: 10,
    borderTopEndRadius: 10,
    borderTopStartRadius: 10,
    borderBottomStartRadius: 10,
    borderBottomEndRadius: 10,
    borderColor: '#E2E3E5',
    bottom: 8,
  },
});
export default Mold_Info;
