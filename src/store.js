import React, { createContext, useReducer, useEffect, useState } from 'react';

import storeState from './storeState';

import loadLocalStorageUser from './utils/loadLocalStorageUser';
import { loadConfig } from './utils/loadLocalStorageConfig';
import { connectToMonitorSocket, disconnectFromMonitorSocket } from './utils/monitorSocket';
import Phone from './utils/phone';

const initialState = {
  notifications: 3,
  user: {},
  phone: null,
  session: null,
  phoneStatus: '',
  callStatus: '',
  callNumber: '',
  callId: null,
  caller: { number: '', name: '' },
  socket: null,
};

const store = createContext(initialState);
const { Provider } = store;

const StoreProvider = ({ children }) => {
  const [user, setUser] = useState({});
  const [phone, setPhone] = useState(null);
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    const loadLocalConfig = async () => {
      const data = await loadConfig();

      setUser(data);
      setPhone(Phone.register(data));
      setSocket(connectToMonitorSocket(data.server));
    };

    loadLocalConfig();
  }, []);

  const [state, dispatch] = useReducer((state, action) => {
    switch (action.type) {
      case 'SET_CONFIG':
        return {
          ...state,
          user: action.payload,
        };

      case 'REGISTER_PHONE':
        return {
          ...state,
          phone: Phone.register(action.payload),
        };

      case 'UNREGISTER_PHONE':
        return {
          ...state,
          phone: Phone.unregister(),
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
          notifications: null,
        };

      case 'SET_SESSION':
        return {
          ...state,
          session: action.payload,
        };

      case 'CLEAR_SESSION':
        return {
          ...state,
          session: action.payload,
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

  return <Provider value={{ state: { ...state, user, phone }, dispatch }}>{children}</Provider>;
};

export { store, StoreProvider };
