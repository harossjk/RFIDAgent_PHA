import React,{useEffect, useState} from 'react';
import RadioForm, {RadioButton, RadioButtonInput, RadioButtonLabel} from 'react-native-simple-radio-button';

const radio_props = [
  {label: 'Mute', value: 0},
  {label: 'Low', value: 1},
  {label: 'High', value: 2},
];

const RadioButtonGroup = ({number , getRadio,prevData }: {number:any,getRadio: any,prevData:any}) => {

  useEffect(()=>{
    setSelectRadio(number);
    prevData(number);
  },[])

  const [selectRadio,setSelectRadio] = useState(0);

   const onRadioButton = (props: any) => {
     setSelectRadio(props);
     getRadio(props);
   };

  return (
    <RadioForm formHorizontal={true} animation={true} initial={selectRadio}>
      {radio_props.map((obj, i) => (
        <RadioButton
          style={{
            justifyContent: 'center',
            alignItems: 'center',
            alignContent: 'center',
            marginHorizontal:-5
          }}
          labelHorizontal={true}
          key={i}>
          <RadioButtonInput
            obj={obj}
            index={i}
            isSelected={selectRadio === i}
            onPress={() => onRadioButton(i)}
            buttonInnerColor={'#2196f3'}
            buttonOuterColor={selectRadio === i ? '#2196f3' : '#000'}
            buttonSize={25}
            buttonOuterSize={30}
            buttonStyle={{borderWidth: 1}}
            buttonWrapStyle={{}}
          />
          <RadioButtonLabel
            obj={obj}
            index={i}
            labelHorizontal={true}
            onPress={() => onRadioButton(i)}
            labelStyle={{fontSize: 20, textAlign: 'left', color: '#5D5D5D',paddingLeft:10,paddingRight:20}}
            labelWrapStyle={{}}
          />
        </RadioButton>
      ))}
    </RadioForm>
  );
};

export default RadioButtonGroup;