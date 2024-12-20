import {
  IonContent,
  IonPage,
  IonButton,
  IonInput,
  IonItem,
  IonIcon,
} from '@ionic/react';
import React, { useState } from 'react';
import { eye, eyeOff } from 'ionicons/icons'; // Import icons for visibility toggle
import './css/Login.css'; // Optional CSS for styling
import { signInWithEmail } from '../theme/firebaseConfig'; // Import your Firebase sign-in function
import { useHistory } from 'react-router-dom'; // Import useHistory for navigation

const Home: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false); // State to toggle password visibility
  const [error, setError] = useState<string | null>(null);
  const history = useHistory(); // Initialize useHistory

  const handleLogin = async () => {
    try {
      setError(null); // Clear any previous errors
      await signInWithEmail(email, password);
      console.log('User logged in successfully');

      // Redirect to HomeUserPage upon successful login
      history.push('/userhome'); // Ensure this path matches your routing configuration
    } catch (err: any) {
      console.error('Login failed:', err.message);
      setError(err.message); // Display error to user
    }
  };

  return (
    <IonPage>
      <IonContent fullscreen className="login-background">
        <div className="login-container">
          <h1 className="app-title">Welcome to Monefy!</h1>
          <h3 className="login-heading">Login</h3>
          {error && <p className="error-message">{error}</p>} {/* Display error message */}
          <IonItem className="input-item">
            <IonInput
              value={email}
              placeholder="Email"
              onIonChange={(e) => setEmail(e.detail.value!)}
              required
            />
          </IonItem>
          <IonItem className="input-item">
            <IonInput
              type={showPassword ? 'text' : 'password'} // Toggle between 'text' and 'password'
              value={password}
              placeholder="Password"
              onIonChange={(e) => setPassword(e.detail.value!)}
              required
            />
            <IonIcon
              slot="end"
              icon={showPassword ? eyeOff : eye} // Change icon based on state
              className="toggle-password-icon"
              onClick={() => setShowPassword(!showPassword)} // Toggle state
            />
          </IonItem>
          <div className="button-container">
            <IonButton expand="full" onClick={handleLogin} className="login-button">
              Login
            </IonButton>
          </div>

          <div className="forgot-password-link">
            <a href="/forgot-password">Forgot Password?</a>
          </div>
          <div className="signup-link">
            Not registered yet? <a href="/signup">Sign up</a>
          </div>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default Home;
