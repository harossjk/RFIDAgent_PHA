import React, { useState } from 'react';
import OptionViewer from '../view/OptionViewer/OptionViewer';


const OptionContainer = ({ navigation }: { navigation: any }) => {
  return <OptionViewer navigation={navigation} />;
};

export default OptionContainer;
