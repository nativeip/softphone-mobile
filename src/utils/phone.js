import { Vibration } from 'react-native';
import CallKeep from 'react-native-callkeep';
import InCallManager from 'react-native-incall-manager';
import { v4 } from 'uuid';
import * as JsSIP from 'jssip';

import store from '../storeState';

import { clearSession, setSession } from '../actions/sessionActions';
import { setPhoneStatus } from '../actions/phoneStatusActions';
import { setCallStatus, clearCallStatus } from '../actions/callStatusActions';
import { clearCallNumber } from '../actions/callNumberActions';
import { setCaller, clearCaller } from '../actions/callerActions';
import { setCallId, clearCallId } from '../actions/callIdActions';

const callOptions = {
  mediaConstraints: {
    audio: true,
    video: false,
    pcConfig: {
      iceServers: [{ urls: ['stun:stun.l.google.com:19302'] }],
    },
  },
};

const END_CALL_REASONS = {
  BUSY: 1,
  REJECTED: 2,
  REDIRECTED: 3,
  UNAVAILABLE: 1,
  NOT_FOUND: 1,
  ADDRESS_INCOMPLETE: 1,
  INCOMPATIBLE_SDP: 1,
  MISSING_SDP: 1,
  AUTHENTICATION_ERROR: 1,
};

let phone = null;
let phoneStatus = '';
let session = null;
let uuid = v4();

const register = user => {
  if (phone) {
    unregister(phone);
  }

  JsSIP.debug.enable('JsSIP:*');
  // JsSIP.debug.disable();

  if (!user.server || !user.secret || !user.peer) {
    return null;
  }

  const sip = {
    host: `wss://${user?.server}/ws`,
    password: user?.secret,
    uri: `sip:${user?.peer}@${user?.server}`,
  };

  const socket = new JsSIP.WebSocketInterface(sip.host);

  const configuration = {
    sockets: [socket],
    uri: sip.uri,
    password: sip.password,
  };

  phone = new JsSIP.UA(configuration);

  phone.on('connecting', () => setStatus('Conectando...'));
  phone.on('connected', () => setStatus('Conectado'));
  phone.on('disconnected', () => setStatus('Desconectado'));
  phone.on('registered', () => setStatus('Registrado'));
  phone.on('unregistered', () => setStatus('Sem registro'));
  phone.on('registrationFailed', () => setStatus('Falha de registro'));
  phone.on('newRTCSession', event => handleNewSession(event.session));

  phone.start();

  CallKeep.setAvailable(true);

  CallKeep.addEventListener('answerCall', ({ callUUID }) => {
    answerCall(callUUID);
  });

  CallKeep.addEventListener('endCall', ({ callUUID }) => {
    clearCall(session, callUUID, null);
  });

  CallKeep.addEventListener('didPerformSetMutedCallAction', ({ muted }) => {
    muted ? session.mute() : session.unmute();
  });

  CallKeep.addEventListener('didToggleHoldCallAction', ({ hold }) => {
    hold ? session.hold() : session.unhold();
  });

  CallKeep.addEventListener('didPerformDTMFAction', ({ digits }) => {
    session.sendDTMF(digits);
  });

  return phone;
};

const unregister = () => {
  if (!phone) {
    return;
  }

  phone.terminateSessions();
  phone.stop();
  phone.removeAllListeners();
  phone.unregister();

  setStatus('Sem registro');
  return null;
};

const setStatus = status => {
  phoneStatus = status;
  store.dispatch(setPhoneStatus(status));
};

const getStatus = () => {
  return phoneStatus;
};

const makeCall = (number, server) => {
  if (!phone.isRegistered() || !number) {
    return;
  }

  session = phone.call(`sip:${number}@${server}`, callOptions);
  CallKeep.startCall(uuid, number, number);

  return session;
};

const answerCall = () => {
  if (session.isInProgress()) {
    CallKeep.answerIncomingCall(uuid);
    session.answer(callOptions);
  }
};

const handleNewSession = newSession => {
  session = newSession;

  if (newSession.direction === 'incoming') {
    InCallManager.startRingtone('_BUNDLE_');
    Vibration.vibrate([1000, 2000, 3000], true);
  }

  newSession.on('accepted', () => updateUI(newSession, uuid));
  newSession.on('confirmed', () => updateUI(newSession, uuid));
  newSession.on('ended', () => clearCall(newSession, uuid, null));

  newSession.on('failed', ({ cause }) => clearCall(newSession, uuid, cause));

  updateUI(newSession, uuid);
  store.dispatch(setSession(newSession));
};

const updateUI = (session, uuid) => {
  if (session.isInProgress()) {
    const number = session.remote_identity.uri.user;
    const name = session.remote_identity.display_name;
    const isIncoming = session.direction === 'incoming';

    store.dispatch(setCaller({ number, name }));

    if (isIncoming) {
      CallKeep.displayIncomingCall(uuid, number, name);

      store.dispatch(setCallStatus('Recebendo ligação...'));
      store.dispatch(setCallId(uuid));
    }

    if (!isIncoming) {
      store.dispatch(setCallStatus('Discando...'));
    }
  }

  if (session.isEstablished()) {
    store.dispatch(setCallStatus('Em ligação...'));
    CallKeep.setCurrentCallActive(uuid);

    InCallManager.stopRingtone();
    Vibration.cancel();
    InCallManager.start({ media: 'audio' });
  }
};

const clearCall = (session, uuid, cause) => {
  console.log({ session, uuid, cause });

  if (session?.isEstablished() || session?.isInProgress()) {
    if (session.direction === 'incoming') {
      CallKeep.rejectCall(uuid);
    }

    session.terminate();
  }

  if (cause) {
    CallKeep.reportEndCallWithUUID(uuid, END_CALL_REASONS[cause.toUpperCase()] ?? 1);
  }

  InCallManager.stopRingtone();
  Vibration.cancel();

  InCallManager.stop();
  CallKeep.endCall(uuid);

  store.dispatch(clearCallId());
  store.dispatch(clearCallStatus());
  store.dispatch(clearCaller());
  store.dispatch(clearCallNumber());
  store.dispatch(clearSession());
};

const Phone = {
  register,
  unregister,
  getStatus,
  makeCall,
  answerCall,
  clearCall,
};

export default Phone;
