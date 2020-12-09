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
    console.log(`Sucessfull connected to ${server}`);
  });

  socket.on('disconnect', () => socket.removeAllListeners());
  socket.on('connect_error', () => console.log(`Failed to connect on ${server}`));

  return socket;
};

export const disconnectFromMonitorSocket = socket => {
  if (!socket) {
    return null;
  }

  socket.on('disconnect', () => console.log('Socket disconnected'));

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
