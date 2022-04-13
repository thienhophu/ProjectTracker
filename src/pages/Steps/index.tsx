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
  IonPage,
  IonReorder,
  IonReorderGroup,
  IonThumbnail,
  IonTitle,
  IonToolbar,
} from '@ionic/react';
import { useCallback, useState } from 'react';
import './styles.css';

const Steps: React.FC = () => {
  const [enableReorder, setEnableReorder] = useState(false);
  const [steps, setSteps] = useState(['Step 1', 'Step 2', 'Step 3']);

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

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton />
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
              <IonItem key={step}>
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
      </IonContent>
    </IonPage>
  );
};

export default Steps;
