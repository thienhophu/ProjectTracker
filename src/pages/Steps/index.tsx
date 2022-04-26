import {
  IonBackButton,
  IonButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonImg,
  IonItem,
  IonLabel,
  IonList,
  IonLoading,
  IonPage,
  IonReorder,
  IonReorderGroup,
  IonThumbnail,
  IonTitle,
  IonToolbar,
  useIonAlert,
  useIonToast,
} from '@ionic/react';
import { addDoc, collection, deleteDoc, doc } from 'firebase/firestore';
import { useCallback, useEffect, useState } from 'react';
import { useHistory, useParams } from 'react-router';
import { useFirestore, useFirestoreCollectionData } from 'reactfire';
import { GALLERY_PAGE } from '../../app/routes';
import './styles.css';

const Steps: React.FC = () => {
  const [enableReorder, setEnableReorder] = useState(false);
  const [steps, setSteps] = useState<any>([]);
  const firestore = useFirestore();
  const { id } = useParams<any>();
  const { goBack } = useHistory();
  const [present] = useIonAlert();
  const [createStepAlert] = useIonAlert();
  const [presentCreateStepToast] = useIonToast();

  const projectRef = doc(firestore, 'projects', id);
  const stepRef = collection(firestore, `projects/${id}/steps`);

  const { status, data: stepsData } = useFirestoreCollectionData(stepRef);

  const reorderText = enableReorder ? 'Done' : 'Re-order';

  const onToggleReorder = useCallback(() => {
    setEnableReorder(!enableReorder);
  }, [setEnableReorder, enableReorder]);

  const doReorder = useCallback(
    (event: CustomEvent) => {
      setSteps(event.detail.complete(steps));
    },
    [steps],
  );

  const onDeleteProject = useCallback(() => {
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
  }, [projectRef, goBack, present]);

  const onCreateStep = useCallback(() => {
    createStepAlert({
      header: 'Delete',
      message: 'Are you sure?',
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
              await addDoc(stepRef, {
                name,
                description,
                imageURL:
                  'https://thumbor.forbes.com/thumbor/fit-in/900x510/https://www.forbes.com/advisor/wp-content/uploads/2021/05/featured-image-cost-of-new-home.jpeg.jpg',
              });
              presentCreateStepToast({
                message: 'New Step created!',
                color: 'success',
                duration: 2000,
              });
            } catch {
              presentCreateStepToast({
                message: 'Unable to create a step',
                color: 'danger',
                duration: 2000,
              });
            }
          },
        },
      ],
    });
  }, [presentCreateStepToast, createStepAlert, stepRef]);

  useEffect(() => {
    if (stepsData) {
      setSteps(stepsData);
    }
  }, [stepsData]);

  const isLoading = status === 'loading';

  if (!steps || isLoading) {
    return <IonLoading isOpen />;
  }

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton defaultHref="/" />
          </IonButtons>
          <IonTitle>Steps</IonTitle>
          <IonButtons slot="end">
            <IonButton onClick={onToggleReorder}>{reorderText}</IonButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <IonList>
          <IonReorderGroup disabled={!enableReorder} onIonItemReorder={doReorder}>
            {steps.map((step: any) => (
              <IonItem key={step.NO_ID_FIELD} routerLink={GALLERY_PAGE}>
                <IonThumbnail slot="start">
                  <IonImg src="https://thumbor.forbes.com/thumbor/fit-in/900x510/https://www.forbes.com/advisor/wp-content/uploads/2021/05/featured-image-cost-of-new-home.jpeg.jpg" />
                </IonThumbnail>
                <IonLabel>
                  <h2>{step.name}</h2>
                  <p>{step.description}</p>
                </IonLabel>
                <IonReorder slot="end" />
              </IonItem>
            ))}
          </IonReorderGroup>
        </IonList>
        <IonButton expand="full" onClick={onCreateStep}>
          Create Step
        </IonButton>
        <IonButton expand="full" color="danger" onClick={onDeleteProject}>
          Delete Project
        </IonButton>
      </IonContent>
    </IonPage>
  );
};

export default Steps;
