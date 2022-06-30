import React, { useEffect } from 'react';
import {
  IonContent,
  IonToolbar,
  IonButtons,
  IonTitle,
  IonHeader,
  IonLabel,
  IonButton,
  IonPage,
  IonLoading,
} from '@ionic/react';
import { useFirestore, useFirestoreCollectionData } from 'reactfire';
import { collection } from '@firebase/firestore';
import { CREATE_PROJECT } from '../../app/routes';
import ProjectCard from './components/ProjectCard';
import { logout } from '../../services/auth';
import { useDispatch } from 'react-redux';
import { PERMISSION_PROJECT_CREATE } from '../../data/roles';
import PermissionBox from '../../components/PermissionBox';
import { PushNotifications } from '@capacitor/push-notifications';

const Projects: React.FC = () => {
  const dispatch = useDispatch();
  const firestore = useFirestore();
  const ref = collection(firestore, 'projects');

  const { status, data: projects } = useFirestoreCollectionData(ref);
  const isLoading = status === 'loading';

  const addListeners = async () => {
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
  };

  const registerNotifications = async () => {
    let permStatus = await PushNotifications.checkPermissions();

    if (permStatus.receive === 'prompt') {
      permStatus = await PushNotifications.requestPermissions();
    }

    if (permStatus.receive !== 'granted') {
      throw new Error('User denied permissions!');
    }

    await PushNotifications.register();
  };

  const getDeliveredNotifications = async () => {
    const notificationList = await PushNotifications.getDeliveredNotifications();
    console.log('delivered notifications', notificationList);
  };

  const logOut = async () => {
    dispatch(logout());
  };

  useEffect(() => {
    addListeners();
    registerNotifications();
    getDeliveredNotifications();
  }, []);

  if (!projects || isLoading) {
    return <IonLoading isOpen />;
  }

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonButton color="danger" onClick={logOut}>
              Logout
            </IonButton>
          </IonButtons>
          <IonTitle>Project Tracker</IonTitle>

          <IonButtons slot="end">
            <PermissionBox has={PERMISSION_PROJECT_CREATE}>
              <IonButton routerLink={CREATE_PROJECT}>
                <IonLabel>Create</IonLabel>
              </IonButton>
            </PermissionBox>
          </IonButtons>
        </IonToolbar>
      </IonHeader>

      <IonContent>
        {projects.map((project: any, index: number) => (
          <ProjectCard key={index} project={project} />
        ))}
      </IonContent>
    </IonPage>
  );
};

export default Projects;
