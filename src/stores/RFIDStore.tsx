import axios from 'axios';
import { makeObservable, observable, action, runInAction, computed } from 'mobx';
import { autoAction } from 'mobx/dist/internal';
import { NativeModules, DeviceEventEmitter } from 'react-native';

import { DeviceConfig } from '../components/DeviceObject';
import { baseURL } from '../components/Sever/Sever';
const { RFIDConnectModule } = NativeModules;

export interface tagType {
  id?: number;
  value?: string;
  isChek?: boolean;
  count?: number;
  moldName?: string;
}

const removeTodo = (tagS: tagType[], value: string): tagType[] => tagS.filter(todo => todo.value !== value);

const addTodo = (tagS: tagType[], value: string, count: number, moldName: string): tagType[] => [
  ...tagS,
  {
    id: Math.max(0, Math.max(...tagS.map(({ id }) => id))) + 1,
    value,
    isChek: false,
    count,
    moldName,
  },
];

class RFIDStore {
  bluetoothInfo: any = undefined;
  deviceInfo: typeof DeviceConfig = { ...DeviceConfig };

  tag: string = '';
  tagS: tagType[] = [];
  barcode: any = { type: 'READ_FAIL', result: 'READ_FAIL' };
  seletedDataS: tagType[] = [];

  totalChkCount: number = 0;
  mode: number = 0; // 0 : RFID , 1: Barcode

  isRFIDConnect: boolean = false;
  isSearchBluetooth: boolean = false;
  isTagAllChkState: boolean = false;

  isBarcodeRead: boolean = false;


  prevReadMode: number = 1;



  isVisible: boolean = false;

  isGunPress: boolean = false;

  constructor() {
    DeviceEventEmitter.addListener('ReceiverScanStatuse', this.ReceiverScanStatuse);
    DeviceEventEmitter.addListener('ReceiverScanData', this.ReceiverScanData);
    DeviceEventEmitter.addListener('ReceiverBarcodeData', this.ReceiverBarcodeData,);
    makeObservable(this, {
      //variable

      isVisible: observable,
      isGunPress: observable,
      deviceInfo: observable,
      bluetoothInfo: observable,
      isRFIDConnect: observable,
      isSearchBluetooth: observable,
      isTagAllChkState: observable,
      tag: observable,
      tagS: observable,
      barcode: observable,
      seletedDataS: observable,
      totalChkCount: observable,
      mode: observable,
      isBarcodeRead: observable,
      prevReadMode: observable,

      //funcation
      onSearchBluetooth: action,
      onSearchStop: action,
      onDeviceConnect: action,
      onDeviceDisConnect: action,

      VerifyConnect: action,
      VerifyBluetooth: action,
      setBluetooth: action,

      RequestBluetoothList: action,
      RequestDeviceConfig: action,
      RequestModeVerify: action,

      SendSetRFIDHandler: action,
      SendSetBarcodeHandler: action,
      SendDisRFIDHandler: action,
      SendDisBarcodeHandler: action,
      SendSetBuzzerVol: action,
      SendSetVibrator: action,
      SendSetReadMode: action,
      //SendSetDeviceConfig: action,
      SendSetRadioPower: action,
      SendToastMessage: action,
      SendSetScanMode: action,

      setBuzzerVol: action,
      setVibrator: action,
      setReadMode: action,
      setRadioPower: action,
      setScanData: action,
      SetSelectData: action,
      setChkOrUnChkAll: action,
      setTagDataClear: action,
      setBarcodeDataClear: action,
      SetSelectDataClear: action,
      setBarcodeReadStatuse: action,
      setPrevReadMode: action,
      SetModalVisible: action,
      SetGunPress: action,
      //property
      getBluetoothInfo: computed,
      getDeviceInfo: computed,
      getScanData: computed,
      getTagChkCount: computed,
      getChkState: computed,
      getMode: computed,
      getSelectedData: computed,
      getReadBarcodeData: computed,
      getTag: computed,
      getBarcodeReadStatuse: computed,
      getPrevReadMode: computed,
      getVisible: computed,
      getIsGunPress: computed,

      isConnect: computed,
      isSearch: computed,
    });
  }

