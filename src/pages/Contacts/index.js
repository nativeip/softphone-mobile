import React, { useContext, useEffect, useState } from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import PhoneContacts from 'react-native-contacts';
import Icon from 'react-native-vector-icons/Feather';
import Toast from 'react-native-toast-message';

import useDebounce from '../../hooks/useDebounce';
import Phone from '../../utils/phone/';
import api from '../../services/api';
import Contact from '../Contact';
import Header from '../../components/Header';
import Failed from '../../components/Failed';
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
  SwitchContainer,
  SwitchLabel,
  Switch,
} from './styles';

const Stack = createStackNavigator();

const Contacts = ({ navigation }) => {
  const { state } = useContext(store);
  const [phoneContacts, setPhoneContacts] = useState([]);
  const [hidePhoneContacts, setHidePhoneContacts] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const debouncedSearchTerm = useDebounce(searchTerm, 250);
  const [contactsFiltered, setContactsFiltered] = useState([]);
  const [isRefreshing, setIsRefreshing] = useState(true);

  useEffect(() => {
    const unsubscribeFocus = navigation.addListener('focus', () => {
      if (!phoneContacts.length) {
        getContacts();
      }
    });

    getContacts();

    return unsubscribeFocus;
  }, []);

  useEffect(() => {
    filterContacts(phoneContacts, debouncedSearchTerm, hidePhoneContacts);
  }, [debouncedSearchTerm]);

  const getContacts = async () => {
    if (!state.user?.server) {
      return;
    }

    try {
      setIsRefreshing(true);
      const contacts = await PhoneContacts.getAll();

      const newPhoneContacts = contacts
        .filter(contact => contact.phoneNumbers.length > 0)
        .map(contact => {
          const { recordID: id, displayName: name, phoneNumbers, emailAddresses } = contact;
          const numbers = [];

          const phones = phoneNumbers.filter(phoneNumber => {
            const repeatedNumber = numbers.includes(phoneNumber.number);
            numbers.push(phoneNumber.number);

            return !repeatedNumber;
          });

          return { id, name, phones, emailAddresses, local: true };
        });

      const { data: auth } = await api.post(`https://${state.user.server}/api/token`, {
        username: state.user.user,
        password: state.user.pass,
      });

      api.defaults.headers['Authorization'] = `Bearer ${auth.token}`;

      const { data: nativeContacts } = await api.get(`https://${state.user.server}/api/contacts`);

      const newNativeContacts = nativeContacts.map(({ id, email, name, phone }) => ({
        id,
        name,
        phones: [{ id, number: phone }],
        emailAddresses: [{ id, email }],
      }));

      const { data: peers } = await api.get(`https://${state.user.server}/api/peers`, {
        params: { attributes: '["id", "name", "username", "email"]' },
      });

      const newPeers = peers.map(({ id, name, username, email }) => ({
        id,
        name,
        phones: [{ id, number: username }],
        emailAddresses: [{ id, email }],
      }));

      setPhoneContacts(
        [...newNativeContacts, ...newPeers, ...newPhoneContacts].sort((a, b) =>
          a.name.toLowerCase() > b.name.toLowerCase() ? 1 : -1,
        ),
      );
      setIsRefreshing(false);
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'Contatos',
        text2: `Erro ao buscar os contatos: ${error.message}`,
      });

      setIsRefreshing(false);
    }
  };

  const filterContacts = (contacts, searchTerm, hideLocalContacts) => {
    const newContacts = contacts.filter(
      contact =>
        (!searchTerm || contact.name?.toLowerCase()?.includes(searchTerm.toLowerCase())) &&
        (hideLocalContacts ? !contact.local : true),
    );

    setContactsFiltered(newContacts);
  };

  const handleContactSelect = contact => {
    if (contact.phones.length > 1) {
      navigation.navigate('Contact', { ...contact });
      return;
    }

    const [phone = {}] = contact.phones;

    try {
      Phone.makeCall(String(phone?.number), state.user.server);
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'Ligar',
        text2: 'Erro ao efetuar a ligação: ${error.message}',
      });
    }
  };

  const togglePhoneContacts = hide => {
    setHidePhoneContacts(hide);

    debouncedSearchTerm
      ? filterContacts(phoneContacts, debouncedSearchTerm, hide)
      : filterContacts(phoneContacts, null, hide);
  };

  const renderContact = ({ item, index }) => (
    <ContactContainer
      key={index}
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
  );

  return (
    <>
      <Header />
      <Container>
        {!state.user?.server ? (
          <Failed navigation={navigation} />
        ) : !phoneContacts.length ? (
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

            <SwitchContainer>
              <SwitchLabel>Ocultar contatos do celular</SwitchLabel>
              <Switch
                value={hidePhoneContacts}
                onValueChange={value => togglePhoneContacts(value)}
                trackColor={{ false: '#767577', true: '#119114' }}
                thumbColor="#f4f3f4"
                ios_backgroundColor="#3e3e3e"
              />
            </SwitchContainer>

            <ContactsList
              data={debouncedSearchTerm || hidePhoneContacts ? contactsFiltered : phoneContacts}
              keyExtractor={(item, index) => index.toString()}
              refreshing={isRefreshing}
              onRefresh={getContacts}
              renderItem={renderContact}
            />
          </>
        )}
      </Container>
    </>
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
