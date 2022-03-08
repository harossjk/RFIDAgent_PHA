import React, { useEffect } from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { Avatar } from 'react-native-paper';
import StepIndicator from 'react-native-step-indicator';

import stepCheck from '../../assets/img/step_check.svg';
import stores from '../../stores';

const secondIndicatorStyles = {
  stepIndicatorSize: 30,
  currentStepIndicatorSize: 40,
  separatorStrokeWidth: 5,
  currentStepStrokeWidth: 5,
  stepStrokeCurrentColor: '#A9CDE8',
  stepStrokeWidth: 2,
  separatorStrokeFinishedWidth: 5,
  stepStrokeFinishedColor: '#A9CDE8',
  stepStrokeUnFinishedColor: '#aaaaaa',
  separatorFinishedColor: '#A9CDE8',
  separatorUnFinishedColor: '#aaaaaa',
  stepIndicatorFinishedColor: '#A9CDE8',
  stepIndicatorUnFinishedColor: '#ffffff',
  stepIndicatorCurrentColor: '#ffffff',

  stepIndicatorLabelFontSize: 30,
  currentStepIndicatorLabelFontSize: 40,
  stepIndicatorLabelCurrentColor: '#A9CDE8',
  stepIndicatorLabelFinishedColor: '#ffffff',
  stepIndicatorLabelUnFinishedColor: '#aaaaaa',
  labelColor: '#999999',
  labelSize: 20,
  currentStepLabelColor: '#A9CDE8',
};

const HorizontalStepIndicator = ({ setPage }: { setPage: any }) => {
  const [currentPage, setCurrentPage] = React.useState<number>(setPage);

  useEffect(() => {
    setStepIndex();
  }, []);

  const setStepIndex = () => {
    setCurrentPage(setPage);
  };

  const renderStepIndicator = (params: any) => {
    if (params['stepStatus'] === 'finished') {
      return (
        <Avatar.Icon
          style={{ backgroundColor: 'white' }}
          icon={stepCheck}
          size={20}
        />
      );
    }
  };

  const renderLabel = ({
    position,
    label,
    currentPosition,
  }: {
    position: number;
    stepStatus: string;
    label: string;
    currentPosition: number;
  }) => {
    return (
      <Text
        style={
          position === currentPosition
            ? styles.stepLabelSelected
            : styles.stepLabel
        }>
        {label}
      </Text>
    );
  };

  // Mold_Info: 'Mold_Info', //금형 정보
  // Mold_Article: 'Mold_Article', //입고
  // Mold_Release: 'Mold_Release', //출고
  // Mold_Article_List: 'Mold_Article_List', //입고 취소
  // Mold_Release_List: 'Mold_Release_List', //출고 취소
  return (
    <View style={styles.container}>
      <View style={styles.stepIndicator}>
        <StepIndicator
          stepCount={3}
          customStyles={secondIndicatorStyles}
          currentPosition={currentPage}
          renderStepIndicator={renderStepIndicator}
          labels={
            stores.StepStore.getMoldPageInfo === 'Mold_Info'
              ? ['금형정보', 'TAG', '바코드']
              : stores.StepStore.getMoldPageInfo === 'Mold_Article'
                ? ['금형이동', 'TAG', '바코드']
                : stores.StepStore.getMoldPageInfo === 'Mold_Release'
                  ? ['금형출고', 'TAG', '바코드']
                  : ['RFID', 'TAG', '바코드']
          }
          renderLabel={renderLabel}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#F9F9F9',
  },
  stepIndicator: {
    marginTop: 30,
    marginBottom: 30,
  },
  page: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  stepLabel: {
    fontSize: 18,
    textAlign: 'center',
    fontWeight: '500',
    fontFamily: 'NanumSquareR',
    color: '#999999',
  },
  stepLabelSelected: {
    fontSize: 20,
    textAlign: 'center',
    fontWeight: '500',
    fontFamily: 'NanumSquareEB',
    color: '#4aae4f',
  },
});

export default HorizontalStepIndicator;
