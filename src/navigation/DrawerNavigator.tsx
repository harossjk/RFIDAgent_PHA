import 'react-native-gesture-handler';
import React from 'react';
import { View, TouchableOpacity, Image, Text } from 'react-native';
import {
  createStackNavigator,
  CardStyleInterpolators,
  StackNavigationProp,
} from '@react-navigation/stack';
import {
  createDrawerNavigator,
  DrawerNavigationProp,
} from '@react-navigation/drawer';
import { CompositeNavigationProp } from '@react-navigation/native';

import { observer } from 'mobx-react';
import NivStyles from './Navigator.module';
import CustomSidebarMenu from '../components/CustomSidebarMenu';
import {
  HomeContainer,
  LoginContainer,
  OptionContainer,
  DeviceContainer,
  MoldContainer,
} from '../containers';
import TopHeader from '../components/TopHeader';
import { ListViewer, CompletionViewer } from '../view/DeviceViewer';
import {
  HorizontalStepIndicator,
  StepViewer_Tag,
  StepViewer_RFID,
  StepViewer_BarCode,
  StepViewer_BarcodeDetail,
} from '../view/StepViewer';

import {
  Mold_Info,
  Mold_Article,
  Mold_Release,
  Mold_ArticleList,
  Mold_ReleaseList,
} from '../view/MoldViewer';

import stores from '../stores';
import { StackActions } from '@react-navigation/native';

export enum AppScreens {
  stackHome = 'StackHome',
  stackLogin = 'StackLogin',
  stackOption = 'StackOption',

  stackRFID = 'StackRFID',
  stackTag = 'StackTag',
  stackBarcode = 'StackBarcode',
  stackBarcodeDetail = 'StackBarcodeDetail',

  stackBluetooth = 'StackBluetooth',
  stackBLEList = 'StackBLEList',
  stackBLECompltion = 'StackBLECompltion',

  stackMoldSearch = 'StackMoldSearch',
  stackMoldInfo = 'StackMoldInfo',
  stackMoldArticle = 'StackMoldArticle',
  stackMoldArticleList = 'StackMoldArticleList',
  stackMoldRelease = 'StackMoldRelease',
  stackMoldReleaseList = 'StackMoldReleaseList',

  drawerHome = 'DrawerHome',
  drawerLogin = 'DrawerLogin',
  drawerOption = 'DrawerOption',
  drawerBluetooth = 'DrawerBluetooth',
  drawerRFID = 'DrawerRFID',
  drawerMold = 'DrawerMold',
  drawerMoldInfo = 'DrawerMoldInfo',
}

export type NivParamList = {
  StackHome: undefined;
  StackLogin: undefined;
  StackOption: undefined;
  StackBluetooth: undefined;
  StackRFID: undefined;
  StackTag: undefined;
  StackBarcode: undefined;
  StackBarcodeDetail: undefined;
  StackBLEList: undefined;
  StackBLECompltion: undefined;

  StackMoldSearch: undefined;
  StackMoldInfo: undefined;
  StackMoldArticle: undefined;
  StackMoldArticleList: undefined;
  StackMoldRelease: undefined;
  StackMoldReleaseList: undefined;

  DrawerHome: undefined;
  DrawerLogin: undefined;
  DrawerOption: undefined;
  DrawerBluetooth: undefined;
  DrawerRFID: undefined;
  DrawerMold: undefined;
  DrawerMoldInfo: undefined;
};

const Stack = createStackNavigator<NivParamList>();
const Drawer = createDrawerNavigator<NivParamList>();

//bluetooth page
const BluetoothNavigator = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
      }}>
      <Stack.Screen
        name={AppScreens.stackBluetooth}
        options={{
          headerShown: false,
          headerTitleStyle: NivStyles.loginNivHeaderTitle,
        }}
        component={DeviceContainer}
      />
      <Stack.Screen
        name={AppScreens.stackBLEList}
        options={{
          headerShown: false,
          headerTitleStyle: NivStyles.loginNivHeaderTitle,
        }}
        component={ListViewer}
      />
      <Stack.Screen
        name={AppScreens.stackBLECompltion}
        options={{
          headerShown: false,
          headerTitleStyle: NivStyles.loginNivHeaderTitle,
        }}
        component={CompletionViewer}
      />
    </Stack.Navigator>
  );
};

