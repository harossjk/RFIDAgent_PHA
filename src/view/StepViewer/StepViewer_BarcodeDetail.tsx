import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  FlatList,
  BackHandler,
  Alert,
  Button,
} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import { Icon } from 'react-native-elements';
import { CodeEntity } from '../../stores/MoldInStore'
import { observer } from 'mobx-react';
import { useIsFocused } from '@react-navigation/native';
import stores from '../../stores';
import { TAG_HAD_NUMBER } from '../../components/DeviceObject';
import BarcodeSvg from '../../assets/img/connect_barcode.svg';
import ProgressBar from '../../components/Progress/ProgressBar';
import { getMap } from '../../components/Utils/Utils';
import moment from 'moment';
import { baseURL } from '../../components/Sever/Sever';
import axios from 'axios';
import { useCallbackHandler } from '../../stores/useCallbackHandler';
import { MoldInEntry } from '../../stores/MoldInStore';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { playStore, Custom_Mode, MODE } from '../../stores/PlayStoreData';
import { MoldMoveDialog } from '../../components/Dialog';

const wait = (timeToDelay: any) => new Promise((resolve) => setTimeout(resolve, timeToDelay))

const GetBarcodeData = (props: { navigation: any; setVisible: any }) => {

  const moldMove = useCallback(async (readBarcode: string) => {
    try {
      props.setVisible(true);
      console.log("readState", readBarcode,);
      console.log("barcodeList length", stores.MoldStore.getBarcodeData.length);
      console.log("리더기로 읽은 바코드 데이터 ", stores.RFIDStore.getReadBarcodeData);
      console.log("Custom_Mode!!!", Custom_Mode);

      await stores.RFIDStore.RequestModeVerify();
      console.log("SCAN MODE", stores.RFIDStore.getMode);
      if (stores.RFIDStore.getMode !== 1) {
        //바코드 스케너 모드가 아닐때
        await stores.RFIDStore.SendSetScanMode(1);
        return;
      }
      else {
        let isMoldInChk: any = -1; // 1 이면 True , 0 false
        //기존 Rack 이동방식
        //바코드 리스트가 0 이상 일 때 
        if (stores.MoldStore.getBarcodeData.length > 0) {
          //바코드 찾기
          const serachBarcode: any[] = JSON.parse(JSON.stringify(stores.MoldStore.getBarcodeData.filter((x: any) => x.barcode === readBarcode)));
          if (serachBarcode.length > 0) {
            stores.RFIDStore.setBarcodeReadStatuse(true);
            //금형이동처리
            //금형 이동이 가능한지 확인
            await stores.MoldStore.inAbleMolds(stores.RFIDStore.getSelectedData[0].value as any);

            //입고 가능한 목록에서 찾는 RFID가 없으면 0
            if (Object.keys(stores.MoldStore.getMoldinAbleData).length === 0) {
              console.log('이동 불가능 상태');
              stores.RFIDStore.SendToastMessage("TAG: " + stores.RFIDStore.getSelectedData[0].value as any + "\n해당 TAG는 이동불가입니다.");
            }
            else {
              console.log('이동 가능 상태 ', stores.MoldStore.getMoldinAbleData);
              const isInAbleData: any = stores.MoldStore.getMoldinAbleData;
              await stores.MoldStore.rackPosition(isInAbleData[0].factoryCode, isInAbleData[0].rfid);
              const rackpos = stores.MoldStore.getRackPostion;

              if (Custom_Mode === MODE.FM_MODE) {
                //신규 사용자 요구사항 이동방식
                // TO DO..
              }
              else if (Custom_Mode === MODE.AM_MODE) {
                //OLD 이동 방식
                console.log("===========================================================================");
                const rackAltPos: CodeEntity = await stores.MoldStore.SearchAltCode('PH', 'MOLD_LOCATION', 'MOLD')
                console.log("금형반  : ", rackAltPos.subCode);

                const currPos = await stores.MoldStore.getRackPostion;
                console.log("현재 위치 : ", currPos.gubunCode);

                const movePos = serachBarcode[0];
                console.log("이동 위치 : ", movePos.locationGubun);
                console.log("===========================================================================");

                let tempMoldInData: any = {
                  dt: isInAbleData[0].dt,
                  seq: isInAbleData[0].seq,
                  corpCode: isInAbleData[0].corpCode,
                  state: isInAbleData[0].state,
                  inDt: new Date(),
                  factoryCode: isInAbleData[0].factoryCode,
                  gubun: isInAbleData[0].gubun,
                  inCorpCode: isInAbleData[0].corpCode,
                  inFactoryCode: isInAbleData[0].factoryCode,
                  inGubun: serachBarcode[0].locationGubun,
                  inPositionDetail: serachBarcode[0].rackCode,
                  inPosition: serachBarcode[0].locationId,
                  inTime: new Date(),
                  moldName: isInAbleData[0].moldName,
                  position: serachBarcode[0].rackCode,
                  positionName: rackpos.positionDetailName,
                  returnValue: null,
                  rfid: isInAbleData[0].rfid,
                  totalCount: isInAbleData[0].totalCount,
                }
                isMoldInChk = await stores.MoldStore.addMoldIn(tempMoldInData);
              }
            }

            if (isMoldInChk === "OK") {
              //현재 RFID 위치 검색
              if (stores.MoldStore.getRackPostion !== null && stores.MoldStore.getRackPostion !== undefined) {
                const rackpos = await stores.MoldStore.getRackPostion;
                console.log("rackpos", rackpos);
                //모달표시 시작
                const StepOne = async () => {
                  await stores.RFIDStore.setBarcodeReadStatuse(false);
                  await stores.MoldStore.SetMoldModalVisible(true);
                  console.log("하나");
                }

                //선택된 데이터와 바코드 위치정보를 표시 후 페이지 넘김
                const StepTwo = async () => {
                  stores.MoldStore.SetRackinfo(stores.RFIDStore.getSelectedData[0].value, "( " + rackpos.gubunName + " : " + rackpos.positionName + ' ) ' + rackpos.positionDetailName);
                  stores.RFIDStore.RemoveTagS(stores.RFIDStore.getSelectedData[0].value);
                  stores.RFIDStore.setTagDataClear();

                  console.log("RFID 확인 : ", stores.RFIDStore.getSelectedData[0].value);
                  await stores.RFIDStore.SendSetScanMode(0);
                  await stores.MoldStore.SetMoldModalVisible(false);
                  await props.navigation.navigate('DrawerHome');
                  console.log("둘");
                }

                await StepOne();
                await wait(3000);
                await StepTwo();
              }
              else {
                stores.RFIDStore.SendToastMessage("등록된 Rack정보를 찾을 수 없습니다.\r\n다시한번 확인 하여 주십시오.");
              }
            }
            else {
              await stores.RFIDStore.SendToastMessage(isMoldInChk.toString());
              const funError = async () => {
                await stores.RFIDStore.setBarcodeReadStatuse(false);
                stores.RFIDStore.setBarcodeDataClear();
                stores.RFIDStore.RemoveTagS(stores.RFIDStore.getSelectedData[0].value);
                //stores.RFIDStore.setTagDataClear();
                //await stores.RFIDStore.SendSetScanMode(0);
                await stores.MoldStore.SetMoldModalVisible(false);
              }
              await funError();
            }
          }
        }
        else {
          stores.RFIDStore.SendToastMessage("BARCODE 데이터가 없습니다.\r\n금형관리시스템(Web)에서 BARCODE를 등록하여 주십시오.");
        }
      }

      await props.setVisible(false);

      // if (Custom_Mode === MODE.FM_MODE) {

      // }
      // else {
      //   //바코드 리스트가 0 이상일떄 
      //   if (stores.MoldStore.getBarcodeData.length > 0) {

      //     const serachBarcode: any[] = JSON.parse(JSON.stringify(stores.MoldStore.getBarcodeData.filter((x: any) => x.barcode === readBarcode)));

      //     //바코드 리스트에서 찾음
      //     if (serachBarcode.length > 0) {
      //       stores.RFIDStore.setBarcodeReadStatuse(true);
      //       console.log("serachBarcode", serachBarcode);
      //       //금형이동처리
      //       //금형 이동이 가능한지 확인
      //       await stores.MoldStore.inAbleMolds(stores.RFIDStore.getSelectedData[0].value as any);
      //       // console.log("!!!!getMoldinAbleData!!!!", stores.MoldStore.getMoldinAbleData);

      //       //입고 가능한 목록에서 찾는 RFID가 없으면 0
      //       if (Object.keys(stores.MoldStore.getMoldinAbleData).length === 0) {
      //         console.log('이동 가능한거 실패');
      //         stores.RFIDStore.SendToastMessage("TAG: " + stores.RFIDStore.getSelectedData[0].value as any + "\n해당 TAG는 이동불가입니다.");
      //       } else {
      //         console.log('이동 가능한 상태 ', stores.MoldStore.getMoldinAbleData);
      //         const isInAbleData: any = stores.MoldStore.getMoldinAbleData;

      //         await stores.MoldStore.rackPosition(isInAbleData[0].factoryCode, isInAbleData[0].rfid);
      //         const rackpos = stores.MoldStore.getRackPostion;

      //         let tempMoldInData: any = {
      //           dt: isInAbleData[0].dt,
      //           seq: isInAbleData[0].seq,
      //           corpCode: isInAbleData[0].corpCode,
      //           state: isInAbleData[0].state,
      //           inDt: new Date(),
      //           factoryCode: isInAbleData[0].factoryCode,
      //           gubun: isInAbleData[0].gubun,
      //           inCorpCode: isInAbleData[0].corpCode,
      //           inFactoryCode: isInAbleData[0].factoryCode,
      //           inGubun: serachBarcode[0].locationGubun,
      //           inPositionDetail: serachBarcode[0].rackCode,
      //           inPosition: serachBarcode[0].locationId,
      //           inTime: new Date(),
      //           moldName: isInAbleData[0].moldName,
      //           position: serachBarcode[0].rackCode,
      //           positionName: rackpos.positionDetailName,
      //           returnValue: null,
      //           rfid: isInAbleData[0].rfid,
      //           totalCount: isInAbleData[0].totalCount,
      //         }
      //         stores.MoldStore.addMoldIn(tempMoldInData);
      //       }

      //       const rackpos = stores.MoldStore.getRackPostion;

      //       if (stores.RFIDStore.getScanData.length > 1) {
      //         console.log("진입?",);
      //         setTimeout(async () => {
      //           console.log("동작?1",);
      //           stores.RFIDStore.setBarcodeReadStatuse(false);
      //           stores.RFIDStore.RemoveTagS(stores.RFIDStore.getSelectedData[0].value);
      //           stores.RFIDStore.SendSetScanMode(0);
      //           stores.RFIDStore.setTagDataClear();
      //           props.setVisible(false);
      //           await stores.MoldStore.SetMoldModalVisible(true);
      //           stores.MoldStore.SetRackinfo(stores.RFIDStore.getSelectedData[0].value, "( " + rackpos.gubunName + " : " + rackpos.positionName + ' ) ' + rackpos.positionDetailName);
      //           await stores.MoldStore.SetMoldModalVisible(false);
      //           props.navigation.navigate('DrawerHome');
      //         }, 500);

      //       }
      //       else {
      //         setTimeout(() => {
      //           console.log("동작?2",);
      //           stores.RFIDStore.setBarcodeReadStatuse(false);
      //           stores.RFIDStore.SendSetScanMode(0);
      //           props.setVisible(false);
      //           stores.MoldStore.SetMoldModalVisible(true);
      //           stores.MoldStore.SetRackinfo(stores.RFIDStore.getSelectedData[0].value, "( " + serachBarcode[0].locationName + ' ) ' + serachBarcode[0].barcode);
      //           setTimeout(() => {
      //             stores.MoldStore.SetMoldModalVisible(false);
      //             props.navigation.navigate('DrawerHome');
      //           }, 1000);

      //         }, 500);
      //       }
      //     }
      //     else if (serachBarcode.length === 0 && readBarcode !== "READ_FAIL") {
      //       stores.RFIDStore.SendToastMessage("등록되지 않은 바코드입니다.\n등록된 바코드로 다시 읽어주십시오.");
      //       setTimeout(() => {

      //         stores.RFIDStore.setBarcodeDataClear();
      //       }, 1000);
      //       stores.RFIDStore.setBarcodeReadStatuse(false);
      //       props.setVisible(false);
      //     }
      //   }
      //   else {
      //     stores.RFIDStore.SendToastMessage("바코드 리스트를 불러올수 없습니다.");
      //     props.setVisible(false);
      //   }
      // }

    } catch (err) {
      console.log(err);
      props.setVisible(false);

    }
  }, []);

  useEffect(() => {
    if (stores.RFIDStore.getReadBarcodeData.result !== "READ_FAIL") {
      moldMove(stores.RFIDStore.getReadBarcodeData.result);
    }
  }, [stores.RFIDStore.getReadBarcodeData]);

  const SendDailogState = (isVisible: boolean) => {
    stores.MoldStore.SetMoldModalVisible(isVisible);
  }

  return (
    <>
      <View style={{ flexDirection: 'column', justifyContent: 'center', alignItems: 'center', width: wp('100%'), height: hp('58%'), }}>
        <BarcodeSvg height={180} width={180} color={stores.RFIDStore.getBarcodeReadStatuse === true ? '#5CB85C' : '#D9534F'} />
        <Text style={[styles.title, { fontSize: 35, top: 10 }]}>
          바{'  '}코{'  '}드
        </Text>
        <Text
          style={{ top: 10, fontFamily: 'NanumSquareB', fontSize: 30, color: stores.RFIDStore.getReadBarcodeData.result === 'READ_FAIL' ? '#D9534F' : '#5CB85C' }}>
          {stores.RFIDStore.getReadBarcodeData.result}
        </Text>
        <Text
          style={{ paddingTop: 30, fontFamily: 'NanumSquareR', fontSize: 18, color: 'red', textAlign: 'center', }}>
          RFID 리더기 왼쪽 (S) LED 빨간색이{'\n'} 켜져 있는지 확인 하여 주십시오. {'\n\n'} 비활성화: RFID {'   '}활성화: Barcode
        </Text>
        <MoldMoveDialog modalVisible={stores.MoldStore.getModalStatuse} SendDailogState={SendDailogState} />
      </View>
    </>
  );
};

