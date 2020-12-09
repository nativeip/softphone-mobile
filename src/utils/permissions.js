import InCallManager from 'react-native-incall-manager';
import { PermissionsAndroid } from 'react-native';

export const requestPermissions = async () => {
  if (InCallManager.recordPermission !== 'granted') {
    try {
      await InCallManager.requestRecordPermission();
    } catch (error) {
      console.error('Error getting permissions to record audio: ', error.message);
    }
  }

  if (InCallManager.cameraPermission !== 'granted') {
    try {
      await InCallManager.requestCameraPermission();
    } catch (error) {
      console.error('Error getting permissions to  camera: ', error.message);
    }
  }

  if (!(await PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.READ_CONTACTS))) {
    try {
      await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.READ_CONTACTS);
    } catch (error) {
      console.error('Error getting permissions to  read contacts: ', error.message);
    }
  }
};
