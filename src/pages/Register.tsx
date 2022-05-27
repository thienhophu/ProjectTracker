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
  IonRadioGroup,
  IonList,
  IonItem,
  IonRadio,
  IonLabel,
  useIonToast,
  useIonLoading,
} from '@ionic/react';
import { register } from '../services/auth';
import { LOGIN } from '../app/routes';
import { useHistory } from 'react-router';
import Field from '../components/Field';
import { useFormValidation } from '../app/hooks';

const Register: React.FC = () => {
  const dispatch = useDispatch();
  const [presentCreateStepToast] = useIonToast();
  const { push } = useHistory();
  const [presentLoading, dismissLoading] = useIonLoading();
  const validationSchema = useFormValidation(
    object().shape({
      email: string().label('Email').required().email(),
      name: string().label('Display Name').required(),
      password: string().label('Password').required(),
    }),
  );

  const registerUser = async (values: any) => {
    try {
      presentLoading({
        message: 'Loading...',
      });
      await dispatch(register(values));
      await dismissLoading();
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
      <IonContent>
        <Form
          initialValues={{ name: '', email: '', password: '', role: 'manager' }}
          onSubmit={registerUser}
          validate={validationSchema}
          render={({ handleSubmit, submitting }) => (
            <form onSubmit={handleSubmit}>
              <IonList className="p-4">
                <Field
                  name="name"
                  component={<IonInput type="text" placeholder="Display Name" />}
                />
                <Field name="email" component={<IonInput type="text" placeholder="Email" />} />
                <Field
                  name="password"
                  component={<IonInput type="password" placeholder="Password" />}
                />

                <IonList className="mt-4">
                  <Field name="role" component={<IonRadioGroup />}>
                    <IonItem>
                      <IonLabel>Manager</IonLabel>
                      <IonRadio slot="start" value="manager" />
                    </IonItem>

                    <IonItem>
                      <IonLabel>User</IonLabel>
                      <IonRadio slot="start" value="user" />
                    </IonItem>
                  </Field>
                </IonList>
                <IonButton expand="full" type="submit" className="my-4" disabled={submitting}>
                  Register
                </IonButton>
                <p>
                  Already have an account? <IonRouterLink href={LOGIN}>Login</IonRouterLink>
                </p>
              </IonList>
            </form>
          )}
        />
      </IonContent>
    </IonPage>
  );
};

export default Register;
