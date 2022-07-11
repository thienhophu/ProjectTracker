import React, { useCallback } from 'react';
import {
  IonContent,
  IonToolbar,
  IonButtons,
  IonTitle,
  IonHeader,
  IonLabel,
  IonButton,
  IonPage,
  IonLoading,
  useIonAlert,
  useIonToast,
} from '@ionic/react';
import { useFirestore, useFirestoreCollectionData } from 'reactfire';
import { collection, addDoc } from '@firebase/firestore';
import { logout } from '../../services/auth';
import { PERMISSION_PROJECT_CREATE } from '../../data/roles';
import { getCurrentUserData } from '../../features/auth/authSlice';
import { useAppSelector, useAppDispatch } from '../../app/hooks';
import ProjectCard from './components/ProjectCard';
import PermissionBox from '../../components/PermissionBox';

const Projects: React.FC = () => {
  const [createStepAlert] = useIonAlert();
  const [presentCreateStepToast] = useIonToast();
  const dispatch = useAppDispatch();
  const currentUser = useAppSelector(getCurrentUserData);
  const firestore = useFirestore();
  const ref = collection(firestore, 'projects');

  const { status, data: projects } = useFirestoreCollectionData(ref);
  const isLoading = status === 'loading';

  const logOut = async () => {
    dispatch(logout());
  };

  const onCreateProject = useCallback(() => {
    createStepAlert({
      header: 'Create Project',
      inputs: [
        {
          name: 'name',
          placeholder: 'Name',
          type: 'text',
          attributes: {
            autoComplete: 'none',
          },
        },
        {
          name: 'description',
          placeholder: 'Description',
          type: 'textarea',
        },
      ],
      buttons: [
        { text: 'Cancel', role: 'destructive' },
        {
          text: 'Create',
          handler: async ({ name, description }) => {
            if (!name || !description) {
              presentCreateStepToast({
                message: 'All fields must be entered!',
                color: 'danger',
                duration: 2000,
              });
              return;
            }
            try {
              await addDoc(ref, {
                name,
                description,
                imageURL:
                  'https://thumbor.forbes.com/thumbor/fit-in/900x510/https://www.forbes.com/advisor/wp-content/uploads/2021/05/featured-image-cost-of-new-home.jpeg.jpg',
                authorId: currentUser.id,
                accessUsers: [currentUser.id],
              });
              presentCreateStepToast({
                message: 'New Project created!',
                color: 'success',
                duration: 2000,
              });
            } catch {
              presentCreateStepToast({
                message: 'Unable to create a project',
                color: 'danger',
                duration: 2000,
              });
            }
          },
        },
      ],
    });
  }, [createStepAlert, presentCreateStepToast, ref, currentUser.id]);

  if (!projects || isLoading) {
    return <IonLoading isOpen />;
  }

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonButton color="danger" onClick={logOut}>
              Logout
            </IonButton>
          </IonButtons>
          <IonTitle>Project Tracker</IonTitle>

          <IonButtons slot="end">
            <PermissionBox has={PERMISSION_PROJECT_CREATE}>
              <IonButton onClick={onCreateProject}>
                <IonLabel>Create</IonLabel>
              </IonButton>
            </PermissionBox>
          </IonButtons>
        </IonToolbar>
      </IonHeader>

      <IonContent>
        {projects.map((project: any, index: number) => (
          <ProjectCard key={index} project={project} />
        ))}
      </IonContent>
    </IonPage>
  );
};

export default Projects;
