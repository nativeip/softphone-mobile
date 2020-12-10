import React, { useEffect, useContext, useState } from 'react';
import { Text, StatusBar } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import SplashScreen from 'react-native-splash-screen';

import { store } from '../../store';
import Phone from '../../utils/phone';

import { setPhoneStatus } from '../../actions/phoneStatusActions';

import Header from '../../components/Header';
import {
  Container,
  NumberContainer,
  Number,
  Erase,
  Divisor,
  DialPad,
  DialNumberContainer,
  DialNumber,
  DialNumberText,
  CallContainer,
  CallButton,
} from './styles';

const Softphone = ({ navigation }) => {
  const DIAL_KEYS = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '*', '0', '#'];
  const { state, dispatch } = useContext(store);
  const [number, setNumber] = useState('');

  useEffect(() => {
    dispatch(setPhoneStatus(Phone.getStatus()));
    StatusBar.setHidden(false);
    SplashScreen.hide();
  }, []);

  const padClick = key => {
    if (key === 'erase') {
      setNumber(number.slice(0, -1) || '');
      return;
    }

    if (number.length >= 13) {
      return;
    }

    setNumber(number + key);
  };

  const callNumber = async number => {
    Phone.makeCall(number, state.user.server);
  };

  return (
    <>
      <StatusBar barStyle="dark-content" backgroundColor="white" />

      <Header />

      <Container>
        {state.session && <Text>Em ligação</Text>}

        <NumberContainer>
          <Number>{number}</Number>

          <Erase onPress={() => padClick('erase')} onLongPress={() => setNumber('')}>
            <Ionicons name="backspace-outline" size={30} color="#444" />
          </Erase>
        </NumberContainer>

        <Divisor />

        <DialPad
          data={DIAL_KEYS}
          numColumns={3}
          key={3}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item, index }) => (
            <DialNumberContainer key={index}>
              <DialNumber activeOpacity={0.5} onPress={() => padClick(item)}>
                <DialNumberText>{item}</DialNumberText>
              </DialNumber>
            </DialNumberContainer>
          )}></DialPad>

        <CallContainer>
          <CallButton
            background={state.session || !number ? '#ccc' : '#389400'}
            disabled={state.session || !number || !state.user?.server ? true : false}
            onPress={() => callNumber(number)}>
            <Ionicons color="#fff" name="call" size={35} />
          </CallButton>
        </CallContainer>
      </Container>
    </>
  );
};

export default Softphone;
