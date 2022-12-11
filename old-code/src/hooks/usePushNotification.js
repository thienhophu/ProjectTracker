import { useCallback, useEffect } from 'react';
import { PushNotifications } from '@capacitor/push-notifications';
import { isPlatform } from '@ionic/react';

const usePushNotification = () => {
  const addListeners = useCallback(async () => {
    await PushNotifications.addListener('registration', (token) => {
      console.info('Registration token: ', token.value);
    });

    await PushNotifications.addListener('registrationError', (err) => {
      console.error('Registration error: ', err.error);
    });

    await PushNotifications.addListener('pushNotificationReceived', (notification) => {
      console.log('Push notification received: ', notification);
    });

    await PushNotifications.addListener('pushNotificationActionPerformed', (notification) => {
      console.log(
        'Push notification action performed',
        notification.actionId,
        notification.inputValue,
      );
    });
  }, []);

  const registerNotifications = useCallback(async () => {
    let permStatus = await PushNotifications.checkPermissions();

    if (permStatus.receive === 'prompt') {
      permStatus = await PushNotifications.requestPermissions();
    }

    if (permStatus.receive !== 'granted') {
      throw new Error('User denied permissions!');
    }

    await PushNotifications.register();
  }, []);

  useEffect(() => {
    const isNotRealMobile = isPlatform('mobileweb') || isPlatform('desktop');

    if (isNotRealMobile) {
      return;
    }

    addListeners();
    registerNotifications();

    return () => {
      if (isNotRealMobile) {
        return;
      }

      PushNotifications.removeAllListeners();
    };
  }, [addListeners, registerNotifications]);

  return null;
};

export default usePushNotification;
