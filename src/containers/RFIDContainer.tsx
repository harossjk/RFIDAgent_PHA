import React, {useEffect, useState} from 'react';
import {View, Text, StyleSheet, SafeAreaView, Alert} from 'react-native';
//import {ProgressSteps, ProgressStep} from 'react-native-progress-steps';

import StepViewer_RFID from '../view/StepViewer/StepViewer_RFID';
import StepViewer_Tag from '../view/StepViewer/StepViewer_Tag';
import StepViewer_BarCode from '../view/StepViewer/StepViewer_BarCode';

// import {
//   NativeBaseProvider,
//   Center,
//   Box,
// } from 'native-base';

const progressSteps = {
  borderWidth: 5,
  borderStyle: 'bold',

  activeStepIconBorderColor: '#A9CDE8',
  completedProgressBarColor: '#A9CDE8',

  activeStepNumColor: '#000',
  activeStepIconColor: '#fff',
  activeLabelColor: '#000',

  completedStepNumColor: '#000',
  completedStepIconColor: '#A9CDE8',

  completedCheckColor: 'green',
  completedLabelColor: 'green',

  activeLabelFontSize: 18,
  labelFontFamily: 'NanumSquareB',
};

const defaultScrollViewProps = {
  keyboardShouldPersistTaps: 'handled', //handled
  contentContainerStyle: {
    flex: 1,
    justifyContent: 'center',
  },
};

const RFIDContainer = ({navigation}: {navigation: any}) => {
  const btnvVsible = true;
  const [activeStep, setActiveStep] = useState(0);

  const onPressRFID = () => {
    setActiveStep(1);
  };

  const onPressBarcode = () => {
    setActiveStep(0);
  };

  const onPressTag = (index: number) => {
    if (index === 0) {
      setActiveStep(0);
    } else if (index === 3) {
      setActiveStep(2);
    }
  };
  return (
    <View style={{flex: 1, backgroundColor: '#F9F9F9'}}>
      <Text
        style={{
          paddingTop: 40,
          fontFamily: 'NanumSquareR',
          fontSize: 20,
          textAlign: 'center',
        }}>
        버튼을 누르면 RFID 스캔을 {'\n'}시작합니다.
      </Text>

      {/* <ProgressSteps activeStep={activeStep} {...progressSteps}>
        <ProgressStep
          label="RFID"
          scrollViewProps={defaultScrollViewProps}
          removeBtnRow={btnvVsible}>
          <View style={{alignItems: 'center'}}>
            <StepViewer_RFID
              navigation={navigation}
              onPressHandler={onPressRFID}
            />
          </View>
        </ProgressStep>
        <ProgressStep
          label="TAG"
          scrollViewProps={defaultScrollViewProps}
          removeBtnRow={btnvVsible}>
          <View style={{flex: 1, alignItems: 'center'}}>
            <StepViewer_Tag navigation={navigation} />
          </View>
          <View style={{width: '100%', height: 80}}>
            <NativeBaseProvider>
              <Box bg="white" safeAreaTop>
                <Center style={{width: '100%', height: 80}}>
                  <FooterTab onPressHandler={onPressTag} />
                </Center>
              </Box>
            </NativeBaseProvider>
          </View>
        </ProgressStep>
        <ProgressStep
          label="BARCODE"
          scrollViewProps={defaultScrollViewProps}
          removeBtnRow={btnvVsible}>
          <View style={{alignItems: 'center'}}>
            <StepViewer_BarCode
              navigation={navigation}
              onPressHandler={onPressBarcode}
            />
          </View>
        </ProgressStep>
        <ProgressStep
            label="금형 정보"
            scrollViewProps={defaultScrollViewProps}
            removeBtnRow={btnvVsible}>
            <View style={{alignItems: 'center'}}>
              <Text>Confirm order step content</Text>
            </View>
          </ProgressStep>
      </ProgressSteps> */}
    </View>
  );
};

export default RFIDContainer;
