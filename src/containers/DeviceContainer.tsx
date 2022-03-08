import React from "react";
import {StyleSheet ,View,Text,DeviceEventEmitter } from "react-native";

import stores from "../stores";
import {SearchViewer} from "../view/DeviceViewer";

const DeviceContainer = ({navigation}: {navigation: any}) => {
  
  const onConnect = (sValue: string) => {
    console.log("onConnect");
    stores.RFIDStore.setBluetooth(sValue);
  };

  DeviceEventEmitter.addListener('onConnect', onConnect);

  return <SearchViewer navigation={navigation} />;
};

export default DeviceContainer;