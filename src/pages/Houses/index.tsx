import React, { useCallback } from 'react';
import {
  IonContent,
  IonToolbar,
  IonButtons,
  IonTitle,
  IonHeader,
  IonLabel,
  IonButton,
  IonPage,
  IonLoading,
  IonBackButton,
  useIonAlert,
  useIonToast,
} from '@ionic/react';
import { useFirestore, useFirestoreCollectionData, useFirestoreDocData } from 'reactfire';
import { query, collection, doc, addDoc, deleteDoc, where } from '@firebase/firestore';
import { useHistory, useParams } from 'react-router';
import { PERMISSION_HOUSE_CREATE, PERMISSION_PROJECT_DELETE } from '../../data/roles';
import { getCurrentUserData } from '../../features/auth/authSlice';
import { useAppSelector } from '../../app/hooks';
import HouseCard from './components/HouseCard';
import PermissionBox from '../../components/PermissionBox';

const Houses: React.FC = () => {
  const [present] = useIonAlert();
  const [createStepAlert] = useIonAlert();
  const [presentCreateStepToast] = useIonToast();
  const { goBack } = useHistory();
  const { projectId } = useParams<any>();
  const currentUser = useAppSelector(getCurrentUserData);
  const firestore = useFirestore();
  const houseRef = collection(firestore, 'houses');
  const projectRef = doc(firestore, 'projects', projectId);

  const { data: project } = useFirestoreDocData(projectRef);
  const { status, data: houses } = useFirestoreCollectionData(
    query(
      houseRef,
      where('projectId', '==', projectId),
      where('accessUsers', 'array-contains', currentUser.id),
    ),
  );

  const isLoading = status === 'loading';

  const onCreateHouse = useCallback(() => {
    createStepAlert({
      header: 'Create House',
      inputs: [
        {
          name: 'name',
          placeholder: 'Name',
          type: 'text',
          attributes: {
            autoComplete: 'none',
          },
        },
        {
          name: 'description',
          placeholder: 'Description',
          type: 'textarea',
        },
      ],
      buttons: [
        { text: 'Cancel', role: 'destructive' },
        {
          text: 'Create',
          handler: async ({ name, description }) => {
            if (!name || !description) {
              presentCreateStepToast({
                message: 'All fields must be entered!',
                color: 'danger',
                duration: 2000,
              });
              return;
            }
            try {
              await addDoc(houseRef, {
                name,
                description,
                imageURL: 'https://wallpaperaccess.com/full/1126753.jpg',
                projectId: projectId,
                steps: [],
                authorId: currentUser.id,
                accessUsers: [currentUser.id],
              });
              presentCreateStepToast({
                message: 'New House created!',
                color: 'success',
                duration: 2000,
              });
            } catch {
              presentCreateStepToast({
                message: 'Unable to create a house',
                color: 'danger',
                duration: 2000,
              });
            }
          },
        },
      ],
    });
  }, [createStepAlert, presentCreateStepToast, houseRef, projectId, currentUser.id]);

  const onDeleteProject = useCallback(() => {
    if (!projectRef) {
      return;
    }

    present({
      header: 'Delete',
      message: 'Are you sure?',
      buttons: [
        'Cancel',
        {
          text: 'Delete',
          role: 'destructive',
          handler: async () => {
            await deleteDoc(projectRef);
            goBack();
          },
        },
      ],
    });
  }, [present, projectRef, goBack]);

  if (!project || isLoading) {
    return <IonLoading isOpen />;
  }

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton defaultHref="/" />
          </IonButtons>
          <IonTitle>Houses</IonTitle>

          <IonButtons slot="end">
            <PermissionBox has={PERMISSION_HOUSE_CREATE}>
              <IonButton onClick={onCreateHouse}>
                <IonLabel>Create</IonLabel>
              </IonButton>
            </PermissionBox>
          </IonButtons>
        </IonToolbar>
      </IonHeader>

      <IonContent>
        {houses.map((house: any, index: number) => (
          <HouseCard key={index} house={house} />
        ))}
      </IonContent>
      {project && (
        <PermissionBox has={PERMISSION_PROJECT_DELETE}>
          <IonButton expand="full" color="danger" onClick={onDeleteProject}>
            Delete Project
          </IonButton>
        </PermissionBox>
      )}
    </IonPage>
  );
};

export default Houses;
