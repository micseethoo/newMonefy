import { IonContent, IonPage, IonButton, IonInput, IonItem, IonText } from '@ionic/react';
import React, { useState } from 'react';
import './css/Signup.css';
import { signUpWithEmail } from '../theme/firebaseConfig';

const SignUp: React.FC = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState(''); // State for storing error messages

  const handleSignUp = () => {
    setError(''); // Clear any existing error messages

    // Validation for password length
    if (password.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }

    // Validation for password match
    if (password !== confirmPassword) {
      setError("Passwords don't match");
      return;
    }

    // Calling the sign-up function
    signUpWithEmail(email, password, username)
      .then(() => {
        console.log('Sign-up successful!');
        // Redirect or perform additional actions here
      })
      .catch((error) => {
        // Handling Firebase authentication errors
        switch (error.code) {
          case 'auth/email-already-in-use':
            setError('This email is already in use. Please try a different email.');
            break;
          case 'auth/invalid-email':
            setError('Invalid email format. Please enter a valid email address.');
            break;
          case 'auth/weak-password':
            setError('Password is too weak. Please use a stronger password.');
            break;
          case 'auth/operation-not-allowed':
            setError('Email/password accounts are currently disabled.');
            break;
          default:
            setError('Sign-up failed. Please try again.');
        }
        console.error('Sign-up failed:', error);
      });
  };

  return (
    <IonPage>
      <IonContent fullscreen className="signup-background">
        <div className="signup-container">
          <h1 className="app-title">Monefy!</h1>
          <h3 className="signup-heading">Register Account</h3>

          {/* Display error message */}
          {error && (
            <IonText color="danger" className="error-message">
              <p>{error}</p>
            </IonText>
          )}

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

export default SignUp;

