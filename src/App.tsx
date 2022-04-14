import { Redirect, Route } from "react-router-dom";
import { IonApp, IonRouterOutlet, setupIonicReact } from "@ionic/react";
import { IonReactRouter } from "@ionic/react-router";
import { Provider } from "react-redux";

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

import { store } from "./app/store";
import Home from "./pages/Home";
import ViewMessage from "./pages/ViewMessage";
import Login from "./pages/Login";
import Register from "./pages/Register";
import News from "./pages/News";

setupIonicReact();

const App: React.FC = () => (
  <Provider store={store}>
    <IonApp>
      <IonReactRouter>
        <IonRouterOutlet>
          <Route path="/" exact={true}>
            <Redirect to="/dashboard" />
          </Route>
          <Route path="/home" exact={true}>
            <Home />
          </Route>
          <Route path="/message/:id">
            <ViewMessage />
          </Route>
          <Route path="/login" component={Login} exact />
          <Route path="/register" component={Register} exact />
          <Route path="/news" component={News} exact />
        </IonRouterOutlet>
      </IonReactRouter>
    </IonApp>
  </Provider>
);

export default App;
