import io from 'socket.io-client';

import store from '../storeState';
import { addNotifications } from '../actions/notificationsActions';

export let socket;

export const connectToMonitorSocket = (server, peer) => {
  if (!server || !peer) {
    return null;
  }

  socket = io.connect(`https://${server}`, {
    path: '/monitorSocket',
    transports: ['websocket'],
  });

  socket.on('connect', () => {
    subscribeLostCalls(socket, peer);
  });

  socket.on('disconnect', () => socket.removeAllListeners());

  return socket;
};

export const disconnectFromMonitorSocket = socket => {
  if (!socket) {
    return null;
  }

  socket.disconnect();
  socket.close();

  return null;
};

const subscribeLostCalls = (socket, peer) => {
  if (!socket) {
    return;
  }

  socket.on('historyCallReceived', ({ destCallerIdNum, dialStatus }) => {
    if (destCallerIdNum != peer || dialStatus === 'ANSWER') {
      return;
    }

    store.dispatch(addNotifications(1));
  });
};
