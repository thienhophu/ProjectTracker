import { useDispatch } from 'react-redux';
import { Form } from 'react-final-form';
import { object, string } from 'yup';
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
import { login } from '../services/auth';
import { DASHBOARD_PAGE, REGISTER } from '../app/routes';
import { useHistory } from 'react-router';
import { useFormValidation } from '../app/hooks';
import Field from '../components/Field';

const Login: React.FC = () => {
  const dispatch = useDispatch();
  const { push } = useHistory();
  const [presentLoading, dismissLoading] = useIonLoading();
  const validationSchema = useFormValidation(
    object().shape({
      email: string().label('Email').required().email(),
      password: string().label('Password').required(),
    }),
  );

  const loginUser = async (values: any) => {
    presentLoading({
      message: 'Loading...',
    });
    await dispatch(login(values));
    await dismissLoading();
    push(DASHBOARD_PAGE);
  };

  return (
    <IonPage id="home-page">
      <IonHeader>
        <IonToolbar>
          <IonTitle>Login</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <Form
          initialValues={{ name: '', email: '', password: '', role: 'manager' }}
          onSubmit={loginUser}
          validate={validationSchema}
          render={({ handleSubmit, submitting }) => (
            <form onSubmit={handleSubmit}>
              <IonList className="p-4">
                <Field name="email" component={<IonInput type="text" placeholder="Email" />} />
                <Field
                  name="password"
                  component={<IonInput type="password" placeholder="Password" />}
                />
                <IonButton expand="full" type="submit" className="my-4" disabled={submitting}>
                  Login
                </IonButton>
                <p>
                  New here? <IonRouterLink href={REGISTER}>Register</IonRouterLink>
                </p>
              </IonList>
            </form>
          )}
        />
      </IonContent>
    </IonPage>
  );
};

export default Login;
