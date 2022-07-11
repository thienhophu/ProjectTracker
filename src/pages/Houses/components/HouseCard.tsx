import { IonCard, IonImg, IonCardHeader, IonCardTitle, IonCardContent } from '@ionic/react';
import { route, STEPS_PAGE } from '../../../app/routes';
import '../../../global.css';

interface HouseCardProps {
  house: {
    NO_ID_FIELD: string;
    name: string;
    description: string;
    imageURL: string;
    progress?: number;
    projectId: number;
    accessUsers: [];
  };
}

const HouseCard: React.FC<HouseCardProps> = ({ house }) => (
  <IonCard color="white" routerLink={route(STEPS_PAGE, { houseId: house.NO_ID_FIELD })}>
    <IonImg src={house.imageURL} />
    <IonCardHeader className="space-between">
      <IonCardTitle>{house.name}</IonCardTitle>
      <IonCardTitle>{house.progress ?? 0}%</IonCardTitle>
    </IonCardHeader>
    <IonCardContent>{house.description}</IonCardContent>
  </IonCard>
);

export default HouseCard;
