import React, {useState, useEffect, useCallback} from 'react';
import {Text, StatusBar, Button, Vibration, AppRegistry} from 'react-native';
import {RTCPeerConnection} from 'react-native-webrtc';
import InCallManager from 'react-native-incall-manager';
import CallKeep from 'react-native-callkeep';
import ramdomUuid from 'uuid-random';
import * as JsSIP from 'jssip';

import useReferredState from './src/hooks/useReferredState';

const App = () => {
  const [peer] = useState({
    server: 'infinity.nativeip.com.br',
    pass: 'Native.111',
    user: '111',
  });

  const callOptions = {
    mediaConstraints: {
      audio: true,
      video: false,
      pcConfig: {
        iceServers: [{urls: ['stun:stun.l.google.com:19302']}],
      },
    },
  };

  const [phoneStatus, setPhoneStatus] = useState('');
  const [callUuid, setCallUuid] = useState('');
  const [callStatus, setCallStatus] = useState('');
  const [callTime, setCallTime] = useState(0);
  const [caller, setCaller] = useState({});
  const [callNumber, setCallNumber] = useState('');
  const [phone, phoneRef, setPhone] = useReferredState(null);
  const [session, sessionRef, setSession] = useReferredState(null);

  useEffect(() => {
    requestPermissions();
    register();

    return unregister;
  }, [register, unregister]);

  const register = useCallback(() => {
    RTCPeerConnection.prototype.addTrack = function(track, stream) {
      this.addStream(stream);
    };

    configureCallKeep();

    JsSIP.debug.enable('JsSIP:*');

    if (!peer.server || !peer.pass || !peer.user) {
      return;
    }

    const sip = {
      host: `wss://${peer?.server}/ws`,
      password: peer?.pass,
      uri: `sip:${peer?.user}@${peer?.server}`,
    };

    const socket = new JsSIP.WebSocketInterface(sip.host);

    const configuration = {
      sockets: [socket],
      uri: sip.uri,
      password: sip.password,
    };

    const newPhone = new JsSIP.UA(configuration);

    newPhone.on('connecting', () => setPhoneStatus('Conectando...'));
    newPhone.on('connected', () => setPhoneStatus('Conectado'));
    newPhone.on('disconnected', () => setPhoneStatus('Desconectado'));
    newPhone.on('registered', () => setPhoneStatus('Registrado'));
    newPhone.on('unregistered', () => setPhoneStatus('Sem registro'));
    newPhone.on('registrationFailed', () =>
      setPhoneStatus('Falha de registro'),
    );

    newPhone.on('newRTCSession', event => handleNewSession(event.session));

    newPhone.start();

    setPhone(newPhone);
  }, [peer, setPhone, handleNewSession]);

  const unregister = useCallback(() => {
    if (!phoneRef.current) {
      return;
    }

    // clearSession(sessionRef.current);

    phoneRef.current.stop();
    phoneRef.current.removeAllListeners();
    phoneRef.current.unregister();

    setPhone(null);
    CallKeep.setAvailable(false);
  }, [phoneRef, setPhone]);

  const requestPermissions = async () => {
    if (InCallManager.recordPermission !== 'granted') {
      try {
        await InCallManager.requestRecordPermission();
      } catch (error) {
        console.error(
          'Error getting permissions to record audio: ',
          error.message,
        );
      }
    }

    if (InCallManager.cameraPermission !== 'granted') {
      try {
        await InCallManager.requestCameraPermission();
      } catch (error) {
        console.error('Error getting permissions to  camera: ', error.message);
      }
    }
  };

  const configureCallKeep = async () => {
    AppRegistry.registerHeadlessTask(
      'RNCallKeepBackgroundMessage',
      () => ({name, callUUID, handle}) => {
        // Make your call here
        console.log('>>> Make your call now');

        return Promise.resolve();
      },
    );

    const options = {
      ios: {
        appName: 'Infinity Softphone',
      },
      android: {
        alertTitle: 'Permissions required',
        alertDescription:
          'This application needs to access your phone accounts',
        cancelButton: 'Cancel',
        okButton: 'ok',
        imageName: 'phone_account_icon',
        // additionalPermissions: [PermissionsAndroid.PERMISSIONS.example]
      },
    };

    await CallKeep.setup(options);
    CallKeep.setAvailable(true);
  };

  const makeCall = number => {
    if (!phoneRef.current?.isRegistered()) {
      return;
    }

    const newSession = phoneRef.current.call(
      `sip:${number}@${peer.server}`,
      callOptions,
    );

    setSession(newSession);
    const uuid = ramdomUuid();
    CallKeep.startCall(uuid, number, 'Fábio Gross');
    setCallUuid(uuid);
  };

  const answerCall = () => {
    if (sessionRef.current?.isInProgress()) {
      sessionRef.current.answer(callOptions);
      CallKeep.answerIncomingCall(callUuid);
    }
  };

  const handleNewSession = useCallback(
    newSession => {
      if (newSession.direction === 'incoming') {
        InCallManager.startRingtone('_BUNDLE_');
        Vibration.vibrate([1000, 2000, 3000], true);
      }

      newSession.on('ended', () => clearSession(newSession));
      newSession.on('failed', () => clearSession(newSession));
      newSession.on('accepted', () => updateUI(newSession));
      newSession.on('confirmed', () => updateUI(newSession));

      updateUI(newSession);
      setSession(newSession);
    },
    [clearSession, setSession, updateUI],
  );

  const updateUI = useCallback(
    newSession => {
      if (newSession.isInProgress()) {
        const number = newSession.remote_identity.uri.user;
        const name = newSession.remote_identity.display_name;
        const isIncoming = newSession.direction === 'incoming';

        setCaller({number, name});

        if (isIncoming) {
          const uuid = ramdomUuid();
          CallKeep.displayIncomingCall(uuid, number, name);

          setCallStatus('Recebendo ligação...');
          setCallUuid(uuid);
        }

        if (!isIncoming) {
          setCallStatus('Discando...');
        }
      }

      if (newSession.isEstablished()) {
        setCallStatus('Em ligação...');
        const name = newSession.remote_identity.display_name;
        CallKeep.updateDisplay(callUuid, name);

        // startCallTimer();

        InCallManager.stopRingtone();
        Vibration.cancel();
        InCallManager.start({media: 'audio'});
      }
    },
    [callUuid],
  );

  const clearSession = useCallback(
    newSession => {
      if (newSession?.isEstablished() || newSession?.isInProgress()) {
        newSession.terminate();
      }

      InCallManager.stopRingtone();
      Vibration.cancel();

      // stopCallTimer();

      InCallManager.stop();
      CallKeep.endCall(callUuid);

      setCallUuid('');
      setCallStatus('');
      setCallNumber('');
      setCaller({});
      setCallTime(0);
      setSession(null);
    },
    [setSession, callUuid],
  );

  return (
    <>
      <StatusBar barStyle="dark-content" backgroundColor="white" />
      <Text>{phoneStatus}</Text>
      <Text>{callStatus}</Text>

      <Text>
        {caller.name} - {caller.number}
      </Text>

      {!session && <Button title="Call 101" onPress={() => makeCall('101')} />}

      {session && (
        <Button
          title="Hangup"
          onPress={() => clearSession(sessionRef.current)}
        />
      )}

      {session?.direction === 'incoming' && (
        <Button title="Answer" onPress={() => answerCall()} />
      )}
    </>
  );
};

export default App;
