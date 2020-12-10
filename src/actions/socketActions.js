export const connect = (server, peer) => ({
  type: 'CONNECT_SOCKET',
  payload: { server, peer },
});

export const disconnect = socket => ({
  type: 'DISCONNECT_SOCKET',
  payload: { socket },
});