//Login Page
const LoginNavigator = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name={AppScreens.stackLogin}
        options={{
          headerShown: false,
          headerTitleStyle: NivStyles.loginNivHeaderTitle,
        }}
        component={LoginContainer}
      />
    </Stack.Navigator>
  );
};

//Home Page
const HomekNavigator = ({ navigation }: { navigation: any }) => {
  const onMenu = () => {
    navigation.toggleDrawer();
  };
  const onBluetooth = () => {
    //navigation.navigate('DrawerBluetooth');
  };

  return (
    <Stack.Navigator
      screenOptions={{
        headerTintColor: '#F7F8FA',
        headerTitleStyle: { fontWeight: 'bold' },
        headerTitleAlign: 'center',
        headerStyle: NivStyles.headerStyle,
      }}>
      <Stack.Screen
        name={AppScreens.stackHome}
        options={{
          header: () => (
            <TopHeader
              onToggleHandler={onMenu}
              onBluetoothHandler={onBluetooth}
              type={AppScreens.stackHome}
            />
          ),
          headerShown: true,
        }}
        component={HomeContainer}
      />
    </Stack.Navigator>
  );
};

//Option Menu Page
const OptionNavigator = ({ navigation }: { navigation: any }) => {
  const onMenu = () => {
    navigation.toggleDrawer();
  };
  const onBluetooth = () => {
    //navigation.navigate('DrawerBluetooth');
  };

  return (
    <Stack.Navigator
      screenOptions={{
        header: () => (
          <TopHeader
            onToggleHandler={onMenu}
            onBluetoothHandler={onBluetooth}
            type={AppScreens.stackOption}
          />
        ),
        headerTitleStyle: { fontWeight: 'bold' },
        headerTitleAlign: 'center',
        headerStyle: NivStyles.headerStyle,
      }}>
      <Stack.Screen
        name={AppScreens.stackOption}
        options={{
          headerShown: true,
        }}
        component={OptionContainer}
      />
    </Stack.Navigator>
  );
};

const MoldinfoNavigator = ({ navigation }: { navigation: any }) => {
  return (
    <Stack.Navigator
      screenOptions={{
        cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
        header: () => (
          <HorizontalStepIndicator setPage={stores.StepStore.stepState} />
        ),
        headerTitleStyle: { fontWeight: 'bold' },
        headerTitleAlign: 'center',
        headerStyle: NivStyles.headerStyle,
      }}>
      <Stack.Screen
        name={AppScreens.stackRFID}
        options={{
          headerShown: false,
          headerTitleStyle: NivStyles.loginNivHeaderTitle,
        }}
        component={StepViewer_RFID}
      />
      <Stack.Screen
        name={AppScreens.stackMoldInfo}
        options={{
          headerShown: false,
          headerTitleStyle: NivStyles.loginNivHeaderTitle,
        }}
        component={Mold_Info}
      />
    </Stack.Navigator>
  );
};

//RFID Page
const RFIDNavigator = ({ navigation }: { navigation: any }) => {
  return (
    <Stack.Navigator
      screenOptions={{
        cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
        header: () => (
          <HorizontalStepIndicator setPage={stores.StepStore.stepState} />
        ),
        headerTitleStyle: { fontWeight: 'bold' },
        headerTitleAlign: 'center',
        headerStyle: NivStyles.headerStyle,
      }}>
      {/* <Stack.Screen
        name={AppScreens.stackRFID}
        options={{
          headerShown: true,
          headerTitleStyle: NivStyles.loginNivHeaderTitle,
        }}
        component={StepViewer_RFID}
      /> */}
      <Stack.Screen
        name={AppScreens.stackTag}
        options={{
          headerShown: true,
          headerTitleStyle: NivStyles.loginNivHeaderTitle,
        }}
        component={StepViewer_Tag}
      />
      {/* <Stack.Screen
        name={AppScreens.stackBarcode}
        options={{
          headerShown: true,
          headerTitleStyle: NivStyles.loginNivHeaderTitle,
        }}
        component={StepViewer_BarCode}
      /> */}
      <Stack.Screen
        name={AppScreens.stackBarcodeDetail}
        options={{
          headerShown: true,
          headerTitleStyle: NivStyles.loginNivHeaderTitle,
        }}
        component={StepViewer_BarcodeDetail}
      />
    </Stack.Navigator>
  );
};

