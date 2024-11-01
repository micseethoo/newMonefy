// src/pages/SignUp.tsx
/*import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonButton, IonInput, IonItem, IonGrid, IonRow, IonCol } from '@ionic/react';
import React, { useState } from 'react';
import './css/Signup.css'; // Optional CSS for styling

const SignUp: React.FC = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSignUp = () => {
    // Handle signup logic here
    console.log('Signing up with', username, email, password);
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar color="danger"> {/* Set to red *//*}
          <IonTitle>Sign Up</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen className="signup-background">
        <div className="signup-container">
          <IonGrid>
            <IonRow className="ion-justify-content-center">
              <IonCol size="12" size-md="8" size-lg="6">
                <h2 className="signup-title">Create an Account</h2>
                <IonItem>
                  <IonInput
                    value={username}
                    placeholder="Username"
                    onIonChange={e => setUsername(e.detail.value!)}
                    required
                  />
                </IonItem>
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
                <IonButton expand="full" onClick={handleSignUp} className="signup-button">
                  Sign Up
                </IonButton>
                <IonButton expand="full" routerLink="/" color="light">
                  Already have an account? Login
                </IonButton>
              </IonCol>
            </IonRow>
          </IonGrid>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default SignUp; */

// src/pages/SignUp.tsx
import { IonContent, IonPage, IonButton, IonInput, IonItem } from '@ionic/react';
import React, { useState } from 'react';
import './css/Signup.css'; // Optional CSS for styling

const SignUp: React.FC = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleSignUp = () => {
    console.log('Signing up with', username, email, password, confirmPassword);
  };

  return (
    <IonPage>
      <IonContent fullscreen className="signup-background">
        <div className="signup-container">
          <h1 className="app-title">Monefy!</h1>
          <h3 className="signup-heading">Register Account</h3>
          <IonItem className="input-item">
            <IonInput
              value={username}
              placeholder="Full Name"
              onIonChange={e => setUsername(e.detail.value!)}
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
          <IonItem className="input-item">
            <IonInput
              type="password"
              value={confirmPassword}
              placeholder="Confirm Password"
              onIonChange={e => setConfirmPassword(e.detail.value!)}
              required
            />
          </IonItem>
          <IonItem className="input-item">
            <IonInput
              value={email}
              placeholder="Email"
              onIonChange={e => setEmail(e.detail.value!)}
              required
            />
          </IonItem>
          <div className="button-container">
            <p className="signup-link">
              Not registered? <a href="/signup">Sign Up</a>
            </p>
            <IonButton expand="full" routerLink="/" className="back-button">
              Back
            </IonButton>
          </div>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default SignUp;

