import React, { useState } from "react";
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
} from "@ionic/react";

const CreateProject: React.FC = () => {
  const [projectName, setProjectName] = useState<string>();
  const [projectDescription, setProjectDescription] = useState<string>();
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Project Tracker</IonTitle>

          <IonButtons slot="end">
            <IonButton
              onClick={() => {
                console.log("🚀 ~ projectName", projectName);
                console.log("🚀 ~ projectDescription", projectDescription);
              }}
            >
              Create
            </IonButton>
          </IonButtons>

          <IonButtons slot="start">
            <IonBackButton defaultHref="\" />
          </IonButtons>
        </IonToolbar>
      </IonHeader>

      <IonContent fullscreen>
        <IonList class="ion-margin">
          <IonItem>
            <IonLabel position="stacked">Project's name</IonLabel>
            <IonInput
              value={projectName}
              onIonChange={(event) => setProjectName(event.detail.value || "")}
            ></IonInput>
          </IonItem>
          <IonItem>
            <IonLabel position="stacked">Project's Description</IonLabel>
            <IonTextarea
              auto-grow
              value={projectDescription}
              onIonChange={(event) =>
                setProjectDescription(event.detail.value!)
              }
            ></IonTextarea>
          </IonItem>
        </IonList>
      </IonContent>
    </IonPage>
  );
};

export default CreateProject;
