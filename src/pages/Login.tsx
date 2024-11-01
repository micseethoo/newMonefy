// src/pages/Home.tsx
/*import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonButton, IonInput, IonItem, IonGrid, IonRow, IonCol } from '@ionic/react';
import React, { useState } from 'react';
import './css/Login.css'; // Optional CSS for styling

const Home: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = () => {
    // Handle login logic here
    console.log('Logging in with', email, password);
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar color="danger"> {/* Set to red *//*}
          <IonTitle>Login</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen className="login-background">
        <div className="login-container">
          <IonGrid>
            <IonRow className="ion-justify-content-center">
              <IonCol size="12" size-md="8" size-lg="6">
                <h2 className="login-title">Welcome Back!</h2>
                <IonItem>
                  <IonInput
                    value={email}
                    placeholder="Email"
                    onIonChange={e => setEmail(e.detail.value!)}
                    required
                  />
                </IonItem>
                <IonItem>
                  <IonInput
                    type="password"
                    value={password}
                    placeholder="Password"
                    onIonChange={e => setPassword(e.detail.value!)}
                    required
                  />
                </IonItem>
                <IonButton expand="full" onClick={handleLogin} className="login-button">
                  Login
                </IonButton>
                <IonButton expand="full" routerLink="/signup" color="light">
                  Sign Up
                </IonButton>
              </IonCol>
            </IonRow>
          </IonGrid>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default Home; */

// src/pages/Home.tsx
import { IonContent, IonPage, IonButton, IonInput, IonItem } from '@ionic/react';
import React, { useState } from 'react';
import './css/Login.css'; // Optional CSS for styling

const Home: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = () => {
    console.log('Logging in with', email, password);
  };

  return (
    <IonPage>
      <IonContent fullscreen className="login-background">
        <div className="login-container">
          <h1 className="app-title">Monefy!</h1>
          <h3 className="login-heading">Login</h3>
          <IonItem className="input-item">
            <IonInput
              value={email}
              placeholder="Username"
              onIonChange={e => setEmail(e.detail.value!)}
              required
            />
          </IonItem>
          <IonItem className="input-item">
            <IonInput
              type="password"
              value={password}
              placeholder="Password"
              onIonChange={e => setPassword(e.detail.value!)}
              required
            />
          </IonItem>
          <div className="button-container">
            <IonButton expand="full" onClick={handleLogin} className="login-button">
              Login
            </IonButton>
            <IonButton expand="full" routerLink="/signup" className="signup-button">
              Sign Up
            </IonButton>
          </div>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default Home;
