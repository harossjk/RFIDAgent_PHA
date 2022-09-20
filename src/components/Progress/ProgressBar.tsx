import React from 'react';
import {
  Modal,
  View,
  Text,
  ActivityIndicator,
  StyleSheet,
  Button,
  ColorValue,
} from 'react-native';


const ProgressBar = (props: { visible: boolean, userColor?: ColorValue }) => (
  <Modal visible={props.visible} animationType="fade" transparent={true}>
    <View style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Please Wait</Text>
        <View style={styles.loading}>
          <View style={styles.loader}>
            <ActivityIndicator size="large" color={props.userColor === undefined ? 'red' : props.userColor} />
          </View>
          <View style={styles.loadingContent}>
            <Text>Loading</Text>
          </View>
        </View>
      </View>
    </View>
  </Modal>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, .5)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'flex-start',
    backgroundColor: 'white',
    borderRadius: 10,
    width: 250,
    height: 120,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    paddingLeft: 30,
    paddingBottom: 10,
  },
  loading: {
    top: 10,
    left: 40,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingContent: {
    flex: 3,
    fontSize: 16,
    paddingHorizontal: 10,
    textAlign: 'center',
  },
});
export default ProgressBar;
