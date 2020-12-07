import React, { useEffect, useContext, useState } from 'react';
import { Text, StatusBar } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

import { store } from '../../store';
import Phone from '../../utils/phone';

import { setPhoneStatus } from '../../actions/phoneStatusActions';

const DIAL_KEYS = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '*', '0', '#'];

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

const App = () => {
  const { state, dispatch } = useContext(store);
  const [number, setNumber] = useState('');

  useEffect(() => {
    dispatch(setPhoneStatus(Phone.getStatus()));
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

  return (
    <Container>
      <StatusBar barStyle="dark-content" backgroundColor="white" />

      <Text>Digite o número desejado:</Text>

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
        <CallButton onPress={() => Phone.makeCall(number, state.peer.server)}>
          <Ionicons color="#fff" name="call" size={35} />
        </CallButton>
      </CallContainer>
    </Container>
  );
};

export default App;
