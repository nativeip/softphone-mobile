import React, {useState, useEffect, useCallback} from 'react';
import {
  StyleSheet,
  FlatList,
  SafeAreaView,
  Text,
  View,
  TouchableOpacity,
} from 'react-native';

const DeviceList = ({socket, onSelectPeer, onAcceptCall}) => {
  const [clients, setClients] = useState([]);
  const [offer, setOffer] = useState(false);
  const [offerFrom, setOfferFrom] = useState(null);
  const [declined, setDeclined] = useState(false);

  useEffect(() => {
    ready();

    return removeListeners;
  }, [ready, removeListeners]);

  const ready = useCallback(() => {
    socket.on('clients', onAllClients);
    socket.on('call', onCall);

    if (socket) {
      socket.emit('ready', {
        message: 'Client is ready!',
      });
    }
  }, [socket, onAllClients, onCall]);

  const removeListeners = useCallback(() => {
    socket.removeListener('clients', onAllClients);
    socket.removeListener('call', onCall);
  }, [socket, onAllClients, onCall]);

  const onAllClients = useCallback(
    data => {
      const index = data.clients.indexOf(socket.id);

      if (index > -1) {
        data.clients.splice(index, 1);
      }

      setClients(data.clients);
    },
    [socket.id],
  );

  const onCall = useCallback(
    data => {
      if (data.offer) {
        setOffer(true);
        setOfferFrom(data.from);
        return;
      }

      if (data.accepted) {
        onSelectPeer(data.from);
        return;
      }

      setDeclined(true);
      setOfferFrom(data.from);
    },
    [onSelectPeer],
  );

  const callClient = socketId => {
    socket.emit('call', {
      to: socketId,
      offer: true,
    });
  };

  const answerCall = accepted => {
    socket.emit('call', {
      to: offerFrom,
      accepted: accepted,
    });

    if (accepted) {
      onAcceptCall(offerFrom);
    }

    setOffer(false);
  };

  return (
    <SafeAreaView style={styles.container}>
      {offer ? (
        <View style={styles.offer}>
          <Text style={styles.text}>New connection</Text>
          <Text style={styles.smallText}>Client {offerFrom}</Text>
          <View style={styles.offerButtons}>
            <TouchableOpacity
              style={[styles.button, styles.accept]}
              onPress={() => answerCall(true)}>
              <Text style={styles.accept}>Accept</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.button, styles.decline]}
              onPress={() => answerCall(false)}>
              <Text style={styles.decline}>Decline</Text>
            </TouchableOpacity>
          </View>
        </View>
      ) : null}

      {declined ? (
        <View style={styles.offer}>
          <Text style={styles.text}>Connection refused</Text>
          <TouchableOpacity
            style={[styles.button, styles.accept]}
            onPress={() => setDeclined(false)}>
            <Text style={styles.accept}>Ok</Text>
          </TouchableOpacity>
        </View>
      ) : null}

      <Text style={styles.id}>{socket.id}</Text>
      <Text style={styles.text}>Clients:</Text>
      <FlatList
        data={clients}
        renderItem={({item}) => (
          <Text style={styles.text} onPress={() => callClient(item)}>
            {item}
          </Text>
        )}
        keyExtractor={item => item}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
    height: '100%',
  },
  text: {
    fontWeight: 'bold',
    marginBottom: 15,
    fontSize: 26,
  },
  smallText: {
    marginTop: -15,
    marginBottom: 15,
    fontSize: 20,
  },
  id: {
    marginTop: 10,
  },
  offer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 15,
    position: 'absolute',
    backgroundColor: 'white',
    width: '80%',
    borderRadius: 5,
    borderWidth: 1,
    zIndex: 100,
  },
  offerButtons: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    width: '100%',
  },
  button: {
    alignItems: 'center',
    backgroundColor: '#DDDDDD',
    padding: 10,
  },
  decline: {
    backgroundColor: '#cd0030',
    color: '#ffffff',
  },
  accept: {
    backgroundColor: '#99cc00',
    color: '#ffffff',
  },
});

export default DeviceList;

// class DeviceList extends React.Component {
//   constructor(props) {
//     super(props);

//     this.state = {
//       clients: [],
//       offer: false,
//       offerFrom: null,
//       declined: false,
//     };

