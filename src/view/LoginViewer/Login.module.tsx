import {StyleSheet} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

const loginStyles = StyleSheet.create({
  keyboardContainer: {
    paddingHorizontal: 10,
    backgroundColor: '#F9F9F9',
    width: wp('100%'), // 스크린 가로 크기
    height: hp('96%'), // 스크린 세로 크기
    //top: hp('30%'), // 스크린 세로 크기의 30% 만큼 0에서부터 이동
  },
  imgContainer: {
    height: hp('22%'), // 스크린 세로 크기
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
  imgStyle: {
    height: 46 * 1.8,
    width: 115 * 1.8,
  },
  titleContainer: {
    height: hp('15%'), // 스크린 세로 크기
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'flex-end',
  },
  titleStyle: {
    fontSize: 45,
    color: '#232E42',
    textAlign: 'right',
    fontFamily: 'NanumSquareB',
    fontWeight: 'bold',
  },
  subtitleStyle: {
    fontSize: 20,
    color: '#232E42',
    textAlign: 'right',
  },
  inputContainer: {
    justifyContent: 'center',
    alignItems: 'flex-start',
    height: hp('38%'),
    top: hp('5%'),
  },
  inputLabelStyle: {
    fontSize: 15,
    marginLeft: 10,
    color: '#C6C6C7',
  },
  inputStyle: {
    color: '#232E42',
    //height: hp('3%'), // 스크린 세로 크기
  },
  buttonContainer: {
    height: hp('13%'),
    justifyContent: 'center',
    alignItems: 'center',
    fontFamily: 'NanumSquareB',
  },
  buttonStyle: {
    borderRadius: 100,
    borderTopEndRadius: 100,
    borderTopStartRadius: 100,
    borderBottomStartRadius: 100,
    borderBottomEndRadius: 100,
    backgroundColor: '#428BCA',
    width: '75%',
  },
  btntitleStyle: {
    fontSize: 20,
    flex: 1,
    alignSelf: 'stretch',
    justifyContent: 'center',
    fontFamily: 'NanumSquareB',
  },
  commpanyContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  companyTitle: {
    fontSize: 13,
    color: '#CDCDCF',
    textAlign: 'center',
    marginBottom: 15,
    fontFamily: 'NanumSquareEB',
    fontWeight: 'bold',
  },
});

export default loginStyles;
