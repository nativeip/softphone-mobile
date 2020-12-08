import React, { useContext, useEffect, useState } from 'react';
import { createStackNavigator } from '@react-navigation/stack';
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

const Stack = createStackNavigator();

const Contacts = ({ navigation }) => {
  const { state, dispatch } = useContext(store);
  const [phoneContacts, setPhoneContacts] = useState([]);

  useEffect(() => {
    const getPhoneContacts = async () => {
      const contacts = await PhoneContacts.getAll();
      const newContacts = contacts
        .filter(contact => contact.phoneNumbers.length > 0)
        .map(contact => {
          const { recordID: id, displayName: name, phoneNumbers: phones } = contact;
          return { id, name, phones };
        })
        .sort((a, b) => (a.name > b.name ? 1 : -1));

      setPhoneContacts(newContacts);
    };

    getPhoneContacts();
  }, []);

  const handleContactSelect = contact => {
    navigation.navigate('Contact', { ...contact });
  };

  return (
    <Container>
      <ContactsList
        data={phoneContacts}
        keyExtractor={item => item.id.toString()}
        renderItem={({ item }) => (
          <ContactContainer key={item.id} onPress={() => handleContactSelect(item)}>
            <ContactNameContainer>
              <Icon name="user" size={16} />
              <ContactName>{item.name}</ContactName>
            </ContactNameContainer>

            {item.phones.map(phone => (
              <PhoneContainer key={phone.id}>
                <Icon name={phone.label === 'home' ? 'home' : 'phone'} size={14} />
                <PhoneNumber>{phone.number}</PhoneNumber>
              </PhoneContainer>
            ))}
          </ContactContainer>
        )}
      />
    </Container>
  );
};

const Contact = ({ route }) => {
  const { state, dispatch } = useContext(store);

  useEffect(() => {
    console.log(route.params);
  }, []);

  return <Container></Container>;
};

function ContactsRoutes() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}>
      <Stack.Screen name="Contacts" component={Contacts} />
      <Stack.Screen name="Contact" component={Contact} />
    </Stack.Navigator>
  );
}

export default ContactsRoutes;
