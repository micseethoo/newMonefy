// src/App.tsx
import { Redirect, Route } from 'react-router-dom';
import { IonApp, IonRouterOutlet, setupIonicReact } from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';
import Home from './pages/Home'; // Home acts as the Login page
import Signup from './pages/Signup'; // Sign Up page
import Login from './pages/Login'; // Reuse Home as Login
import UserHome from './pages/UserHome';
import Savings from './pages/Savings';
import HomeTest from './pages/HomeTest';
import MainMenu from './pages/MainMenu';

/* Core CSS required for Ionic components to work properly */
import '@ionic/react/css/core.css';
import '@ionic/react/css/normalize.css';
import '@ionic/react/css/structure.css';
import '@ionic/react/css/typography.css';
import '@ionic/react/css/padding.css';
import '@ionic/react/css/float-elements.css';
import '@ionic/react/css/text-alignment.css';
import '@ionic/react/css/text-transformation.css';
import '@ionic/react/css/flex-utils.css';
import '@ionic/react/css/display.css';

/* Optional dark mode */
import '@ionic/react/css/palettes/dark.system.css';

/* Theme variables */
import './theme/variables.css';

setupIonicReact();

const App: React.FC = () => (
  <IonApp>
    <IonReactRouter>
      <IonRouterOutlet>
        <Route exact path="/home">
          <Home />
        </Route>
        <Route exact path="/login">
          <Login /> {/* Reusing Home for login */}
        </Route>
        <Route exact path="/signup">
          <Signup />
        </Route>
        <Route exact path="/savings">
          <Savings />
        </Route>
        <Route exact path="/mainmenu">
          <MainMenu />
        </Route>
        <Route exact path="/">
          <MainMenu />
        </Route>
        <Route path="/userhome" component={UserHome} exact={true} />
      </IonRouterOutlet>
    </IonReactRouter>
  </IonApp>
);

export default App;
