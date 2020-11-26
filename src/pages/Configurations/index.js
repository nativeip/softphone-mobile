import React from 'react';
import { View, Text, Button } from 'react-native';
import RNExitApp from 'react-native-exit-app';

import { stopForegroundService } from '../../utils/foregroundService';

// import { Container } from './styles';

const Configurations = ({ navigation }) => {
  const exitApp = () => {
    stopForegroundService();
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