  get getIsGunPress() {
    return this.isGunPress;
  }

  get getVisible() {
    return this.isVisible;
  }

  setPrevReadMode(value: number) {
    runInAction(() => {
      this.prevReadMode = value;
    })
  }
  get getPrevReadMode() {
    return this.prevReadMode;
  }

  setBarcodeReadStatuse(isStatuse: boolean) {
    runInAction(() => {
      this.isBarcodeRead = isStatuse;
    })
  }
  get getBarcodeReadStatuse() {
    return this.isBarcodeRead;
  }

  async SendToastMessage(msg: String) {
    try {
      await RFIDConnectModule.ToasttMessge(msg);
    } catch (error) {
      console.log('SendToastMessage error:', error);
    }
  }

  async SendSetRFIDHandler(): Promise<Boolean> {
    let isHandler = null;
    try {
      isHandler = await RFIDConnectModule.setRFIDHandler();
      console.log('SendSetRFIDHandler 연결 ');
    } catch (error) {
      console.log('SendSetRFIDHandler error:', error);
    }
    return await isHandler;
  }

  async SendDisRFIDHandler() {
    try {
      await RFIDConnectModule.DisRFIDHandler();
      console.log('SendDisRFIDHandler 연결 해제');
    } catch (error) {
      console.log(error);
    }
  }

  async SendDisBarcodeHandler() {
    try {
      await RFIDConnectModule.DisBarcodeHandler();
      console.log('SendDisBarcodeHandler 연결 해제');
    } catch (error) {
      console.log(error);
    }
  }

  async SendSetBarcodeHandler() {
    try {
      await RFIDConnectModule.setBarcodeHandler();
      console.log('setBarcodeHandler 연결 ');
    } catch (error) {
      console.log('SendSetBarcodeHandler error:', error);
    }
  }

  async VerifyConnect() {
    try {
      const isConnect: any = await RFIDConnectModule.getRFIDIsConnect();
      runInAction(() => {
        this.isRFIDConnect = isConnect;
      });
    } catch (error) {
      console.log('VerifyConnect error:', error);
    }
  }

  async VerifyBluetooth() {
    try {
      const isSearch: any = await RFIDConnectModule.getBLEIsSearch();
      runInAction(() => {
        this.isSearchBluetooth = isSearch;
      });
    } catch (error) {
      console.log('VerifyBluetooth error:', error);
    }
  }

  async onSearchBluetooth() {
    try {
      await RFIDConnectModule.onSearchBluetooth();
    } catch (error) {
      console.log('onSearchBluetooth error:', error);
      runInAction(() => {
        this.bluetoothInfo = 'error';
      });
    }
  }

  async onDeviceConnect(devName: any, devMacAdrr: any) {
    try {
      this.deviceInfo.devName = devName;
      this.deviceInfo.devMacAdrr = devMacAdrr;
      await RFIDConnectModule.onDeviceConnect(devName, devMacAdrr);
    } catch (error) {
      console.log('onDeviceConnect error:', error);
    }
  }

  async onSearchStop() {
    try {
      await RFIDConnectModule.onSearchStop();
    } catch (error) {
      console.log('onSearchStop error:', error);
    }
  }

  async onDeviceDisConnect() {
    try {
      await RFIDConnectModule.onDeviceDisConnect();
    } catch (error) {
      console.log('onDeviceDisConnect error:', error);
    }
  }

  SetMoldName = (rfid: string, moldName: string) => {
    // let filterTag = this.tagS.filter(x => x.value === rfid);
    // runInAction(() => {
    //   console.log("TEST1 : ", rfid, moldName);

    //   filterTag[0].moldName = moldName;
    //   console.log("TEST2 : ", filterTag[0]);

    // });
  }

  RemoveTagS = (value: string) => {
    try {
      runInAction(() => {
        this.tagS = removeTodo(this.tagS, value);
      });
    } catch (error) {

    }
  }

