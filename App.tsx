/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React from 'react';
import { SafeAreaView, StatusBar, StyleSheet, View, Text, AppRegistry } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import DrawerNavigator from './src/navigation/DrawerNavigator';
import { ModalProvider } from 'react-native-use-modal';
import SplashScreen from 'react-native-splash-screen';
import { observer } from 'mobx-react';
import stores from './src/stores';
// import ProgressBar from './src/components/Progress/ProgressBar';



const VerifyDevcie = () => {
  React.useEffect(() => {
    async function VerifConnect() {
      await stores.RFIDStore.VerifyConnect();
      // if (stores.RFIDStore.isConnect) {
      //   // await stores.RFIDStore.SendSetRFIDHandler();
      //   // await stores.RFIDStore.RequestDeviceConfig();
      // }
    }
    VerifConnect();
  }, []);

  return (
    <ModalProvider>
      <SafeAreaView style={{ flex: 1 }}>
        <NavigationContainer>
          <StatusBar barStyle="dark-content" />
          <DrawerNavigator />
        </NavigationContainer>
      </SafeAreaView>
    </ModalProvider>
  );
};

const ObservedVerifyDevcie = observer(VerifyDevcie);

const App = () => {
  React.useEffect(() => {
    SplashScreen.hide();
  }, []);

  return <ObservedVerifyDevcie />;
};

AppRegistry.registerComponent("RFIDAgent", () => App);
export default App;
