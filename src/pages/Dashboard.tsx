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

const Dashboard: React.FC = () => {
  const data = useSelector(getProjectsIds);

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Project Tracker</IonTitle>

          <IonButtons slot="end">
            <IonButton routerLink="/createProject">
              <IonLabel>Create</IonLabel>
            </IonButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>

      <IonContent fullscreen>
        {data &&
          data.map((project: Project) => (
            <ProjectCard key={project.id} project={project} />
        ))}
      </IonContent>
    </IonPage>
  );
};

export default Dashboard;
