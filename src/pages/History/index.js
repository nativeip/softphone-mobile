import React, { useContext, useEffect } from 'react';
import { Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { store } from '../../store';
import { clearNotifications } from '../../actions/notificationsActions';

// import { Container } from './styles';

const History = () => {
  const { state, dispatch } = useContext(store);

  useEffect(() => {
    dispatch(clearNotifications());
  }, [dispatch]);

  return (
    <SafeAreaView>
      <Text>This is a test...</Text>
    </SafeAreaView>
  );
};

export default History;
