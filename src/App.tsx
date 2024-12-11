// src/App.tsx
import { Redirect, Route } from 'react-router-dom';
import { IonApp, IonRouterOutlet, setupIonicReact } from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';
import Home from './pages/Home';
import Signup from './pages/Signup';
import Login from './pages/Login';
import UserHome from './pages/UserHome';
import Savings from './pages/Savings';
import Statistics from './pages/Statistics'; // Import Statistics
import Budgeting from './pages/Budgeting'; // Import Budgeting
import TransactionHistory from './pages/TransactionHistory';
import Profile from './pages/Profile'; // Import Profile


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
          <Login />
        </Route>
        <Route exact path="/signup">
          <Signup />
        </Route>
        <Route exact path="/savings">
          <Savings />
        </Route>
        <Route exact path="/statistics">
           <Statistics />
        </Route>
        <Route exact path="/profile">
                   <Profile />
                </Route>
        <Route exact path="/budgeting"> {/* Add Budgeting route */}
          <Budgeting />
        </Route>
        <Route path="/userhome" component={UserHome} exact={true} />
        <Route exact path="/">
          <Redirect to="/home" />
        </Route>

      </IonRouterOutlet>
    </IonReactRouter>
  </IonApp>
);

export default App;

