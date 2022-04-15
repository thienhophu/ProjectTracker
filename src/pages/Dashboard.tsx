import React from 'react';
import { useSelector } from 'react-redux';
import {
  IonContent,
  IonToolbar,
  IonButtons,
  IonTitle,
  IonHeader,
  IonLabel,
  IonButton,
  IonPage,
} from '@ionic/react';
import ProjectCard from '../components/ProjectCard';
import {Project, getProjectsIds } from '../features/projects/projectsSlice';
import { CREATE_PROJECT} from '../app/routes';

const Dashboard: React.FC = () => {
  const data = useSelector(getProjectsIds);

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
        {data &&
          data.map((project: Project, index: number) => (
            <ProjectCard key={index} project={project} />
        ))}
      </IonContent>
    </IonPage>
  );
};

export default Dashboard;
