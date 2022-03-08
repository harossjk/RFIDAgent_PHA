import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  FlatList,
  TouchableOpacity,
  BackHandler,
} from 'react-native';
import ProgressBar from '../../components/Progress/ProgressBar';
import stores from '../../stores';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import _ from 'lodash';
import { useIsFocused } from '@react-navigation/native';
const columns = [
  { id: 6, key: 'poutDt', colName: '출고일자', width: 100, }
  , { id: 5, key: 'inDt', colName: '입고일자', width: 100, }
  , { id: 1, key: 'rfid', colName: 'RFID', width: 110, }
  , { id: 2, key: 'outPositionName', colName: '보관위치', width: 100, }
  , { id: 3, key: 'moldName', colName: '금형명', width: 150, }
  , { id: 4, key: 'carName', colName: '프로젝트명', width: 150, }
  , { id: 7, key: 'outGubunName', colName: '출고구분', width: 150, }
  , { id: 8, key: 'factoryCode', colName: '공    정', width: 150, }
];
const CustomTable = ({ isVisible }: { isVisible: any }) => {
  const [data, setData] = useState<any>(null);
  const [direction, setDirection] = useState(null);
  const [selectedColumn, setSelectedColumn] = useState(null);

  useEffect(() => {
    if (data !== null) {
      const sortedData = _.orderBy(
        data,
        ['outDt', 'outSeq', 'outTime'],
        ['desc', 'desc', 'desc'],
      ); //['inTime', 'inSeq'], ['desc', 'desc']
      setData(sortedData);
    }
  }, [stores.MoldStore.getMoldOutDataList]);

  useEffect(() => {
    //jjk, 21.12.22
    async function searchMoldOutList() {
      let bOk = await stores.MoldStore.searchMoldOutList();
      if (bOk === 0) {
        if (isVisible !== null) await isVisible(false);
      } else {
        let moldout = stores.MoldStore.getMoldOutDataList;
        setData(moldout);
        if (isVisible !== null) await isVisible(false);
      }
    }

    searchMoldOutList();
  }, []);

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
              style={{
                ...styles.columnHeader,
                borderWidth: 1,
                height: 50,
                width: item.width,
                borderColor: '#E2E3E5',
              }}
              onPress={() => {
                sortTable(item.key, direction);
              }}>
              <Text style={styles.columnHeaderTxt}>
                {item.colName}
                {selectedColumn === item.key && (
                  <MaterialCommunityIcons
                    size={18}
                    name={
                      direction === 'desc'
                        ? 'arrow-down-drop-circle'
                        : 'arrow-up-drop-circle'
                    }
                  />
                )}
              </Text>
            </TouchableOpacity>
          );
        }
      })}
    </View>
  );

  const TableRowItem = () => {
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
                  style={{
                    ...styles.tableRow,
                    backgroundColor: '#fff',
                    //backgroundColor: index % 2 == 1 ? '#F0FBFC' : 'white',
                  }}>
                  <View style={[styles.rowRect, { width: columns[0]['width'] }]}>
                    <Text
                      style={[
                        styles.columnRowTxt,
                        { width: columns[0]['width'] },
                      ]}>
                      {item['outDt']}
                    </Text>
                  </View>
                  <View style={[styles.rowRect, { width: columns[1]['width'] }]}>
                    <Text
                      style={[
                        styles.columnRowTxt,
                        { width: columns[1]['width'] },
                      ]}>
                      {item['pinDt']}
                    </Text>
                  </View>
                  <View style={[styles.rowRect, { width: columns[2]['width'] }]}>
                    <Text
                      style={{
                        ...styles.columnRowTxt,
                        fontWeight: 'bold',
                        width: columns[2]['width'],
                      }}>
                      {item['rfid']}
                    </Text>
                  </View>
                  <View style={[styles.rowRect, { width: columns[3]['width'] }]}>
                    <Text
                      style={[
                        styles.columnRowTxt,
                        { width: columns[3]['width'], color: 'red' },
                      ]}>
                      {item['outPositionName']}
                    </Text>
                  </View>
                  <View style={[styles.rowRect, { width: columns[4]['width'] }]}>
                    <Text
                      style={[
                        styles.columnRowTxt,
                        { width: columns[4]['width'] },
                      ]}>
                      {item['moldName']}
                    </Text>
                  </View>
                  <View style={[styles.rowRect, { width: columns[5]['width'] }]}>
                    <Text
                      style={[
                        styles.columnRowTxt,
                        { width: columns[5]['width'] },
                      ]}>
                      {item['carName']}
                    </Text>
                  </View>
                  <View style={[styles.rowRect, { width: columns[6]['width'] }]}>
                    <Text
                      style={[
                        styles.columnRowTxt,
                        { width: columns[6]['width'] },
                      ]}>
                      {item['outGubunName']}
                    </Text>
                  </View>
                  <View style={[styles.rowRect, { width: columns[7]['width'] }]}>
                    <Text
                      style={[
                        styles.columnRowTxt,
                        { width: columns[7]['width'] },
                      ]}>
                      {item['factoryCode']}
                    </Text>
                  </View>
                </View>
              );
            }}
          />
        </ScrollView>
      </View>
    );
  };

  if (data === undefined) {
    console.log('data undfined');
    return <></>;
  } else if (data === null) {
    console.log('data null');
    return (
      <>
        <View
          style={{
            flex: 1,
            paddingBottom: 30,
            justifyContent: 'center',
            alignContent: 'center',
          }}>
          <Text
            style={{
              justifyContent: 'center',
              alignContent: 'center',
              textAlign: 'center',
              fontSize: 20,
            }}>
            {'- DB Connected Error\nData가 없습니다.'}
          </Text>
        </View>
      </>
    );
  } else {
    return <TableRowItem />;
  }
  return <></>;
};
const Mold_ReleaseList = ({ navigation }: { navigation: any }) => {
  const [loading, setLoading] = useState(true);
  const isFocused = useIsFocused();
  React.useEffect(() => {
    if (isFocused) {
      const backAction = () => {
        console.log(' Mold_Info 백버튼 반응');
        navigation.navigate('DrawerHome');
        return true;
      };
      const backHandler = BackHandler.addEventListener(
        'hardwareBackPress',
        backAction,
      );
      return () => {
        backHandler.remove();
      };
    }
  }, [isFocused]);

  const isVisible = (visible: any) => {
    setLoading(visible);
  };

  return (
    <View style={styles.container}>
      <Text
        style={{
          marginVertical: 10,
          textAlign: 'center',
          fontFamily: 'NanumSquareEB',
          color: '#808080',
          fontSize: 20,
        }}>
        금형 출고이력
      </Text>
      <ProgressBar visible={loading} />
      <CustomTable isVisible={isVisible} />
    </View>
  );
};

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
    // borderTopEndRadius: 10,
    // borderTopStartRadius: 10,
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

export default Mold_ReleaseList;
