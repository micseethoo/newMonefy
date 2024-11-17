// src/pages/SignUp.tsx
/*import { IonContent, IonPage, IonButton, IonInput, IonItem } from '@ionic/react';
import React, { useState } from 'react';
import './css/Signup.css';
import { signUpWithEmail } from '../theme/firebaseConfig';

const SignUp: React.FC = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleSignUp = () => {
    if (password !== confirmPassword) {
      console.error("Passwords don't match");
      return;
    }

    signUpWithEmail(email, password, username)
      .then(() => {
        console.log('Sign-up successful!');
        // Redirect or perform additional actions here
      })
      .catch((error) => {
        console.error('Sign-up failed:', error);
      });
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
              value={email}
              placeholder="Email"
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
          <IonItem className="input-item">
            <IonInput
              type="password"
              value={confirmPassword}
              placeholder="Confirm Password"
              onIonChange={e => setConfirmPassword(e.detail.value!)}
              required
            />
          </IonItem>

          <div className="button-container">
            <IonButton expand="full" onClick={handleSignUp} className="signup-button">
              Register
            </IonButton>

          </div>
          <div className="login-link">
            Have registered? <a href="/login">Log in</a>
          </div>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default SignUp;*/

import { IonContent, IonPage, IonButton, IonInput, IonItem, IonIcon } from '@ionic/react';
import React, { useState } from 'react';
import './css/Signup.css';
import { signUpWithEmail } from '../theme/firebaseConfig';
import { eyeOffOutline, eyeOutline } from 'ionicons/icons'; // Import eye icons

const SignUp: React.FC = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordVisible, setPasswordVisible] = useState(false); // State for password visibility
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false); // State for confirm password visibility

  const handleSignUp = () => {
    if (password !== confirmPassword) {
      console.error("Passwords don't match");
      return;
    }

    signUpWithEmail(email, password, username)
      .then(() => {
        console.log('Sign-up successful!');
        // Redirect or perform additional actions here
      })
      .catch((error) => {
        console.error('Sign-up failed:', error);
      });
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
              value={email}
              placeholder="Email"
              onIonChange={e => setEmail(e.detail.value!)}
              required
            />
          </IonItem>
          <IonItem className="input-item">
            <IonInput
              type={passwordVisible ? 'text' : 'password'} // Toggle password visibility
              value={password}
              placeholder="Password"
              onIonChange={e => setPassword(e.detail.value!)}
              required
            />
            <IonIcon
              icon={passwordVisible ? eyeOutline : eyeOffOutline} // Change icon based on visibility
              onClick={() => setPasswordVisible(!passwordVisible)} // Toggle visibility
              slot="end"
              className="password-icon"
            />
          </IonItem>
          <IonItem className="input-item">
            <IonInput
              type={confirmPasswordVisible ? 'text' : 'password'} // Toggle confirm password visibility
              value={confirmPassword}
              placeholder="Confirm Password"
              onIonChange={e => setConfirmPassword(e.detail.value!)}
              required
            />
            <IonIcon
              icon={confirmPasswordVisible ? eyeOutline : eyeOffOutline} // Change icon based on visibility
              onClick={() => setConfirmPasswordVisible(!confirmPasswordVisible)} // Toggle visibility
              slot="end"
              className="password-icon"
            />
          </IonItem>

          <div className="button-container">
            <IonButton expand="full" onClick={handleSignUp} className="signup-button">
              Register
            </IonButton>
          </div>
          <div className="login-link">
            Have registered? <a href="/login">Log in</a>
          </div>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default SignUp;


