/**
 * @format
 */

import 'react-native-gesture-handler';
import { AppRegistry, LogBox } from 'react-native';
import App from './App';
import { name as appName } from './app.json';
import BackgroundTimer from 'react-native-background-timer';
import { createForegroundService } from './src/utils/foregroundService';

window.setTimeout = (fn, ms) => BackgroundTimer.setTimeout(fn, ms);
window.clearTimeout = timeoutId => BackgroundTimer.clearTimeout(timeoutId);
window.setInterval = (fn, ms) => BackgroundTimer.setInterval(fn, ms);
window.clearInterval = intervalId => BackgroundTimer.clearInterval(intervalId);

LogBox.ignoreLogs(['Setting a timer', 'Remote debugger', 'registerHeadlessTask']);

AppRegistry.registerComponent(appName, () => App);

createForegroundService();
