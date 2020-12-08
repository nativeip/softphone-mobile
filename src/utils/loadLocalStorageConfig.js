import AsyncStorage from '@react-native-async-storage/async-storage';

export const loadConfig = async () => {
  const initialState = { server: '', user: '', pass: '', peer: '', secret: '' };

  const peer = await AsyncStorage.getItem('data');

  if (peer) {
    return JSON.parse(peer);
  }

  return initialState;
};

export const saveConfig = async data => {
  await AsyncStorage.setItem('data', JSON.stringify(data));

  return data;
};
