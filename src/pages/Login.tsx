import { useState } from "react";
import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  IonInput,
  IonButton,
} from "@ionic/react";
import { login } from "../services/auth";

const Login: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const loginUser = () => {
    login(username, password);
  }

  return (
    <IonPage id="home-page">
      <IonHeader>
        <IonToolbar>
          <IonTitle>Login</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <IonInput placeholder="Username" onIonChange={(e: any) => setUsername(e.target.value)}></IonInput>
        <IonInput placeholder="Password" type="password" onIonChange={(e: any) => setPassword(e.target.value)}></IonInput>
        <IonButton onClick={loginUser}>Login</IonButton>
      </IonContent>
    </IonPage>
  );
};

export default Login;