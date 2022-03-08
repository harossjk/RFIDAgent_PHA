import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Image,
} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import { Avatar, Title, Caption } from 'react-native-paper';
import stores from '../../stores';
import MoldMoveSvg from '../../assets/img/moldmove.svg';
import MoldInfoSvg from '../../assets/img/moldinfo.svg';
import { backgroundColor } from 'styled-system';

const HomeViewer = ({
  navigation,
  pageInfo,
  onPressPageMove,
}: {
  navigation: any;
  pageInfo: any;
  onPressPageMove: any;
}) => {
  async function VerifConnect() {
    try {
      if (stores.RFIDStore.isConnect) {
        let isHandler = await stores.RFIDStore.SendSetRFIDHandler();
        if (isHandler) {
          let deviceinfo = await stores.RFIDStore.RequestDeviceConfig();
          console.log(VerifConnect, deviceinfo);

          if (deviceinfo === null || deviceinfo === undefined) {
            let bOk = true;

            while (bOk) {
              deviceinfo = await stores.RFIDStore.RequestDeviceConfig();
              if (deviceinfo !== null || deviceinfo !== undefined) break;
            }
          }
        } else {
          console.log(HomeViewer, 'RFID Handler 연결안됨 다시요청');
        }
      }
    } catch (error) {
      console.log(VerifConnect, error);
    }
  }

  React.useEffect(() => {
    VerifConnect();
  }, []);

  const onMoldInfoPress = (pageInfo: string) => {
    onPressPageMove(pageInfo);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={{ width: '100%', backgroundColor: '#F9F9F9' }}>
        <View
          style={{
            paddingTop: 5,
            backgroundColor: '#428BCA',
            width: wp('100%'),
            height: 150,
            justifyContent: 'flex-start',
            alignItems: 'center',
          }}>
          <Avatar.Icon
            icon="face"
            size={55}
            color={'#fff'}
            style={{ backgroundColor: '#000' }}
          />
          <Title style={styles.headerTitle}>Administer</Title>
          <Caption style={styles.headerSubTitle}>금형관리반</Caption>
        </View>
        <View
          style={{
            width: wp('100%'),
            height: hp('60%'),
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            marginTop: -15,
            marginBottom: 30,
          }}>
          <TouchableOpacity
            style={styles.homeTochitemContainer}
            activeOpacity={0.9}
            onPress={() => onMoldInfoPress(pageInfo.Mold_Article)}>
            <View style={styles.homeItemContainer}>
              <View style={styles.rectangleLayoutcontainer}>
                <MoldMoveSvg height={100} width={100} fill={'#000'} />
                <Text style={styles.lbLefttitle}>금형 이동</Text>
              </View>
            </View>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.homeTochitemContainer}
            activeOpacity={0.9}
            onPress={() => onMoldInfoPress(pageInfo.MoldSearch)}>
            <View style={styles.homeItemContainer}>
              <View style={styles.rectangleLayoutcontainer}>
                <MoldInfoSvg height={80} width={80} fill={'#000'} />
                <Text style={styles.lbLefttitle}>금형 조회</Text>
              </View>
            </View>
          </TouchableOpacity>

          {/* <TouchableOpacity
            style={styles.homeTochitemContainer}
            activeOpacity={0.9}
            onPress={() => onMoldInfoPress(pageInfo.Mold_Release)}>
            <View style={styles.homeItemContainer}>
              <View style={styles.rectangleLayoutcontainer}>
                <Text style={styles.lbLefttitle}>금형 출고</Text>
              </View>
            </View>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.homeTochitemContainer}
            activeOpacity={0.9}
            onPress={() => onMoldInfoPress(pageInfo.Mold_Article_List)}>
            <View style={styles.homeItemContainer}>
              <View style={styles.rectangleLayoutcontainer}>
                <Text style={styles.lbLefttitle}>입고 이력</Text>
              </View>
            </View>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.homeTochitemContainer}
            activeOpacity={0.9}
            onPress={() => onMoldInfoPress(pageInfo.Mold_Release_List)}>
            <View style={styles.homeItemContainer}>
              <View style={styles.rectangleLayoutcontainer}>
                <Text style={styles.lbLefttitle}>출고 이력</Text>
              </View>
            </View>
          </TouchableOpacity> */}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F9F9F9',
  },
  headerTitle: {
    fontSize: 18,
    color: 'white',
    textAlign: 'right',
    fontFamily: 'NanumSquareR',
  },
  headerSubTitle: {
    top: -5,
    fontSize: 15,
    color: 'white',
    textAlign: 'right',
    fontFamily: 'NanumSquareL',
  },
  homeTochitemContainer: {
    borderRadius: 15,
    borderTopEndRadius: 15,
    borderTopStartRadius: 15,
    borderBottomStartRadius: 15,
    borderBottomEndRadius: 15,
    backgroundColor: 'black',
    marginTop: 20,
  },
  homeItemContainer: {
    width: wp('88%'),
    height: hp('30%'),
    borderRadius: 10,
    borderTopEndRadius: 10,
    borderTopStartRadius: 10,
    borderBottomStartRadius: 10,
    borderBottomEndRadius: 10,
    borderColor: '#97BBE5',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
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
    width: wp('80%'),
    height: '100%',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  lbLefttitle: {
    top: 10,
    textAlign: 'center',
    fontFamily: 'NanumSquareB',
    fontSize: 35,
  },
  lbRighttitle: {
    textAlign: 'right',
    top: 15,
    fontFamily: 'NanumSquareB',
  },
});

export default HomeViewer;
