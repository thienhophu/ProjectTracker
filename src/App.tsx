import { Redirect, Route } from 'react-router-dom';
import { IonApp, IonRouterOutlet, setupIonicReact } from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';
import Home from './pages/Home';
import ViewMessage from './pages/ViewMessage';
import Dashboard from './pages/Dashboard';

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
import { DASHBOARD_PAGE, GALLERY_PAGE, STEPS_PAGE, CREATE_PROJECT, HOME} from './app/routes';
import Gallery from './pages/Gallery';
import Test from './pages/Test';
import { getFirestore } from 'firebase/firestore';
import { useFirebaseApp, FirestoreProvider } from 'reactfire';

setupIonicReact({
  mode: 'ios',
});

const App: React.FC = () => {
  const firestore = getFirestore(useFirebaseApp());

  return (
    <Provider store={store}>
      <FirestoreProvider sdk={firestore}>
        <IonApp>
          <IonReactRouter>
            <IonRouterOutlet>
              <Route exact path={DASHBOARD_PAGE} component={Dashboard} />
              <Route exact path={CREATE_PROJECT} component={CreateProject} />
              <Route exact path={HOME} component={Home} />
              <Route exact path={DASHBOARD_PAGE} component={Dashboard} />
              <Route exact path={STEPS_PAGE} component={Steps} />
              <Route exact path={GALLERY_PAGE} component={Gallery} />
              <Route path='/message/:id' component={ViewMessage} />

              <Route exact path={'/test'} component={Test} />
              <Redirect exact from='/' to={DASHBOARD_PAGE} />
            </IonRouterOutlet>
          </IonReactRouter>
        </IonApp>
      </FirestoreProvider>
    </Provider>
  );
};

export default App;
