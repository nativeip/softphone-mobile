import React, { useEffect, useState, useContext } from 'react';
import { Image } from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import PhoneContacts from 'react-native-contacts';
import fs from 'react-native-fs';

import { store } from '../../store';
import placeholder from '../../assets/user.jpg';

import Button from '../../components/Button';
import {
  Container,
  AvatarContainer,
  Title,
  Avatar,
  ContactNameContainer,
  ContactName,
  PhoneContainer,
  PhoneNumber,
  Controls,
} from './styles';
import Phone from '../../utils/phone';

const Contact = ({ route, navigation }) => {
  const { state, dispatch } = useContext(store);
  const [contact, setContact] = useState({});
  const [avatar, setAvatar] = useState(null);

  useEffect(() => {
    const getAvatar = async id => {
      const contactImage = await PhoneContacts.getPhotoForId(String(id));
      if (!contactImage) {
        return;
      }

      const image = await fs.readFile(contactImage, 'base64');
      setAvatar(`data:image/png;base64,${image}`);
    };

    setContact(route.params);
    getAvatar(route.params.id);
  }, []);

  const callContact = number => {
    Phone.makeCall(number, state.user.server);
  };

  return (
    <Container>
      <Title>Detalhes do contato:</Title>

      <AvatarContainer>
        <Avatar source={avatar ? { uri: avatar } : placeholder} />

        <ContactNameContainer>
          <ContactName>{contact.name}</ContactName>
        </ContactNameContainer>
      </AvatarContainer>

      {contact.phones?.map(phone => (
        <PhoneContainer key={phone.id} onPress={() => callContact(phone.number)}>
          <Icon name={phone.label === 'home' ? 'home' : 'phone'} size={14} />
          <PhoneNumber>{phone.number}</PhoneNumber>
        </PhoneContainer>
      ))}

      {contact.emailAddresses?.map(email => (
        <PhoneContainer key={email.id}>
          <Icon name={'mail'} size={14} />
          <PhoneNumber>{email.email}</PhoneNumber>
        </PhoneContainer>
      ))}

      <Controls>
        <Button
          icon="arrow-back-outline"
          title="Voltar"
          color="#ff9532"
          onPress={() => navigation.goBack()}
        />
      </Controls>
    </Container>
  );
};

export default Contact;
