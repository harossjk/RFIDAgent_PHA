export interface DeviceObject {
  devName: string;
  devMacAdrr: string;
  devBuzzer: number;
  devVibState: number;
  devRadio: number;
  devContinue: number;
}

export const DeviceConfig: DeviceObject = {
  devName: 'NONE',
  devMacAdrr: 'NONE',
  devBuzzer: 1,
  devVibState: 0,
  devRadio: 0,
  devContinue: 1,
};

export const TAG_HAD_NUMBER = '5038106628';

//DeviceConfig;
