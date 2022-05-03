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
  IonRadioGroup,
  IonList,
  IonItem,
  IonRadio,
  IonLabel,
  useIonToast,
} from '@ionic/react';
import { register } from '../services/auth';
import { LOGIN } from '../app/routes';
import { useHistory } from 'react-router';

const Register: React.FC = () => {
  const dispatch = useDispatch();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<string>('manager');
  const [presentCreateStepToast] = useIonToast();
  const { push } = useHistory();

  const registerUser = async () => {
    try {
      await dispatch(register(username, password, role));

      presentCreateStepToast({
        message: 'New Account created!',
        color: 'success',
        duration: 2000,
      });
      push(LOGIN);
    } catch (e) {
      presentCreateStepToast({
        message: 'Email already in use!',
        color: 'danger',
        duration: 2000,
      });
    }
  };

  return (
    <IonPage id="home-page">
      <IonHeader>
        <IonToolbar>
          <IonTitle>Register</IonTitle>
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
          <IonList className="mt-4">
            <IonRadioGroup value={role} onIonChange={(e: any) => setRole(e.detail.value)}>
              <IonItem>
                <IonLabel>Manager</IonLabel>
                <IonRadio slot="start" value="manager" />
              </IonItem>

              <IonItem>
                <IonLabel>User</IonLabel>
                <IonRadio slot="start" value="user" />
              </IonItem>
            </IonRadioGroup>
          </IonList>
          <IonButton expand="full" onClick={registerUser} className="my-4">
            Register
          </IonButton>
          <p>
            Already have an account? <IonRouterLink href={LOGIN}>Login</IonRouterLink>
          </p>
        </IonList>
      </IonContent>
    </IonPage>
  );
};

export default Register;
