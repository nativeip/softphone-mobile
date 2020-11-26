import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Text, StatusBar, Button, Vibration, AppRegistry, Platform } from 'react-native';
import { RTCPeerConnection } from 'react-native-webrtc';
import InCallManager from 'react-native-incall-manager';
import CallKeep from 'react-native-callkeep';
import { v4 } from 'uuid';
import * as JsSIP from 'jssip';
import ForegroundService from '@voximplant/react-native-foreground-service';
import BackgroundTimer from 'react-native-background-timer';

import useReferredState from './src/hooks/useReferredState';

window.setTimeout = (fn, ms) => BackgroundTimer.setTimeout(fn, ms);
window.clearTimeout = timeoutId => BackgroundTimer.clearTimeout(timeoutId);
window.setInterval = (fn, ms) => BackgroundTimer.setInterval(fn, ms);
window.clearInterval = intervalId => BackgroundTimer.clearInterval(intervalId);

const App = () => {
  const [peer] = useState({
    server: 'infinity.nativeip.com.br',
    pass: 'Native.111',
    user: '111',
  });

  const callOptions = useMemo(
    () => ({
      mediaConstraints: {
        audio: true,
        video: false,
        pcConfig: {
          iceServers: [{ urls: ['stun:stun.l.google.com:19302'] }],
        },
      },
    }),
    [],
  );

  const END_CALL_REASONS = useMemo(
    () => ({
      BUSY: 1,
      REJECTED: 2,
      REDIRECTED: 3,
      UNAVAILABLE: 1,
      NOT_FOUND: 1,
      ADDRESS_INCOMPLETE: 1,
      INCOMPATIBLE_SDP: 1,
      MISSING_SDP: 1,
      AUTHENTICATION_ERROR: 1,
    }),
    [],
  );

  const [phoneStatus, setPhoneStatus] = useState('');
  const [callId, callIdRef, setCallId] = useReferredState('');
  const [callStatus, setCallStatus] = useState('');
  const [caller, setCaller] = useState({});
  const [callNumber, setCallNumber] = useState('');
  const [phone, phoneRef, setPhone] = useReferredState(null);
  const [session, sessionRef, setSession] = useReferredState(null);

  useEffect(() => {
    requestPermissions();
    createForegroundService();
    register();

    // return unregister;
  }, [register, unregister]);

  const register = useCallback(() => {
    RTCPeerConnection.prototype.addTrack = function (track, stream) {
      this.addStream(stream);
    };

    // JsSIP.debug.enable('JsSIP:*');
    JsSIP.debug.disable();

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
    newPhone.on('registrationFailed', () => setPhoneStatus('Falha de registro'));

    newPhone.on('newRTCSession', event => handleNewSession(event.session));

    newPhone.start();

    setPhone(newPhone);

    configureCallKeep();
  }, [peer, setPhone, handleNewSession, configureCallKeep]);

  const unregister = useCallback(() => {
    if (!phoneRef.current) {
      return;
    }

    phoneRef.current.stop();
    phoneRef.current.removeAllListeners();
    phoneRef.current.unregister();

    setPhone(null);
    CallKeep.endAllCalls();
    CallKeep.setAvailable(false);

    CallKeep.removeEventListener('answerCall');
    CallKeep.removeEventListener('endCall');
    CallKeep.removeEventListener('didPerformSetMutedCallAction');
    CallKeep.removeEventListener('didToggleHoldCallAction');
    CallKeep.removeEventListener('didPerformDTMFAction');

    ForegroundService.stopService();
  }, [phoneRef, setPhone]);

  const requestPermissions = async () => {
    if (InCallManager.recordPermission !== 'granted') {
      try {
        await InCallManager.requestRecordPermission();
      } catch (error) {
        console.error('Error getting permissions to record audio: ', error.message);
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

  const configureCallKeep = useCallback(async () => {
    AppRegistry.registerHeadlessTask(
      'RNCallKeepBackgroundMessage',
      () => ({ name, callUUID, handle }) => {
        // Make your call here
        // CallKeep.backToForeground();
        console.log('>>> MAKE YOUR OUTGOING CALL NOW');

        return Promise.resolve();
      },
    );

    const options = {
      ios: {
        appName: 'Infinity Softphone',
      },
      android: {
        alertTitle: 'Permissões Necessárias',
        alertDescription: 'Essa aplicação precisa de permissões para acessar seu telefone',
        cancelButton: 'Cancelar',
        okButton: 'Aceitar',
        imageName: 'sim_icon',
      },
    };

    await CallKeep.setup(options);
    CallKeep.setAvailable(true);

    CallKeep.addEventListener('answerCall', ({ callUUID }) => {
      answerCall(callUUID);
    });

    CallKeep.addEventListener('endCall', ({ callUUID }) => {
      clearSession(sessionRef.current, callUUID);
    });

    CallKeep.addEventListener('didPerformSetMutedCallAction', ({ muted }) => {
      muted ? sessionRef.current.mute() : sessionRef.current.unmute();
    });

    CallKeep.addEventListener('didToggleHoldCallAction', ({ hold }) => {
      hold ? sessionRef.current.hold() : sessionRef.current.unhold();
    });

    CallKeep.addEventListener('didPerformDTMFAction', ({ digits }) => {
      sessionRef.current.sendDTMF(digits);
    });
  }, [answerCall, clearSession, sessionRef]);

  const createForegroundService = async () => {
    if (Platform.Version >= 26) {
      const channelConfig = {
        id: 'channelId',
        name: 'Channel name',
        description: 'Channel description',
        enableVibration: false,
      };

      ForegroundService.createNotificationChannel(channelConfig);
    }

    const notificationConfig = {
      channelId: 'channelId',
      id: 3456,
      title: 'Infinity Softphone',
      text: 'Some text',
      icon: 'ic_notification',
    };

    try {
      await ForegroundService.startService(notificationConfig);
    } catch (e) {
      console.error(e);
    }
  };

  const makeCall = number => {
    if (!phoneRef.current?.isRegistered()) {
      return;
    }

    const newSession = phoneRef.current.call(`sip:${number}@${peer.server}`, callOptions);

    setSession(newSession);

    const uuid = v4();
    CallKeep.startCall(uuid, number, number);
    setCallId(uuid);
  };

  const answerCall = useCallback(
    uuid => {
      if (sessionRef.current?.isInProgress()) {
        sessionRef.current.answer(callOptions);
        CallKeep.answerIncomingCall(uuid || callId);
      }
    },
    [callOptions, callId, sessionRef],
  );

  const handleNewSession = useCallback(
    newSession => {
      if (newSession.direction === 'incoming') {
        InCallManager.startRingtone('_BUNDLE_');
        Vibration.vibrate([1000, 2000, 3000], true);
      }

      newSession.on('accepted', () => updateUI(newSession));
      newSession.on('confirmed', () => updateUI(newSession));
      newSession.on('ended', () => clearSession(newSession));

      newSession.on('failed', ({ cause }) => clearSession(newSession, null, cause));

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

        setCaller({ number, name });

        if (isIncoming) {
          const uuid = v4();
          CallKeep.displayIncomingCall(uuid, number, name);

          setCallStatus('Recebendo ligação...');
          setCallId(uuid);
        }

        if (!isIncoming) {
          setCallStatus('Discando...');
        }
      }

      if (newSession.isEstablished()) {
        setCallStatus('Em ligação...');

        CallKeep.setCurrentCallActive(callIdRef.current);

        InCallManager.stopRingtone();
        Vibration.cancel();
        InCallManager.start({ media: 'audio' });
      }
    },
    [callIdRef, setCallId],
  );

  const clearSession = useCallback(
    (newSession, uuid, cause) => {
      if (newSession?.isEstablished() || newSession?.isInProgress()) {
        if (newSession.direction === 'incoming') {
          CallKeep.rejectCall(uuid || callIdRef.current);
        }

        newSession.terminate();
      }

      if (cause) {
        CallKeep.reportEndCallWithUUID(
          uuid || callIdRef.current,
          END_CALL_REASONS[cause.toUpperCase()] ?? 1,
        );
      }

      InCallManager.stopRingtone();
      Vibration.cancel();

      InCallManager.stop();
      CallKeep.endCall(uuid || callIdRef.current);

      setCallId('');
      setCallStatus('');
      setCallNumber('');
      setCaller({});
      setSession(null);
    },
    [setSession, callIdRef, setCallId, END_CALL_REASONS],
  );

  return (
    <>
      <StatusBar barStyle="dark-content" backgroundColor="white" />
      <Text>{phoneStatus}</Text>
      <Text>{callStatus}</Text>

      <Text>
        {caller.name} - {caller.number}
      </Text>

      {!session && <Button title="Call 109" onPress={() => makeCall('109')} />}

      {session && <Button title="Hangup" onPress={() => clearSession(sessionRef.current)} />}

      {session?.direction === 'incoming' && <Button title="Answer" onPress={() => answerCall()} />}
    </>
  );
};

export default App;
