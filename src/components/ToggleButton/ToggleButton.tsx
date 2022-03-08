import React, {useState} from 'react';
import SwitchToggle from 'react-native-switch-toggle';

const ToggleButton = ({ setToggle, getToggle}:{setToggle:any, getToggle:any}) => {

  const onPressToggle = (isOnOff: boolean) => {
    setToggle = isOnOff;
    getToggle(setToggle);
  };

  return (
    <SwitchToggle
      containerStyle={{
        top: 10,
        left: 5,
        width: 50,
        height: 25,
        borderRadius: 25,
        backgroundColor: '#ccc',
        padding: 5,
      }}
      
      circleStyle={{
        width: 20,
        height: 20,
        borderRadius: 19,
        backgroundColor: 'white',
      }}

      switchOn={setToggle}
      onPress={() => onPressToggle(!setToggle)}
      circleColorOff="#fff"
      circleColorOn="#fff"
      backgroundColorOn="#2196f3"
      backgroundColorOff="#C4C4C4"
    />
  );
};

export default ToggleButton;
