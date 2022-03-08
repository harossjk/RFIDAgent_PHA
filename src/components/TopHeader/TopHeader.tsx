import React, {useState} from 'react';
import {
  View,
  TouchableOpacity,
  Image,
  Text,
  StyleSheet,
  Dimensions,
} from 'react-native';

import BluetoothSvg from '../../assets/img/bluetooth_red.svg';
import BluetoothGreenSvg from '../../assets/img/bluetooth_green.svg';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

import stores from '../../stores';
import {observer} from 'mobx-react';

//Mennu Drawer
const NavigationDrawerStructure = ({onToggleClick}: {onToggleClick: any}) => {
  const toggleDrawer = () => {
    if (onToggleClick) onToggleClick();
  };

  return (
    <View style={{flexDirection: 'row'}}>
      <TouchableOpacity onPress={toggleDrawer}>
        <Image
          source={require('../../assets/img/drawerWhite.png')}
          style={styles.menuDrawerStructure}
        />
      </TouchableOpacity>
    </View>
  );
};

const HeaderTitle = () => {
  return (
    <Text style={styles.headerTitle}>
      RFID<Text style={styles.headerSubTitle}> Agent</Text>
    </Text>
  );
};

const BluetoothConnectState = ({onBluetoothClick}: {onBluetoothClick: any}) => {
  // const [isConnect, setConnect] = useState(stores.RFIDStore.isBLEConnect);

  // React.useEffect(() => {

  // }, [isConnect]);

  const onClick = () => {
    if (onBluetoothClick) onBluetoothClick();

    //  stores.RFIDStore.onBluetooth();
    //  setConnect(stores.RFIDStore.isBLEConnect)
    //  console.log("useEffect",stores.RFIDStore.isBLEConnect);

    // stores.RFIDStore.onBluetooth();
    // setConnect(stores.RFIDStore.isBLEConnect)
  };

  if (stores.RFIDStore.isConnect) {
    return (
      <View style={{marginRight: 20}}>
        <TouchableOpacity onPress={onClick}>
          <BluetoothGreenSvg height={40} width={40} />
        </TouchableOpacity>
      </View>
    );
  } else {
    return (
      <View style={{marginRight: 20}}>
        <TouchableOpacity onPress={onClick}>
          <BluetoothSvg height={40} width={40} />
        </TouchableOpacity>
      </View>
    );
  }
  // return (
  //   <View style={{marginRight: 20}}>
  //     <TouchableOpacity onPress={onClick}>
  //       <BluetoothSvg height={40} width={40} />
  //     </TouchableOpacity>
  //   </View>
  // );
};

const ObservedbluetoothState = observer(BluetoothConnectState);
export const {width, height} = Dimensions.get('window');
const TopHeader = ({
  onToggleHandler,
  onBluetoothHandler,
  type,
}: {
  onToggleHandler: any;
  onBluetoothHandler: any;
  type: any;
}) => {
  return (
    //<View style={[styles.container,type==="StackHome"? styles.containerHome : styles.container]}>
    <View style={styles.container}>
      <NavigationDrawerStructure onToggleClick={onToggleHandler} />
      <View style={{left: 5, bottom: 0.2}}>
        <HeaderTitle />
      </View>
      <ObservedbluetoothState onBluetoothClick={onBluetoothHandler} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingTop: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    backgroundColor: '#428BCA',
    width,
    height: 55,
  },
  containerHome: {
    paddingTop: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    backgroundColor: '#428BCA',
    width: wp('100%'),
    height: 55, //55
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
});

export default TopHeader;
