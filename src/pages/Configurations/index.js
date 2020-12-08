import React, { useContext, useRef, useEffect } from 'react';
import { KeyboardAvoidingView, ScrollView, Platform, Alert } from 'react-native';
import RNExitApp from 'react-native-exit-app';
import { Form } from '@unform/mobile';

import { store } from '../../store';
import { unregister, register } from '../../actions/phoneActions';

import { stopForegroundService } from '../../utils/foregroundService';
import { unregisterCallKeep } from '../../utils/callKeep';

import Header from '../../components/Header';
import Button from '../../components/Button';
import Input from '../../components/Input';

import { loadConfig, saveConfig } from '../../utils/loadLocalStorageConfig';
import { setConfig } from '../../actions/userConfigActions';

import { Container, Title, Controls } from './styles';

const Configurations = () => {
  const { state, dispatch } = useContext(store);
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

  const handleSaveData = async data => {
    await saveConfig(data);
    dispatch(setConfig(data));
    dispatch(register(data));
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
                onSubmitEditing={() => peerInputRef.current?.focus()}
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
              />

              <Input
                ref={secretInputRef}
                name="secret"
                icon="key"
                placeholder="Senha ramal"
                returnKeyType="send"
                onSubmitEditing={() => formRef.current?.submitForm()}
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
