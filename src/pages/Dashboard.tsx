import React from 'react';
import {
  IonContent
} from '@ionic/react';
import ProjectCard from '../components/ProjectCard';
import { projects } from '../data/projects';

const Dashboard: React.FC = () => {
  return (
    <IonContent fullscreen>
      {projects.map((project) => (
        <ProjectCard key={project.id} project={project} />
      ))}
    </IonContent>
  );
};

export default Dashboard;
