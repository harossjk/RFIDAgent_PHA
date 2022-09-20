import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, } from "react-native";


import LoginViewer from "../view/LoginViewer/LoginViewer";

import stores from '../stores';
import { ProgressBar } from '../components/Progress';
import { flex } from 'styled-system';
import { observer } from 'mobx-react';


const LoginInfo = {
  Id: "udmt",//"admin" , "udmt"
  Pw: "1111",//"pha123!" , "1111"
};

const ObserverProgressBar = observer(ProgressBar);

const LoginContainer = ({ navigation }: { navigation: any }) => {
  const [logininfo, setlogininfo] = useState({ ...LoginInfo });

  const [IsModal, setIsModal] = useState<boolean>(false);
  const onChangeText = (type: string, value: string) => {

    let templogininfo = { ...logininfo };
    if (type === "id") {
      templogininfo.Id = value;
    } else if (type === "pw") {
      templogininfo.Pw = value;
    }
    setlogininfo(templogininfo);
  };

  const onBtnInput = async () => {
    //사용자 정보가 있는지 확인하고 해당 아이디로 로그인 
    try {
      setIsModal(true);
      let bOk: any = await stores.MoldStore.Login(logininfo);

      setTimeout(() => {
        if (bOk === -1) {
          stores.RFIDStore.SendToastMessage("아이디와 패스워드를 입력하여\n주십시오.");
        }
        else if (bOk === -2) {
          stores.RFIDStore.SendToastMessage("패스워드를 입력하여 주십시오.");
        }
        else if (bOk === -3) {
          stores.RFIDStore.SendToastMessage("아이디를 입력하여 주십시오.");
        }
        else if (bOk === 1) {
          navigation.navigate('DrawerHome'); //로그인시 홈화면으로 이동
        }
        else if (bOk === 0) {
          stores.RFIDStore.SendToastMessage("아이디 또는 패스워드가\n잘못되었습니다.");
        }
        setIsModal(false);
      }, 1000);
    } catch (error) {
      console.log("error", error);
      setIsModal(false);
      await stores.RFIDStore.SendToastMessage("네트워크 연결이 정상이 아닙니다.\nWifi연결 주소를 확인 하여주십시오.");
    }

  };

  return (
    <View style={{ flex: 1 }}>
      <ObserverProgressBar visible={IsModal} />
      <LoginViewer info={logininfo} onBtnInput={onBtnInput} onChangeText={onChangeText} />
    </View>
  );
};

export default LoginContainer;