  SetModalVisible(isRfidRunning: boolean) {
    runInAction(() => {
      this.isVisible = isRfidRunning;
    })
    console.log("modal 상태 : ", this.isVisible);

  }

  SetGunPress(isGunPress: boolean) {
    runInAction(() => {
      this.isGunPress = isGunPress;
    })
  }

  ReceiverScanStatuse = async (isRfidRunning: boolean) => {
    try {
      runInAction(() => {
        if (isRfidRunning)
          this.isGunPress = isRfidRunning;

      })
    } catch (error) {
      console.log("ReceiverScanStatuse : ", error);
      runInAction(() => {
        this.isGunPress = false;
      })
    }
  }

  ReceiverScanData = async (scanData: string) => {
    try {
      let sliceData: string = scanData.slice(10, 16);
      if (scanData !== null || scanData !== '') {
        //중복검사
        const response = await axios.get(`${baseURL}/mold/selectone`, { params: { rfid: sliceData } });

        //setTimeout(() => {
        //등록된 테그에서 읽힌 Tag에대한것을 찾고 filter된것이 없을때 추가 
        runInAction(() => {
          const findTag = this.tagS.filter(x => x.value === sliceData);
          if (findTag.length === 0) {
            let data = response.data;
            this.tagS = addTodo(this.tagS, sliceData, 0, data.moldName);
            console.log(" this.tagS", this.tagS);
            this.tag = sliceData;
          }
        });

      }
    } catch (error) {
      this.SendToastMessage("- DB Connected Error\nData가 없습니다.");
      console.log('ReceiverScanData error', error);
    }
  };

  ReceiverBarcodeData = async (barcodeData: string) => {
    console.log('ReceiverBarcodeData', barcodeData);
    try {
      runInAction(() => {
        this.barcode = barcodeData;
        console.log("ReceiverBarcodeData", this.barcode);

      });
    } catch (error) {
      console.log('ReceiverBarcodeData error', error);
    }
  };

  async SendSetScanMode(iMode: number) {
    try {
      await RFIDConnectModule.setScanMode(iMode);
    } catch (error) {
      console.log('SendSetScanMode error:', error);
    }
  }

  async RequestBluetoothList() {
    try {
      await RFIDConnectModule.getDeviceList();

      const getBluetoothInfo: any =
        await RFIDConnectModule.getBluetoothDeviceName();

      runInAction(() => {
        if (
          getBluetoothInfo === null ||
          getBluetoothInfo === 'BLUETOOTH_NONE'
        ) {
          this.bluetoothInfo = 'BLUETOOTH_NONE';
        } else {
          this.bluetoothInfo = getBluetoothInfo;
        }
      });
    } catch (error) {
      console.log('RequestBluetoothList error:', error);
    }
  }

  async RequestDeviceConfig(): Promise<typeof DeviceConfig> {
    try {
      const getDeviceConfig: any =
        await RFIDConnectModule.getDeviceConfigSetting();

      runInAction(() => {
        if (getDeviceConfig === null || getDeviceConfig === 'CONFIG_NONE') {
          this.deviceInfo = { ...DeviceConfig };
        } else {
          this.deviceInfo = getDeviceConfig;

          console.log('RequestDeviceConfig', this.deviceInfo);
        }
      });
    } catch (error) {
      console.log('RequestDeviceConfig error:', error);
    }
    return await this.deviceInfo;
  }

  async RequestModeVerify() {
    try {
      const getMode: any = await RFIDConnectModule.ModeVerify();

      runInAction(() => {
        this.mode = getMode;
      });
    } catch (error) {
      console.log('RequestModeVerify error', error);
    }
  }

  // SendSetDeviceConfig(configS: any) {
  //   const serialized = JSON.stringify(configS, null);
  //   RFIDConnectModule.setDeviceConfigSetting(serialized);
  // }

  SendSetBuzzerVol(devBuzzer: any) {
    RFIDConnectModule.setBuzzerVol(devBuzzer);
  }

