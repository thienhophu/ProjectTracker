import React, { useState } from 'react';
import { useAppDispatch } from '../app/hooks';
import { add } from '../features/projects/projectsSlice';
import { useHistory } from 'react-router-dom';
import { DASHBOARD_PAGE } from '../app/routes';
import {
  IonContent,
  IonToolbar,
  IonButtons,
  IonTitle,
  IonHeader,
  IonItem,
  IonLabel,
  IonBackButton,
  IonInput,
  IonList,
  IonTextarea,
  IonButton,
  IonPage,
  useIonViewWillEnter
} from '@ionic/react';

const CreateProject: React.FC = () => {
  const [projectName, setProjectName] = useState<string>('');
  const [projectDescription, setProjectDescription] = useState<string>('');
  const dispatch = useAppDispatch();
  const history = useHistory();

  useIonViewWillEnter(() => {
    setProjectName('');
    setProjectDescription('');
  });

  const createNewProject = () => {
    dispatch(
      add({
        id: '12312',
        name: projectName,
        description: projectDescription,
        progress: 0,
        steps: [],
      }),
    );
      history.push(DASHBOARD_PAGE);
  }
  
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Project Tracker</IonTitle>
          <IonButtons slot='start'>
            <IonBackButton defaultHref='\' />
          </IonButtons>

          <IonButtons slot='end'>
            <IonButton onClick={createNewProject}>
              Create
            </IonButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>

      <IonContent fullscreen>
        <IonList class='ion-margin'>
          <IonItem>
            <IonLabel position='stacked'>Project's name</IonLabel>
            <IonInput
              value={projectName}
              onIonChange={(event) => setProjectName(event.detail.value || '')}
            ></IonInput>
          </IonItem>
          
          <IonItem>
            <IonLabel position='stacked'>Project's Description</IonLabel>
            <IonTextarea
              auto-grow
              value={projectDescription}
              onIonChange={(event) => setProjectDescription(event.detail.value || '')}
            ></IonTextarea>
          </IonItem>
        </IonList>
      </IonContent>
    </IonPage>
  );
};

export default CreateProject;
