import React, { useState, useMemo, SetStateAction, Dispatch } from 'react';
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
import { useAppDispatch } from '../../app/hooks';
import ErrorMessage from '../../components/ErrorMessage';
import { add } from '../../features/projects/projectsSlice';
import { useFirestore } from 'reactfire';
import { addDoc, collection } from '@firebase/firestore';

const CreateProject: React.FC = () => {
  const firestore = useFirestore();
  const projectRef = collection(firestore, 'projects');
  const [name, setName] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [hasNameError, setHasNameError] = useState<boolean>(false);
  const [hasDescriptionError, setHasDescriptionError] = useState<boolean>(false);

  const dispatch = useAppDispatch();
  const { goBack } = useHistory();

  const onChangeProjectNameInput = (event: any) => {
    setHasNameError(false);
    setName(event.detail.value || '');
  };

  const onChangeProjectDecriptionInput = (event: any) => {
    setHasDescriptionError(false);
    setDescription(event.detail.value || '');
  };

  const clearAllFields = () => {
    setName('');
    setDescription('');
  };

  const showNameError = useMemo(
    () => (hasNameError ? <ErrorMessage fieldName="name" /> : null),
    [hasNameError],
  );

  const showDescriptionError = useMemo(
    () => (hasDescriptionError ? <ErrorMessage fieldName="description" /> : null),
    [hasDescriptionError],
  );

  const checkFieldValue = (field: string, hanldler: Dispatch<SetStateAction<boolean>>) => {
    const isFieldEmpty = field === '';
    hanldler(isFieldEmpty);
    return isFieldEmpty;
  };

  const createNewProject = async () => {
    let isNameValue = checkFieldValue(name, setHasNameError);
    let isDescriptionValue = checkFieldValue(description, setHasDescriptionError);

    if (isNameValue || isDescriptionValue) {
      return;
    }

    dispatch(
      add({
        id: '12312',
        name: name,
        description: description,
        progress: 0,
        steps: [],
      }),
    );

    await addDoc(projectRef, {
      name,
      description,
      imageURL: 'https://www.linkpicture.com/q/mansion.jpg',
      steps: [],
    });

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
