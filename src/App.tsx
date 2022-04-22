import { Redirect, Route } from 'react-router-dom';
import { IonApp, IonLoading, IonRouterOutlet, setupIonicReact } from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';
import Home from './pages/Home';
import ViewMessage from './pages/ViewMessage';

/* Core CSS required for Ionic components to work properly */
import '@ionic/react/css/core.css';

/* Basic CSS for apps built with Ionic */
import '@ionic/react/css/normalize.css';
import '@ionic/react/css/structure.css';
import '@ionic/react/css/typography.css';

/* Optional CSS utils that can be commented out */
import '@ionic/react/css/padding.css';
import '@ionic/react/css/float-elements.css';
import '@ionic/react/css/text-alignment.css';
import '@ionic/react/css/text-transformation.css';
import '@ionic/react/css/flex-utils.css';
import '@ionic/react/css/display.css';

/* Theme variables */
import './theme/variables.css';
/* Tailwind variables */
import './theme/tailwind.css';

import { Provider } from 'react-redux';
import { store } from './app/store';
import Steps from './pages/Steps';
import CreateProject from './pages/CreateProject';
import {
  DASHBOARD_PAGE,
  GALLERY_PAGE,
  STEPS_PAGE,
  CREATE_PROJECT,
  HOME,
  PROJECTS_PAGE,
} from './app/routes';
import Gallery from './pages/Gallery';
import Test from './pages/Test';
import { initializeFirestore, enableIndexedDbPersistence } from 'firebase/firestore';
import { FirestoreProvider, useInitFirestore } from 'reactfire';
import Login from './pages/Login';
import Register from './pages/Register';
import Projects from './pages/Projects';

setupIonicReact({
  mode: 'ios',
});

const App: React.FC = () => {
  const { status, data: firestoreInstance } = useInitFirestore(async (firebaseApp) => {
    const db = initializeFirestore(firebaseApp, {});
    await enableIndexedDbPersistence(db);
    return db;
  });

  if (status === 'loading') {
    return <IonLoading isOpen message={'Please wait...'} />;
  }

  return (
    <Provider store={store}>
      <FirestoreProvider sdk={firestoreInstance}>
        <IonApp>
          <IonReactRouter>
            <IonRouterOutlet>
              <Route exact path={DASHBOARD_PAGE} component={Projects} />
              <Route exact path={CREATE_PROJECT} component={CreateProject} />
              <Route exact path={HOME} component={Home} />
              <Route exact path={`${PROJECTS_PAGE}/:id${STEPS_PAGE}`} component={Steps} />
              <Route exact path={GALLERY_PAGE} component={Gallery} />
              <Route path="/message/:id" component={ViewMessage} />
              <Route path="/login" component={Login} />
              <Route path="/register" component={Register} />
              <Route exact path={'/test'} component={Test} />
              <Redirect exact from="/" to={DASHBOARD_PAGE} />
            </IonRouterOutlet>
          </IonReactRouter>
        </IonApp>
      </FirestoreProvider>
    </Provider>
  );
};

export default App;
