import axios from 'axios';
import { makeObservable, observable, action, runInAction, computed } from 'mobx';
import { baseURL } from '../components/Sever/Sever';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const urls = {

  moldClearUpdate: `${baseURL}/mold/`,

  moldSelect: `${baseURL}/mold`,
  moldSelectOne: `${baseURL}/mold/selectone`,

  moldinAdd: `${baseURL}/moldin`,
  moldinAble: `${baseURL}/moldin/inAbleMolds`,
  moldInList: `${baseURL}/moldin/`,

  moldoutAdd: `${baseURL}/moldout/`, //put
  moldoutAble: `${baseURL}/moldin/outAbleMolds`, //get
  moldOutList: `${baseURL}/moldout/`, //get

  rackList: `${baseURL}/rack/barcode`,
  login: `${baseURL}/user/login`,
  rackSearch: `${baseURL}/mold/position`,
};

export interface MoldMasterEntitiy {
  corpCode?: string,
  factoryCode?: string,
  rack?: string,
  moldCode?: string,
  moldName?: string,
  rfid?: string,
  cavity?: string,
  grade?: string,
  family?: string,
  carMaps?: string,
  partGbm?: string,
  startDt?: string,
  endDt?: string,
  moldType?: string,
  routCode?: string,
  routEtc?: string,
  moldStatus?: string,
  createUser?: string,
  createDt?: Date,
  updateUser?: string,
  updateDt?: Date,
  moldProductionSite?: string,
  lifeCnt?: string,
  totalCnt?: string,
  positionCompany?: string,
  positionFactory?: string,
  cateCode?: string,
  positionRack?: string,
  shotCnt?: string,
  sapCode?: string,
  assetGubun?: string,
  methodType?: string,
  multy?: string,
  partGubun?: string,
  hkmcDt?: string,
  hkmcAsset?: string,
  hkmcVendorNo?: null,
  manager?: string,
  managerTel?: string,
  positionManager?: string,
  positionManagerTel?: string,
  ton?: string,
  color?: string,
  weight?: string,
  horizontal?: string,
  vertical?: string,
  height?: string,
  editCnt?: string,
  remark?: string,
  useYn?: string,
  carName?: string,
  moldPositionName?: string,
  inPosition?: string,
  gubun?: string,
  isClear?: string,
  totalCount?: string,
  returnValue?: string,
}

export interface MoldOutEntry {
  state?: string;
  dt?: string;
  seq?: string;
  corpCode?: string;
  factoryCode?: string;
  rfid?: string;
  outDt?: string;
  pinCorpCode?: string;
  pinFactoryCode?: string;
  pinDt?: string;
  pinSeq?: string;
  outPosition?: string;
  outSeq?: string;
  outCorpCode?: string;
  outFactoryCode?: string;
  outUser?: string;
  outGubun?: string;
  outTime?: Date;
  updateUserId?: string;
  gubunName?: string;
  [prop: number]: any;
}

export interface MoldInEntry {
  corpCode?: string;
  inCorpCode?: string;
  factoryCode?: string;
  inFactoryCode?: string;
  rfid?: string;
  state?: string;
  inDt?: string;
  dt?: string;
  seq?: string;
  inUser?: string;
  inPosition?: string;
  inTime?: Date;
  inGubun?: string;
  createUserId?: string;
  updateUserId?: string;
  gubunName?: string;
}

export interface dayType {
  id: number;
  day: string;
  time: string;
}

export interface rackinfo {
  id?: string,
  pos?: string
}

class MoldInStore {
  moldMasterData: any = {} // 마스터에 등록된 RFID 용
  moldMasterDataS: any[] = [];
  // 입고이력
  moldInDataList: any[] = [];
  moldInAbleData: MoldInEntry | undefined[] = [];
  moldInTempData: MoldInEntry = {};
  // 출고이력
  moldOutDataList: any[] = [];
  moldOutAbleData: MoldOutEntry | undefined[] = [];
  moldOutTempData: MoldOutEntry = {};

  searchBarcodeData: any = {};
  serachRackPostion: any = {};

  isMoldal: boolean = false;

  rackinfo: rackinfo = {};

