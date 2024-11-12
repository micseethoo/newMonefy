// import { IonContent, IonPage, IonButton, IonInput, IonItem } from '@ionic/react';
// import React, { useState } from 'react';
// import './css/Login.css'; // Optional CSS for styling
// import { signInWithEmail } from '../theme/firebaseConfig'; // Import your Firebase sign-in function
// import { useHistory } from 'react-router-dom'; // Import useHistory for navigation
//
// const Home: React.FC = () => {
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const [error, setError] = useState<string | null>(null);
//   const history = useHistory(); // Initialize useHistory
//
//   const handleLogin = async () => {
//     try {
//       setError(null); // Clear any previous errors
//       await signInWithEmail(email, password);
//       console.log('User logged in successfully');
//
//       // Redirect to HomeUserPage upon successful login
//       history.push('/userhome'); // Ensure this path matches your routing configuration
//     } catch (err: any) {
//       console.error('Login failed:', err.message);
//       setError(err.message); // Display error to user
//     }
//   };
//
//   return (
//     <IonPage>
//       <IonContent fullscreen className="login-background">
//         <div className="login-container">
//           <h1 className="app-title">Monefy!</h1>
//           <h3 className="login-heading">Login</h3>
//           {error && <p className="error-message">{error}</p>} {/* Display error message */}
//           <IonItem className="input-item">
//             <IonInput
//               value={email}
//               placeholder="Email"
//               onIonChange={e => setEmail(e.detail.value!)}
//               required
//             />
//           </IonItem>
//           <IonItem className="input-item">
//             <IonInput
//               type="password"
//               value={password}
//               placeholder="Password"
//               onIonChange={e => setPassword(e.detail.value!)}
//               required
//             />
//           </IonItem>
//           <div className="button-container">
//             <IonButton expand="full" onClick={handleLogin} className="login-button">
//               Login
//             </IonButton>
//
//           </div>
//           <div className="signup-link">
//             Not registered yet? <a href="/signup">Sign up</a>
//           </div>
//         </div>
//       </IonContent>
//     </IonPage>
//   );
// };
//
// export default Home;

import { IonContent, IonPage, IonButton, IonInput, IonItem } from '@ionic/react';
import React, { useState } from 'react';
import './css/Login.css'; // Optional CSS for styling
import { signInWithEmail } from '../theme/firebaseConfig'; // Import your Firebase sign-in function
import { useHistory } from 'react-router-dom'; // Import useHistory for navigation

const Home: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
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

      // Simplified error messages
      switch (err.code) {
//         case 'auth/user-not-found':
//             setError('Account not found. Please sign up.');
//             break;
//         case 'auth/wrong-password':
//             setError('Incorrect password. Try again.');
//             break;
//         case 'auth/invalid-email':
//             setError('Invalid email. Check your input.');
//             break;
        case 'auth/invalid-credential':
            setError('Invalid email or password. Please try again.');
            break;
        default:
            setError('Something went wrong. Please try again.');
      }
    }
  };

  return (
    <IonPage>
      <IonContent fullscreen className="login-background">
        <div className="login-container">
          <h1 className="app-title">Monefy!</h1>
          <h3 className="login-heading">Login</h3>

          {/* Display error message */}
          {error && <p className="error-message">{error}</p>}

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

          <div className="button-container">
            <IonButton expand="full" onClick={handleLogin} className="login-button">
              Login
            </IonButton>
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

