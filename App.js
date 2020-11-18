import React, {useState, useEffect} from 'react';
import {StatusBar} from 'react-native';
import io from 'socket.io-client';
import {SERVER_URL} from './config';
import DeviceList from './src/components/DeviceList/DeviceList';
import VideoCallView from './src/components/VideoCallView/VideoCallView';

const App = () => {
  const options = {jsonp: false, transports: ['websocket']};

  const [socket] = useState(io(SERVER_URL, options));
  const [connection, setConnection] = useState(false);
  const [callee, setCallee] = useState(null);
  const [caller, setCaller] = useState(null);

  useEffect(() => {
    return io.Socket.disconnect;
  }, []);

  const handleSelectPeer = item => {
    setConnection(true);
    setCallee(item);
  };

  const handleAcceptCall = item => {
    setConnection(true);
    setCaller(item);
  };

  const handleCloseCall = () => {
    setConnection(false);
    setCallee(null);
    setCaller(null);
  };

  return (
    <>
      <StatusBar barStyle="dark-content" backgroundColor="white" />
      {connection ? (
        <VideoCallView
          socket={socket}
          callee={callee}
          caller={caller}
          onCloseCall={handleCloseCall}
        />
      ) : socket ? (
        <DeviceList
          socket={socket}
          onSelectPeer={handleSelectPeer}
          onAcceptCall={handleAcceptCall}
        />
      ) : null}
    </>
  );
};

export default App;
