import React, { useContext, useRef, useEffect, useState } from 'react';
import { KeyboardAvoidingView, ScrollView, Platform, DevSettings } from 'react-native';
import RNExitApp from 'react-native-exit-app';
import { Form } from '@unform/mobile';
import Toast from 'react-native-toast-message';

import api from '../../services/api';
import { store } from '../../store';
import { unregister } from '../../actions/phoneActions';

import { stopForegroundService } from '../../utils/foregroundService';
import { unregisterCallKeep } from '../../utils/callKeep';
import { loadConfig, saveConfig } from '../../utils/loadLocalStorageConfig';

import Header from '../../components/Header';
import Button from '../../components/Button';
import Input from '../../components/Input';

import { Container, Title, Controls } from './styles';

const Configurations = ({ navigation }) => {
  const { state, dispatch } = useContext(store);
  const [peerError, setPeerError] = useState(false);
  const formRef = useRef(null);
  const serverInputRef = useRef(null);
  const userInputRef = useRef(null);
  const passInputRef = useRef(null);
  const peerInputRef = useRef(null);
  const secretInputRef = useRef(null);

  useEffect(() => {
    const loadLocalData = async () => {
      const data = await loadConfig();
      formRef.current.setData(data);
    };

    loadLocalData();
  });

  const loadPeerConfig = async ({ server, user, pass }) => {
    try {
      const { data } = await api.post(`https://${server}/api/token`, {
        username: user,
        password: pass,
      });

      const { Peer } = data?.user;

      if (!Peer) {
        return null;
      }

      const { username, secret } = Peer;

      return { peer: String(username), secret };
    } catch (error) {
      return null;
    }
  };

  const handleSaveData = async data => {
    let peer = {};

    if (data.server && data.user && data.pass && !peerError) {
      peer = await loadPeerConfig(data);

      if (!peer) {
        Toast.show({
          type: 'error',
          text1: 'Ramal',
          text2: 'Erro ao buscar informações do ramal, preencha manualmente!',
        });

        formRef.current.setData({ ...data, peer: '', secret: '' });
        setPeerError(true);
        peerInputRef.current?.focus();
        return;
      }
    }

    if (!data.server || !data.user || !data.pass || !peer.secret || !peer.peer) {
      Toast.show({
        type: 'error',
        text1: 'Configurações',
        text2: 'Preencha todos os campos para continuar!',
      });

      formRef.current.setData(data);
    }

    await saveConfig({ ...data, ...peer });

    Toast.show({
      type: 'success',
      text1: 'Configurações salvas',
      text2: 'As configurações foram salvas com sucesso!',
    });

    DevSettings.reload();
    navigation.navigate('Softphone');
  };

  const exitApp = () => {
    dispatch(unregister());
    stopForegroundService();
    unregisterCallKeep();

    RNExitApp.exitApp();
  };

  return (
    <>
      <Header />
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        enabled>
        <ScrollView keyboardShouldPersistTaps="handled" contentContainerStyle={{ flexGrow: 1 }}>
          <Container>
            <Title>Preencha as informações abaixo:</Title>

            <Form style={{ width: '100%' }} ref={formRef} onSubmit={handleSaveData}>
              <Input
                ref={serverInputRef}
                name="server"
                autoCapitalize="none"
                defaultValue="Testando"
                keyboardType="url"
                icon="globe"
                placeholder="Endereço native"
                returnKeyType="next"
                onSubmitEditing={() => userInputRef.current?.focus()}
              />

              <Input
                ref={userInputRef}
                autoCapitalize="none"
                name="user"
                icon="user"
                placeholder="Usuário native"
                returnKeyType="next"
                onSubmitEditing={() => passInputRef.current?.focus()}
              />

              <Input
                ref={passInputRef}
                name="pass"
                icon="lock"
                placeholder="Senha native"
                returnKeyType="next"
                onSubmitEditing={() => formRef.current?.submitForm()}
                secureTextEntry
              />

              <Input
                ref={peerInputRef}
                autoCapitalize="none"
                keyboardType="number-pad"
                name="peer"
                icon="phone"
                placeholder="Ramal"
                returnKeyType="next"
                onSubmitEditing={() => secretInputRef.current?.focus()}
                visible={peerError}
              />

              <Input
                ref={secretInputRef}
                name="secret"
                icon="key"
                placeholder="Senha ramal"
                returnKeyType="send"
                onSubmitEditing={() => formRef.current?.submitForm()}
                visible={peerError}
                secureTextEntry
              />
            </Form>

            <Controls>
              <Button
                title="Salvar"
                onPress={() => formRef.current?.submitForm()}
                icon="checkmark-outline"
                color="#32a852"
              />
              <Button title="Sair" onPress={exitApp} color="#e0392d" icon="exit-outline" />
            </Controls>
          </Container>
        </ScrollView>
      </KeyboardAvoidingView>
    </>
  );
};

export default Configurations;
