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
  IonModal,
  IonTextarea,
  IonButton,
  IonFooter,
} from '@ionic/react';
import { useFirestore, useFirestoreDocDataOnce } from 'reactfire';
import { useParams } from 'react-router';
import { doc } from 'firebase/firestore';
import { FC, useCallback, useState } from 'react';

const SingleComment: FC = () => {
  return (
    <IonItem>
      <IonLabel>
        <h2>
          <b>Thien Ho</b> <span>- 2 mins</span>
        </h2>
        <span>Comment on image.</span>
      </IonLabel>
    </IonItem>
  );
};

const Comments: FC = () => {
  const firestore = useFirestore();
  const { id, stepId, imageId } = useParams<any>();
  const [showModal, setShowModal] = useState(false);

  const imageRef = doc(firestore, `projects/${id}/steps/${stepId}/gallery`, imageId);
  const { status, data: image } = useFirestoreDocDataOnce(imageRef);

  const openAddCommentModal = useCallback(() => {
    setShowModal(true);
  }, [setShowModal]);

  const closeAddCommentModal = useCallback(() => {
    setShowModal(false);
  }, [setShowModal]);

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

      <IonModal isOpen={showModal} breakpoints={[0.5, 1]} initialBreakpoint={0.5}>
        <IonHeader>
          <IonToolbar>
            <IonTitle>Add comment</IonTitle>
            <IonButtons slot="end">
              <IonButton color="danger" onClick={closeAddCommentModal}>
                Cancel
              </IonButton>
            </IonButtons>
          </IonToolbar>
        </IonHeader>
        <IonContent fullscreen>
          <IonItem>
            <IonLabel position="stacked">Comment</IonLabel>
            <IonTextarea rows={6} />
          </IonItem>

          <IonButton expand="full" className="m-4">
            Comment
          </IonButton>
        </IonContent>
      </IonModal>
      <IonFooter>
        <IonButton expand="full" onClick={openAddCommentModal}>
          Add Comment
        </IonButton>
      </IonFooter>
    </IonPage>
  );
};

export default Comments;
