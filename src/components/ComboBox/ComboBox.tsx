import React, { useState, useRef } from 'react';
import { Picker } from '@react-native-picker/picker';
import { AxiosResponse } from 'axios';
import { getMap, mapEntity } from '../Utils/Utils';
import stores from '../../stores';

interface props {
  mapFunc?: Promise<AxiosResponse<mapEntity[]>>;
  onValueChange?: any;
  onFocusTitle?: any;
  family?: any;
  size?: any;
  color?: any;
  comboTitle: string;
  fakeData?: mapEntity[];
}

const ComboBox = ({
  comboTitle,
  onFocusTitle,
  mapFunc,
  onValueChange,
  family,
  size,
  color,
  fakeData,
}: props) => {
  const [combo, setCombo] = useState<mapEntity[]>();
  React.useEffect(() => {
    if (mapFunc) {
      mapFunc
        .then(result => {
          if (result && result.data) {
            setCombo(result.data);
          }
        })
        .catch(error => {
          console.log(error);
        });
    }
    setCombo(fakeData);
  }, []);

  const [selectCombo, setSelectedCombo] = useState();

  const selectMoldData = (itemValue: any, itemIndex: number) => {
    switch (itemValue) {
      case 'inCorpCode':
        console.log('입고반응?', comboTitle, itemValue);
        stores.MoldStore.SetMoldInData(comboTitle, itemValue);
        stores.MoldStore.SetMoldInData('corpCode', itemValue);
        break;
      case 'inFactoryCode':
        console.log('입고반응?', comboTitle, itemValue);
        stores.MoldStore.SetMoldInData(comboTitle, itemValue);
        stores.MoldStore.SetMoldInData('factoryCode', itemValue);
        break;
      case 'inPosition':
        console.log('입고반응?', comboTitle, itemValue);
        stores.MoldStore.SetMoldInData(comboTitle, itemValue);
        stores.MoldStore.SetMoldInData(
          'positionName',
          combo?.[itemIndex].label,
        );
      case 'inGubun':
        console.log('입고반응?', comboTitle, itemValue);
        stores.MoldStore.SetMoldInData(comboTitle, itemValue);
        stores.MoldStore.SetMoldInData('gubunName', combo?.[itemIndex].label);

      case 'outCorpCode':
        console.log('출고반응?', comboTitle, itemValue);
        stores.MoldStore.SetMoldOutData(comboTitle, itemValue);
        stores.MoldStore.SetMoldOutData('corpCode', itemValue);
        break;
      case 'outFactoryCode':
        console.log('출고반응?', comboTitle, itemValue);
        stores.MoldStore.SetMoldOutData(comboTitle, itemValue);
        stores.MoldStore.SetMoldOutData('factoryCode', itemValue);
        break;
      case 'outPosition':
        console.log('출고반응?', comboTitle, itemValue);
        stores.MoldStore.SetMoldOutData(comboTitle, itemValue);
        stores.MoldStore.SetMoldOutData(
          'positionName',
          combo?.[itemIndex].label,
        );
        break;
      case 'outGubun':
        console.log('출고반응?', comboTitle, itemValue);
        stores.MoldStore.SetMoldOutData(comboTitle, itemValue);
        stores.MoldStore.SetMoldOutData('gubunName', combo?.[itemIndex].label);
        break;

      default:
        stores.MoldStore.SetMoldInData(comboTitle, itemValue);
        stores.MoldStore.SetMoldOutData(comboTitle, itemValue);
        break;
    }
  };

  const handleFocusTitle = (currTitle: string) => {
    if (onFocusTitle) onFocusTitle(currTitle, selectCombo);
  };
  return (
    <Picker
      itemStyle={{ fontFamily: family, fontSize: size }}
      selectedValue={selectCombo}
      style={{
        height: 50,
        width: '100%',
        overflow: 'hidden',
        color: color,
        fontFamily: family,
        fontSize: size,
      }}
      onFocus={() => { }}
      onValueChange={(itemValue: any, itemIndex: number) => {
        setSelectedCombo(itemValue);
        selectMoldData(itemValue, itemIndex);
      }}>
      {combo?.map((key, idx) => {
        return (
          <Picker.Item
            style={{
              fontSize: size,
              fontFamily: family,
            }}
            label={key.label}
            key={idx}
            value={key.value}
          />
        );
      })}
    </Picker>
  );
};

export default ComboBox;
