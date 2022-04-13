import { 
  IonCard,
  IonImg, 
  IonCardHeader,
  IonCardTitle,
  IonCardContent
} from "@ionic/react";
import { Project } from "../data/projects";

interface ProjectCardProps {
  project: Project;
}

const ProjectCard: React.FC<ProjectCardProps> = ({ project }) => {
  return (
    <IonCard color='white'>
      <IonImg src={project.imageUrl} />
        <IonCardHeader>
          <IonCardTitle>{project.title}</IonCardTitle>
        </IonCardHeader>
        <IonCardContent>
          {project.description}
        </IonCardContent>
      </IonCard>
  );
}; 

export default ProjectCard;
