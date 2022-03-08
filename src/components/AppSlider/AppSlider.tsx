import React, {useState} from 'react';
import {View, Text, Animated} from 'react-native';

import {Slider} from 'react-native-elements';
//import Slider from '@react-native-community/slider';
import stores from '../../stores';

const AppSlider = ({setData,sendRadioData}: {setData: any ,sendRadioData:any}) => {

  const [radioPower, setRadioPowerValue] = useState(setData);

  React.useEffect(()=>{
    //setRadioPowerValue(setData+30)
  },[radioPower])

  const onChangeValue = (value: any) => {
    if(0<value)
      return;

    if(sendRadioData) sendRadioData(value);
    setRadioPowerValue(value);
  };

  return (
    <View style={{flex: 1, alignItems: 'stretch', justifyContent: 'center'}}>
      <Text
        style={{
          textAlign: 'center',
          justifyContent: 'center',
          alignItems: 'center',
          fontSize: 25,
          bottom: 10,
        }}>
        {radioPower}({radioPower+30})dBm
      </Text>
      <Slider

        allowTouchTrack={true}
        style={{
          height: 20,
          width: 250,
          //marginLeft: 10,
        }}
        value={setData}
  
        onValueChange={value => onChangeValue(value)} // 슬라이더를 움질일때 출력값 변환
        minimumValue={-30} // 최소값 설정
        maximumValue={0} // 최대값 설정
        maximumTrackTintColor="#8A8A8A" //"" // 값이 크면 빨간색
        minimumTrackTintColor="#2196f3" //"#2196f3" // 값이 작으면 파란색
        thumbTintColor="#52AFE0"
        step={1} // 1단위로 값이 변경
        trackStyle={{
          height: 25,
          backgroundColor: 'transparent',
          borderRadius: 10,
          borderTopEndRadius: 10,
          borderTopStartRadius: 10,
          borderBottomStartRadius: 10,
          borderBottomEndRadius: 10,
        }}
        thumbStyle={{borderColor: 'red',borderWidth:2}}
      />

    </View>
    // <View style={{flex:1, justifyContent:'center',alignItems:'center'}}>
    //   <Text
    //     style={{
    //       textAlign: 'center',
    //       justifyContent: 'center',
    //       alignItems: 'center',
    //     }}>
    //     {radioPower}({radioPower + 30})dBm
    //   </Text>

    //   <Slider
    //     style={{
    //       height: 20,
    //       width: 280,
    //       //marginLeft: 10,
    //     }}
    //     value={15}
    //     onValueChange={value => onChangeValue(value)} // 슬라이더를 움질일때 출력값 변환
    //     minimumValue={-30} // 최소값 설정
    //     maximumValue={0} // 최대값 설정
    //     maximumTrackTintColor='balck'//"#8A8A8A" // 값이 크면 빨간색
    //     minimumTrackTintColor='red'//"#2196f3" // 값이 작으면 파란색
    //     thumbTintColor="black"
    //     step={1} // 1단위로 값이 변경
    //   />
    // </View>
  );
};

export default AppSlider;
