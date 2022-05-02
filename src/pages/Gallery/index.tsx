import {
  IonBackButton,
  IonButtons,
  IonButton,
  IonContent,
  IonGrid,
  IonHeader,
  IonImg,
  IonPage,
  IonLabel,
  IonRow,
  IonTitle,
  IonToolbar,
  IonLoading,
  IonIcon,
} from '@ionic/react';
import { removeCircle } from 'ionicons/icons';
import { usePhotoGallery } from '../../app/hooks';
import { useFirestore, useFirestoreCollectionData } from 'reactfire';
import { useParams } from 'react-router';
import { setDoc, deleteDoc, doc, collection } from 'firebase/firestore';
import { useState } from 'react';

const Gallery: React.FC = () => {
  const firestore = useFirestore();
  const [uploading, setUploading] = useState(false);
  const { takePhoto } = usePhotoGallery();
  const { id, stepId } = useParams<any>();

  const galleryRef = collection(firestore, `projects/${id}/steps/${stepId}/gallery`);
  const { status, data: galleryData } = useFirestoreCollectionData(galleryRef);

  const uploadPhoto = async () => {
    const snapshot = await takePhoto();
    setUploading(true);
    await setDoc(doc(galleryRef, snapshot.name), { imageURL: snapshot.photoURL });
    setUploading(false);
  };

  const deleteItem = async (id: any) => {
    try {
      await deleteDoc(doc(galleryRef, id));
    } catch (error) {
      console.log('🚀 ~ file: index.tsx ~ line 44 ~ error', error);
    }
  };

  const isLoading = status === 'loading';

  if (isLoading || uploading) {
    return <IonLoading isOpen />;
  }

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton defaultHref="/" />
          </IonButtons>
          <IonTitle>Gallery</IonTitle>

          <IonButtons slot="end">
            <IonButton onClick={uploadPhoto}>
              <IonLabel>Upload</IonLabel>
            </IonButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>

      <IonContent>
        <IonGrid>
          {galleryData.map((i: any) => (
            <IonRow key={i.NO_ID_FIELD}>
              <IonIcon icon={removeCircle} color="danger" onClick={() => deleteItem(i.imageURL)}>
                DELETE
              </IonIcon>
              <IonImg src={i.imageURL} />
            </IonRow>
          ))}
        </IonGrid>
      </IonContent>
    </IonPage>
  );
};

export default Gallery;
