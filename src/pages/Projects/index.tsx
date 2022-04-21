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

const Projects: React.FC = () => {
  const firestore = useFirestore();
  const ref = collection(firestore, 'projects');

  const { status, data: projects } = useFirestoreCollectionData(ref);
  const isLoading = status === 'loading';

  if (!projects || isLoading) {
    return <IonLoading isOpen />;
  }

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Project Tracker</IonTitle>

          <IonButtons slot="end">
            <IonButton routerLink={CREATE_PROJECT}>
              <IonLabel>Create</IonLabel>
            </IonButton>
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
