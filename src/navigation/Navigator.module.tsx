import {StyleSheet} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

const NivStyles = StyleSheet.create({
  headerStyle :{
     height: 55,
     backgroundColor: '#428BCA',
  },
  headerTitle: {
    
    fontSize: 30,
    color: 'white',
    textAlign: 'right',
    fontFamily: '',
    fontWeight: 'bold',
  },
  headerSubTitle: {
    fontSize: 20,
    color: 'white',
    textAlign: 'right',
  },
  menuDrawerStructure: {
    width: 40,
    height: 40,
    marginLeft: 10,
    backgroundColor: '#428BCA',
  },
  bluetoothImgContainer:{
    flexDirection:'row',
    width: wp('100%'), // 스크린 가로 크기
    justifyContent: 'flex-end',
    alignItems:'flex-end',
    backgroundColor:'yellow'
  },
  loginNivHeaderTitle:{
    fontFamily: 'NanumSquareL',
  },
  homeNivHeaderTitle:{
    textAlign: 'center',
    fontSize: 25,
    fontWeight: 'bold',
    fontFamily: 'NanumSquareB',
  },
  optionNivHeaderTitle:{
    textAlign: 'center',
    fontSize: 25,
    fontWeight: 'bold',
    fontFamily: 'NanumSquareB',
  },
});

export default NivStyles;