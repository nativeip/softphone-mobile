import React, {useState, useEffect, useCallback} from 'react';
import {Text, StatusBar, Button} from 'react-native';
import {
  registerGlobals,
  mediaDevices,
  RTCPeerConnection,
  RTCIceCandidate,
  MediaStream,
  RTCSessionDescription,
  MediaStreamTrack,
} from 'react-native-webrtc';
import * as JsSIP from 'jssip';

import useReferredState from './src/hooks/useReferredState';

const App = () => {
  const [peer] = useState({
    server: 'infinity.nativeip.com.br',
    pass: 'Native.111',
    user: '111',
  });

  const [phoneStatus, setPhoneStatus] = useState('');
  const [isFront, setIsFront] = useState(false);
  const [stream, streamRef, setStream] = useReferredState(null);
  const [phone, phoneRef, setPhone] = useReferredState(null);
  const [session, sessionRef, setSession] = useReferredState(null);

  useEffect(() => {
    registerGlobals();
    register();

    JsSIP.debug.enable('JsSIP:*');

    return unregister;
  }, [register, unregister]);

  const register = useCallback(() => {
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

    // newPhone.on('newRTCSession', event => handleNewSession(event.session));

    newPhone.start();
    setPhone(newPhone);
  }, [peer, setPhone]);

  const unregister = useCallback(() => {
    if (!phoneRef.current) {
      return;
    }

    // clearSession(sessionRef.current);

    phoneRef.current.stop();
    phoneRef.current.removeAllListeners();
    phoneRef.current.unregister();

    setPhone(null);
  }, [phoneRef, setPhone]);

  const answerOrCall = callNumber => {
    const callOptions = {
      mediaConstraints: {
        audio: true,
        video: false,
        pcConfig: {
          iceServers: [{urls: ['stun:stun.l.google.com:19302']}],
        },
      },
    };

    if (!phoneRef.current?.isRegistered()) {
      return;
    }

    const newSession = phoneRef.current.call(
      `sip:${callNumber}@${peer.server}`,
      callOptions,
    );

    addTrack(newSession, newSession.connection);
    setSession(newSession);
  };

  const addTrack = (newSession, connection) => {
    connection.ontrack = event => {
      newSession.stream = event.streams[0];
    };
  };

  return (
    <>
      <StatusBar barStyle="dark-content" backgroundColor="white" />
      <Text>{phoneStatus}</Text>

      <Button
        title="List media devices"
        onPress={async () => console.log(await mediaDevices.enumerateDevices())}
      />

      <Button
        title="Get user media"
        onPress={async () => {
          const newStream = await mediaDevices.getUserMedia({
            audio: true,
            video: false,
          });

          setStream(newStream);
        }}
      />

      <Button title="Call 101" onPress={() => answerOrCall('101')} />
    </>
  );
};

export default App;
