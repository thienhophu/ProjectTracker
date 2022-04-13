import { 
  IonCard,
  IonImg, 
  IonCardHeader,
  IonCardTitle,
  IonCardContent
} from "@ionic/react";
import { Projects } from "../data/projects";
interface ProjectCardProps {
  project: Projects;
}

const ProjectCard: React.FC<ProjectCardProps> = ({ project }) => {
  
  return (
    <IonCard button color={'white'} routerDirection = {'back'}>
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
