import InCallManager from 'react-native-incall-manager';

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
};
