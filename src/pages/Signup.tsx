import { IonContent, IonPage, IonButton, IonInput, IonItem, IonIcon } from '@ionic/react';
import React, { useState } from 'react';
import './css/Signup.css';
import { signUpWithEmail } from '../theme/firebaseConfig';
import { eyeOffOutline, eyeOutline } from 'ionicons/icons'; // Import eye icons
import { useHistory } from 'react-router-dom'; // Import useHistory

const SignUp: React.FC = () => {
  const [username, setUsername] = useState('');
  const [nickname, setNickname] = useState(''); // State for nickname
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordVisible, setPasswordVisible] = useState(false); // State for password visibility
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false); // State for confirm password visibility
  const [errorMessage, setErrorMessage] = useState(''); // State for error messages

  const history = useHistory(); // Initialize useHistory

  const handleSignUp = () => {
    // Check if all fields are filled
    if (!username || !nickname || !email || !password || !confirmPassword) {
      setErrorMessage("Please fill in all the fields.");
      return;
    }

    // Check if passwords match
    if (password !== confirmPassword) {
      setErrorMessage("Passwords don't match");
      return;
    }

    // Proceed with sign-up if all validations pass
    signUpWithEmail(email, password, username, nickname)
      .then(() => {
        console.log('Sign-up successful!');
        history.push('/login'); // Redirect to the login page on successful sign-up
      })
      .catch((error) => {
        setErrorMessage('Sign-up failed: ' + error.message); // Display error message
        console.error('Sign-up failed:', error);
      });
  };

  return (
    <IonPage>
      <IonContent fullscreen className="signup-background">
        <div className="signup-container">
          <h1 className="app-title">Monefy!</h1>
          <h3 className="signup-heading">Register Account</h3>

          {errorMessage && <div className="error-message">{errorMessage}</div>}

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
              value={nickname}
              placeholder="Nickname"
              onIonChange={e => setNickname(e.detail.value!)}
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
              onIonChange={(e) => setPassword(e.detail.value!)}
              required
            />
            <IonIcon
              icon={passwordVisible ? eyeOutline : eyeOffOutline}
              onClick={() => setPasswordVisible(!passwordVisible)}
              slot="end"
              className="password-icon"
            />
          </IonItem>
          <IonItem className="input-item">
            <IonInput
              type={confirmPasswordVisible ? 'text' : 'password'}
              value={confirmPassword}
              placeholder="Confirm Password"
              onIonChange={(e) => setConfirmPassword(e.detail.value!)}
              required
            />
            <IonIcon
              icon={confirmPasswordVisible ? eyeOutline : eyeOffOutline}
              onClick={() => setConfirmPasswordVisible(!confirmPasswordVisible)}
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
