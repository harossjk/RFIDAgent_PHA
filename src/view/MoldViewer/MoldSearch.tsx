import React, { useEffect, useState } from 'react';
import { Text, View, StyleSheet, ScrollView, FlatList, TouchableOpacity, BackHandler } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { ProgressBar, ProgressBarInfoMode } from '../../components/Progress';
import stores from '../../stores';
import _ from 'lodash';
import { useIsFocused } from '@react-navigation/native';
import { observer, inject } from 'mobx-react';
import { MoldMasterEntitiy } from '../../stores/MoldInStore';
import { playStore, searchList } from '../../stores/PlayStoreData';

const columns = [
    { id: 0, key: 'index', colName: 'No.', width: 50, },
    { id: 1, key: 'rfid', colName: 'RFID', width: 100, },
    { id: 2, key: 'moldName', colName: '금형명', width: 200, },
    { id: 3, key: 'rack', colName: '위치', width: 100, },
];

const CustomTable = () => {
    const [data, setData] = useState<any>(null);
    const [direction, setDirection] = useState(null);
    const [selectedColumn, setSelectedColumn] = useState(null);

    React.useEffect(() => {
        if (playStore) {
            setData(searchList);
        }
        else {
            async function searchMoldInList() {
                let bOk = await stores.MoldStore.moldMasterList();
                if (bOk === 0) {
                    stores.RFIDStore.SetModalVisible(false);
                } else {
                    let moldData = stores.MoldStore.getMoldMasterList;
                    if (moldData.length > 0)
                        setData(moldData);
                    stores.RFIDStore.SetModalVisible(false);
                }
            }
            searchMoldInList();
        }
    }, []);

    useEffect(() => {
        if (data !== null) {
            const sortedData = _.orderBy(data, ['rfid', 'moldName'], ['desc', 'desc', 'desc']);
            setData(sortedData);
            stores.RFIDStore.SetModalVisible(false);
        }
    }, [stores.MoldStore.getMoldInDataList]);

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
                            style={{ ...styles.columnHeader, borderWidth: 1, height: 50, width: item.width, borderColor: '#E2E3E5', }}
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
                            return (
                                <View key={index} style={[styles.tableRow, { backgroundColor: '#FFF' }]}>
                                    <View style={[styles.rowRect, { width: columns[0]['width'] }]}>
                                        <Text style={[styles.columnRowTxt, { width: columns[0]['width'] }]}>
                                            {index + 1}
                                        </Text>
                                    </View>
                                    <View style={[styles.rowRect, { width: columns[1]['width'] }]}>
                                        <Text style={[styles.columnRowTxt, { width: columns[1]['width'] }]}>
                                            {item.rfid}
                                        </Text>
                                    </View>
                                    <View style={[styles.rowRect, { width: columns[2]['width'] }]}>
                                        <Text style={[styles.columnRowTxt, { width: columns[2]['width'] }]}>
                                            {item.moldName}
                                        </Text>
                                    </View>
                                    <View style={[styles.rowRect, { width: columns[3]['width'] }]}>
                                        <Text style={[styles.columnRowTxt, { width: columns[3]['width'] }]}>
                                            {item.rack}
                                        </Text>
                                    </View>
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
                                            <Text
                                                style={[styles.columnRowTxt, { width: columns[0]['width'] }]}>
                                                {index + 1}
                                            </Text>
                                        </View>
                                        <View style={[styles.rowRect, { width: columns[1]['width'] }]}>
                                            <Text
                                                style={[styles.columnRowTxt, { width: columns[1]['width'] }]}>
                                                {item.rfid}
                                            </Text>
                                        </View>
                                        <View style={[styles.rowRect, { width: columns[2]['width'] }]}>
                                            <Text
                                                style={[styles.columnRowTxt, { width: columns[2]['width'] }]}>
                                                {item.moldName}
                                            </Text>
                                        </View>
                                        <View style={[styles.rowRect, { width: columns[3]['width'] }]}>
                                            <Text
                                                style={[styles.columnRowTxt, { width: columns[3]['width'] }]}>
                                                {item.rack}
                                            </Text>
                                        </View>
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

const MoldSearch = (props: { navigation: any }) => {
    const [isScan, setisScan] = useState(false);
    const [isGunPress, setIsGunPress] = useState(false);
    useEffect(() => {
        if (stores.RFIDStore.getScanData.length === 1) {
            MoveToMoldInfo();
        }

    }, [stores.RFIDStore.getScanData]);

    useEffect(() => {
        if (stores.RFIDStore.getIsGunPress)
            stores.RFIDStore.SetModalVisible(true);
    }, [stores.RFIDStore.getIsGunPress])

    const MoveToMoldInfo = async () => {
        if (stores.RFIDStore.getScanData.length === 1) {
            let searchRFID = stores.MoldStore.getMoldMasterList.filter(x => x.rfid === stores.RFIDStore.getTag)
            if (searchRFID.length === 0) {
                stores.RFIDStore.SendToastMessage('등록된 RFID정보가 없습니다.\n웹페이지에서 RFID를 등록하여 주십시오.');
                stores.RFIDStore.setTagDataClear();
                stores.RFIDStore.SetGunPress(false);
                stores.RFIDStore.SetModalVisible(false);
                console.log("여기됨?");
                setTimeout(async () => {


                }, 2000);
                return;
            } else if (searchRFID.length > 0) {
                stores.MoldStore.SetMoldMasterData(searchRFID);

                stores.RFIDStore.SendToastMessage("       TAG : " + stores.RFIDStore.getTag + "\n\n상세정보를 불러옵니다.\n잠시만 기다려주세요.")
                stores.StepStore.SetMoldPageInfo('Mold_Info');
                stores.RFIDStore.SendDisBarcodeHandler();
                stores.RFIDStore.SendDisRFIDHandler();
                stores.RFIDStore.setTagDataClear();
                stores.RFIDStore.SetGunPress(false);
                stores.RFIDStore.SetModalVisible(false);

                await props.navigation.navigate('StackMoldInfo');
            }
        }
    }

    // useEffect(() => {
    //     if (isScan && !isGunPress) {
    //         console.log("!!!!!!!!!!!!!!", isScan, isGunPress);

    //     }
    //     // else if (stores.RFIDStore.getVisible && !isGunPress) {
    //     //     console.log("여기됨??2", isScan, isGunPress);
    //     //     stores.RFIDStore.SetScanSatuse(false);
    //     // }

    // }, [isScan, isGunPress])

    const init = () => {
        return new Promise<void>((resolve, reject) => {
            stores.RFIDStore.SetModalVisible(true);
            stores.RFIDStore.SendDisBarcodeHandler();
            stores.RFIDStore.SendDisRFIDHandler();
            stores.RFIDStore.SendSetRFIDHandler();
            stores.RFIDStore.RequestModeVerify();

            if (stores.RFIDStore.getScanData.length > 0) {
                stores.RFIDStore.setScanData(stores.StepStore.getSelectedTagId, false);
                stores.RFIDStore.SetSelectDataClear();
            }

            if (stores.RFIDStore.getReadBarcodeData.result !== "READ_FAIL")
                stores.RFIDStore.setBarcodeDataClear();

            if (stores.RFIDStore.getMode === 1) {
                stores.RFIDStore.SendSetScanMode(0);
            }

        });
    }

    useEffect(() => {
        init();
    }, [])

    const initComponet = async () => {
        await init();
    }

    const isFocused = useIsFocused();
    React.useEffect(() => {
        if (isFocused) {
            initComponet();
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
    return (
        <View style={styles.container}>
            <ProgressBar visible={stores.RFIDStore.getVisible} />
            <Text
                style={{
                    marginVertical: 10,
                    textAlign: 'center',
                    fontFamily: 'NanumSquareEB',
                    color: '#808080',
                    fontSize: 20,
                }}>
                금형 조회
            </Text>
            <CustomTable />
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
        height: 50,
    },
    columnHeader: {
        width: 150,
        justifyContent: 'center',
        alignItems: 'center',
    },
    columnHeaderTxt: {
        color: '#F9F9F9',
        fontWeight: 'bold',
        fontSize: 20,
    },
    columnRowTxt: {
        width: 150,
        textAlign: 'center',
        fontSize: 18,
        color: '#5D5D5D',
    },
    tableRow: {
        flexDirection: 'row',
        height: 70,
        alignItems: 'center',
    },
    rowRect: {
        flex: 1,
        borderWidth: 1,
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        height: 70,
        borderColor: '#E2E3E5',
    },
});

export default inject('navigation')(observer(MoldSearch));