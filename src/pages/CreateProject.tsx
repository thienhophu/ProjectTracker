import React, { useState } from 'react';
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
  IonButton
} from '@ionic/react';

const CreateProject: React.FC = () => {
  const [projectName, setProjectName] = useState<string>();
  const [projectDescription, setProjectDescription] = useState<string>();
  return (
    <IonContent fullscreen>
      <IonHeader translucent>
        <IonToolbar>
          <IonTitle>Project Tracker</IonTitle>

          <IonButtons slot='end'>
            <IonButton onClick={() => {
                console.log('🚀 ~ projectName', projectName)
                console.log('🚀 ~ projectDescription', projectDescription)
              }}>
                Create
            </IonButton>
          </IonButtons>

          <IonButtons slot='start'>
            <IonBackButton defaultHref='/'/>
          </IonButtons>
        </IonToolbar>
      </IonHeader>

      <IonList class='ion-margin'>
        <IonItem>
          <IonLabel position='stacked'>Project's name</IonLabel>
          <IonInput 
            value={projectName}
            onIonChange={event => setProjectName(event.detail.value!)}></IonInput>
        </IonItem>
        <IonItem>
          <IonLabel position='stacked'>Project's Description</IonLabel>
          <IonTextarea 
            auto-grow value={projectDescription}
            onIonChange={event => setProjectDescription(event.detail.value!)}>
          </IonTextarea>
        </IonItem>
      </IonList>
    </IonContent>
  );
};

export default CreateProject;
