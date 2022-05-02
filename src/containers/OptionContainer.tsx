import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import OptionViewer from '../view/OptionViewer/OptionViewer';


const OptionContainer = ({ navigation }: { navigation: any }) => {
  return <OptionViewer navigation={navigation} />;
};

export default OptionContainer;
