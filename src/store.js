import React, { createContext, useReducer } from 'react';

import storeState from './storeState';

import loadLocalStorageUser from './utils/loadLocalStorageUser';
// import loadLocalStoragePeer from './utils/loadLocalStoragePeer';
import { connectToMonitorSocket, disconnectFromMonitorSocket } from './utils/monitorSocket';
import Phone from './utils/phone';

const peer = {
  server: 'infinity.nativeip.com.br',
  pass: 'Native.111',
  user: '111',
};

const initialState = {
  notifications: 0,
  user: loadLocalStorageUser(),
  phone: Phone.register(peer),
  phoneStatus: '',
  callStatus: '',
  callNumber: '',
  callId: null,
  caller: { number: '', name: '' },
  peer,
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
        return {
          ...state,
          notifications: state.notifications + action.payload.notifications,
        };

      case 'CLEAR_NOTIFICATIONS':
        return {
          ...state,
          notifications: 0,
        };

      case 'SET_PHONE_STATUS':
        return {
          ...state,
          phoneStatus: action.payload,
        };

      case 'SET_CALL_STATUS':
        return {
          ...state,
          callStatus: action.payload,
        };

      case 'CLEAR_CALL_STATUS':
        return {
          ...state,
          callStatus: action.payload,
        };

      case 'SET_CALLER':
        return {
          ...state,
          caller: action.payload,
        };

      case 'CLEAR_CALLER':
        return {
          ...state,
          caller: action.payload,
        };

      case 'SET_CALL_NUMBER':
        return {
          ...state,
          callNumber: action.payload,
        };

      case 'CLEAR_CALL_NUMBER':
        return {
          ...state,
          callNumber: action.payload,
        };

      default:
        return state;
    }
  }, initialState);

  if (!storeState.isReady) {
    storeState.isReady = true;
    storeState.dispatch = params => dispatch(params);
  }

  return <Provider value={{ state, dispatch }}>{children}</Provider>;
};

export { store, StoreProvider };
