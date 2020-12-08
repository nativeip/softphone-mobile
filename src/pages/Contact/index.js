import React, { useContext, useEffect, useState } from 'react';
import PhoneContacts from 'react-native-contacts';
import Icon from 'react-native-vector-icons/Feather';

import { store } from '../../store';
import {
  Container,
  ContactsList,
  ContactContainer,
  ContactNameContainer,
  ContactName,
  PhoneContainer,
  PhoneNumber,
} from './styles';

const Contact = ({ route }) => {
  const { state, dispatch } = useContext(store);

  useEffect(() => {
    console.log(route.params);
  }, []);

  return <Container></Container>;
};

export default Contact;