  constructor() {
    makeObservable(this, {
      //variable
      moldMasterDataS: observable,
      moldMasterData: observable,
      moldInAbleData: observable,
      moldInTempData: observable,
      moldInDataList: observable,
      moldOutTempData: observable,
      moldOutAbleData: observable,
      moldOutDataList: observable,
      searchBarcodeData: observable,
      serachRackPostion: observable,

      isMoldal: observable,
      rackinfo: observable,

      moldIsClearUpdate: action,
      moldMasterList: action,
      moldSelectOne: action,
      inAbleMolds: action,
      addMoldIn: action,
      searchMoldInList: action,
      outAbleMolds: action,
      addMoldOut: action,
      searchMoldOutList: action,
      rackList: action,
      rackPosition: action,

      //set
      SetMoldInData: action,
      SetMoldOutData: action,
      SetMoldMasterData: action,
      SetMoldModalVisible: action,
      SetRackinfo: action,

      //get
      getMoldMasterData: computed,
      getMoldInTempData: computed,
      getMoldinAbleData: computed,
      getMoldInDataList: computed,
      getMoldOutTempData: computed,
      getMoldoutAbleData: computed,
      getMoldOutDataList: computed,
      getMoldMasterList: computed,
      getBarcodeData: computed,
      getModalStatuse: computed,
      getRackinfo: computed,
      getRackPostion: computed
    });
  }

  SetRackinfo(id: string, pos: string) {
    runInAction(() => {
      this.rackinfo.id = id;
      this.rackinfo.pos = pos;

      console.log("this.rackinfo", this.rackinfo);

    })
  }

  get getRackinfo() {
    return this.rackinfo;
  }


  SetMoldModalVisible(isVisible: boolean) {
    runInAction(() => {
      this.isMoldal = isVisible;
    })
  }
  get getModalStatuse() {
    return this.isMoldal;
  }

  async Login() {
    try {
      const response = await axios.post(urls.login, { corpCode: "PH", userId: "admin", userPw: "11111" });
      runInAction(() => {
        if (response.data !== null || response.data !== undefined) {
          const user = response.data;

          console.log("로그인 부분 확인용 ", user.token, user.menuAuthDic);

          AsyncStorage.setItem("auth-token", user.token);
          AsyncStorage.setItem("menu-auth", JSON.stringify(user.menuAuthDic));

          console.log("로그인됨");

        }
        else {
          console.log("로그인 안됨");
        }

      });
    } catch (err) {
      console.log(err);
    }
  }


  async rackList() {
    try {
      const response = await axios.get(urls.rackList);
      runInAction(() => {
        if (response.data !== null || response.data !== undefined)
          this.searchBarcodeData = response.data;
        console.log("rackList : ", this.searchBarcodeData);

      });
    } catch (err) {
      console.log(err);
    }
  }


  //금형마스터에 RFID의 세척 상태를 업데이트 해주는 함수
  async moldIsClearUpdate(rfid: string, corpCode: string, factoryCode: string, isClear: string,): Promise<any> {
    try {
      const response = await axios.post(urls.moldClearUpdate, { rfid: rfid, corpCode: corpCode, factoryCode: factoryCode, isClear: isClear });
      console.log("업데이트 진해오딤?", response);

    } catch (err) {
      console.log(err);
    }
  }

  async moldMasterList(): Promise<number> {
    //0 false, 1 true, -1 NetError
    let bOk = 0;
    try {
      const response = await axios.get(urls.moldSelect);
      //console.log('axios moldSelect', response.data);
      let tempData: any[] = response.data;
      runInAction(async () => {

        if (tempData === null || tempData === undefined || tempData.length === 0) {
          bOk = 0;
          console.log("값이 없을때");
          return await bOk;
        }
        else {
          this.moldMasterDataS = tempData;
          bOk = 1;
          return await bOk;
        }
      });
    } catch (err) {
      console.log(err);
      bOk = -1;
      return await bOk;
    }
    return await bOk;
  }

  SetMoldMasterData(filterTag: any) {
    runInAction(() => {
      this.moldMasterData = filterTag;
    })
  }
  //금형마스터에 RFID가 등록 되어있는지 확인 하는 함수
  async moldSelectOne(rfid: string): Promise<number> {

    //0 false, 1 true, -1 NetError
    let bOk = 0;
    try {
      const response = await axios.get(urls.moldSelectOne, {
        params: { rfid: rfid },
      });
      console.log('axios moldSelectOne', response.data);

      let tempData: any[] = response.data;
      runInAction(async () => {

        if (response.data === null || response.data === undefined || response.data === "" || tempData.length === 0) {
          bOk = 0;
          console.log("값이 없을때");
          return await bOk;
        }
        else {
          console.log('RFID :  ', rfid);
          this.moldMasterData = response.data;
          bOk = 1;
          return await bOk;
        }
        // if (Object.keys(this.moldMasterData).length === 0) {

        //   bOk = 0;
        //   return await bOk;
        // } else {
        //   bOk = 1;
        //   return await bOk;
        // }

      });
    } catch (err) {
      console.log(err);
      bOk = -1;
      return await bOk;
    }
    return await bOk;
  }

