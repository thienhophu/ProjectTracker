import {
  IonBackButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonPage,
  IonLabel,
  IonTitle,
  IonToolbar,
  IonLoading,
  IonImg,
  IonText,
  IonItemDivider,
  IonList,
  IonItem,
} from '@ionic/react';
import { useFirestore, useFirestoreDocDataOnce } from 'reactfire';
import { useParams } from 'react-router';
import { doc } from 'firebase/firestore';
import { FC } from 'react';

const SingleComment: FC = () => {
  return (
    <IonItem>
      <IonLabel>
        <h2>
          <b>Thien Ho</b> <span>- 2 mins</span>
        </h2>
        <caption>Comment on image.</caption>
      </IonLabel>
    </IonItem>
  );
};

const Comments: FC = () => {
  const firestore = useFirestore();
  const { id, stepId, imageId } = useParams<any>();

  const imageRef = doc(firestore, `projects/${id}/steps/${stepId}/gallery`, imageId);
  const { status, data: image } = useFirestoreDocDataOnce(imageRef);

  const isLoading = status === 'loading';

  if (isLoading) {
    return <IonLoading isOpen />;
  }

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton defaultHref="/" />
          </IonButtons>
          <IonTitle>Step 1</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent>
        <IonImg src={image.imageURL} className="w-full p-4" />
        <IonText className="p-4">{imageId}</IonText>

        <IonList className="mt-8">
          <IonItemDivider>
            <IonLabel>Comments</IonLabel>
          </IonItemDivider>
          <IonItem>
            <IonLabel className="text-center">There is no comments.</IonLabel>
          </IonItem>
          <SingleComment />
          <SingleComment />
          <SingleComment />
          <SingleComment />
          <SingleComment />
          <SingleComment />
          <SingleComment />
          <SingleComment />
          <SingleComment />
          <SingleComment />
          <SingleComment />
          <SingleComment />
          <SingleComment />
        </IonList>
      </IonContent>
    </IonPage>
  );
};

export default Comments;
