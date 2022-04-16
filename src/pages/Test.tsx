import { IonPage } from '@ionic/react';
import { getFirestore, collection } from 'firebase/firestore';
import { useFirebaseApp, useFirestoreCollectionData, useFirestore, FirestoreProvider } from 'reactfire';

const TestChild: React.FC = () => {
  // easily access the Firestore library
   // set up query
   const firestore = useFirestore();
   const testingRef = collection(firestore, 'testingCollection');

  // subscribe to a document for realtime updates. just one line!
  const { status, data } = useFirestoreCollectionData(testingRef);
  console.log("🚀 ~ file: Test.tsx ~ line 11 ~ status", status);
  console.log("🚀 ~ file: Test.tsx ~ line 11 ~ data", data);

  return (
  <IonPage>
    {data.map((animal) => (
    <li key={animal.id}>{animal.name}</li>
  ))}
  </IonPage>
  );
};

const Test: React.FC = () => {
  const firestore = getFirestore(useFirebaseApp());

  return <FirestoreProvider sdk={firestore}><TestChild></TestChild></FirestoreProvider>;
};

export default Test;