import React from 'react';
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

const Projects: React.FC = () => {
  const dispatch = useDispatch();
  const firestore = useFirestore();
  const ref = collection(firestore, 'projects');

  const { status, data: projects } = useFirestoreCollectionData(ref);
  const isLoading = status === 'loading';

  const logOut = async () => {
    dispatch(logout());
  };

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

      <IonContent fullscreen>
        {projects.map((project: any, index: number) => (
          <ProjectCard key={index} project={project} />
        ))}
      </IonContent>
    </IonPage>
  );
};

export default Projects;
