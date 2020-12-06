import React, { useContext } from 'react';
import { View, Text, Button } from 'react-native';
import RNExitApp from 'react-native-exit-app';

import { store } from '../../store';
import { unregister } from '../../actions/phoneActions';

import { stopForegroundService } from '../../utils/foregroundService';
import { unregisterCallKeep } from '../../utils/callKeep';

// import { Container } from './styles';

const Configurations = ({ navigation }) => {
  const { state, dispatch } = useContext(store);

  const exitApp = () => {
    dispatch(unregister(state.phone));
    stopForegroundService();
    unregisterCallKeep();

    RNExitApp.exitApp();
  };

  return (
    <View>
      <Text>Make your config here</Text>
      <Button title="Back to softphone" onPress={() => navigation.navigate('Softphone')} />
      <Button title="Sair" onPress={exitApp} />
    </View>
  );
};

export default Configurations;
