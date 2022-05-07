import {
  IonBackButton,
  IonButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonImg,
  IonItem,
  IonItemOption,
  IonItemOptions,
  IonItemSliding,
  IonLabel,
  IonList,
  IonLoading,
  IonPage,
  IonReorder,
  IonReorderGroup,
  IonThumbnail,
  IonTitle,
  IonToolbar,
  useIonAlert,
  useIonToast,
  IonListHeader,
  IonBadge,
  IonNote,
  IonRange,
  IonModal,
} from '@ionic/react';
import { addDoc, collection, deleteDoc, doc, updateDoc } from 'firebase/firestore';
import { maxBy, orderBy } from 'lodash';
import { useCallback, useMemo, useState } from 'react';
import { useHistory, useParams } from 'react-router';
import { GALLERY_PAGE, PROJECTS_PAGE, STEPS_PAGE } from '../../app/routes';
import { useFirestore, useFirestoreCollectionData, useFirestoreDocData } from 'reactfire';
import './styles.css';
import {
  PERMISSION_PROJECT_DELETE,
  PERMISSION_STEP_CREATE,
  PERMISSION_STEP_DELETE,
  PERMISSION_STEP_REORDER,
} from '../../data/roles';
import PermissionBox from '../../components/PermissionBox';

const SingleStep: React.FC<{
  step: any;
  onDelete: Function;
}> = ({ step, onDelete }) => {
  const { id } = useParams<any>();
  const onClickDelete = useCallback(() => {
    onDelete(step.NO_ID_FIELD);
  }, [onDelete, step.NO_ID_FIELD]);

  return (
    <IonItemSliding>
      <IonItem
        routerLink={`${PROJECTS_PAGE}/${id}${STEPS_PAGE}/${step.NO_ID_FIELD}${GALLERY_PAGE}`}
      >
        <IonThumbnail slot="start">
          <IonImg src="https://thumbor.forbes.com/thumbor/fit-in/900x510/https://www.forbes.com/advisor/wp-content/uploads/2021/05/featured-image-cost-of-new-home.jpeg.jpg" />
        </IonThumbnail>
        <IonLabel>
          <h2>{step.name}</h2>
          <p>{step.description}</p>
        </IonLabel>
        <IonNote>
          <IonBadge color={step.isCompleted ? 'primary' : 'danger'} className="mt-1">
            {step.isCompleted ? 'Completed' : 'In Progress'}
          </IonBadge>
        </IonNote>
        <IonReorder slot="end" />
      </IonItem>
      <IonItemOptions side="end">
        <PermissionBox has={PERMISSION_STEP_DELETE}>
          <IonItemOption color="danger" onClick={onClickDelete}>
            Delete
          </IonItemOption>
        </PermissionBox>
      </IonItemOptions>
    </IonItemSliding>
  );
};

