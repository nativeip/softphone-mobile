import React, { useEffect, useContext } from 'react';
import { Text, StatusBar, Button } from 'react-native';

import { store } from '../../store';
import Phone from '../../utils/phone';

import { setPhoneStatus } from '../../actions/phoneStatusActions';

const App = () => {
  const { state, dispatch } = useContext(store);

  useEffect(() => {
    dispatch(setPhoneStatus(Phone.getStatus()));
  }, []);

  return (
    <>
      <StatusBar barStyle="dark-content" backgroundColor="white" />
      <Text>Softphone Home</Text>
      <Text>{state.phoneStatus}</Text>
      <Text>{state.callStatus}</Text>
      <Text>
        {state.caller?.name} - {state.caller?.number}
      </Text>
      <Button title="Call 109" onPress={() => Phone.makeCall('109', state.peer.server)} />

      {/* {session && <Button title="Hangup" onPress={() => clearSession(sessionRef.current)} />}
      {session?.direction === 'incoming' && (
        <Button title="Answer" onPress={() => answerCall()} />
      )} */}
    </>
  );
};

export default App;
