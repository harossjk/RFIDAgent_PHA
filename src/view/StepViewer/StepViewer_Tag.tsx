import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  FlatList,
  BackHandler,
} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import { Avatar, Title, Caption, Checkbox } from 'react-native-paper';
import { useIsFocused } from '@react-navigation/native';
import stores from '../../stores';
import { observer } from 'mobx-react';
import { Observer } from 'mobx-react-lite';
import BarcodeSvg from '../../assets/img/connect_barcode.svg';
import { TAG_HAD_NUMBER } from '../../components/DeviceObject';
import ProgressBar from '../../components/Progress/ProgressBar';
import { getMap } from '../../components/Utils/Utils';
import { tagType } from '../../stores/RFIDStore';
import { runInAction } from 'mobx';
import { moldSelectOne, playStore, tag } from '../../stores/PlayStoreData';



const TagHader = () => {
  return (
    <View style={styles.topHeaderContainer}>
      <Text style={styles.lbTopTitle}>
        선택 수 : {stores.RFIDStore.getTagChkCount}
      </Text>
      <Text style={styles.lbTopTitle}>
        스캔 수 : {stores.RFIDStore.getScanData.length}
      </Text>
    </View>
  );
};

const GetScanData = (props: { navigation: any; setVisible: any }) => {
  const flatList = React.useRef<any>();

  useEffect(() => {
    if (playStore) {
      stores.StepStore.SetNoticeVisible(false);


    }
    else {
      if (stores.RFIDStore.getScanData.length > 0) {
        stores.StepStore.SetNoticeVisible(false);
      }
    }

  }, [stores.RFIDStore.getScanData]);


  // const SearchMoldData = async () => {
  //   if (stores.RFIDStore.getScanData.length > 0) {
  //     await stores.StepStore.SetNoticeVisible(false);
  //   }
  // }

  // SearchMoldData();

  const onPrssCheck = (item: any) => {
    stores.RFIDStore.setScanData(item, !stores.RFIDStore.getScanData[item]['isChek']);
    if (stores.RFIDStore.getScanData[item]['isChek']) {
      onMoveToBarcode();
    }
  };

  const onEndReached = () => {
    if (stores.RFIDStore.getScanData.length !== 0)
      flatList.current.scrollToIndex({
        index: stores.RFIDStore.getScanData.length - 1,
      });
  };

  const onMoveToBarcode = async () => {
    if (playStore)
      props.navigation.navigate('StackBarcodeDetail');
    else {
      props.setVisible(true);
      if (stores.RFIDStore.getTagChkCount > 0) {
        await stores.RFIDStore.SetSelectDataClear();
        await stores.RFIDStore.SetSelectData();

        let bOK = 0;
        const rfidTag = await stores.RFIDStore.getSelectedData[0]['value'];
        if (rfidTag !== null || rfidTag !== undefined) {
          bOK = await stores.MoldStore.moldSelectOne(rfidTag);
        }
        if (bOK === 0) {
          stores.RFIDStore.SendToastMessage('등록된 RFID정보가 없습니다.\n웹페이지에서 RFID를 등록하여 주십시오.');
          stores.RFIDStore.setScanData(stores.StepStore.getSelectedTagId, false);
          props.setVisible(false);
          return;
        } else if (bOK === -1) {
          stores.RFIDStore.SendToastMessage('-Network Error\n DB연결정보를 확인하여주십시오.');
          stores.RFIDStore.setScanData(stores.StepStore.getSelectedTagId, false);
          props.setVisible(false);
          return;
        } else if (bOK === 1) {
          await stores.StepStore.SetStepState(1);
          await stores.RFIDStore.SendSetScanMode(1);
          await stores.RFIDStore.setBarcodeDataClear();
          await props.navigation.navigate('StackBarcodeDetail'); //StackBarcode
        }
        props.setVisible(false);
      }
    }

  };

  return (
    <>
      {
        playStore ? (
          <View style={{ padding: 8, top: 30, }}>
            <View style={styles.scrollContainer}>
              <TouchableOpacity
                style={styles.tochitemContainer}
                activeOpacity={0.9}
                onPress={() => { onMoveToBarcode() }}>
                <View style={styles.tagContainer}>
                  <View style={{ flex: 1, flexDirection: 'row' }}>
                    <View style={{ flex: 1, backgroundColor: '#D5E8FF', justifyContent: 'center', alignItems: 'center', borderTopLeftRadius: 10, borderBottomLeftRadius: 10, }}>
                      <Checkbox
                        color={'black'}
                        status={'checked'}
                        onPress={() => { }}
                      />
                    </View>
                    <View style={{ flex: 5 }}>
                      <View style={{ flex: 1, justifyContent: 'flex-end', alignItems: 'center' }}>
                        <Text style={{ color: 'black', fontFamily: 'NanumSquareB', fontSize: 30 }}>
                          {moldSelectOne.moldName}
                        </Text>
                      </View>
                      <View style={{ flex: 1, justifyContent: 'flex-start', alignItems: 'center' }}>
                        <Text style={styles.lbRighttitle}>
                          {tag.value}
                        </Text>
                      </View>
                    </View>
                  </View>
                </View>
              </TouchableOpacity>
            </View>
          </View>
        ) : stores.StepStore.getNoticeVisible ? (
          <View
            style={{ flex: 1, justifyContent: 'center', alignItems: 'center', }}>
            <Text style={{ paddingTop: 30, fontFamily: 'NanumSquareB', fontSize: 25, textAlign: 'center' }}>
              버튼을 누르면 RFID 스캔을 {'\n'}시작합니다.
            </Text>
            <Text
              style={{ paddingTop: 20, fontFamily: 'NanumSquareR', fontSize: 18, color: 'red', textAlign: 'center', }}>
              RFID 리더기 왼쪽 (S) LED 빨간색이{'\n'} 꺼져있는지 확인 하여 주십시오.{'\n\n'}
              비활성화: RFID {'   '}활성화: Barcode
            </Text>
          </View>
        ) : (
          <FlatList
            ref={flatList}
            data={stores.RFIDStore.getScanData}
            contentContainerStyle={{ flexDirection: 'column' }}
            renderItem={item => {
              return (
                <Observer>
                  {() => {
                    return (
                      <View style={{ padding: 8 }}>
                        <View style={styles.scrollContainer}>
                          <TouchableOpacity
                            style={styles.tochitemContainer}
                            activeOpacity={0.9}
                            onPress={() => { onPrssCheck(item.index) }}>
                            <View style={styles.tagContainer}>
                              <View style={{ flex: 1, flexDirection: 'row' }}>
                                <View style={{ flex: 1, backgroundColor: '#D5E8FF', justifyContent: 'center', alignItems: 'center', borderTopLeftRadius: 10, borderBottomLeftRadius: 10, }}>
                                  <Checkbox
                                    color={'black'}
                                    status={stores.RFIDStore.getScanData[item.index]['isChek'] ? 'checked' : 'unchecked'}
                                    onPress={() => { onPrssCheck(item.index); }}
                                  />
                                </View>
                                <View style={{ flex: 5 }}>
                                  <View style={{ flex: 1, justifyContent: 'flex-end', alignItems: 'center' }}>
                                    <Text style={stores.RFIDStore.getScanData[item.index].moldName === undefined ?
                                      { color: '#D9534F', fontFamily: 'NanumSquareB', fontSize: 30 } :
                                      { color: 'black', fontFamily: 'NanumSquareB', fontSize: 30 }}>
                                      {stores.RFIDStore.getScanData[item.index].moldName === undefined ?
                                        "금형 조회 불가" : stores.RFIDStore.getScanData[item.index].moldName
                                      }
                                    </Text>
                                  </View>
                                  <View style={{ flex: 1, justifyContent: 'flex-start', alignItems: 'center' }}>
                                    <Text style={styles.lbRighttitle}>
                                      {stores.RFIDStore.getScanData[item.index]['value']}
                                    </Text>
                                  </View>
                                </View>

                              </View>
                            </View>
                          </TouchableOpacity>
                        </View>
                      </View>
                    );
                  }}
                </Observer>
              );
            }}
            keyExtractor={item => String(item.id)}
            onEndReachedThreshold={0.8}
            onEndReached={onEndReached}
            onScrollToIndexFailed={() => { }}
          />
        )}
    </>
  );
};

