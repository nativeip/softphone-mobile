import React from 'react';
import Ionicons from 'react-native-vector-icons/Ionicons';

import { Container, ButtonText } from './styles';

const Button = ({ title, color, onPress, icon, padding }) => {
  return (
    <Container onPress={onPress} color={color}>
      {icon && <Ionicons color="#fff" name={icon} size={24} />}
      <ButtonText padding={padding}>{title}</ButtonText>
    </Container>
  );
};

export default Button;
