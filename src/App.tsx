import { Redirect, Route } from "react-router-dom";
import { IonApp, IonRouterOutlet, setupIonicReact } from "@ionic/react";
import { IonReactRouter } from "@ionic/react-router";
import Home from "./pages/Home";
import ViewMessage from "./pages/ViewMessage";
import Dashboard from "./pages/Dashboard";
import CreateProject from "./pages/CreateProject";

/* Core CSS required for Ionic components to work properly */
import "@ionic/react/css/core.css";

/* Basic CSS for apps built with Ionic */
import "@ionic/react/css/normalize.css";
import "@ionic/react/css/structure.css";
import "@ionic/react/css/typography.css";

/* Optional CSS utils that can be commented out */
import "@ionic/react/css/padding.css";
import "@ionic/react/css/float-elements.css";
import "@ionic/react/css/text-alignment.css";
import "@ionic/react/css/text-transformation.css";
import "@ionic/react/css/flex-utils.css";
import "@ionic/react/css/display.css";

/* Theme variables */
import "./theme/variables.css";
/* Tailwind variables */
import "./theme/tailwind.css";
import { Provider } from "react-redux";
import { store } from "./app/store";

setupIonicReact({
  mode: "ios",
});

const App: React.FC = () => (
  <Provider store={store}>
    <IonApp>
      <IonReactRouter>
        <IonRouterOutlet>
          <Route path="/dashboard" component={Dashboard} />
          <Redirect exact from="/" to="/dashboard" />

          <Route exact path="/createProject" component={CreateProject} />

          <Route path="/home" exact={true}>
            <Home />
          </Route>

          <Route path="/message/:id">
            <ViewMessage />
          </Route>
        </IonRouterOutlet>
      </IonReactRouter>
    </IonApp>
  </Provider>
);

export default App;
