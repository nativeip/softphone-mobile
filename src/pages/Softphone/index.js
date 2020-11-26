import React, { useContext, useEffect } from 'react';
import { Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { store } from '../../store';

// import { Container } from './styles';

const Softphone = () => {
  const { state, dispatch } = useContext(store);

  return (
    <SafeAreaView>
      <Text>This is a test...</Text>
    </SafeAreaView>
  );
};

export default Softphone;
