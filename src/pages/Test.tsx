import { doc, collection, addDoc, updateDoc, deleteDoc } from 'firebase/firestore';
import { useFirestoreCollectionData, useFirestore } from 'reactfire';
import {
  IonBackButton,
  IonButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonIcon,
  IonItem,
  IonLabel,
  IonPage,
  IonToolbar,
} from '@ionic/react';
import { removeCircle } from 'ionicons/icons';

const Test: React.FC = () => {
  // easily access the Firestore library
  // set up query
  const firestore = useFirestore();
  const testingRef = collection(firestore, 'projects');

  // subscribe to a document for realtime updates. just one line!
  const { status, data } = useFirestoreCollectionData(testingRef);

  const addItem = async () => {
    try {
      await addDoc(testingRef, { name: new Date().getTime() + '- Name' });
    } catch (error) {
      console.log('🚀 ~ file: Test.tsx ~ line 30 ~ error', error);
    }
  };

  const updateItem = async (id: any) => {
    try {
      await updateDoc(doc(testingRef, id), { name: new Date().getTime() + '- Name' });
    } catch (error) {
      console.log('🚀 ~ file: Test.tsx ~ line 30 ~ error', error);
    }
  };

  const deleteItem = async (id: any) => {
    try {
      await deleteDoc(doc(testingRef, id));
    } catch (error) {
      console.log('🚀 ~ file: Test.tsx ~ line 30 ~ error', error);
    }
  };

  // check the loading status
  if (status === 'loading') {
    return <p>Fetching...</p>;
  }

  return (
    <IonPage>
      <IonHeader translucent>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton text="Inbox" defaultHref="/home"></IonBackButton>
            <IonButton onClick={() => addItem()}>Add Item</IonButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>

      <IonContent fullscreen>
        {data &&
          data.map((animal) => {
            console.log(animal.NO_ID_FIELD);
            return (
              <IonItem key={animal.NO_ID_FIELD}>
                <IonIcon
                  icon={removeCircle}
                  color="danger"
                  onClick={() => deleteItem(animal.NO_ID_FIELD)}
                >
                  DELETE
                </IonIcon>
                <IonLabel className="ion-text-wrap">
                  <h2>{animal.NO_ID_FIELD}</h2>
                  <h2>{animal.name}</h2>
                </IonLabel>
              </IonItem>
            );
          })}
      </IonContent>
    </IonPage>
  );
};

export default Test;
