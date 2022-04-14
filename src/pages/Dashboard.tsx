import React from 'react';
import {
  IonContent,
  IonToolbar,
  IonButtons,
  IonTitle,
  IonHeader,
  IonLabel,
  IonButton
} from '@ionic/react';
import ProjectCard from '../components/ProjectCard';
import { projects } from '../data/projects';

const Dashboard: React.FC = () => {
  return (
    <IonContent fullscreen>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Project Tracker</IonTitle>

          <IonButtons slot='end'>
            <IonButton routerLink='/createProject'>
                <IonLabel>Create</IonLabel>
            </IonButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>
    
      {projects.map((project) => (
        <ProjectCard key={project.id} project={project} />
      ))}
    </IonContent>
  );
};

export default Dashboard;