//Mold Page
const MoldNavigator = ({ navigation }: any) => {
  const onMenu = () => {
    console.log('MoldNavigator', '반응');
    navigation.toggleDrawer();
  };
  const onBluetooth = () => {
    //navigation.navigate('DrawerBluetooth');
  };
  return (
    <Stack.Navigator
      screenOptions={{
        cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
      }}>
      <Stack.Screen
        name={AppScreens.stackMoldSearch}
        options={{
          headerTitleStyle: NivStyles.loginNivHeaderTitle,
          header: () => (
            <TopHeader
              onToggleHandler={onMenu}
              onBluetoothHandler={onBluetooth}
              type={AppScreens.stackMoldSearch}
            />
          ),
          headerShown: true,
        }}
        component={MoldContainer}
      />
      <Stack.Screen
        name={AppScreens.stackMoldInfo}
        options={{
          headerTitleStyle: NivStyles.loginNivHeaderTitle,
          header: () => (
            <TopHeader
              onToggleHandler={onMenu}
              onBluetoothHandler={onBluetooth}
              type={AppScreens.stackMoldInfo}
            />
          ),
          headerShown: true,
        }}
        component={MoldContainer}
      />
    </Stack.Navigator>
  );
};

const ObservedRFIDNavigator = observer(RFIDNavigator);

//Drawer add Navigation Page
const DrawerNavigator = () => {
  return (
    <Drawer.Navigator
      initialRouteName={AppScreens.drawerLogin}
      screenOptions={DrawerOption.drawerContentOptions}
      drawerContent={(props: any) => {
        const filteredProps = {
          ...props,
          state: {
            ...props.state,
            routeNames: props.state.routeNames.filter((routeName: any) => {
              routeName !== AppScreens.drawerBluetooth.toString();
            }),
            routes: props.state.routes.filter(
              (route: any) =>
                route.name !== AppScreens.drawerBluetooth.toString(),
            ),
          },
        };
        return <CustomSidebarMenu {...filteredProps} />;
      }}>
      <Drawer.Screen name={AppScreens.drawerHome} component={HomekNavigator} />
      <Drawer.Screen
        name={AppScreens.drawerOption}
        component={OptionNavigator}
      />
      <Drawer.Screen
        name={AppScreens.drawerLogin}
        options={DrawerOption.loginOption}
        component={LoginNavigator}
      />

      <Drawer.Screen
        name={AppScreens.drawerBluetooth}
        component={BluetoothNavigator}
      />

      <Drawer.Screen
        name={AppScreens.drawerRFID}
        options={DrawerOption.loginOption}
        component={ObservedRFIDNavigator}
      />

      <Drawer.Screen
        name={AppScreens.drawerMold}
        options={{ headerShown: false, swipeEnabled: true }}
        component={MoldNavigator}
      />

      {/* <Drawer.Screen
        name={AppScreens.drawerMoldInfo}
        options={{ headerShown: false, swipeEnabled: true }}
        component={MoldinfoNavigator}
      /> */}
    </Drawer.Navigator>
  );
};

const DrawerOption: any = {
  drawerContentOptions: {
    drawerItemStyle: { marginVertical: 8 },
  },
  loginOption: {
    headerShown: false,
    swipeEnabled: false,
  },
  homeOption: {
    headerShown: false,
    headerTitleAlign: 'center',
    headerTitleAllowFontScaling: true,
  },
  bluetoothOption: {
    headerShown: false,
    headerTitleAlign: 'center',
    headerTitleAllowFontScaling: true,
  },
  deviceOption: {
    headerShown: false,
  },
};

export default DrawerNavigator;
