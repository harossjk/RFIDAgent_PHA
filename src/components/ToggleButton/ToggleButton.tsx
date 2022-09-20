import React, { useState } from 'react';
import { useEffect } from 'react';
import SwitchToggle from 'react-native-switch-toggle';

const ToggleButton = (props: { isConnect: boolean, setToggle: any, getToggle: any }) => {

  const onPressToggle = (isOnOff: boolean) => {
    props.setToggle = isOnOff;
    props.getToggle(props.setToggle);
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

      switchOn={props.setToggle}
      onPress={() => onPressToggle(!props.setToggle)}
      circleColorOff="#fff"
      circleColorOn="#fff"
      backgroundColorOn={props.isConnect ? "#2196f3" : "#C4C4C4"}
      backgroundColorOff="#C4C4C4"
    />
  );
};

export default ToggleButton;
