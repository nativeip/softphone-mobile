import React, { useContext, useEffect, useState } from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import PhoneContacts from 'react-native-contacts';
import Icon from 'react-native-vector-icons/Feather';

import useDebounce from '../../hooks/useDebounce';
import Phone from '../../utils/phone/';
import api from '../../services/api';
import Contact from '../Contact';
import { store } from '../../store';

import {
  Container,
  Loading,
  LoadingText,
  ContactsList,
  ContactContainer,
  ContactNameContainer,
  ContactName,
  PhoneContainer,
  PhoneNumber,
  SearchContainer,
  ClearSearch,
  Search,
} from './styles';

const Stack = createStackNavigator();

const Contacts = ({ navigation }) => {
  const { state, dispatch } = useContext(store);
  const [phoneContacts, setPhoneContacts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const debouncedSearchTerm = useDebounce(searchTerm, 500);
  const [contactsFiltered, setContactsFiltered] = useState([]);

  useEffect(() => {
    const getContacts = async () => {
      const contacts = await PhoneContacts.getAll();

      const newPhoneContacts = contacts
        .filter(contact => contact.phoneNumbers.length > 0)
        .map(contact => {
          const { recordID: id, displayName: name, phoneNumbers: phones, emailAddresses } = contact;
          return { id, name, phones, emailAddresses };
        });

      const { data } = await api.get(`https://${state.user.server}/api/contacts`);

      const newNativeContacts = data.map(({ id, email, name, phone }) => ({
        id,
        name,
        phones: [{ id, number: phone }],
        emailAddresses: [{ id, email }],
      }));

      setPhoneContacts(
        [...newNativeContacts, ...newPhoneContacts].sort((a, b) => (a.name > b.name ? 1 : -1)),
      );
    };

    getContacts();
  }, []);

  useEffect(() => {
    const searchContacts = () => {
      if (!debouncedSearchTerm) {
        return;
      }

      const newContacts = phoneContacts.filter(contact =>
        contact.name?.toLowerCase()?.includes(debouncedSearchTerm.toLowerCase()),
      );

      setContactsFiltered(newContacts);
    };

    searchContacts();
  }, [debouncedSearchTerm]);

  const handleContactSelect = contact => {
    if (contact.phones.length > 1) {
      navigation.navigate('Contact', { ...contact });
      return;
    }

    Phone.makeCall(contact.phones[0].number, state.user.server);
  };

  return (
    <Container>
      {!phoneContacts.length ? (
        <Loading>
          <Icon name="loader" size={24} color="#aaa" />
          <LoadingText>Carregando contatos...</LoadingText>
        </Loading>
      ) : (
        <>
          <SearchContainer>
            <Search
              placeholder="Pesquisar contato"
              value={searchTerm}
              onChangeText={value => setSearchTerm(value)}
            />
            <ClearSearch>
              <Icon name="x" size={24} color="#666" onPress={() => setSearchTerm('')} />
            </ClearSearch>
          </SearchContainer>

          <ContactsList
            data={debouncedSearchTerm ? contactsFiltered : phoneContacts}
            keyExtractor={item => item.id.toString()}
            renderItem={({ item }) => (
              <ContactContainer
                key={item.id}
                onPress={() => handleContactSelect(item)}
                onLongPress={() => navigation.navigate('Contact', { ...item })}
                delayLongPress={500}>
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
        </>
      )}
    </Container>
  );
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
