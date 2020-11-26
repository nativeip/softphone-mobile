import React from 'react';
import { StatusBar } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import Routes from './src/routes';
import { StoreProvider } from './src/store';

export default function App() {
  return (
    <SafeAreaProvider>
      <StoreProvider>
        <StatusBar barStyle="light-content" backgroundColor="#444" />
        <Routes />
      </StoreProvider>
    </SafeAreaProvider>
  );
}