  async rackPosition(factoryCode: string, rfid: string) {
    try {
      const response = await axios.get(urls.rackSearch, {
        params: { factoryCode: factoryCode, moldRfid: rfid }
      });

      runInAction(() => {
        this.serachRackPostion = response.data;
        console.log("rackPosition", response.data);
      })
    }
    catch (err) {
      console.log("rackPosition", err);
    }
  }
  get getRackPostion() {
    return this.serachRackPostion
  }

  //입고가 가능한 금형 리스트
  async inAbleMolds(rfid: string) {
    console.log('RFID :  ', rfid);
    //0 false, 1 true, -1 NetError

    try {
      let response = await axios.get(urls.moldinAble);
      runInAction(() => {
        this.moldInAbleData = [];
        if (response.data.length > 0) {
          let MoldS = response.data;
          this.moldInAbleData = MoldS.filter((key: any, idx: number) => MoldS[idx]['rfid'] === rfid,);
          // //입고 가능한 목록에서 찾는 RFID가 없으면 0
          // if (Object.keys(this.moldInAbleData).length === 0) {
          //   console.log('axios inAbleMolds', this.moldInAbleData);
          // } else {
          //   console.log('axios inAbleMolds', this.moldInAbleData);
          // }
        }
      });
    } catch (err) {
      console.log(err);
    }
  }

  //출고가 가능한 금형 리스트
  async outAbleMolds(rfid: string): Promise<number> {
    console.log('RFID :  ', rfid);
    //0 false, 1 true, -1 NetError
    let bOk = 0;
    try {
      const response = await axios.get(urls.moldoutAble);
      runInAction(async () => {
        this.moldOutAbleData = [];
        if (response.data.length > 0) {
          console.log("outAbleMolds", response.data);


          let MoldS = response.data;
          this.moldOutAbleData = MoldS.filter(
            (key: any, idx: number) => MoldS[idx]['rfid'] === rfid,
          );

          //출고 가능한 목록에서 찾는 RFID가 없으면 0
          if (Object.keys(this.moldOutAbleData).length === 0) {
            bOk = 0;
            return await bOk;
          } else {
            console.log('axios outAbleMolds', this.moldOutAbleData);
            bOk = 1;
            return await bOk;
          }
        } else {
          bOk = 0;
          return await bOk;
        }
      });
    } catch (err) {
      console.log(err);
      bOk = -1;
      return await bOk;
    }
    return await bOk;
  }

  //입고이력
  async searchMoldInList(): Promise<number> {
    //0 false, 1 true, -1 NetError
    let bOk = 0;
    try {
      this.moldInDataList = [];
      const response = await axios.get(urls.moldInList, {});
      //console.log('axios serachMoldInList', response.data);

      runInAction(async () => {
        if (response.data.length > 0) {
          this.moldInDataList = response.data;
        }
        //출고 가능한 목록에서 찾는 RFID가 없으면 0
        if (Object.keys(this.moldInDataList).length === 0) {
          bOk = 0;
          return await bOk;
        } else {
          console.log('axios outAbleMolds', this.moldOutAbleData);
          bOk = 1;
          return await bOk;
        }
      });
    } catch (err) {
      console.log(err);
    }
    return await bOk;
  }

  //DB Mold in 추가
  addMoldIn = async (data: MoldInEntry) => {
    console.log('들어온addMold', data);
    try {

      const token = await AsyncStorage.getItem("auth-token");
      //console.log("token", token);
      const headers = { Authorization: `Bearer ${token}` }
      console.log("headers", headers);

      const response = await axios.put(urls.moldinAdd, { ...data }, { headers });
      console.log(response.data);
    } catch (err) {
      console.log('여기 들어오는지 확인 ', err);
    }
  };

  //DB Mold out 추가
  addMoldOut = async (data: MoldOutEntry) => {
    console.log('들어온addout', data);
    try {
      const response = await axios.put(urls.moldoutAdd, {
        ...data,
      });
      console.log(response.data);
    } catch (err) {
      console.log('여기 들어오는지 확인 ', err);
    }
  };

  //출고이력
  async searchMoldOutList(): Promise<any> {
    //jjk, 21.12.22
    //0 false, 1 true, -1 NetError
    let bOk = 0;
    try {
      this.moldOutDataList = [];
      const response = await axios.get(urls.moldOutList, {});
      runInAction(async () => {
        if (response.data.length > 0) {
          this.moldOutDataList = response.data;
        }
        //출고 가능한 목록에서 찾는 RFID가 없으면 0
        if (Object.keys(this.moldOutDataList).length === 0) {
          bOk = 0;
          return await bOk;
        } else {
          console.log('axios outAbleMolds', this.moldOutAbleData);
          bOk = 1;
          return await bOk;
        }
      });
    } catch (err) {
      console.log(err);
    }
    return await bOk;
  }

