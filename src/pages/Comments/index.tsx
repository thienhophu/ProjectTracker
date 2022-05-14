import {
  IonBackButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonPage,
  IonLabel,
  IonTitle,
  IonToolbar,
  IonLoading,
  IonImg,
  IonText,
  IonItemDivider,
  IonList,
  IonItem,
  IonModal,
  IonTextarea,
  IonButton,
  IonFooter,
  IonSkeletonText,
} from '@ionic/react';
import { useFirestore, useFirestoreCollectionData, useFirestoreDocDataOnce } from 'reactfire';
import { useParams } from 'react-router';
import { addDoc, collection, doc, Timestamp, query, where } from 'firebase/firestore';
import { FC, useCallback, useMemo, useRef, useState } from 'react';
import { formatDistanceToNow } from 'date-fns';

import { getCurrentUserData } from '../../features/auth/authSlice';
import { useAppSelector } from '../../app/hooks';
import { Comment } from '../../data/comment';
import { orderBy } from 'lodash';

const SingleComment: FC<{ comment: Comment }> = ({ comment }) => {
  return (
    <IonItem>
      <IonLabel>
        <h2>
          <b>{comment?.author_name}</b>{' '}
          <span>- {formatDistanceToNow(comment?.created_at.toDate())}</span>
        </h2>
        <span>{comment?.description}</span>
      </IonLabel>
    </IonItem>
  );
};

const CommentSkeletons: FC = () => {
  return (
    <>
      {Array(5)
        .fill(0)
        .map((_, index) => (
          <IonItem key={index}>
            <IonLabel>
              <h2>
                <IonSkeletonText animated style={{ width: '40%' }} />
              </h2>
              <span>
                <IonSkeletonText animated style={{ width: '100%' }} />
              </span>
            </IonLabel>
          </IonItem>
        ))}
    </>
  );
};

const Comments: FC = () => {
  const firestore = useFirestore();
  const currentUser = useAppSelector(getCurrentUserData);
  const { id, stepId, imageId } = useParams<any>();
  const [showModal, setShowModal] = useState(false);
  const [didLoadImage, setDidLoadImage] = useState(false);
  const [currentComment, setCurrentComment] = useState(null);
  const contentRef: any = useRef();

  const imageRef = doc(firestore, `projects/${id}/steps/${stepId}/gallery`, imageId);
  const { status, data: image } = useFirestoreDocDataOnce(imageRef);

  const commentRef = collection(firestore, 'comments');
  const { status: commentStatus, data: comments } = useFirestoreCollectionData(
    query(commentRef, where('model_type', '==', 'gallery'), where('model_id', 'in', [imageId])),
  );

  const isLoadingComments = useMemo(() => commentStatus === 'loading', [commentStatus]);

  const orderedComments = useMemo(
    () => orderBy(comments, 'created_at.seconds', 'desc'),
    [comments],
  );

  const openAddCommentModal = useCallback(() => {
    setShowModal(true);
  }, [setShowModal]);

  const closeAddCommentModal = useCallback(() => {
    setShowModal(false);
  }, [setShowModal]);

  const onComment = useCallback(async () => {
    if (!currentComment) {
      return;
    }

    try {
      await addDoc(commentRef, {
        description: currentComment,
        model_type: 'gallery',
        model_id: imageId,
        created_at: Timestamp.now(),
        author_name: currentUser.displayName || 'Anonymous',
      });
      if (contentRef.current) {
        contentRef.current.scrollToTop(0);
      }
    } catch (error) {
      console.error('🚀 ~ file: index.tsx ~ line 73 ~ error', error);
    }
    setCurrentComment(null);
    closeAddCommentModal();
  }, [closeAddCommentModal, commentRef, currentComment, currentUser.displayName, imageId]);

  const isLoading = status === 'loading';

  if (isLoading) {
    return <IonLoading isOpen />;
  }

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton defaultHref="/" />
          </IonButtons>
          <IonTitle>Step 1</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent ref={contentRef}>
        <IonImg
          src={image.imageURL}
          className={'w-full p-4'}
          style={!didLoadImage ? { minHeight: 400 } : {}}
          onIonImgDidLoad={() => setDidLoadImage(true)}
        />
        <IonText className="p-4">{imageId}</IonText>

        <IonList className="mt-8">
          <IonItemDivider>
            <IonLabel>Comments</IonLabel>
          </IonItemDivider>

          {isLoadingComments && <CommentSkeletons />}

          {comments && comments.length === 0 && (
            <IonItem>
              <IonLabel className="text-center">There is no comments.</IonLabel>
            </IonItem>
          )}
          {comments &&
            orderedComments.map((comment: any) => (
              <SingleComment key={comment.NO_ID_FIELD} comment={comment} />
            ))}
        </IonList>
      </IonContent>

      <IonModal
        isOpen={showModal}
        breakpoints={[0.5, 1]}
        initialBreakpoint={0.5}
        onDidDismiss={closeAddCommentModal}
      >
        <IonHeader>
          <IonToolbar>
            <IonTitle>Add comment</IonTitle>
            <IonButtons slot="end">
              <IonButton color="danger" onClick={closeAddCommentModal}>
                Cancel
              </IonButton>
            </IonButtons>
          </IonToolbar>
        </IonHeader>
        <IonContent>
          <IonItem>
            <IonLabel position="stacked">Comment</IonLabel>
            <IonTextarea
              rows={6}
              value={currentComment}
              onIonChange={(e: any) => setCurrentComment(e.detail.value)}
            />
          </IonItem>

          <IonButton expand="full" className="m-4" onClick={onComment}>
            Comment
          </IonButton>
        </IonContent>
      </IonModal>
      <IonFooter>
        <IonButton expand="full" onClick={openAddCommentModal}>
          Add Comment
        </IonButton>
      </IonFooter>
    </IonPage>
  );
};

export default Comments;
