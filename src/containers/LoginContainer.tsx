import React, { useState } from 'react';
import { View, Text, StyleSheet, } from "react-native";


import LoginViewer from "../view/LoginViewer/LoginViewer";

import stores from '../stores';


const LoginInfo = {
  Id: "",
  Pw: "",
};
const LoginContainer = ({ navigation }: { navigation: any }) => {
  const [logininfo, setlogininfo] = useState({ ...LoginInfo });

  const onChangeText = (type: string, value: string) => {

    let templogininfo = { ...logininfo };
    if (type === "id") {
      templogininfo.Id = value;
    } else if (type === "pw") {
      templogininfo.Pw = value;
    }
    setlogininfo(templogininfo);
  };

  const onBtnInput = () => {
    console.log("눌림", { ...logininfo });

    stores.MoldStore.Login();

    navigation.navigate('DrawerHome'); //로그인시 홈화면으로 이동
  };

  return <LoginViewer info={logininfo} onBtnInput={onBtnInput} onChangeText={onChangeText} />;
};

export default LoginContainer;
