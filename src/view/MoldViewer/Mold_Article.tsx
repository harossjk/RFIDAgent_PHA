import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  BackHandler,
  StyleSheet,
  Dimensions,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import stores from '../../stores';
import { observer } from 'mobx-react';
import ComboBox from '../../components/ComboBox/ComboBox';
import { useIsFocused } from '@react-navigation/native';
import { getMap, mapEntity } from '../../components/Utils/Utils';
import { Icon } from 'react-native-elements';
import moment from 'moment';
import ProgressBar from '../../components/Progress/ProgressBar';
import { TAG_HAD_NUMBER } from '../../components/DeviceObject';
import { SafeAreaView } from 'react-native-safe-area-context';

const MoldItemOne = ({ navigation }: any) => {
  const [currDate, setCurrDate] = useState<any>();
  const [loading, setloading] = useState(false);
  React.useEffect(() => {
    let todate = moment().format('yyyy-MM-DD / HH:mm');
    setCurrDate(todate);
  }, []);

  const onMoldIn = () => {
    console.log('======================================================');
    console.log('입고처리전 데이터 확인', stores.MoldStore.getMoldInTempData);

    const strInfo: string =
      'TAG : ' +
      stores.RFIDStore.getSelectedData[stores.StepStore.getSelectedTagId].value +
      '\n입고처리 진행 하시겠습니까?';
    Alert.alert('입고처리', strInfo, [
      {
        text: '취소',
        onPress: () => null,
        style: 'cancel',
      },
      {
        text: '확인',
        onPress: async () => {
          setloading(true);
          setTimeout(async () => {

            //CODE에서 SUBCODE를 먼저 가져옴.
            //사용자에 따라서 SUBCODE 이름이 변경이 될수있기때문에 CODE에서 사출이라는 단어가 포함된 SUBCODE를 가져옴
            //사출이라는 단어는 고정으로 사용되었을때 가정하여 진행
            let getState = (await getMap('code', 'MOLD_IN').then()).data.filter(x => x.label.includes('사출'));
            let subCode = undefined;
            if (getState.length > 0) {
              //SUBCODE를 저장
              subCode = getState[0].value;

              const rfid: any = await stores.MoldStore.getMoldMasterData.rfid
              const corpCode: any = await stores.MoldStore.getMoldMasterData.corpCode
              const factoryCode: any = await stores.MoldStore.getMoldMasterData.factoryCode
              if (stores.MoldStore.getMoldMasterData.gubun === subCode) {
                console.log("1.여기 진행됨?");
                await stores.MoldStore.moldIsClearUpdate(rfid, corpCode, factoryCode, 'false')
              }
            }

            //외주로 빠져있을때는 세척을 처리 안함?
            await stores.MoldStore.addMoldIn(
              stores.MoldStore.getMoldInTempData,
            );

            navigation.navigate('DrawerHome');
            setloading(false);
          }, 1000);
        },
      },
    ]);
  };

  return (
    <SafeAreaView style={{ top: 10, flex: 1 }}>
      <ScrollView>
        <ProgressBar visible={loading} />
        <View style={styles.molditemContainer}>
          <View style={[styles.moldItemRact, { backgroundColor: '#fff' }]}>
            <Text style={styles.lbLeftTitle}>금형코드</Text>
            <View
              style={[
                styles.comboboxContainer,
                {
                  flexDirection: 'row',
                  justifyContent: 'flex-start',
                  alignItems: 'center',
                },
              ]}>
              <Text style={[styles.lbValue, { fontSize: 21 }]}>
                {stores.MoldStore.getMoldinAbleData !== undefined ||
                  stores.MoldStore.getMoldinAbleData !== null
                  ? TAG_HAD_NUMBER +
                  stores.RFIDStore.getSelectedData[0]['value']
                  : 'NONE'}
              </Text>
            </View>
          </View>
          <View style={[styles.moldItemRact, { backgroundColor: '#fff' }]}>
            <Text style={styles.lbLeftTitle}>
              금{'  '}형{'  '}명
            </Text>
            <View style={[styles.comboboxContainer, {}]}>
              <Text style={styles.lbValue}>
                {stores.MoldStore.getMoldinAbleData !== undefined ||
                  stores.MoldStore.getMoldinAbleData !== null
                  ? stores.MoldStore.getMoldMasterData.moldName
                  : 'NONE'}
              </Text>
            </View>
          </View>

          <View style={[styles.moldItemRact, { backgroundColor: '#fff' }]}>
            <Text style={styles.lbLeftTitle}>입고회사</Text>
            <View style={styles.comboboxContainer}>
              <ComboBox
                comboTitle={'inCorpCode'}
                family={'NanumSquareR'}
                size={21}
                color={'black'}
                mapFunc={getMap('code', 'CORP')}
              />
            </View>
          </View>
          <View style={[styles.moldItemRact, { backgroundColor: '#fff' }]}>
            <Text style={styles.lbLeftTitle}>입고공장</Text>
            <View style={styles.comboboxContainer}>
              <ComboBox
                comboTitle={'inFactoryCode'}
                family={'NanumSquareB'}
                size={21}
                color={'black'}
                mapFunc={getMap('code', 'FACTORY')}
              />
            </View>
          </View>
          <View style={[styles.moldItemRact, { backgroundColor: '#fff' }]}>
            <Text style={styles.lbLeftTitle}>입고구분</Text>
            <View style={styles.comboboxContainer}>
              <ComboBox
                comboTitle={'inGubun'}
                family={'NanumSquareB'}
                size={21}
                color={'black'}
                mapFunc={getMap('code', 'MOLD_IN')}
              />
            </View>
          </View>

          <View style={[styles.moldItemRact, { backgroundColor: '#fff' }]}>
            <Text style={styles.lbLeftTitle}>입고위치</Text>
            <View style={styles.comboboxContainer}>
              <ComboBox
                comboTitle={'inPosition'}
                key={'inPosition'}
                family={'NanumSquareB'}
                size={25}
                color={'#D9534F'}
                mapFunc={getMap('code', 'MOLD_POSITION')}
              />
            </View>
          </View>
          <View style={[styles.moldItemRact, { backgroundColor: '#fff' }]}>
            <Text style={styles.lbLeftTitle}>
              입{'  '}고{'  '}자
            </Text>
            <View style={styles.comboboxContainer}>
              <ComboBox
                comboTitle={'inUser'}
                key={'inUser'}
                family={'NanumSquareL'}
                size={25}
                color={'black'}
                mapFunc={getMap('user')}
              />
            </View>
          </View>
          <View style={[styles.moldItemRact, { backgroundColor: '#fff' }]}>
            <Text style={styles.lbLeftTitle}>입고일자</Text>
            <View style={styles.comboboxContainer}>
              <Text style={[styles.lbValue, { color: '#5CB85C' }]}>
                {currDate}
              </Text>
            </View>
          </View>
          <TouchableOpacity
            style={{ top: 10 }}
            activeOpacity={0.5}
            onPress={() => {
              onMoldIn();
            }}>
            <View style={styles.btnmoldin}>
              <Icon style={{ left: 5 }} name="inbox" size={46} color="#fff" />
              <Text
                style={{
                  left: 50,
                  fontSize: 35,
                  color: '#fff',
                  fontFamily: 'NanumSquareEB',
                }}>
                입 고 처 리
              </Text>
            </View>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const ObserverMoldItemOne = observer(MoldItemOne);

const Mold_Article = ({ navigation }: { navigation: any }) => {
  async function initData() {
    let ableData: any = await stores.MoldStore.getMoldinAbleData;
    console.log(ableData);

    let today = moment().format('yyyyMMDD');

    await stores.MoldStore.SetMoldInData('corpCode', ableData[0]['corpCode']);
    await stores.MoldStore.SetMoldInData(
      'factoryCode',
      ableData[0]['factoryCode'],
    );
    await stores.MoldStore.SetMoldInData('rfid', ableData[0]['rfid']);
    await stores.MoldStore.SetMoldInData('state', ableData[0]['state']);
    await stores.MoldStore.SetMoldInData('dt', ableData[0]['dt']);
    await stores.MoldStore.SetMoldInData('inDt', today);
    await stores.MoldStore.SetMoldInData('seq', ableData[0]['seq']);
    await stores.MoldStore.SetMoldInData(
      'createUserId',
      ableData[0]['createUserId'],
    );
    await stores.MoldStore.SetMoldInData(
      'updateUserId',
      ableData[0]['updateUserId'],
    );
    console.log('moldin 완료', stores.MoldStore.getMoldInTempData);
  }

  const isFocused = useIsFocused();
  React.useEffect(() => {
    initData();
    //DB Mold Data 찾기
    if (isFocused) {
      const backAction = () => {
        console.log(' Mold_Info 백버튼 반응');
        navigation.goBack(); //navigate('StackBarcodeDetail');
        stores.StepStore.SetStepState(1);
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
  }, [isFocused]);

  return (
    <>
      <View style={styles.container}>
        <Text
          style={{
            textAlign: 'center',
            fontFamily: 'NanumSquareEB',
            color: '#808080',
            fontSize: 25,
          }}>
          금형이동
        </Text>
        {/* <ObserverMoldItemOne navigation={navigation} /> */}
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
    paddingBottom: 10,
  },
  molditemContainer: {
    paddingBottom: 5,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    width,
    backgroundColor: '#F9F9F9',
  },
  moldItemRact: {
    width: wp('95%'),
    height: hp('12%'),
    marginBottom: 5,
    borderRadius: 10,
    borderTopEndRadius: 10,
    borderTopStartRadius: 10,
    borderBottomStartRadius: 10,
    borderBottomEndRadius: 10,
    borderColor: '#97BBE5',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 6,
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
    left: 5,
    textAlign: 'left',
    fontFamily: 'NanumSquareB',
    fontSize: 21,
  },
  lbValue: {
    paddingLeft: 15,
    textAlign: 'left',
    fontFamily: 'NanumSquareB',
    fontSize: 21,
    color: '#1082DA',
  },
  comboboxContainer: {
    left: 5,
    width: 240,
  },
  btnmoldin: {
    paddingHorizontal: 10,
    width: wp('95%'),
    height: hp('12%'),
    backgroundColor: '#5CB85C',
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

export default Mold_Article;
