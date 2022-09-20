import React, { useEffect, useState } from 'react';
import { Text, View, StyleSheet, ScrollView, FlatList, TouchableOpacity, BackHandler } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
//import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { ProgressBar, ProgressBarInfoMode } from '../../components/Progress';
import stores from '../../stores';
import _ from 'lodash';
import { useIsFocused } from '@react-navigation/native';
import { observer, inject } from 'mobx-react';
import { MoldMasterEntitiy } from '../../stores/MoldInStore';
import { playStore, searchList } from '../../stores/PlayStoreData';
import { FloatingAction } from "react-native-floating-action";
import Icon from 'react-native-vector-icons/FontAwesome';
import { SearchDialog } from '../../components/Dialog';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import Mold_Info from './Mold_Info';
import { toJS } from 'mobx';

//jjk, 22.05.25 - 수정
const columns = [
    // { id: 0, key: 'index', colName: 'No.', width: 30, },
    { id: 0, key: 'rfid', colName: 'RFID', width: 80, },
    { id: 1, key: 'moldName', colName: '금형명', width: 195, },
    { id: 2, key: 'gubunName', colName: '위치', width: 80, },
];
const wait = (timeToDelay: any) => new Promise((resolve) => setTimeout(resolve, timeToDelay))
const CustomTable = () => {
    const [data, setData] = useState<any>(null);
    const [direction, setDirection] = useState(null);
    const [selectedColumn, setSelectedColumn] = useState(null);
    React.useEffect(() => {
        if (playStore) {
            setData(searchList);
        }
        else {
            const searchMoldInList = async () => {
                await stores.MoldStore.inAbleMoldList();
                console.log("1. 입고 가능한 목록 조회");
                await stores.MoldStore.moldMasterList();
                console.log("2. 전체 등록된 금형 목록 조회");
                if (stores.MoldStore.getMoldInAbleDataList !== null || stores.MoldStore.getMoldInAbleDataList !== undefined) {
                    setData(stores.MoldStore.getMoldInAbleDataList);
                    stores.RFIDStore.SetModalVisible(false);
                }
            }
            searchMoldInList();
        }
    }, []);

    // useEffect(() => {

    //     if (data !== null) {
    //         const sortedData = _.orderBy(data, ['rfid', 'moldName'], ['desc', 'desc', 'desc']);
    //         setData(sortedData);
    //         stores.RFIDStore.SetModalVisible(false);

    //         console.log(sortedData);

    //     }
    //     // const test = async () => {
    //     //     await stores.MoldStore.inAbleMoldList();
    //     //     console.log(stores.MoldStore.getMoldInAbleDataList);

    //     // }

    //     // test();
    // }, [stores.MoldStore.getMoldInAbleDataList]);


    // React.useEffect(() => {
    //     if (playStore) {
    //         setData(searchList);
    //     }
    //     else {
    //         async function searchMoldInList() {

    //             console.log("반복 되는지 확인하기 ");

    //             let bOk = await stores.MoldStore.moldMasterList();
    //             if (bOk === 0) {
    //                 stores.RFIDStore.SetModalVisible(false);
    //             } else {
    //                 let moldData = stores.MoldStore.getMoldMasterList;
    //                 if (moldData.length > 0)
    //                     setData(moldData);
    //                 stores.RFIDStore.SetModalVisible(false);
    //             }
    //         }
    //         searchMoldInList();
    //     }
    // }, []);

    // useEffect(() => {

    //     if (data !== null) {
    //         const sortedData = _.orderBy(data, ['rfid', 'moldName'], ['desc', 'desc', 'desc']);
    //         setData(sortedData);
    //         stores.RFIDStore.SetModalVisible(false);


    //     }
    //     const test = async () => {
    //         await stores.MoldStore.inAbleMoldList();
    //         console.log(stores.MoldStore.getMoldInDataList);

    //     }

    //     test();
    // }, [stores.MoldStore.getMoldInAbleDataList]);

    const sortTable = (colName: any, direction: any) => {

        const newDirection: any = direction === 'desc' ? 'asc' : 'desc'; //asc오름,desc내림
        setDirection(newDirection);
        setSelectedColumn(colName);
        SortValue(colName, direction);
    };

    const SortValue = (colName: any, direction: any) => {
        const sortedData = _.orderBy(data, [colName], [direction]);
        setData(sortedData);
    };

    const TableHeader = () => (
        <View style={styles.tableHeader}>
            {columns?.map(item => {
                if (item === undefined || item === null) return <></>;
                else {
                    return (
                        <TouchableOpacity
                            key={item.id}
                            style={{ ...styles.columnHeader, borderWidth: 1, height: 40, width: item.width, borderColor: '#E2E3E5', }}
                            onPress={() => {
                                sortTable(item.key, direction);
                            }}>
                            <Text style={styles.columnHeaderTxt}>
                                {item.colName}
                                {selectedColumn === item.key && (
                                    <MaterialCommunityIcons size={18} name={direction === 'desc' ? 'arrow-down-drop-circle' : 'arrow-up-drop-circle'} />
                                )}
                            </Text>
                        </TouchableOpacity>
                    );
                }
            })}
        </View>
    );

    const TableRowItem = () => {
        if (playStore) {
            return (<View style={styles.container}>
                <ScrollView horizontal={true}>
                    <FlatList
                        data={data}
                        keyExtractor={(item, index) => index.toString()}
                        ListHeaderComponent={<TableHeader />}
                        stickyHeaderIndices={[0]}
                        renderItem={({ item, index }: any) => {
                            console.log(item);

                            return (
                                <View key={index} style={[styles.tableRow, { backgroundColor: '#FFF' }]}>
                                    <View style={[styles.rowRect, { width: columns[0]['width'] }]}>
                                        <Text style={[styles.columnRowTxt, { width: columns[0]['width'] }]}>
                                            {/* {index + 1} */}
                                            {item.rfid}
                                        </Text>
                                    </View>
                                    <View style={[styles.rowRect, { width: columns[1]['width'] }]}>
                                        <Text style={[styles.columnRowTxt, { width: columns[1]['width'] }]}>
                                            {/* {item.rfid} */}
                                            {item.moldName}
                                        </Text>
                                    </View>
                                    <View style={[styles.rowRect, { width: columns[2]['width'] }]}>
                                        <Text style={[styles.columnRowTxt, { width: columns[2]['width'] }]}>
                                            {/* {item.moldName} */}
                                            {item.rack}
                                        </Text>
                                    </View>
                                    {/* <View style={[styles.rowRect, { width: columns[3]['width'] }]}>
                                        <Text style={[styles.columnRowTxt, { width: columns[3]['width'] }]}>
                                            {item.rack}
                                        </Text>
                                    </View> */}
                                </View>
                            );
                        }}
                    />
                </ScrollView>
            </View>)
        }
        else {
            return (
                <View style={styles.container}>
                    <ScrollView horizontal={true}>
                        <FlatList
                            data={data}
                            keyExtractor={(item, index) => index.toString()}
                            ListHeaderComponent={<TableHeader />}
                            stickyHeaderIndices={[0]}
                            renderItem={({ item, index }: any) => {
                                return (
                                    <View
                                        key={index}
                                        style={[styles.tableRow, { backgroundColor: '#FFF' }]}>
                                        <View style={[styles.rowRect, { width: columns[0]['width'] }]}>
                                            <Text style={[styles.columnRowTxt, { width: columns[0]['width'] }]}>
                                                {/* {index + 1} */}
                                                {item.rfid}
                                            </Text>
                                        </View>
                                        <View style={[styles.rowRect, { width: columns[1]['width'] }]}>
                                            <Text numberOfLines={3} ellipsizeMode="tail" style={[styles.columnRowTxt, { width: columns[1]['width'] }]}>
                                                {/* {item.rfid} */}
                                                {item.moldName}
                                            </Text>
                                        </View>
                                        <View style={[styles.rowRect, { width: columns[2]['width'] }]}>
                                            <Text numberOfLines={3} ellipsizeMode="tail" style={[styles.columnRowTxt, { color: 'red' }, { width: columns[2]['width'] }]}>
                                                {
                                                    item.gubunName === "RACK" ? item.positionDetailName :
                                                        item.gubunName === "금형반" ? item.gubunName :
                                                            item.gubunName !== null && item.positionName !== null ? `${item.gubunName}\n${item.positionName}` : ''
                                                }
                                            </Text>
                                        </View>
                                        {/* <View style={[styles.rowRect, { width: columns[3]['width'] }]}>
                                            <Text
                                                style={[styles.columnRowTxt, { width: columns[3]['width'] }]}>
                                                {item.rack}
                                            </Text>
                                        </View> */}
                                    </View>
                                );
                            }}
                        />
                    </ScrollView>
                </View>
            );
        }
    };

    if (data === undefined) {
        console.log('data undfined');
        return <></>;
    } else if (data === null) {
        return (
            <>
                <View style={{ flex: 1, paddingBottom: 30, justifyContent: 'center', alignContent: 'center', }}>
                    <Text
                        style={{ justifyContent: 'center', alignContent: 'center', textAlign: 'center', fontSize: 20 }}>
                        {'- DB Connected Error\nData가 없습니다.'}
                    </Text>
                </View>
            </>
        );
    } else {
        return <TableRowItem />;
    }
};
const ObserverCustomTable = observer(CustomTable);
const ObserverProgressBar = observer(ProgressBar);
const MoldSearch = (props: { navigation: any }) => {
    const [modalVisible, setModalVisible] = useState(false);
    useEffect(() => {
        return () => stores.RFIDStore.SetModalVisible(false);
    }, []);

    useEffect(() => {
        if (stores.RFIDStore.getScanData.length === 1) {
            SearchScanData();
        }
    }, [stores.RFIDStore.getScanData]);

    useEffect(() => {
        if (stores.RFIDStore.getIsGunPress) {
            const ModalVisible = async () => {
                stores.RFIDStore.SetModalVisible(true);
            }
            ModalVisible();
        }
    }, [stores.RFIDStore.getIsGunPress])

    const SearchAutocompleateData = async (searchRfid: any) => {
        const array = Object.values(stores.MoldStore.getMoldInAbleDataList);
        let searchRFID = array.filter((x: any) => x.rfid === searchRfid.id);

        await MoveToMoldInfoPage(searchRFID);
    }

    const SearchScanData = async () => {
        if (stores.RFIDStore.getScanData.length === 1) {
            //let searchRFID = stores.MoldStore.getMoldMasterList.filter(x => x.rfid === stores.RFIDStore.getTag)

            const array = Object.values(stores.MoldStore.getMoldInAbleDataList);
            let searchRFID = array.filter((x: any) => x.rfid === stores.RFIDStore.getTag);
            await MoveToMoldInfoPage(searchRFID);
        }
    }

    const MoveToMoldInfoPage = async (searchRFID: any) => {

        if (searchRFID.length === 0) {
            await stores.RFIDStore.SendToastMessage('등록된 RFID정보가 없습니다.\n웹페이지에서 RFID를 등록하여 주십시오.');
            stores.RFIDStore.setTagDataClear();
            stores.RFIDStore.SetGunPress(false);
            stores.RFIDStore.SetModalVisible(false);
            return;
        }

        await stores.MoldStore.inAbleMolds(searchRFID[0].rfid);
        const inAbleReslut: any = stores.MoldStore.getMoldinAbleData;

        if (inAbleReslut.length === 0) {
            stores.RFIDStore.SendToastMessage("TAG : " + searchRFID[0].rfid + "\n\nWeb에서 금형 입/출고목록을 확인하여주십시오.\n");
            stores.RFIDStore.setTagDataClear();
            stores.RFIDStore.SetGunPress(false);
            stores.RFIDStore.SetModalVisible(false);
        }
        else if (searchRFID.length > 0) {

            const defualtRfid = stores.MoldStore.getMoldMasterList.filter(x => x.rfid === searchRFID[0].rfid);
            console.log("!!!!!!!!!!!!!!!!!", defualtRfid);
            stores.MoldStore.SetMoldMasterData(defualtRfid);
            stores.RFIDStore.SendToastMessage("       TAG : " + searchRFID[0].rfid + "\n\n상세정보를 불러옵니다.\n잠시만 기다려주세요.")
            //stores.StepStore.SetMoldPageInfo('Mold_Info');
            stores.RFIDStore.SendDisBarcodeHandler();
            stores.RFIDStore.SendDisRFIDHandler();
            stores.RFIDStore.setTagDataClear();
            stores.RFIDStore.SetGunPress(false);
            await props.navigation.navigate('StackMoldInfo');
            stores.RFIDStore.SetModalVisible(false);
        }
    }

    const init = () => {
        return new Promise<void>(async (resolve, reject) => {

            try {
                stores.RFIDStore.SetModalVisible(true);
                await stores.RFIDStore.SendDisBarcodeHandler();
                await stores.RFIDStore.SendDisRFIDHandler();
                await stores.RFIDStore.SendSetRFIDHandler();
                await stores.RFIDStore.RequestModeVerify();

                if (stores.RFIDStore.getScanData.length > 0) {
                    stores.RFIDStore.setScanData(stores.StepStore.getSelectedTagId, false);
                    stores.RFIDStore.SetSelectDataClear();
                }

                if (stores.RFIDStore.getReadBarcodeData.result !== "READ_FAIL")
                    await stores.RFIDStore.setBarcodeDataClear();

                if (stores.RFIDStore.getMode === 1) {
                    await stores.RFIDStore.SendSetScanMode(0);
                }
                resolve();

            } catch (error) {
                console.log(error);
                reject();
            }

        });
    }

    const isFocused = useIsFocused();
    React.useEffect(() => {
        if (isFocused) {
            init();
            const backAction = () => {
                props.navigation.navigate('DrawerHome');
                return true;
            };

            const backHandler = BackHandler.addEventListener(
                'hardwareBackPress',
                backAction,
            );
            return () => backHandler.remove();
        }
    }, [isFocused]);


    const customActionItem = () => {
        return (
            <View key={'bt_Search'} style={{ left: 5, paddingBottom: 25, flexDirection: 'column', justifyContent: 'center' }}>
                <View style={{ backgroundColor: 'transparent', top: 60 }}>
                    <Icon name="circle" size={60} color="#082332" />
                </View>
                <View style={{ backgroundColor: 'transparent', top: 14, paddingLeft: 12 }}>
                    <Icon name="search" size={27} color="white" />
                </View>
            </View>
        )
    }
    const actions = [
        { name: "bt_Search", position: 1, render: customActionItem },
    ];

    const searchModal = (name: string) => {
        setModalVisible(true);
    }
    const getSerachModalVisible = (visible: boolean) => {
        setModalVisible(visible);
    };

    const getSerachResult = (rfid: any) => {
        SearchAutocompleateData(rfid)
    }

    return (
        <View style={styles.container}>
            <ObserverProgressBar visible={stores.RFIDStore.getVisible} />
            <Text style={{ marginVertical: 10, textAlign: 'center', fontFamily: 'NanumSquareEB', color: '#808080', fontSize: 20, }}>
                금형 조회
            </Text>
            <ObserverCustomTable />
            <FloatingAction
                color={'#082332'}
                actions={actions}
                onPressItem={name => { searchModal(name) }}
                distanceToEdge={{ vertical: 15, horizontal: 15 }}
                actionsPaddingTopBottom={5}
            />
            <SearchDialog modalVisible={modalVisible} SendDailogState={getSerachModalVisible} RequestSearchResult={getSerachResult} />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        paddingTop: 1,
        paddingLeft: 1,
        paddingRight: 1,
        flex: 1,
        backgroundColor: '#ffffff',
    },
    tableHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#082332',
        height: 40,
    },
    columnHeader: {
        width: 150,
        justifyContent: 'center',
        alignItems: 'center',
    },
    columnHeaderTxt: {
        color: '#F9F9F9',
        fontWeight: 'bold',
        fontSize: 15,
    },
    columnRowTxt: {
        width: 150,
        textAlign: 'center',
        fontSize: 13,
        color: '#5D5D5D',
    },
    tableRow: {
        flexDirection: 'row',
        height: 40,
        alignItems: 'center',
    },
    rowRect: {
        flex: 1,
        borderWidth: 1,
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        height: 40,
        borderColor: '#E2E3E5',
    },
});

export default inject('navigation')(observer(MoldSearch));