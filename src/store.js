import React, { createContext, useReducer } from 'react';

import loadLocalStorageUser from './utils/loadLocalStorageUser';
// import loadLocalStoragePeer from './utils/loadLocalStoragePeer';
import { connectToMonitorSocket, disconnectFromMonitorSocket } from './utils/monitorSocket';

const initialState = {
  notifications: 0,
  user: loadLocalStorageUser(),
  peer: {
    server: 'infinity.nativeip.com.br',
    pass: 'Native.111',
    user: '111',
  },
  socket: connectToMonitorSocket(loadLocalStorageUser().api),
};

const store = createContext(initialState);
const { Provider } = store;

const StoreProvider = ({ children }) => {
  const [state, dispatch] = useReducer((state, action) => {
    switch (action.type) {
      case 'SAVE_USER':
        return {
          ...state,
          user: action.payload,
        };

      case 'SAVE_PEER':
        return {
          ...state,
          peer: action.payload,
        };

      case 'CONNECT_SOCKET':
        return {
          ...state,
          socket: connectToMonitorSocket(action.payload.server),
        };

      case 'DISCONNECT_SOCKET':
        return {
          ...state,
          socket: disconnectFromMonitorSocket(action.payload.socket),
        };

      case 'ADD_NOTIFICATIONS':
        console.log('add', action.payload);

        return {
          ...state,
          notifications: state.notifications + action.payload.notifications,
        };

      case 'CLEAR_NOTIFICATIONS':
        return {
          ...state,
          notifications: 0,
        };

      default:
        return state;
    }
  }, initialState);

  return <Provider value={{ state, dispatch }}>{children}</Provider>;
};

export { store, StoreProvider };
