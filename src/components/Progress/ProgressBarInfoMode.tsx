import React from 'react';
import {
  Modal,
  View,
  Text,
  ActivityIndicator,
  StyleSheet,
  Button,
} from 'react-native';

// const ProgressBar = ({visible}: {visible: boolean}) => (
//   <Modal
//     animationType="fade"
//     transparent={true}
//     onRequestClose={() => null}
//     visible={visible}>
//     <View
//       style={{
//         flex: 1,
//         backgroundColor: 'transparent',
//         alignItems: 'center',
//         justifyContent: 'center',
//       }}>
//       <View
//         style={{
//           borderRadius: 10,
//           backgroundColor: 'rgba(0, 0, 0, .5)',
//           padding: 25,
//         }}>
//         <Text style={styles.title}>Please Wait</Text>
//         <Text style={{fontSize: 20, fontWeight: '200'}}>Loading</Text>
//         <ActivityIndicator size="large" color="#0000ff" />
//       </View>
//     </View>
//   </Modal>
// );
const ProgressBarInfoMode = ({ visible }: { visible: boolean }) => (
  <Modal visible={visible} animationType="fade" transparent={true}>
    <View style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Please Wait</Text>

        <View style={{ left: 35, justifyContent: 'center', alignContent: 'center' }}>
          <Text>TAG가 읽힐때까지 눌러주세요</Text>
        </View>

        <View style={styles.loading}>
          <View style={styles.loader}>
            <ActivityIndicator size="large" color={'red'} />
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
    height: 160,
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
export default ProgressBarInfoMode;
