import { useIsFocused } from '@react-navigation/native';
import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import stores from '../stores';
import {
  Mold_Info,
  Mold_Article,
  Mold_Release,
  Mold_ArticleList,
  Mold_ReleaseList,
  MoldSearch
} from '../view/MoldViewer';

const MoldContainer = ({ navigation }: { navigation: any }) => {
  const [page, setPage] = React.useState<any>();
  const isFocused = useIsFocused();

  // React.useEffect(() => {
  //   if (page === stores.StepStore.getMoldPageInfo) {
  //     console.log("mold page!!! : ", page);
  //     return;
  //   }

  //   if (
  //     stores.StepStore.getMoldPageInfo !== '' ||
  //     stores.StepStore.getMoldPageInfo !== undefined ||
  //     stores.StepStore.getMoldPageInfo !== null
  //   ) {
  //     setPage(stores.StepStore.getMoldPageInfo);
  //     console.log("mold page : ", page);
  //   }
  // }, [isFocused]);

  // if (page === '') {
  //   return <></>;
  // } else if (page === 'Mold_Article') {
  //   return <Mold_Article navigation={navigation} />;
  // } else if (page === 'Mold_Release') {
  //   return <Mold_Release navigation={navigation} />;
  // } else if (page === 'Mold_Article_List') {
  //   return <Mold_ArticleList navigation={navigation} />;
  // } else if (page === 'Mold_Release_List')
  //   return <Mold_ReleaseList navigation={navigation} />;
  // else if (page === 'MoldSearch') {
  //   return <MoldSearch navigation={navigation} />;
  // }
  // // else if (page === 'Mold_Info') {
  // //   return <Mold_Info pageinfo={page} navigation={navigation} />;
  // // }

  // else
  //   return <></>;
  return (
    <MoldSearch navigation={navigation} />
  )
};

export default MoldContainer;
