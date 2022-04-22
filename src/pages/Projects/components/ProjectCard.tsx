import { IonCard, IonImg, IonCardHeader, IonCardTitle, IonCardContent } from '@ionic/react';
import { PROJECTS_PAGE, STEPS_PAGE } from '../../../app/routes';

interface ProjectCardProps {
  project: {
    NO_ID_FIELD: string;
    name: string;
    description: string;
    imageURL: string;
  };
}

const ProjectCard: React.FC<ProjectCardProps> = ({ project }) => (
  <IonCard color="white" routerLink={`${PROJECTS_PAGE}/${project.NO_ID_FIELD}${STEPS_PAGE}`}>
    <IonImg src={project.imageURL} />
    <IonCardHeader>
      <IonCardTitle>{project.name}</IonCardTitle>
    </IonCardHeader>
    <IonCardContent>{project.description}</IonCardContent>
  </IonCard>
);

export default ProjectCard;
