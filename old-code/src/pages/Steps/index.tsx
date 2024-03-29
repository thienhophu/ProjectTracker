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
import { GALLERY_PAGE, PROJECTS_PAGE, STEPS_PAGE, HOUSES_PAGE } from '../../app/routes';
import { useFirestore, useFirestoreCollectionData, useFirestoreDocData } from 'reactfire';
import './styles.css';
import {
  PERMISSION_HOUSE_DELETE,
  PERMISSION_PROJECT_UPDATE_PROGRESS,
  PERMISSION_STEP_CREATE,
  PERMISSION_STEP_DELETE,
  PERMISSION_STEP_REORDER,
} from '../../data/roles';
import PermissionBox from '../../components/PermissionBox';
import { useCurrentUserPermission } from '../../app/hooks';

const SingleStep: React.FC<{
  step: any;
  onDelete: Function;
}> = ({ step, onDelete }) => {
  const { id, houseId } = useParams<any>();
  const onClickDelete = useCallback(() => {
    onDelete(step.NO_ID_FIELD);
  }, [onDelete, step.NO_ID_FIELD]);

  return (
    <IonItemSliding>
      <IonItem
        routerLink={`${PROJECTS_PAGE}/${id}${HOUSES_PAGE}/${houseId}${STEPS_PAGE}/${step.NO_ID_FIELD}${GALLERY_PAGE}`}
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
  const { id, houseId } = useParams<any>();
  const { goBack } = useHistory();
  const [present] = useIonAlert();
  const [createStepAlert] = useIonAlert();
  const [presentCreateStepToast] = useIonToast();
  const [showProgressModal, setShowProgressModal] = useState(false);

  const ableToUpdateProjectProgress = useCurrentUserPermission({
    permission: PERMISSION_PROJECT_UPDATE_PROGRESS,
  });

  const houseRef = doc(firestore, `projects/${id}/houses`, houseId);
  const stepRef = collection(firestore, `projects/${id}/houses/${houseId}/steps`);

  const { status, data: stepsData } = useFirestoreCollectionData(stepRef);
  const { data: houseData } = useFirestoreDocData(houseRef);

  const orderedSteps = useMemo(() => orderBy(stepsData, 'order'), [stepsData]);

  const reorderText = enableReorder ? 'Done' : 'Re-order';

  const onToggleReorder = useCallback(() => {
    setEnableReorder(!enableReorder);
  }, [setEnableReorder, enableReorder]);

  const updateStepsOrder = useCallback(
    async (steps: any) => {
      await steps.forEach(async (stepId: string, index: number) => {
        await updateDoc(doc(stepRef, stepId), {
          order: index,
        });
      });
    },
    [stepRef],
  );

  const deleteStep = useCallback(
    async (stepId: any) => {
      await deleteDoc(doc(stepRef, stepId));
      const newSteps = orderedSteps
        .filter((step) => step.NO_ID_FIELD !== stepId)
        .map((result: any) => result.NO_ID_FIELD);
      await updateStepsOrder(newSteps);
    },
    [orderedSteps, stepRef, updateStepsOrder],
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

  const onDeleteHouse = useCallback(() => {
    present({
      header: 'Delete',
      message: 'Are you sure?',
      buttons: [
        'Cancel',
        {
          text: 'Delete',
          role: 'destructive',
          handler: async () => {
            await deleteDoc(houseRef);
            goBack();
          },
        },
      ],
    });
  }, [present, houseRef, goBack]);

  const onCreateStep = useCallback(() => {
    createStepAlert({
      header: 'Create Step',
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
    async (value: any) => {
      await updateDoc(doc(firestore, `projects`, id), {
        progress: value,
      });
    },
    [firestore, id],
  );

  const showProjectProgressModal = useCallback(() => {
    setShowProgressModal(true);
  }, []);

  const hideProjectProgressModal = useCallback(() => {
    setShowProgressModal(false);
  }, []);

  const onUpdateProjectProgress = useCallback(() => {
    if (!ableToUpdateProjectProgress) {
      return;
    }
    showProjectProgressModal();
  }, [ableToUpdateProjectProgress, showProjectProgressModal]);

  const isLoading = status === 'loading';

  if (!stepsData || isLoading || !houseData) {
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
      <IonContent>
        <IonModal
          className="progress-modal"
          isOpen={showProgressModal}
          onDidDismiss={hideProjectProgressModal}
        >
          <IonHeader className="px-3 pt-2">
            <b>Progress {houseData.progress ?? 0}%</b>
          </IonHeader>
          <IonContent>
            <IonRange
              debounce={500}
              min={0}
              max={100}
              pin
              color="secondary"
              value={houseData.progress}
              onIonChange={(e) => onSaveProgress(e.detail.value)}
            />
          </IonContent>
        </IonModal>
        <IonList>
          <IonListHeader lines="inset" className="mb-8">
            <IonLabel>{houseData.name}</IonLabel>
            <IonLabel onClick={onUpdateProjectProgress} className="text-right pr-8">
              {houseData.progress ?? 0}%
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
        <PermissionBox has={PERMISSION_HOUSE_DELETE}>
          <IonButton expand="full" color="danger" onClick={onDeleteHouse}>
            Delete House
          </IonButton>
        </PermissionBox>
      </IonContent>
    </IonPage>
  );
};

export default Steps;
