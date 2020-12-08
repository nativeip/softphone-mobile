import React, { useContext } from 'react';
import Ionicons from 'react-native-vector-icons/Ionicons';

import { store } from '../../store';

import { Container, Title } from './styles';

const Chat = () => {
  const { state, dispatch } = useContext(store);

  return (
    <Container>
      <Ionicons name="chatbubbles" size={26} />
      <Title>Este recurso será disponibilizado em breve!</Title>
    </Container>
  );
};

export default Chat;
