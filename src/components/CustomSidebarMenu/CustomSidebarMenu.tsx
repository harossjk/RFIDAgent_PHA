import React, { useState } from 'react';
import { View, StyleSheet, Image, TouchableOpacity } from 'react-native';
import {
  Avatar,
  Title,
  Caption,
  Paragraph,
  Drawer,
  Text,
  TouchableRipple,
  Switch,
} from 'react-native-paper';
import {
  DrawerContentScrollView,
  DrawerItemList,
  DrawerItem,
} from '@react-navigation/drawer';

import Icon from 'react-native-vector-icons/MaterialCommunityIcons';


const draweritemSelect = {
  home: true,
  option: false,
};

const CustomSidebarMenu = (props: any) => {
  const [activeDrawer, setActiveDrawer] = useState({ ...draweritemSelect });
  const onActivDarwer = (type: string) => {
    let tempActiveDrawer = { ...activeDrawer };
    if (type === 'Home') {
      tempActiveDrawer.home = true;
      tempActiveDrawer.option = false;
    } else if (type === 'Option') {
      tempActiveDrawer.home = false;
      tempActiveDrawer.option = true;
    } else if (type === 'Logout') {
      tempActiveDrawer.home = true;
      tempActiveDrawer.option = false;
    }

    setActiveDrawer(tempActiveDrawer);
  };

  return (
    <View style={{ flex: 1 }}>
      <DrawerContentScrollView {...props}>
        <View style={styles.drawerContent}>
          <View style={styles.userInfoSection}>
            <View style={{ flexDirection: 'row', marginTop: 14 }}>
              <Avatar.Icon
                style={{ backgroundColor: '#428BCA' }}
                icon="face"
                size={55}
              />
              {/* <Image
                style={{height: 46 , width: 115,top:8, }}
                source={require('../../assets/img/phc.png')}
              /> */}
              <View style={{ marginLeft: 20, flexDirection: 'column' }}>
                <Title style={styles.title}>Administer</Title>
                <Caption style={styles.caption}>금형관리반</Caption>
              </View>
              <TouchableOpacity style={{ left: 10 }}
                onPress={() => {
                  onActivDarwer('Logout');
                  props.navigation.navigate('DrawerLogin');
                }}>
                <Icon name="logout" color={"#000"} size={50} />
              </TouchableOpacity>
            </View>

            <View style={styles.row}>
              <View style={styles.section}>
                <Paragraph style={[styles.paragraph, styles.caption]}>
                  Administer{' '}
                </Paragraph>
                <Caption style={styles.caption}>사용자님 안녕하세요.</Caption>
              </View>
            </View>
          </View>
          <Drawer.Section style={styles.drawerSection}>
            <DrawerItem
              icon={({ color, size }) => (
                <Icon name="home-outline" color={color} size={40} />
              )}
              label="Home"
              labelStyle={styles.lbMenuTitle}
              onPress={() => {
                onActivDarwer('Home');
                props.navigation.navigate('DrawerHome');
              }}
              focused={activeDrawer.home}
              activeTintColor={'#fff'} //활성 탭의 레이블 및 아이콘 색상.
              activeBackgroundColor={'#428BCA'} //활성 탭의 배경색.
              inactiveTintColor={'#fff'} //비활성 탭의 레이블 및 아이콘 색상.
              inactiveBackgroundColor={'#83BDE8'} //비활성 탭의 배경색입니다.
            />
            <DrawerItem
              icon={({ color, size }) => (
                <Icon name="content-save-settings" color={color} size={40} />
              )}
              label="Option"
              labelStyle={styles.lbMenuTitle}
              onPress={() => {
                onActivDarwer('Option');
                props.navigation.navigate('DrawerOption');
              }}
              focused={activeDrawer.option}
              activeTintColor={'#fff'}
              activeBackgroundColor={'#428BCA'}
              inactiveTintColor={'#fff'}
              inactiveBackgroundColor={'#83BDE8'}
            />
            {/* <DrawerItem
              icon={({color, size}) => (
                <Icon name="logout" color={color} size={30} />
              )}
              label="Logout"
              labelStyle={styles.lbMenuTitle}
              onPress={() => {
                onActivDarwer('Logout');
                props.navigation.navigate('DrawerLogin');
              }}
              activeTintColor={'#fff'}
              activeBackgroundColor={'#428BCA'}
              inactiveTintColor={'#fff'}
              inactiveBackgroundColor={'#83BDE8'}
            /> */}
          </Drawer.Section>
        </View>
      </DrawerContentScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  drawerContent: {
    flex: 1,
  },
  userInfoSection: {
    paddingLeft: 20,
  },
  title: {
    fontSize: 20,
    marginTop: 3,
    fontWeight: 'bold',
  },
  caption: {
    fontSize: 15,
    lineHeight: 20,
  },
  row: {
    marginTop: 20,
    flexDirection: 'row',
    alignItems: 'center',
  },
  section: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 15,
  },
  paragraph: {
    fontWeight: 'bold',
    marginRight: 3,
  },
  drawerSection: {
    marginTop: 15,
  },
  bottomDrawerSection: {
    marginBottom: 15,
    borderTopColor: 'black',
    borderTopWidth: 1,
  },
  preference: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  lbMenuTitle: {
    fontSize: 30,
    fontFamily: 'NanumSquareB',
  },
});

export default CustomSidebarMenu;
