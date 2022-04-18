import React, { useState } from 'react';
import { useAppDispatch } from '../app/hooks';
import { add } from '../features/projects/projectsSlice';
import { useHistory } from 'react-router-dom';
import { useForm } from 'react-hook-form';

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
import './CreateProject.css';

const CreateProject: React.FC = () => {
  const [projectName, setProjectName] = useState<string>('');
  const [projectDescription, setProjectDescription] = useState<string>('');
  const dispatch = useAppDispatch();
  const { goBack } = useHistory();

  interface FormValues {
    projectName: string;
    projectDescription: string;
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    defaultValues: {
      projectName: '',
      projectDescription: ''
    }
  });

  const projectNameProp = {...register('projectName', {
    required: "Project's name is required."
  })}

  const projectDescriptionProp = {...register('projectDescription', {
    required: "Project's description is required."
  })}

  const onSubmit = handleSubmit(() => createNewProject());

  const onChangeProjectNameInput = (event: any) => {
    errors.projectName = undefined;
    setProjectName(event.detail.value || '')
  };

  const onChangeProjectDecriptionInput = (event: any) => {
    errors.projectDescription = undefined;
    setProjectDescription(event.detail.value || '');
  }

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
    goBack();
  };

  const showError = (fieldName: string) => {
    let error = (errors as any)[fieldName];
    return error ? (
      <p className ='error-message'>{error.message}</p>
    ) : null;
  }
 
  return (
    <IonPage>
      <form onSubmit={onSubmit}>
        <IonHeader>
          <IonToolbar>
            <IonTitle>Project Tracker</IonTitle>
            <IonButtons slot='start'>
              <IonBackButton defaultHref='\' />
            </IonButtons>

            <IonButtons slot='end'>
              <IonButton class='create-project-button' type='submit'>
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
                {...projectNameProp}
                onIonChange={onChangeProjectNameInput}>
              </IonInput>
              {showError('projectName')}
            </IonItem>

            <IonItem>
              <IonLabel position='stacked'>Project's Description</IonLabel>
              <IonTextarea
                {...projectDescriptionProp}
                auto-grow
                onIonChange={onChangeProjectDecriptionInput}>
              </IonTextarea>
              {showError('projectDescription')}
            </IonItem>
          </IonList>
        </IonContent>
      </form>
    </IonPage>
  );
};

export default CreateProject;
