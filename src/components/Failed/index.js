import React from 'react';
import Icon from 'react-native-vector-icons/Feather';

import Button from '../Button';
import { Container, Message } from './styles';

const Failed = ({ navigation }) => {
  return (
    <Container>
      <Icon size={24} name="cloud-off" color="#666" />
      <Message>Falha ao buscar as informações, verifique sua configuração!</Message>
      <Button
        title="Configurar"
        icon="cog"
        color="#5f646e"
        padding="10"
        onPress={() => navigation.navigate('Configurations')}
      />
    </Container>
  );
};

export default Failed;
