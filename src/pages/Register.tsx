import { useState } from "react";
import { useDispatch } from "react-redux";
import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  IonInput,
  IonButton,
} from "@ionic/react";
import { register } from "../services/auth";

const Register: React.FC = () => {
  const dispatch = useDispatch();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const registerUser = () => {
    dispatch(register(username, password));
  }

  return (
    <IonPage id="home-page">
      <IonHeader>
        <IonToolbar>
          <IonTitle>Register</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <IonInput placeholder="Username" onIonChange={(e: any) => setUsername(e.target.value)}></IonInput>
        <IonInput placeholder="Password" type="password" onIonChange={(e: any) => setPassword(e.target.value)}></IonInput>
        <IonButton onClick={registerUser}>Register</IonButton>
      </IonContent>
    </IonPage>
  );
};

export default Register;
