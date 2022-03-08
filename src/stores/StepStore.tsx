import React, { useRef } from 'react';
import { NativeModules } from 'react-native';
import SwiperFlatList from 'react-native-swiper-flatlist';
import { makeObservable, observable, action, runInAction, computed } from 'mobx';
const { RFIDConnectModule } = NativeModules;

const step_page = [
  { label: 'RFID', value: 0 },
  { label: 'TAG', value: 1 },
  { label: 'BARCODE', value: 2 },
  { label: 'MOLDINFO', value: 3 },
];

class StepStore {
  stepState = 0;
  selectTagid = 0;
  scrollindex = 0;
  moldPageInfo = '';
  isNoticeVisible: boolean = false;
  //loading control

  constructor() {
    makeObservable(this, {
      //variable
      stepState: observable,
      selectTagid: observable,
      scrollindex: observable,
      moldPageInfo: observable,
      isNoticeVisible: observable,

      SetMoldPageInfo: action,
      SetStepState: action,
      SetSelectTagId: action,
      SetScrollIndex: action,

      SetNoticeVisible: action,

      getMoldPageInfo: computed,
      getSelectedTagId: computed,
      getScrollIndex: computed,
      getNoticeVisible: computed,
    });
  }

  SetMoldPageInfo(page: string) {
    try {
      runInAction(() => {
        this.moldPageInfo = page;
        console.log("변경된 페이지", this.moldPageInfo);

      });
    } catch (error) {
      console.log('SetMoldPageInfo', error);
    }
  }

  SetScrollIndex(curridx: any) {
    try {
      runInAction(() => {
        this.scrollindex = curridx;
      });
    } catch (error) {
      console.log('SetScrollIndex', error);
    }
  }

  SetSelectTagId(itmeID: any) {
    try {
      runInAction(() => {
        this.selectTagid = itmeID;
      });
    } catch (error) {
      console.log('SetSelectTagId', error);
    }
  }

  SetStepState(state: any) {
    try {
      runInAction(() => {
        this.stepState = state;
      });
    } catch (error) {
      console.log('SetStepState', error);
    }
  }

  SetNoticeVisible(isVislbe: boolean) {
    try {
      runInAction(() => {
        this.isNoticeVisible = isVislbe;
      });
    } catch (error) {
      console.log('SetStepState', error);
    }
  }

  get getSelectedTagId(): number {
    return this.selectTagid;
  }
  get getScrollIndex(): number {
    return this.scrollindex;
  }
  get getMoldPageInfo(): string {
    return this.moldPageInfo;
  }

  get getNoticeVisible(): boolean {
    return this.isNoticeVisible;
  }
}

export default StepStore;