  SetMoldInData(tempData: MoldInEntry) {
    runInAction(() => {
      this.moldInTempData = { ...tempData };
      console.log(" this.moldInTempData", this.moldInTempData);

    })
  }

  // SetMoldInData(category: string, itemValue: any) {
  //   runInAction(() => {
  //     switch (category) {
  //       case 'state':
  //         this.moldInTempData.state = itemValue;
  //         break;
  //       case 'inDt':
  //         this.moldInTempData.inDt = itemValue;
  //         break;
  //       case 'rfid':
  //         this.moldInTempData.rfid = itemValue;
  //         break;
  //       case 'dt':
  //         this.moldInTempData.dt = itemValue;
  //         break;
  //       case 'inTime':
  //         this.moldInTempData.inTime = itemValue;
  //         break;
  //       case 'inCorpCode':
  //         this.moldInTempData.inCorpCode = itemValue;
  //         break;
  //       case 'corpCode':
  //         this.moldInTempData.corpCode = itemValue;
  //         break;
  //       case 'factoryCode':
  //         this.moldInTempData.factoryCode = itemValue;
  //         break;
  //       case 'inFactoryCode':
  //         this.moldInTempData.inFactoryCode = itemValue;
  //         break;
  //       case 'seq':
  //         this.moldInTempData.seq = itemValue;
  //         break;
  //       case 'inUser':
  //         this.moldInTempData.inUser = itemValue;
  //         break;
  //       case 'inPosition':
  //         this.moldInTempData.inPosition = itemValue;
  //         break;
  //       case 'inGubun':
  //         this.moldInTempData.inGubun = itemValue;
  //         break;
  //       case 'gubunName':
  //         this.moldInTempData.gubunName = itemValue;
  //         break;
  //       default:
  //         break;
  //     }
  //   });
  // }

  SetMoldOutData(category: string, itemValue: any) {
    runInAction(() => {
      switch (category) {
        case 'pinCorpCode': //inCorpCode
          this.moldOutTempData.pinCorpCode = itemValue;
          break;
        case 'pinDt': //inDt
          this.moldOutTempData.pinDt = itemValue;
          break;
        case 'pinFactoryCode': //infactory
          this.moldOutTempData.pinFactoryCode = itemValue;
          break;
        case 'pinSeq': //inSeq
          this.moldOutTempData.pinSeq = itemValue;
          break;
        case 'state':
          this.moldOutTempData.state = itemValue;
          break;
        case 'seq':
          this.moldOutTempData.seq = itemValue;
          break;
        case 'rfid':
          this.moldOutTempData.rfid = itemValue;
          break;
        case 'dt':
          this.moldOutTempData.dt = itemValue;
          break;
        case 'outSeq':
          this.moldOutTempData.outSeq = itemValue;
          break;
        case 'outDt':
          this.moldOutTempData.outDt = itemValue;
          break;
        case 'outTime':
          this.moldOutTempData.outTime = itemValue;
          break;
        case 'outCorpCode':
          this.moldOutTempData.outCorpCode = itemValue;
          break;
        case 'corpCode':
          this.moldOutTempData.corpCode = itemValue;
          break;
        case 'factoryCode':
          this.moldOutTempData.factoryCode = itemValue;
          break;
        case 'outFactoryCode':
          this.moldOutTempData.outFactoryCode = itemValue;
          break;
        case 'outUser':
          this.moldOutTempData.outUser = itemValue;
          break;
        case 'outPosition':
          this.moldOutTempData.outPosition = itemValue;
          break;
        case 'outGubun':
          this.moldOutTempData.outGubun = itemValue;
          break;
        case 'gubunName':
          this.moldOutTempData.gubunName = itemValue;
          break;
        case 'updateUserId':
          this.moldOutTempData.updateUserId = itemValue;
          break;
        default:
      }
    });
  }

  get getMoldMasterData() {
    return this.moldMasterData;
  }

  get getMoldInTempData() {
    return this.moldInTempData;
  }
  get getMoldinAbleData() {
    return this.moldInAbleData;
  }
  get getMoldInDataList() {
    return this.moldInDataList;
  }

  get getMoldOutTempData() {
    return this.moldOutTempData;
  }
  get getMoldoutAbleData() {
    return this.moldOutAbleData;
  }
  get getMoldOutDataList() {
    return this.moldOutDataList;
  }
  get getMoldMasterList() {
    return this.moldMasterDataS;
  }
  get getBarcodeData() {
    return this.searchBarcodeData;
  }
}

export default MoldInStore;
