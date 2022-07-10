import { Redirect, Route } from 'react-router-dom';
import { IonApp, IonRouterOutlet, setupIonicReact } from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';
import { SplashScreen } from '@capacitor/splash-screen';

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

import Steps from './pages/Steps';
import {
  HOME,
  GALLERY_PAGE,
  STEPS_PAGE,
  PROJECTS_PAGE,
  REGISTER,
  COMMENTS_PAGE,
  HOUSES_PAGE,
  LOGIN,
} from './app/routes';
import { AuthProvider, FirestoreProvider, StorageProvider, useFirebaseApp } from 'reactfire';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { setAuthListener } from './services/auth';
import { useAppDispatch } from './app/hooks';
import Gallery from './pages/Gallery';
import Login from './pages/Login';
import Register from './pages/Register';
import Projects from './pages/Projects';
import Comments from './pages/Comments';
import Houses from './pages/Houses';
import usePushNotification from './hooks/usePushNotification';
import PrivateRoute from './components/PrivateRoute';

setupIonicReact({
  mode: 'ios',
});

const App: React.FC = () => {
  const dispatch = useAppDispatch();
  const firebaseApp = useFirebaseApp();
  const auth = getAuth(firebaseApp);
  const firestore = getFirestore(firebaseApp);
  const storage = getStorage(firebaseApp);

  // usePushNotification();

  if (auth && firestore && storage) {
    (async () => await SplashScreen.hide())();
  }

  (async () => await dispatch(setAuthListener()))();

  return (
    <IonApp>
      <AuthProvider sdk={auth}>
        <FirestoreProvider sdk={firestore}>
          <StorageProvider sdk={storage}>
            <IonReactRouter>
              <IonRouterOutlet>
                <Route path={LOGIN} component={Login} />
                <Route path={REGISTER} component={Register} />
                <PrivateRoute exact path={PROJECTS_PAGE}>
                  <Projects />
                </PrivateRoute>
                <PrivateRoute exact path={HOUSES_PAGE}>
                  <Houses />
                </PrivateRoute>
                <PrivateRoute exact path={STEPS_PAGE}>
                  <Steps />
                </PrivateRoute>
                <PrivateRoute exact path={GALLERY_PAGE}>
                  <Gallery />
                </PrivateRoute>
                <PrivateRoute exact path={COMMENTS_PAGE}>
                  <Comments />
                </PrivateRoute>
                <Redirect exact from={HOME} to={PROJECTS_PAGE} />
              </IonRouterOutlet>
            </IonReactRouter>
          </StorageProvider>
        </FirestoreProvider>
      </AuthProvider>
    </IonApp>
  );
};

export default App;