// const BottomMenu = ({ navigation, setVisible, }: { navigation: any; setVisible: any; }) => {
//   const onItemClear = () => {
//     if (
//       stores.RFIDStore.getScanData.length === 0 ||
//       stores.RFIDStore.getScanData === undefined
//     )
//       return;

//     stores.RFIDStore.setTagDataClear();
//     stores.StepStore.SetNoticeVisible(true);
//   };

//   const onChkAll = () => {
//     if (
//       stores.RFIDStore.getScanData.length === 0 ||
//       stores.RFIDStore.getScanData === undefined
//     )
//       return;

//     let chkState = !stores.RFIDStore.getScanData[0]['isChek'];
//     stores.RFIDStore.setChkOrUnChkAll(chkState);
//   };

//   const onMoveToBarcode = async () => {
//     setVisible(true);
//     if (stores.RFIDStore.getTagChkCount > 0) {
//       await stores.RFIDStore.SetSelectDataClear();
//       await stores.RFIDStore.SetSelectData();

//       let bOK = 0;
//       const rfidTag = await stores.RFIDStore.getSelectedData[0]['value'];
//       if (rfidTag !== null || rfidTag !== undefined) {
//         const tagCode: string = TAG_HAD_NUMBER + rfidTag;
//         bOK = await stores.MoldStore.moldSelectOne(rfidTag);
//       }
//       if (bOK === 0) {
//         stores.RFIDStore.SendToastMessage(
//           '등록된 RFID정보가 없습니다.\n웹페이지에서 RFID를 등록하여 주십시오.',
//         );
//         setVisible(false);
//         return;
//       } else if (bOK === -1) {
//         stores.RFIDStore.SendToastMessage(
//           '-Network Error\n DB연결정보를 확인하여주십시오.',
//         );
//         setVisible(false);
//         return;
//       } else if (bOK === 1) {
//         if (stores.StepStore.getMoldPageInfo === 'Mold_Info') {
//           await stores.StepStore.SetStepState(2);
//           await navigation.navigate('DrawerMold');
//           console.log();
//         } else {
//           await stores.StepStore.SetStepState(2);
//           await stores.RFIDStore.SendSetScanMode(1);
//           await navigation.navigate('StackBarcodeDetail'); //StackBarcode
//         }
//         setVisible(false);
//       }
//     } else {
//       stores.RFIDStore.SendToastMessage(
//         '선택된 TAG가 없습니다.\nTAG를 선택하여 주십시오.',
//       );
//       setVisible(false);
//       return;
//     }
//   };

