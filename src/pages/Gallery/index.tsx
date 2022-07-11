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
import {
  useFirestore,
  useFirestoreCollectionData,
  useFirestoreDocData,
  useStorage,
} from 'reactfire';
import { useHistory, useParams } from 'react-router';
import { setDoc, deleteDoc, doc, collection, updateDoc } from 'firebase/firestore';
import { ref, uploadBytesResumable, getDownloadURL, deleteObject } from 'firebase/storage';
import { FC, useCallback, useState } from 'react';
import { PERMISSION_GALLERY_DELETE, PERMISSION_GALLERY_UPLOAD } from '../../data/roles';
import { COMMENTS_PAGE, route } from '../../app/routes';
import PermissionBox from '../../components/PermissionBox';

const SingleImage: FC<{ image: any; onDelete: Function }> = ({ image, onDelete }) => {
  const [present] = useIonAlert();
  const { push } = useHistory();
  const { houseId, stepId } = useParams<any>();

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

  const onClick = useCallback(() => {
    push(
      route(COMMENTS_PAGE, {
        houseId,
        stepId,
        imageId: image.NO_ID_FIELD,
      }),
    );
  }, [push, houseId, stepId, image.NO_ID_FIELD]);

  return (
    <IonCol size="6" className="h-40">
      <IonImg src={image.imageURL} className="w-full h-full" onClick={onClick} />
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
  const storage = useStorage();
  const [uploading, setUploading] = useState(false);
  const { getPhotos } = usePhotoGallery();
  const { houseId, stepId } = useParams<any>();

  const stepRef = doc(firestore, `houses/${houseId}/steps/${stepId}`);
  const galleryRef = collection(firestore, `houses/${houseId}/steps/${stepId}/gallery`);

  const { data: step } = useFirestoreDocData(stepRef);
  const { status, data: galleryData } = useFirestoreCollectionData(galleryRef);

  const uploadPhoto = async () => {
    const photos = await getPhotos();
    setUploading(true);
    photos.forEach(async (photo, index) => {
      const fileName = new Date().getTime() + `${index}.jpeg`;
      const response = await fetch(photo.webPath!);
      const blob = await response.blob();
      const newRef = ref(storage, `images/${fileName}`);
      const uploadTask = await uploadBytesResumable(newRef, blob);
      const photoURL = await getDownloadURL(uploadTask.ref);

      await setDoc(doc(galleryRef, fileName), { imageURL: photoURL });
    });
    setUploading(false);
  };

  const deleteItem = async (id: any) => {
    try {
      await deleteDoc(doc(galleryRef, id));
      // Create a reference to the file to delete
      const desertRef = ref(storage, `images/${id}`);

      // Delete the file
      await deleteObject(desertRef);
    } catch (error) {
      console.error('🚀 ~ file: index.tsx ~ line 44 ~ error', error);
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
