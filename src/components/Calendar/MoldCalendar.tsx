import React, {useState} from 'react';
import {View, StyleSheet, Button} from 'react-native';
import stores from '../../stores';
import Modal from 'react-native-modal';

import {
  LocaleConfig,
  Calendar,
  CalendarList,
  Agenda,
} from 'react-native-calendars';

const MoldCalendar = ({
  modalVisible,
  SendDailogState,
  SendSelectedDay,
}: {
  modalVisible: boolean;
  SendDailogState: any;
  SendSelectedDay: any;
}): React.ReactElement => {
  const [markedDates, setMarkedDates] = React.useState<any>(null);
  const [currDay, setCurrday] = React.useState<any>(null);

  // React.useEffect(() => {
  //   if (stores.MoldStore.getMoldInDay.length > 0) {
  //     console.log(stores.MoldStore.getMoldInDay);
  //   }
  // }, [modalVisible]);

  const addDates = (day: any) => {
    let obj: any = {};
    const dateString = day.dateString;
    obj[dateString] = {
      selected: true,
      marked: true,
      selectedColor: 'blue',
    };
    setMarkedDates(obj);
    setCurrday(dateString);
    console.log('mark null', day);
  };

  const onPressOk = (isVisible: boolean) => {
    SendDailogState(isVisible);
  };

  const onPressCancel = (isVisible: boolean) => {
    SendDailogState(isVisible);
  };

  return (
    <Modal
      isVisible={modalVisible}
      useNativeDriver={true}
      hideModalContentWhileAnimating={true}
      onBackButtonPress={() => {
        SendDailogState(false);
        SendSelectedDay(markedDates);
      }}
      onBackdropPress={() => {
        SendDailogState(false);
        SendSelectedDay(markedDates);
      }}
      style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
      <View
        style={{
          flexDirection: 'column',
          width: 320,
          height: 350,
          backgroundColor: '#F9F9F9',
          borderRadius: 10,
          borderTopEndRadius: 10,
          borderTopStartRadius: 10,
          borderBottomStartRadius: 10,
          borderBottomEndRadius: 10,
          borderColor: '#707070',
          borderWidth: 2,
        }}>
        <Calendar
          current={currDay}
          monthFormat={'yyyy년 MM월'}
          onDayPress={(day: any) => {
            addDates(day);
          }}
          markedDates={markedDates}
        />
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  btnStyle: {
    borderRadius: 100,
    borderTopEndRadius: 100,
    borderTopStartRadius: 100,
    borderBottomStartRadius: 100,
    borderBottomEndRadius: 100,
    backgroundColor: '#428BCA', //
    width: 100,
    height: 50,
  },
});
export default MoldCalendar;