  setBuzzerVol(buzzerVol: any) {
    try {
      runInAction(() => {
        this.deviceInfo.devBuzzer = buzzerVol;
      });
    } catch (error) {
      console.log('setBuzzerVol error:', error);
    }
  }

  SendSetVibrator(devVibState: any) {
    RFIDConnectModule.setVibrator(devVibState);
  }

  setVibrator(isOnOff: any) {
    try {
      runInAction(() => {
        this.deviceInfo.devVibState = isOnOff;
        console.log(this.deviceInfo);
      });
    } catch (error) {
      console.log('setVibrator error:', error);
    }
  }

  SendSetReadMode(devReadMode: any) {
    RFIDConnectModule.setReadMode(devReadMode);
  }

  setReadMode(isOnOff: any) {
    try {
      runInAction(() => {
        this.deviceInfo.devContinue = isOnOff;
      });
    } catch (error) {
      console.log('setReadMode error:', error);
    }
  }

  SendSetRadioPower(devRadio: any) {
    RFIDConnectModule.setRadioPower(devRadio);
  }

  setRadioPower(devRadio: any) {
    try {
      runInAction(() => {
        this.deviceInfo.devRadio = devRadio;
      });
    } catch (error) {
      console.log('setRadioPower error:', error);
    }
  }

  setBluetooth(sValue: string) {
    this.bluetoothInfo = sValue;
  }

  setBarcodeDataClear() {
    console.log("바코드 데이터 초기화");
    this.barcode = { type: 'READ_FAIL', result: 'READ_FAIL' };
  }

  setScanData(idx: number, isChk: boolean) {
    console.log('setScanData', idx, isChk);

    let count = 0;
    for (let i = 0; i < this.tagS.length; i++) {
      this.tagS[i]['isChek'] = false;
      //console.log(this.tagS[i]);
      // if (this.tagS[i]['isChek']) {
      //   count++;
      //   this.totalChkCount = count;
      // } else {
      //   this.totalChkCount = count;
      // }
    }

    this.tagS[idx]['isChek'] = isChk;

    if (this.tagS[idx]['isChek']) count++;
    else count = 0;

    this.totalChkCount = count;
  }

  SetSelectData() {
    for (let i = 0; i < this.tagS.length; i++) {
      if (this.tagS[i]['isChek']) {
        runInAction(() => {
          this.seletedDataS.push(this.tagS[i]);
        });
      }
    }
  }

  setChkOrUnChkAll(isChk: boolean) {
    for (let idx = 0; idx < this.tagS.length; idx++) {
      //this.setScanData(idx, isChk);

      this.tagS[idx]['isChek'] = isChk;
      let count = 0;
      for (let i = 0; i < this.tagS.length; i++) {
        if (this.tagS[i]['isChek']) {
          count++;
          this.totalChkCount = count;
        } else {
          this.totalChkCount = count;
        }
      }

      this.isTagAllChkState = isChk;
    }
  }

  setTagDataClear() {
    runInAction(() => {
      this.tagS = [];
      this.totalChkCount = 0;
    })
  }

  SetSelectDataClear() {
    console.log('select data clear');
    runInAction(() => {
      this.seletedDataS = [];
    });
  }
  get getBluetoothInfo() {
    return this.bluetoothInfo;
  }

  get getDeviceInfo(): any {
    return this.deviceInfo;
  }

  get isConnect() {
    return this.isRFIDConnect;
  }
  get isSearch() {
    return this.isSearchBluetooth;
  }
  get getScanData() {
    return this.tagS;
  }
  get getSelectedData() {
    return this.seletedDataS;
  }
  get getTagChkCount() {
    return this.totalChkCount;
  }

  get getChkState() {
    return this.isTagAllChkState;
  }
  get getMode() {
    return this.mode;
  }
  get getReadBarcodeData() {
    return this.barcode;
  }
  get getTag() {
    return this.tag;
  }
}
export default RFIDStore;