const ObserverBarcodeData = observer(GetBarcodeData);

const PlayStoreMode = () => {
  return (<View style={{ flexDirection: 'column', justifyContent: 'center', alignItems: 'center', width: wp('100%'), height: hp('58%'), }}>
    <BarcodeSvg height={180} width={180} color={'#5CB85C'} />
    <Text style={[styles.title, { fontSize: 35, top: 10 }]}>
      바{'  '}코{'  '}드
    </Text>
    <Text
      style={{ top: 10, fontFamily: 'NanumSquareB', fontSize: 30, color: '#5CB85C' }}>
      A-1-3
    </Text>
    <Text
      style={{ paddingTop: 30, fontFamily: 'NanumSquareR', fontSize: 18, color: 'red', textAlign: 'center', }}>
      RFID 리더기 왼쪽 (S) LED 빨간색이{'\n'} 켜져 있는지 확인 하여 주십시오. {'\n\n'} 비활성화: RFID {'   '}활성화: Barcode
    </Text>
  </View>);
}

const StepViewer_BarcodeDetail = (props: { navigation: any; onPressHandler: any; }) => {
  const [loading, setloading] = useState(false);
  const isFocused = useIsFocused();
  React.useEffect(() => {

    if (isFocused) {
      if (playStore) {
        stores.RFIDStore.setBarcodeReadStatuse(true);
        setloading(true);
        setTimeout(() => {
          setloading(false);
          props.navigation.navigate('DrawerHome');
        }, 3000);
      }
      else {
        const initData = async () => {
          setloading(false);
          stores.RFIDStore.setBarcodeReadStatuse(false);
          await stores.MoldStore.rackList();
          await stores.RFIDStore.SendDisRFIDHandler();
          await stores.RFIDStore.SendDisBarcodeHandler();
          await stores.StepStore.SetStepState(2);
          await stores.RFIDStore.SendSetBarcodeHandler();
          stores.RFIDStore.setScanData(stores.StepStore.getSelectedTagId, false);
        };

        initData();

        const backAction = () => {
          console.log('BarCodeDitail 백버튼 반응');
          props.navigation.navigate('StackTag');
          return true;
        };

        const backHandler = BackHandler.addEventListener(
          'hardwareBackPress',
          backAction,
        );
        return () => backHandler.remove();
      }
    }
  }, [isFocused]);




  const setVisible = (visible: boolean) => {
    console.log("setVisible", visible);
    setloading(visible);
  };



  return (
    <SafeAreaView style={styles.container}>

      <ProgressBar visible={loading} />
      {
        playStore ?
          (<PlayStoreMode />) :
          (<ObserverBarcodeData navigation={props.navigation} setVisible={setVisible} />)
      }
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#F9F9F9',
  },
  mainContainer: {
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'center',
    flex: 1,
  },
  tagContainer: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',

    width: wp('88%'),
    height: hp('73%'),
    borderRadius: 10,
    borderTopEndRadius: 10,
    borderTopStartRadius: 10,
    borderBottomStartRadius: 10,
    borderBottomEndRadius: 10,
    borderColor: '#97BBE5',
    backgroundColor: '#EEEEEE',
    borderWidth: 1,

    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  title: {
    bottom: 5,
    textAlign: 'center',
    fontFamily: 'NanumSquareB',
    fontSize: 25,
    color: '#5D5D5D',
  },
  type: {
    textAlign: 'center',
    fontFamily: 'NanumSquareB',
    fontSize: 20,
    color: '#5CB85C',
  },
  result: {
    fontFamily: 'NanumSquareB',
    fontSize: 30,
    color: '#5CB85C',
  },
  taglist: {
    flexDirection: 'column',
    alignContent: 'center',
    alignItems: 'center',
    justifyContent: 'center',
  },
  tagtitle: {
    right: 23,
    textAlign: 'center',
    fontFamily: 'NanumSquareB',
    fontSize: 40,
    color: '#428BCA',
  },
  btnmoldin: {
    paddingHorizontal: 10,
    width: wp('55%'),
    height: hp('10%'),
    backgroundColor: '#5CB85C',
    flexDirection: 'row',
    justifyContent: 'center',
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

export default StepViewer_BarcodeDetail;