//   return (
//     <View
//       style={{
//         flex: 1,
//         backgroundColor: '#428BCA',
//         flexDirection: 'row',
//         justifyContent: 'space-between',
//         alignItems: 'center',
//         paddingHorizontal: 50,
//       }}>
//       {/* <TouchableOpacity activeOpacity={0.9} onPress={onChkAll}>
//         <View
//           style={{
//             flexDirection: 'column',
//             justifyContent: 'center',
//             alignItems: 'center',
//           }}>
//           <Avatar.Icon
//             icon="text-box-check"
//             size={65}
//             color={'#000'}
//             style={{backgroundColor: '#fff', marginHorizontal: 10}}
//           />
//           <Text style={{top: 5, fontFamily: 'NanumSquareB', color: '#fff'}}>
//             {stores.RFIDStore.getChkState ? '전체 해제' : '전체 선택'}
//           </Text>
//         </View>
//       </TouchableOpacity> */}

//       <TouchableOpacity activeOpacity={0.9} onPress={onItemClear}>
//         <View
//           style={{
//             flexDirection: 'column',
//             justifyContent: 'center',
//             alignItems: 'center',
//           }}>
//           <Avatar.Icon
//             icon="delete"
//             size={65}
//             color={'#000'}
//             style={{ backgroundColor: '#fff', marginHorizontal: 10 }}
//           />
//           <Text style={{ top: 5, fontFamily: 'NanumSquareB', color: '#fff' }}>
//             목록 지우기
//           </Text>
//         </View>
//       </TouchableOpacity>
//       <TouchableOpacity activeOpacity={0.9} onPress={onMoveToBarcode}>
//         <View
//           style={{
//             flexDirection: 'column',
//             justifyContent: 'center',
//             alignItems: 'center',
//           }}>
//           {stores.StepStore.getMoldPageInfo === 'Mold_Info' ? (
//             <>
//               <Avatar.Icon
//                 icon="cellphone-information"
//                 size={65}
//                 color={'#000'}
//                 style={{ backgroundColor: '#fff', marginHorizontal: 10 }}
//               />
//               <Text style={{ top: 5, fontFamily: 'NanumSquareB', color: '#fff' }}>
//                 금형정보 보기
//               </Text>
//             </>
//           ) : (
//             <>
//               <Avatar.Icon
//                 icon="barcode"
//                 size={65}
//                 color={'#000'}
//                 style={{ backgroundColor: '#fff', marginHorizontal: 10 }}
//               />
//               <Text style={{ top: 5, fontFamily: 'NanumSquareB', color: '#fff' }}>
//                 바코드스캔
//               </Text>
//             </>
//           )}
//         </View>
//       </TouchableOpacity>
//     </View>
//   );
// };

