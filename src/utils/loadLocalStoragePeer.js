import AsyncStorage from '@react-native-async-storage/async-storage';

const loadPeerFromLocalStorage = async () => {
  const initialState = { server: '', user: '', pass: '' };

  const peer = await AsyncStorage.getItem('peer');

  if (peer) {
    return JSON.parse(peer);
  }

  return initialState;
};

export default loadPeerFromLocalStorage;
