/**
 * @format
 */

import {AppRegistry, LogBox} from 'react-native';
import App from './App';
import {name as appName} from './app.json';

LogBox.ignoreLogs([
  'Setting a timer',
  'Remote debugger',
  'registerHeadlessTask',
]);

AppRegistry.registerComponent(appName, () => App);
