import CallKeep from 'react-native-callkeep';

export const configureCallKeep = async () => {
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
