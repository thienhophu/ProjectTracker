import React from "react";
import {
  IonContent,
  IonToolbar,
  IonButtons,
  IonTitle,
  IonHeader,
  IonLabel,
  IonButton,
  IonPage,
} from "@ionic/react";
import ProjectCard from "../components/ProjectCard";
import { projects } from "../data/projects";

const Dashboard: React.FC = () => {
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
        {projects.map((project) => (
          <ProjectCard key={project.id} project={project} />
        ))}
      </IonContent>
    </IonPage>
  );
};

export default Dashboard;
