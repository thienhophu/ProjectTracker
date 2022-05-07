import { Redirect, Route } from 'react-router-dom';
import { IonApp, IonRouterOutlet, setupIonicReact } from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';

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
  PROJECTS_PAGE,
  REGISTER,
  COMMENTS_PAGE,
} from './app/routes';
import Gallery from './pages/Gallery';
import Test from './pages/Test';
import Login from './pages/Login';
import Register from './pages/Register';
import Projects from './pages/Projects';
import AuthCheck from './components/AuthCheck';
import { AuthProvider, FirestoreProvider, StorageProvider, useFirebaseApp } from 'reactfire';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import Comments from './pages/Comments';

setupIonicReact({
  mode: 'ios',
});

const App: React.FC = () => {
  const firebaseApp = useFirebaseApp();
  const auth = getAuth(firebaseApp);
  const firestore = getFirestore(firebaseApp);
  const storage = getStorage(firebaseApp);

  return (
    <Provider store={store}>
      <IonApp>
        <AuthProvider sdk={auth}>
          <FirestoreProvider sdk={firestore}>
            <StorageProvider sdk={storage}>
              <IonReactRouter>
                <IonRouterOutlet>
                  <AuthCheck fallback={<Login />}>
                    <Route exact path={DASHBOARD_PAGE} component={Projects} />
                    <Route exact path={CREATE_PROJECT} component={CreateProject} />
                    <Route exact path={`${PROJECTS_PAGE}/:id${STEPS_PAGE}`} component={Steps} />
                    <Route
                      exact
                      path={`${PROJECTS_PAGE}/:id${STEPS_PAGE}/:stepId${GALLERY_PAGE}`}
                      component={Gallery}
                    />
                    <Route
                      exact
                      path={`${PROJECTS_PAGE}/:id${STEPS_PAGE}/:stepId${GALLERY_PAGE}/:imageId${COMMENTS_PAGE}`}
                      component={Comments}
                    />
                    <Route exact path={'/test'} component={Test} />
                    <Redirect exact from="/" to={DASHBOARD_PAGE} />
                  </AuthCheck>
                  <Route path={REGISTER} component={Register} />
                </IonRouterOutlet>
              </IonReactRouter>
            </StorageProvider>
          </FirestoreProvider>
        </AuthProvider>
      </IonApp>
    </Provider>
  );
};

export default App;