const OnserverTagHader = observer(TagHader);
const ObserverScanData = observer(GetScanData);
//const ObserverBottomMenu = observer(BottomMenu);

const StepViewer_Tag = ({ navigation }: { navigation: any }) => {

  const [loading, setloading] = useState(false);

  function init() {
    return new Promise<void>((resolve, reject) => {
      stores.RFIDStore.SendDisBarcodeHandler();
      stores.RFIDStore.SendDisRFIDHandler();
      stores.RFIDStore.SendSetRFIDHandler();
      stores.RFIDStore.RequestModeVerify();

      if (stores.RFIDStore.getScanData.length > 0) {
        stores.RFIDStore.setScanData(stores.StepStore.getSelectedTagId, false);
      }

      if (stores.RFIDStore.getReadBarcodeData.result !== "READ_FAIL")
        stores.RFIDStore.setBarcodeDataClear();

      if (stores.RFIDStore.getMode === 1) {
        stores.RFIDStore.SendSetScanMode(0);
      }
    });
  }

  // React.useEffect(() => {
  //   const initComponet = async () => {
  //     await init();
  //   }
  //   initComponet();
  // }, [])

  const isFocused = useIsFocused();
  React.useEffect(() => {
    if (isFocused) {

      const initComponet = async () => {
        await init();
      }
      initComponet();

      const backAction = () => {
        navigation.navigate('DrawerHome'); //StackRFID
        stores.StepStore.SetStepState(1);
        return true;
      };

      const backHandler = BackHandler.addEventListener(
        'hardwareBackPress',
        backAction,
      );
      return () => backHandler.remove();
    }
  }, [isFocused]);

  const setVisible = (visible: boolean) => {
    setloading(visible);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ProgressBar visible={loading} />
      <View style={{ flexDirection: 'column', height: hp('70%'), }}>
        <OnserverTagHader />
        <ObserverScanData navigation={navigation} setVisible={setVisible} />
      </View>
      {/* <ObserverBottomMenu navigation={navigation} setVisible={setVisible} /> */}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 3,
    backgroundColor: '#F9F9F9',
  },
  tochitemContainer: {
    width: wp('88%'),
    height: hp('20%'),
    borderRadius: 15,
    borderTopEndRadius: 15,
    borderTopStartRadius: 15,
    borderBottomStartRadius: 15,
    borderBottomEndRadius: 15,
    backgroundColor: 'black',
    marginTop: 10,
  },
  tagContainer: {
    width: wp('88%'),
    height: hp('20%'),
    borderRadius: 10,
    borderTopEndRadius: 10,
    borderTopStartRadius: 10,
    borderBottomStartRadius: 10,
    borderBottomEndRadius: 10,
    borderColor: '#97BBE5',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  rectangleLayoutcontainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 10,
  },
  topHeaderContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 30,
    backgroundColor: '#F9F9F9',
  },
  lbRighttitle: {
    textAlign: 'center',
    fontFamily: 'NanumSquareB',
    fontSize: 25,
    //right: -30,
  },
  scrollContainer: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  lbTopTitle: {
    textAlign: 'left',
    fontSize: 19,
    fontFamily: 'NanumSquareB',
  },
});

export default StepViewer_Tag;
