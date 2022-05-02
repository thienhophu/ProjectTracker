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
  IonPopover,
  IonRange,
  IonText,
} from '@ionic/react';
import { addDoc, collection, deleteDoc, doc, updateDoc } from 'firebase/firestore';
import { maxBy, orderBy } from 'lodash';
import { useCallback, useMemo, useState } from 'react';
import { useHistory, useParams } from 'react-router';
import { GALLERY_PAGE, PROJECTS_PAGE, STEPS_PAGE } from '../../app/routes';
import { useFirestore, useFirestoreCollectionData, useFirestoreDocData } from 'reactfire';
import './styles.css';

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
        <IonReorder slot="end" />
      </IonItem>
      <IonItemOptions side="end">
        <IonItemOption color="danger" onClick={onClickDelete}>
          Delete
        </IonItemOption>
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
  const [popoverState, setIsShowPopover] = useState({ isShowPopover: false, event: undefined });

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

  const showPopover = useCallback(
    (e: any) => {
      e.persist();
      setIsShowPopover({ isShowPopover: true, event: e });
    },
    [setIsShowPopover],
  );

  const onHideProjectPopover = useCallback(() => {
    setIsShowPopover({ isShowPopover: false, event: undefined });
  }, [setIsShowPopover]);

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
          <IonButtons slot="end">
            <IonButton onClick={onToggleReorder}>{reorderText}</IonButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <IonList>
          <IonListHeader lines="inset" className="mb-4">
            <IonLabel>{projectData.name}</IonLabel>
            <IonLabel className="text-right pr-8" onClick={showPopover}>
              {projectData.progress ?? 0}%
            </IonLabel>
          </IonListHeader>

          <IonPopover
            event={popoverState.event}
            isOpen={popoverState.isShowPopover}
            onDidDismiss={onHideProjectPopover}
            alignment="center"
          >
            <IonText className="ion-padding">Progress {projectData.progress ?? 0}%</IonText>
            <IonRange min={0} max={100} pin color="secondary"></IonRange>
          </IonPopover>

          <IonReorderGroup disabled={!enableReorder} onIonItemReorder={doReorder}>
            {orderedSteps.map((step: any) => (
              <SingleStep key={step.NO_ID_FIELD} step={step} onDelete={deleteStep} />
            ))}
          </IonReorderGroup>
        </IonList>
        <IonButton expand="full" onClick={onCreateStep}>
          Create Step
        </IonButton>
        <IonButton expand="full" color="danger" onClick={onDeleteProject}>
          Delete Project
        </IonButton>
      </IonContent>
    </IonPage>
  );
};

export default Steps;
