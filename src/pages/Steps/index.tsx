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
} from '@ionic/react';
import { deleteDoc, doc } from 'firebase/firestore';
import { useCallback, useState } from 'react';
import { useHistory, useParams } from 'react-router';
import { useFirestore, useFirestoreDocData } from 'reactfire';
import { GALLERY_PAGE } from '../../app/routes';
import './styles.css';

const Steps: React.FC = () => {
  const [enableReorder, setEnableReorder] = useState(false);
  const [steps, setSteps] = useState(['Step 1', 'Step 2', 'Step 3', 'Step 4', 'Step 5', 'Step 6']);
  const firestore = useFirestore();
  const { id } = useParams<any>();
  const { goBack } = useHistory();
  const [present] = useIonAlert();

  const projectRef = doc(firestore, 'projects', id);

  const { status, data: project } = useFirestoreDocData(projectRef);

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

  const isLoading = status === 'loading';

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
          <IonTitle>Steps</IonTitle>
          <IonButtons slot="end">
            <IonButton onClick={onToggleReorder}>{reorderText}</IonButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <IonList>
          <IonReorderGroup disabled={!enableReorder} onIonItemReorder={doReorder}>
            {steps.map((step) => (
              <IonItem key={step} routerLink={GALLERY_PAGE}>
                <IonThumbnail slot="start">
                  <IonImg src="https://www.linkpicture.com/q/mansion.jpg" />
                </IonThumbnail>
                <IonLabel>
                  <h2>{step}</h2>
                  <p>Step description</p>
                </IonLabel>
                <IonReorder slot="end" />
              </IonItem>
            ))}
          </IonReorderGroup>
        </IonList>
        <IonButton expand="full" color="danger" onClick={onDeleteProject}>
          Delete Project
        </IonButton>
      </IonContent>
    </IonPage>
  );
};

export default Steps;
