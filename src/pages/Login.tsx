import { useState } from 'react';
import { useDispatch } from 'react-redux';
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
} from '@ionic/react';
import { login } from '../services/auth';
import { DASHBOARD_PAGE, REGISTER } from '../app/routes';
import { useHistory } from 'react-router';

const Login: React.FC = () => {
  const dispatch = useDispatch();
  const { push } = useHistory();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const loginUser = async () => {
    dispatch(login(username, password));
    push(DASHBOARD_PAGE);
  };

  return (
    <IonPage id="home-page">
      <IonHeader>
        <IonToolbar>
          <IonTitle>Login</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
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
