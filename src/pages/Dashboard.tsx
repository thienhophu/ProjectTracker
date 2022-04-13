import React from 'react';
import {
  IonContent,
  IonPage,
  useIonViewWillEnter
} from "@ionic/react";
import ProjectCard from '../components/ProjectCard';
import { useState } from "react";
import { Projects, getProjects } from "../data/projects";

const Dashboard: React.FC = () => {
  const [projects, setProjects] = useState<Projects[]>([]);

  useIonViewWillEnter(() => {
    const projs = getProjects();
    setProjects(projs);
  });

  return (
    <IonPage id="home-page">
      <IonContent fullscreen>
      {projects.map((p) => (
            <ProjectCard key={p.id} project={p} />
      ))}
      </IonContent>
    </IonPage>
  );
};

export default Dashboard;
