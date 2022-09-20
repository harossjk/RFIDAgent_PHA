import React, { useRef } from 'react';
import { View, Text, Image } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { Input, Button } from 'react-native-elements';
import loginStyles from './Login.module';
import stores from '../../stores';
//props: { navigation: any; setVisible: any }
//const LoginViewer = ({info,onBtnInput,onChangeText,}: {info: any;onBtnInput: any;onChangeText: any;}) => {
const LoginViewer = (props: { info: any; onBtnInput: any; onChangeText: any; }) => {
  const ref_input2: any = useRef();

  return (
    <KeyboardAwareScrollView
      resetScrollToCoords={{ x: 0, y: 0 }}
      contentContainerStyle={loginStyles.keyboardContainer}
      scrollEnabled={false}>
      <View style={loginStyles.imgContainer}>
        <Image
          style={loginStyles.imgStyle}
          source={require('../../assets/img/phc.png')}
        />
      </View>
      <View style={loginStyles.titleContainer}>
        <Text style={loginStyles.titleStyle}>
          RFID<Text style={loginStyles.subtitleStyle}> Agent</Text>
        </Text>
      </View>
      <View style={loginStyles.inputContainer}>
        <Text style={loginStyles.inputLabelStyle}> 사용자 / ID </Text>
        <Input
          inputStyle={loginStyles.inputStyle}
          inputContainerStyle={{
            borderBottomColor: '#428BCA',
            borderBottomWidth: 2,
          }}
          onChangeText={(IdValue: any) => {
            props.onChangeText('id', IdValue);
          }}
          placeholderTextColor={'#C6C6C7'}
          value={props.info.Id}
          returnKeyType="next"
          autoFocus={false}
          onSubmitEditing={() => ref_input2.current.focus()}
        />
        <Text style={loginStyles.inputLabelStyle}> 비밀번호 </Text>
        <Input
          inputStyle={loginStyles.inputStyle}
          inputContainerStyle={{
            borderBottomColor: '#428BCA',
            borderBottomWidth: 2,
          }}
          value={props.info.Pw}
          onChangeText={(pwValue: any) => {
            props.onChangeText('pw', pwValue);
          }}
          placeholderTextColor={'#C6C6C7'}
          ref={ref_input2}
          secureTextEntry={true}
        />
      </View>
      <View style={loginStyles.buttonContainer}>
        <Button
          buttonStyle={loginStyles.buttonStyle}
          titleStyle={loginStyles.btntitleStyle}
          type="solid"
          title="로그인"
          onPress={props.onBtnInput}
        />
      </View>
      <View style={loginStyles.commpanyContainer}>
        <Text style={loginStyles.companyTitle}>
          COPYRIGHT UDMTEK ALL RIGHTS RESERVED
        </Text>
      </View>
    </KeyboardAwareScrollView>
  );
};

export default LoginViewer;
