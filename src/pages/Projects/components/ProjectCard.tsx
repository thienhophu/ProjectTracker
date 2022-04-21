import { IonCard, IonImg, IonCardHeader, IonCardTitle, IonCardContent } from '@ionic/react';
import { STEPS_PAGE } from '../../../app/routes';

interface ProjectCardProps {
  project: {
    name: string;
    description: string;
    imageURL: string;
  };
}

const ProjectCard: React.FC<ProjectCardProps> = ({ project }) => (
  <IonCard color="white" routerLink={STEPS_PAGE}>
    <IonImg src={project.imageURL} />
    <IonCardHeader>
      <IonCardTitle>{project.name}</IonCardTitle>
    </IonCardHeader>
    <IonCardContent>{project.description}</IonCardContent>
  </IonCard>
);

export default ProjectCard;
