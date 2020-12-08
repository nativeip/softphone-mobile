import React from 'react';

import logoImg from '../../assets/logo.png';
import { Container, Logo } from './styles';

const Header = () => {
  return (
    <Container>
      <Logo source={logoImg} />
    </Container>
  );
};

export default Header;
