import React, { useState, useMemo, SetStateAction, Dispatch } from 'react';
import { useAppDispatch } from '../app/hooks';
import { add } from '../features/projects/projectsSlice';
import { useHistory } from 'react-router-dom';

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
} from '@ionic/react';
import ErrorMessage from '../components/ErrorMessage';

const CreateProject: React.FC = () => {
  const [projectName, setProjectName] = useState<string>('');
  const [projectDescription, setProjectDescription] = useState<string>('');
  const [hasNameError, setHasNameError] = useState<boolean>(false);
  const [hasDescriptionError, setHasDescriptionError] = useState<boolean>(false);

  const dispatch = useAppDispatch();
  const { goBack } = useHistory();

  const onChangeProjectNameInput = (event: any) => {
    setHasNameError(false);
    setProjectName(event.detail.value || '');
  };

  const onChangeProjectDecriptionInput = (event: any) => {
    setHasDescriptionError(false);
    setProjectDescription(event.detail.value || '');
  };

  const clearAllFields = () => {
    setProjectName('');
    setProjectDescription('');
  };

  const showNameError = useMemo(() =>
    hasNameError ? <ErrorMessage fieldName='name' /> : null, [hasNameError]);

  const showDescriptionError = useMemo(() =>
    hasDescriptionError ? <ErrorMessage fieldName='description' /> : null, [hasDescriptionError]);

  const checkFieldValue = (field: string, hanldler: Dispatch<SetStateAction<boolean>>) => {
    const isFieldEmpty = field === '';
    hanldler(isFieldEmpty);
    return isFieldEmpty;
  };

  const createNewProject = () => {
    let isNameValue = checkFieldValue(projectName, setHasNameError);
    let isDescriptionValue = checkFieldValue(projectDescription, setHasDescriptionError);

    if (isNameValue || isDescriptionValue) {
      return;
    }

    dispatch(
      add({
        id: '12312',
        name: projectName,
        description: projectDescription,
        progress: 0,
        steps: [],
      }),
    );
    clearAllFields();
    goBack();
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Project Tracker</IonTitle>
          <IonButtons slot="start">
            <IonBackButton defaultHref="/" />
          </IonButtons>

          <IonButtons slot="end">
            <IonButton onClick={createNewProject}>Create</IonButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>

      <IonContent fullscreen>
        <IonList class="ion-margin">
          <IonItem>
            <IonLabel position="stacked">Project's name</IonLabel>
            <IonInput onIonChange={onChangeProjectNameInput}></IonInput>
          </IonItem>
          {showNameError}

          <IonItem>
            <IonLabel position="stacked">Project's Description</IonLabel>
            <IonTextarea auto-grow onIonChange={onChangeProjectDecriptionInput}></IonTextarea>
          </IonItem>
          {showDescriptionError}
        </IonList>
      </IonContent>
    </IonPage>
  );
};

export default CreateProject;
