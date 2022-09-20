export let playStore: boolean = false;

export enum MODE {
    FM_MODE, // 정해진 시퀀스 대로 
    AM_MODE  // 자유롭게 
}

//jjk, 22.09.05 - 나중에 변경될것 감안해서 MODE를 나눔 FM / AM 
// 금형이동 시퀀스
// 사출기 → 금형반 → 일상점검/정기점검/수리완료 → 금형렉 or 사출기 이동
export let Custom_Mode: MODE = MODE.AM_MODE; //


export const tag: any = {
    count: 0,
    id: 1,
    isChek: false,
    moldName: undefined,
    value: "008869",
}

export const moldSelectOne: any = {
    cavity: 123,
    checksheetNo: "20220127000001",
    corpCode: "PH",
    createDt: "2022-02-08T00:00:00",
    editCnt: 0,
    factoryCode: "16",
    factoryCodeName: "현풍",
    grade: "S",
    gubun: "87",
    height: 0,
    horizontal: 0,
    lifeCnt: 0,
    maintainance: "48",
    moldName: "테스트",
    moldProductionSite: "18",
    rack: "17_1_3",
    rfid: "008869",
    sapCode: "123",
    totalCnt: 0,
    totalCount: 0,
    updateDt: "2022-02-08T00:00:00",
    useYn: "\u0000",
    vertical: 0,
    weight: 0,
}

export const barcodedata: any = {
    barcode: null,
    barcodeName: "A-1-3",
    corpCode: null,
    createDt: "2022-02-07T00:00:00",
    createUserId: "admin",
    factoryCode: "16",
    isUsed: 0,
    moldName: null,
    rackCode: "17_1_3",
    rackNumber: "17",
    rackNumberName: "RACK001",
    rackPosition: "1x3",
    rackSize: null,
    remark: null,
    returnValue: null,
    rfid: null,
    totalCount: 0,
    updateDt: "2022-02-07T00:00:00",
    updateUserId: "admin",
}



export const searchList: any[] = [
    { index: 1, rfid: '008801', moldName: '금형01', rack: 'a-1-1' },
    { index: 2, rfid: '008802', moldName: '금형02', rack: 'a-1-2' },
    { index: 3, rfid: '008803', moldName: '금형03', rack: 'a-1-3' },
    { index: 4, rfid: '008804', moldName: '금형04', rack: 'a-1-4' },
    { index: 5, rfid: '008805', moldName: '금형05', rack: 'a-1-5' },
    { index: 6, rfid: '008806', moldName: '금형06', rack: 'a-1-6' },
    { index: 7, rfid: '008807', moldName: '금형07', rack: 'a-1-7' },
    { index: 8, rfid: '008808', moldName: '금형08', rack: 'a-1-8' },
    { index: 9, rfid: '008809', moldName: '금형09', rack: 'a-1-9' },
    { index: 10, rfid: '008810', moldName: '금형10', rack: 'a-2-1' },
    { index: 11, rfid: '008811', moldName: '금형11', rack: 'a-2-2' },
    { index: 12, rfid: '008812', moldName: '금형12', rack: 'a-2-3' },
    { index: 13, rfid: '008813', moldName: '금형13', rack: 'a-2-4' },
    { index: 14, rfid: '008814', moldName: '금형14', rack: 'a-2-5' },
    { index: 15, rfid: '008815', moldName: '금형15', rack: 'a-2-6' },
    { index: 16, rfid: '008816', moldName: '금형16', rack: 'a-2-7' },
    { index: 17, rfid: '008817', moldName: '금형17', rack: 'a-2-8' },
    { index: 18, rfid: '008818', moldName: '금형18', rack: 'a-2-9' },
    { index: 19, rfid: '008819', moldName: '금형19', rack: 'a-3-1' },
    { index: 20, rfid: '008820', moldName: '금형20', rack: 'a-3-2' },
    { index: 21, rfid: '008821', moldName: '금형21', rack: 'a-3-3' },
    { index: 22, rfid: '008822', moldName: '금형22', rack: 'a-3-4' },
]