const Steps: React.FC = () => {
  const [enableReorder, setEnableReorder] = useState(false);
  const firestore = useFirestore();
  const { id } = useParams<any>();
  const { goBack } = useHistory();
  const [present] = useIonAlert();
  const [createStepAlert] = useIonAlert();
  const [presentCreateStepToast] = useIonToast();
  const [showProgressModal, setShowProgressModal] = useState(false);

  const projectRef = doc(firestore, 'projects', id);
  const stepRef = collection(firestore, `projects/${id}/steps`);

  const { status, data: stepsData } = useFirestoreCollectionData(stepRef);
  const { data: projectData } = useFirestoreDocData(projectRef);

  const orderedSteps = useMemo(() => orderBy(stepsData, 'order'), [stepsData]);

  const reorderText = enableReorder ? 'Done' : 'Re-order';

  const onToggleReorder = useCallback(() => {
    setEnableReorder(!enableReorder);
  }, [setEnableReorder, enableReorder]);

  const updateStepsOrder = useCallback(
    async (steps) => {
      await steps.forEach(async (stepId: string, index: number) => {
        await updateDoc(doc(firestore, `projects/${id}/steps`, stepId), {
          order: index,
        });
      });
    },
    [firestore, id],
  );

  const deleteStep = useCallback(
    async (stepId) => {
      await deleteDoc(doc(firestore, `projects/${id}/steps`, stepId));
      const newSteps = orderedSteps
        .filter((step) => step.NO_ID_FIELD !== stepId)
        .map((result: any) => result.NO_ID_FIELD);
      await updateStepsOrder(newSteps);
    },
    [firestore, id, orderedSteps, updateStepsOrder],
  );

  const doReorder = useCallback(
    async (event: CustomEvent) => {
      const orderedResultStepIds = event.detail
        .complete(orderedSteps)
        .map((result: any) => result.NO_ID_FIELD);

      await updateStepsOrder(orderedResultStepIds);
    },
    [orderedSteps, updateStepsOrder],
  );

  const onDeleteProject = useCallback(() => {
    present({
      header: 'Delete',
      message: 'Are you sure?',
      buttons: [
        'Cancel',
        {
          text: 'Delete',
          role: 'destructive',
          handler: async () => {
            await deleteDoc(projectRef);
            goBack();
          },
        },
      ],
    });
  }, [projectRef, goBack, present]);

  const onCreateStep = useCallback(() => {
    createStepAlert({
      header: 'Delete',
      message: 'Are you sure?',
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
              const highestOrder = maxBy(stepsData, 'order')?.order || null;

              await addDoc(stepRef, {
                name,
                description,
                imageURL:
                  'https://thumbor.forbes.com/thumbor/fit-in/900x510/https://www.forbes.com/advisor/wp-content/uploads/2021/05/featured-image-cost-of-new-home.jpeg.jpg',
                order: highestOrder >= 0 ? highestOrder + 1 : 0,
              });
              presentCreateStepToast({
                message: 'New Step created!',
                color: 'success',
                duration: 2000,
              });
            } catch {
              presentCreateStepToast({
                message: 'Unable to create a step',
                color: 'danger',
                duration: 2000,
              });
            }
          },
        },
      ],
    });
  }, [presentCreateStepToast, createStepAlert, stepRef, stepsData]);

  const onSaveProgress = useCallback(
    async (value) => {
      await updateDoc(doc(firestore, `projects`, id), {
        progress: value,
      });
    },
    [firestore, id],
  );

  const isLoading = status === 'loading';

  if (!stepsData || isLoading || !projectData) {
    return <IonLoading isOpen />;
  }

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton defaultHref="/" />
          </IonButtons>
          <IonTitle>Steps</IonTitle>
          <PermissionBox has={PERMISSION_STEP_REORDER}>
            <IonButtons slot="end">
              <IonButton onClick={onToggleReorder}>{reorderText}</IonButton>
            </IonButtons>
          </PermissionBox>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <IonModal
          className="progress-modal"
          isOpen={showProgressModal}
          onDidDismiss={() => setShowProgressModal(false)}
        >
          <IonHeader className="px-3 pt-2">
            <b>Progress {projectData.progress}%</b>
          </IonHeader>
          <IonContent>
            <IonRange
              debounce={500}
              min={0}
              max={100}
              pin
              color="secondary"
              value={projectData.progress}
              onIonChange={(e) => onSaveProgress(e.detail.value)}
            />
          </IonContent>
        </IonModal>
        <IonList>
          <IonListHeader lines="inset" className="mb-8">
            <IonLabel>{projectData.name}</IonLabel>
            <IonLabel onClick={() => setShowProgressModal(true)} className="text-right pr-8">
              {projectData.progress}%
            </IonLabel>
          </IonListHeader>

          <IonReorderGroup disabled={!enableReorder} onIonItemReorder={doReorder}>
            {orderedSteps.map((step: any) => (
              <SingleStep key={step.NO_ID_FIELD} step={step} onDelete={deleteStep} />
            ))}
          </IonReorderGroup>
        </IonList>
        <PermissionBox has={PERMISSION_STEP_CREATE}>
          <IonButton expand="full" onClick={onCreateStep} className="mt-8">
            Create Step
          </IonButton>
        </PermissionBox>
        <PermissionBox has={PERMISSION_PROJECT_DELETE}>
          <IonButton expand="full" color="danger" onClick={onDeleteProject}>
            Delete Project
          </IonButton>
        </PermissionBox>
      </IonContent>
    </IonPage>
  );
};

export default Steps;
