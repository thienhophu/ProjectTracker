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
  IonCol,
  useIonAlert,
} from '@ionic/react';
import { removeCircle } from 'ionicons/icons';
import { usePhotoGallery } from '../../app/hooks';
import { useFirestore, useFirestoreCollectionData, useFirestoreDocData } from 'reactfire';
import { useParams } from 'react-router';
import { setDoc, deleteDoc, doc, collection, updateDoc } from 'firebase/firestore';
import { FC, useCallback, useState } from 'react';
import { PERMISSION_GALLERY_DELETE, PERMISSION_GALLERY_UPLOAD } from '../../data/roles';
import PermissionBox from '../../components/PermissionBox';

const SingleImage: FC<{ image: any; onDelete: Function }> = ({ image, onDelete }) => {
  const [present] = useIonAlert();

  const onClickDelete = useCallback(() => {
    present({
      header: 'Delete',
      message: 'Are you sure?',
      buttons: [
        'Cancel',
        {
          text: 'Delete',
          role: 'destructive',
          handler: async () => {
            await onDelete(image.NO_ID_FIELD);
          },
        },
      ],
    });
  }, [image, onDelete, present]);

  return (
    <IonCol size="6" className="h-40">
      <IonImg src={image.imageURL} className="w-full h-full" />
      <PermissionBox has={PERMISSION_GALLERY_DELETE}>
        <IonIcon
          icon={removeCircle}
          color="danger"
          onClick={onClickDelete}
          className="absolute top-2 right-2 w-8 h-8"
          style={{ width: 30, height: 30 }}
        >
          DELETE
        </IonIcon>
      </PermissionBox>
    </IonCol>
  );
};

const Gallery: FC = () => {
  const firestore = useFirestore();
  const [uploading, setUploading] = useState(false);
  const { takePhoto } = usePhotoGallery();
  const { id, stepId } = useParams<any>();

  const stepRef = doc(firestore, `projects/${id}/steps/${stepId}`);
  const { data: step } = useFirestoreDocData(stepRef);
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

  const onToggleStepStatus = useCallback(async () => {
    if (!step) {
      return;
    }
    await updateDoc(stepRef, { isCompleted: !step.isCompleted });
  }, [stepRef, step]);

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
            <PermissionBox has={PERMISSION_GALLERY_UPLOAD}>
              <IonButton onClick={uploadPhoto}>
                <IonLabel>Upload</IonLabel>
              </IonButton>
            </PermissionBox>
          </IonButtons>
        </IonToolbar>
      </IonHeader>

      <IonContent>
        <PermissionBox has={PERMISSION_GALLERY_UPLOAD}>
          <IonButton
            color={step.isCompleted ? 'primary' : 'danger'}
            expand="full"
            className="m-3"
            onClick={onToggleStepStatus}
          >
            {step.isCompleted ? 'Completed' : 'In Progress'}
          </IonButton>
        </PermissionBox>
        <IonGrid>
          <IonRow>
            {galleryData.length === 0 && (
              <IonLabel className="text-center w-full">There is no images.</IonLabel>
            )}
            {galleryData.map((image: any) => (
              <SingleImage key={image.NO_ID_FIELD} image={image} onDelete={deleteItem} />
            ))}
          </IonRow>
        </IonGrid>
      </IonContent>
    </IonPage>
  );
};

export default Gallery;
