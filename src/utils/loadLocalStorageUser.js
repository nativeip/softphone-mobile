import AsyncStorage from '@react-native-async-storage/async-storage';

const loadUserFromLocalStorage = async () => {
  const initialState = { server: '', user: '', pass: '' };

  const user = await AsyncStorage.getItem('user');

  if (user) {
    return JSON.parse(user);
  }

  return initialState;
};

export default loadUserFromLocalStorage;