//     this.props.socket.on('clients', this._onAllClients);
//     this.props.socket.on('call', this._onCall);
//   }

//   componentDidMount() {
//     this._ready();
//   }

//   componentWillUnmount() {
//     this.props.socket.removeListener('clients', this._onAllClients);
//     this.props.socket.removeListener('call', this._onCall);
//   }

//   _onAllClients = data => {
//     let index = data.clients.indexOf(this.props.socket.id);
//     if (index > -1) {
//       data.clients.splice(index, 1);
//     }
//     this.setState({
//       clients: data.clients,
//     });
//   };

//   _onCall = data => {
//     if (data.offer) {
//       this.setState({
//         offer: true,
//         offerFrom: data.from,
//       });
//     } else if (data.accepted) {
//       this.props.onSelectPeer(data.from);
//     } else {
//       this.setState({
//         declined: true,
//         offerFrom: data.from,
//       });
//     }
//   };

//   _callClient = socketId => {
//     this.props.socket.emit('call', {
//       to: socketId,
//       offer: true,
//     });
//   };

//   _answerCall = accepted => {
//     this.props.socket.emit('call', {
//       to: this.state.offerFrom,
//       accepted: accepted,
//     });

//     if (accepted) {
//       this.props.onAcceptCall(this.state.offerFrom);
//     }

//     this.setState({
//       offer: false,
//     });
//   };

//   _ready = () => {
//     if (this.props.socket) {
//       this.props.socket.emit('ready', {
//         message: 'Client is ready!',
//       });
//     }
//   };

//   render() {
//     return (
//       <SafeAreaView style={styles.container}>
//         {this.state.offer ? (
//           <View style={styles.offer}>
//             <Text style={styles.text}>New connection</Text>
//             <Text style={styles.smallText}>Client {this.state.offerFrom}</Text>
//             <View style={styles.offerButtons}>
//               <TouchableOpacity
//                 style={[styles.button, styles.accept]}
//                 onPress={() => this._answerCall(true)}>
//                 <Text style={styles.accept}>Accept</Text>
//               </TouchableOpacity>
//               <TouchableOpacity
//                 style={[styles.button, styles.decline]}
//                 onPress={() => this._answerCall(false)}>
//                 <Text style={styles.decline}>Decline</Text>
//               </TouchableOpacity>
//             </View>
//           </View>
//         ) : null}
//         {this.state.declined ? (
//           <View style={styles.offer}>
//             <Text style={styles.text}>Connection refused</Text>
//             <TouchableOpacity
//               style={[styles.button, styles.accept]}
//               onPress={() => this.setState({declined: false})}>
//               <Text style={styles.accept}>Ok</Text>
//             </TouchableOpacity>
//           </View>
//         ) : null}
//         <Text style={styles.id}>{this.props.socket.id}</Text>
//         <Text style={styles.text}>Clients:</Text>
//         <FlatList
//           data={this.state.clients}
//           renderItem={({item}) => (
//             <Text style={styles.text} onPress={() => this._callClient(item)}>
//               {item}
//             </Text>
//           )}
//           keyExtractor={item => item}
//         />
//       </SafeAreaView>
//     );
//   }
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     backgroundColor: 'white',
//     height: '100%',
//   },
//   text: {
//     fontWeight: 'bold',
//     marginBottom: 15,
//     fontSize: 26,
//   },
//   smallText: {
//     marginTop: -15,
//     marginBottom: 15,
//     fontSize: 20,
//   },
//   id: {
//     marginTop: 10,
//   },
//   offer: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     padding: 15,
//     position: 'absolute',
//     backgroundColor: 'white',
//     width: '80%',
//     borderRadius: 5,
//     borderWidth: 1,
//     zIndex: 100,
//   },
//   offerButtons: {
//     flex: 1,
//     flexDirection: 'row',
//     justifyContent: 'space-evenly',
//     width: '100%',
//   },
//   button: {
//     alignItems: 'center',
//     backgroundColor: '#DDDDDD',
//     padding: 10,
//   },
//   decline: {
//     backgroundColor: '#cd0030',
//     color: '#ffffff',
//   },
//   accept: {
//     backgroundColor: '#99cc00',
//     color: '#ffffff',
//   },
// });

// export default DeviceList;
