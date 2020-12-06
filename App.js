import React from 'react';
import { StatusBar } from 'react-native';

import Routes from './src/routes';
import { StoreProvider } from './src/store';

export default function App() {
  return (
    <StoreProvider>
      <StatusBar barStyle="light-content" backgroundColor="#444" />
      <Routes />
    </StoreProvider>
  );
}
