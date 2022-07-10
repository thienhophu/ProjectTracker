import { IonCard, IonImg, IonCardHeader, IonCardTitle, IonCardContent } from '@ionic/react';
import { HOUSES_PAGE, route } from '../../../app/routes';
import '../../../global.css';

interface ProjectCardProps {
  project: {
    NO_ID_FIELD: string;
    name: string;
    description: string;
    imageURL: string;
  };
}

const ProjectCard: React.FC<ProjectCardProps> = ({ project }) => (
  <IonCard color="white" routerLink={route(HOUSES_PAGE, { projectId: project.NO_ID_FIELD })}>
    <IonImg src={project.imageURL} />
    <IonCardHeader className="space-between">
      <IonCardTitle>{project.name}</IonCardTitle>
    </IonCardHeader>
    <IonCardContent>{project.description}</IonCardContent>
  </IonCard>
);

export default ProjectCard;
