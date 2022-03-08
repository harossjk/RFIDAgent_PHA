import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import stores from '../stores';
import HomeViewer from '../view/HomeViewer';
import { useIsFocused } from '@react-navigation/native';

const pageinfo = {
  Mold_Info: 'Mold_Info', //금형 정보
  Mold_Article: 'Mold_Article', //입고
  Mold_Release: 'Mold_Release', //출고
  Mold_Article_List: 'Mold_Article_List', //입고 취소
  Mold_Release_List: 'Mold_Release_List', //출고 취소
  MoldSearch: 'MoldSearch'
};

const HomeContainer = ({ navigation }: { navigation: any }) => {
  const isFocused = useIsFocused();
  React.useEffect(() => {
    console.log("현재 RFID 모드", stores.RFIDStore.getDeviceInfo.devContinue);
    console.log("저장된 RFID 모드", stores.RFIDStore.getPrevReadMode);
  }, [isFocused]);

  const onPageMoveHandler = async (pageInfo: string) => {
    console.log('반응반응', pageInfo);

    async function MoveToRFID() {
      return new Promise<void>((resolve, reject) => {
        const isConnect = stores.RFIDStore.isConnect;
        if (isConnect) {
          stores.RFIDStore.setTagDataClear();
          console.log('1.데이터 초기화');
          stores.StepStore.SetStepState(1);
          console.log('2.Step 넘버 변경 0');
          stores.RFIDStore.SendSetScanMode(0);
          console.log('3.스캔모드 변경 0');
          stores.RFIDStore.SendDisRFIDHandler();
          stores.RFIDStore.SendDisBarcodeHandler();
          console.log('4.핸들러 초기화');
          console.log('======================================');
        }
        stores.StepStore.SetMoldPageInfo(pageInfo);
        stores.StepStore.SetNoticeVisible(true);
        let page = stores.StepStore.getMoldPageInfo;
        // if (page === pageinfo.Mold_Article_List)
        //   navigation.reset({ routes: [{ name: 'DrawerMold' }] });
        // else if (page === pageinfo.Mold_Release_List)
        //   navigation.reset({ routes: [{ name: 'DrawerMold' }] });
        // else
        if (page === pageinfo.MoldSearch) {
          stores.RFIDStore.SendSetReadMode(1);
          navigation.reset({ routes: [{ name: 'DrawerMold' }] });
        }
        else {
          stores.RFIDStore.SendSetReadMode(0);
          navigation.reset({ routes: [{ name: 'DrawerRFID' }] });
        }
        resolve();
      });
    }
    await MoveToRFID();
  };

  return (
    <HomeViewer
      navigation={navigation}
      pageInfo={pageinfo}
      onPressPageMove={onPageMoveHandler}
    />
  );
};

export default HomeContainer;
