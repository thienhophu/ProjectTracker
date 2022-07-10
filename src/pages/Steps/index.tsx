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
  IonAvatar,
  IonCheckbox,
} from '@ionic/react';
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  updateDoc,
  query,
  orderBy,
  where,
} from 'firebase/firestore';
import { maxBy } from 'lodash';
import { useCallback, useEffect, useMemo, useState, useRef } from 'react';
import { useHistory, useParams } from 'react-router';
import { GALLERY_PAGE, route } from '../../app/routes';
import { useFirestore, useFirestoreCollectionData, useFirestoreDocData } from 'reactfire';
import './styles.css';
import {
  PERMISSION_HOUSE_ASSIGNED_USERS,
  PERMISSION_HOUSE_DELETE,
  PERMISSION_PROJECT_UPDATE_PROGRESS,
  PERMISSION_STEP_CREATE,
  PERMISSION_STEP_DELETE,
  PERMISSION_STEP_REORDER,
} from '../../data/roles';
import PermissionBox from '../../components/PermissionBox';
import { useAppSelector, useCurrentUserPermission } from '../../app/hooks';
import { getCurrentUserData } from '../../features/auth/authSlice';

const SingleStep: React.FC<{
  step: any;
  onDelete: Function;
}> = ({ step, onDelete }) => {
  const { houseId } = useParams<any>();
  const onClickDelete = useCallback(() => {
    onDelete(step.NO_ID_FIELD);
  }, [onDelete, step.NO_ID_FIELD]);

  return (
    <IonItemSliding>
      <IonItem routerLink={route(GALLERY_PAGE, { houseId, stepId: step.NO_ID_FIELD })}>
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
  const firestore = useFirestore();
  const currentUser = useAppSelector(getCurrentUserData);
  const { houseId } = useParams<any>();
  const { goBack } = useHistory();
  const [present] = useIonAlert();
  const [createStepAlert] = useIonAlert();
  const [presentCreateStepToast] = useIonToast();
  const [enableReorder, setEnableReorder] = useState(false);
  const [showProgressModal, setShowProgressModal] = useState(false);
  const accessUsersModal = useRef<HTMLIonModalElement>(null);

  const ableToUpdateProjectProgress = useCurrentUserPermission({
    permission: PERMISSION_PROJECT_UPDATE_PROGRESS,
  });

  const userRef = collection(firestore, 'users');
  const houseRef = doc(firestore, 'houses', houseId);
  const stepRef = collection(firestore, `houses/${houseId}/steps`);

  const { data: usersData } = useFirestoreCollectionData(
    query(userRef, where('id', '!=', currentUser.id)),
  );
  const { status, data: stepsData } = useFirestoreCollectionData(query(stepRef, orderBy('order')));
  const { data: houseData } = useFirestoreDocData(houseRef);
  const [prepareAccessUsers, setPrepareAccessUsers] = useState<any>(houseData?.accessUsers || []);

  const reorderText = enableReorder ? 'Done' : 'Re-order';

  const onToggleReorder = useCallback(() => {
    setEnableReorder(!enableReorder);
  }, [setEnableReorder, enableReorder]);

  const updateStepsOrder = useCallback(
    async (steps) => {
      await steps.forEach(async (stepId: string, index: number) => {
        await updateDoc(doc(stepRef, stepId), {
          order: index,
        });
      });
    },
    [stepRef],
  );

  const deleteStep = useCallback(
    async (stepId) => {
      await deleteDoc(doc(stepRef, stepId));
      const newSteps = stepsData
        .filter((step) => step.NO_ID_FIELD !== stepId)
        .map((result: any) => result.NO_ID_FIELD);
      await updateStepsOrder(newSteps);
    },
    [stepsData, stepRef, updateStepsOrder],
  );

  const doReorder = useCallback(
    async (event: CustomEvent) => {
      const orderedResultStepIds = event.detail
        .complete(stepsData)
        .map((result: any) => result.NO_ID_FIELD);

      await updateStepsOrder(orderedResultStepIds);
    },
    [stepsData, updateStepsOrder],
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

  const onAssignUsers = useCallback(async () => {
    await updateDoc(houseRef, {
      accessUsers: prepareAccessUsers,
    });
    accessUsersModal.current?.dismiss();
  }, [houseRef, prepareAccessUsers]);

  const onSaveProgress = useCallback(
    async (value) => {
      await updateDoc(houseRef, {
        progress: value,
      });
    },
    [houseRef],
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

  const isLoading = useMemo(() => status === 'loading', [status]);

  useEffect(() => {
    setPrepareAccessUsers(houseData?.accessUsers || []);
  }, [houseData]);

  if (isLoading || !houseData) {
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
        <IonList>
          <IonListHeader lines="inset" className="mb-8">
            <IonLabel>{houseData.name}</IonLabel>
            <IonLabel onClick={onUpdateProjectProgress} className="text-right pr-8">
              {houseData.progress ?? 0}%
            </IonLabel>
          </IonListHeader>

          <IonReorderGroup disabled={!enableReorder} onIonItemReorder={doReorder}>
            {stepsData.map((step: any) => (
              <SingleStep key={step.NO_ID_FIELD} step={step} onDelete={deleteStep} />
            ))}
          </IonReorderGroup>
        </IonList>
        <PermissionBox has={PERMISSION_STEP_CREATE}>
          <IonButton expand="full" onClick={onCreateStep} className="mt-8">
            Create Step
          </IonButton>
        </PermissionBox>
        <PermissionBox has={PERMISSION_HOUSE_ASSIGNED_USERS}>
          <IonButton id="assigned-modal" expand="full">
            Assign Users
          </IonButton>
        </PermissionBox>
        <PermissionBox has={PERMISSION_HOUSE_DELETE}>
          <IonButton expand="full" color="danger" onClick={onDeleteHouse}>
            Delete House
          </IonButton>
        </PermissionBox>
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
        <IonModal
          ref={accessUsersModal}
          trigger="assigned-modal"
          initialBreakpoint={0.5}
          breakpoints={[0, 0.25, 0.5, 0.75]}
        >
          <IonHeader>
            <IonToolbar>
              <IonTitle>Assigned Users</IonTitle>
              <IonButtons slot="end">
                <IonButton onClick={() => onAssignUsers()}>Save</IonButton>
              </IonButtons>
            </IonToolbar>
          </IonHeader>
          <IonContent className="ion-padding">
            <IonList>
              {usersData.map((user) => (
                <IonItem key={user.id}>
                  <IonAvatar slot="start">
                    <IonImg src="https://i.pravatar.cc/300?u=a" />
                  </IonAvatar>
                  <IonLabel {...{ for: user.id }}>
                    <h2>{user.displayName}</h2>
                  </IonLabel>
                  <IonCheckbox
                    id={user.id}
                    value={user.id}
                    checked={prepareAccessUsers.includes(user.id)}
                    onIonChange={(ev) => {
                      if (ev.detail.checked) {
                        setPrepareAccessUsers((users: any) => [...users, ev.detail.value]);
                      } else {
                        setPrepareAccessUsers((users: any) =>
                          users.filter((u: any) => u !== ev.detail.value),
                        );
                      }
                    }}
                  ></IonCheckbox>
                </IonItem>
              ))}
            </IonList>
          </IonContent>
        </IonModal>
      </IonContent>
    </IonPage>
  );
};

export default Steps;
