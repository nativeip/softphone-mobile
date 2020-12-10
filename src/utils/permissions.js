// import InCallManager from 'react-native-incall-manager';
import CallKeep from 'react-native-callkeep';
import { PermissionsAndroid } from 'react-native';
import Toast from 'react-native-toast-message';

export const requestPermissions = async () => {
  // if (InCallManager.recordPermission !== 'granted') {
  //   try {
  //     await InCallManager.requestRecordPermission();
  //   } catch (error) {
  //     console.error('Error getting permissions to record audio: ', error.message);
  //   }
  // }

  // if (InCallManager.cameraPermission !== 'granted') {
  //   try {
  //     await InCallManager.requestCameraPermission();
  //   } catch (error) {
  //     console.error('Error getting permissions to  camera: ', error.message);
  //   }
  // }

  // if (!(await PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.READ_CONTACTS))) {
  //   try {
  //     await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.READ_CONTACTS);
  //   } catch (error) {
  //     console.error('Error getting permissions to  read contacts: ', error.message);
  //   }
  // }

  if (Platform.OS === 'android') {
    PermissionsAndroid.requestMultiple([
      PermissionsAndroid.PERMISSIONS.CAMERA,
      PermissionsAndroid.PERMISSIONS.READ_CONTACTS,
      PermissionsAndroid.PERMISSIONS.CALL_PHONE,
      PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
    ]).then(result => {
      if (
        result['android.permission.CAMERA'] !== 'granted' ||
        result['android.permission.READ_CONTACTS'] !== 'granted' ||
        result['android.permission.CALL_PHONE'] !== 'granted' ||
        result['android.permission.RECORD_AUDIO'] !== 'granted'
      ) {
        Toast.show({
          type: 'error',
          text1: 'Permissões não concedidas',
          text2:
            'Por favor vá em configurações -> Aplicativos -> Infinity Sofpthone -> Permissões e dê as permissões para continuar',
        });
      }
    });
  }

  CallKeep.registerPhoneAccount();
};
