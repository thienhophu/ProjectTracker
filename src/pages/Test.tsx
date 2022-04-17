import { IonPage } from '@ionic/react';
import { collection } from 'firebase/firestore';
import { useFirestoreCollectionData, useFirestore } from 'reactfire';

const Test: React.FC = () => {
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
    {data && data.map((animal) => (
    <li key={animal.id}>{animal.name}</li>
  ))}
  </IonPage>
  );
};


export default Test;