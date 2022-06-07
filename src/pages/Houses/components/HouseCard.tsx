import { IonCard, IonImg, IonCardHeader, IonCardTitle, IonCardContent } from '@ionic/react';
import { HOUSES_PAGE, PROJECTS_PAGE, STEPS_PAGE } from '../../../app/routes';
import '../../../global.css';

interface HouseCardProps {
  house: {
    NO_ID_FIELD: string;
    name: string;
    description: string;
    imageURL: string;
    progress?: number;
    projectId: number;
  };
}

const HouseCard: React.FC<HouseCardProps> = ({ house }) => (
  <IonCard
    color="white"
    routerLink={`${PROJECTS_PAGE}/${house.projectId}${HOUSES_PAGE}/${house.NO_ID_FIELD}${STEPS_PAGE}`}
  >
    <IonImg src={house.imageURL} />
    <IonCardHeader className="space-between">
      <IonCardTitle>{house.name}</IonCardTitle>
      <IonCardTitle>{house.progress ?? 0}%</IonCardTitle>
    </IonCardHeader>
    <IonCardContent>{house.description}</IonCardContent>
  </IonCard>
);

export default HouseCard;
