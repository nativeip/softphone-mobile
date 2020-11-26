import ForegroundService from '@voximplant/react-native-foreground-service';
import { Platform } from 'react-native';

export const createForegroundService = async () => {
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

export const stopForegroundService = () => {
  ForegroundService.stopService();
};
