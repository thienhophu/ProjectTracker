import { useState } from 'react';
import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  IonInput,
  IonButton,
  IonRouterLink,
  IonList,
  useIonLoading,
} from '@ionic/react';
import { useHistory } from 'react-router';
import { useAppDispatch } from '../app/hooks';
import { login } from '../services/auth';
import { PROJECTS_PAGE, REGISTER } from '../app/routes';

const Login: React.FC = () => {
  const dispatch = useAppDispatch();
  const { push } = useHistory();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [presentLoading, dismissLoading] = useIonLoading();

  const loginUser = async () => {
    presentLoading({
      message: 'Loading...',
    });
    await dispatch(login(username, password));
    await dismissLoading();
    push(PROJECTS_PAGE);
  };

  return (
    <IonPage id="home-page">
      <IonHeader>
        <IonToolbar>
          <IonTitle>Login</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <IonList className="p-4">
          <IonInput
            placeholder="Email"
            onIonChange={(e: any) => setUsername(e.target.value)}
          ></IonInput>
          <IonInput
            placeholder="Password"
            type="password"
            onIonChange={(e: any) => setPassword(e.target.value)}
          ></IonInput>
          <IonButton expand="full" onClick={loginUser} className="my-4">
            Login
          </IonButton>
          <p>
            New here? <IonRouterLink href={REGISTER}>Register</IonRouterLink>
          </p>
        </IonList>
      </IonContent>
    </IonPage>
  );
};

export default Login;
