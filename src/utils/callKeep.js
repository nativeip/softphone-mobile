import { AppRegistry } from 'react-native';
import CallKeep from 'react-native-callkeep';

let isRegistered = false;

export const configureCallKeep = async () => {
  if (isRegistered) {
    return;
  }

  AppRegistry.registerHeadlessTask(
    'RNCallKeepBackgroundMessage',
    () => ({ name, callUUID, handle }) => {
      return Promise.resolve();
    },
  );

  const options = {
    ios: {
      appName: 'Infinity Softphone',
    },
    android: {
      alertTitle: 'Permissões Necessárias',
      alertDescription: 'Essa aplicação precisa de permissões para acessar seu telefone',
      cancelButton: 'Cancelar',
      okButton: 'Aceitar',
      imageName: 'sim_icon',
    },
  };

  await CallKeep.setup(options);
  isRegistered = true;
};

export const unregisterCallKeep = () => {
  CallKeep.endAllCalls();
  CallKeep.setAvailable(false);

  CallKeep.removeEventListener('answerCall');
  CallKeep.removeEventListener('endCall');
  CallKeep.removeEventListener('didPerformSetMutedCallAction');
  CallKeep.removeEventListener('didToggleHoldCallAction');
  CallKeep.removeEventListener('didPerformDTMFAction');

  return false;
};
