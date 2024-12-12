// // import { IonContent, IonPage, IonButton, IonInput, IonItem } from '@ionic/react';
// // import React, { useState } from 'react';
// // import './css/Login.css'; // Optional CSS for styling
// // import { signInWithEmail } from '../theme/firebaseConfig'; // Import your Firebase sign-in function
// // import { useHistory } from 'react-router-dom'; // Import useHistory for navigation
// //
// // const Home: React.FC = () => {
// //   const [email, setEmail] = useState('');
// //   const [password, setPassword] = useState('');
// //   const [error, setError] = useState<string | null>(null);
// //   const history = useHistory(); // Initialize useHistory
// //
// //   const handleLogin = async () => {
// //       try {
// //         setError(null);
// //         const isPhoneNumber = /^\d+$/.test(identifier);
// //         const usersRef = collection(db, 'users');
// //
// //         let userQuery;
// //         if (isPhoneNumber) {
// //           userQuery = query(usersRef, where('phoneNumber', '==', identifier));
// //         } else if (identifier.includes('@')) {
// //           userQuery = query(usersRef, where('email', '==', identifier));
// //         } else {
// //           throw new Error('Invalid email or phone number format.');
// //         }
// //
// //         const querySnapshot = await getDocs(userQuery);
// //         if (!querySnapshot.empty) {
// //           console.log('User found. Implement further authentication logic.');
// //           history.push('/userhome'); // Redirect to the user home page
// //         } else {
// //           throw new Error('No account found with the provided email or phone number.');
// //         }
// //       } catch (err: any) {
// //         console.error('Login failed:', err.message);
// //         setError(err.message);
// //       }
// //     };
// //
// //   return (
// //     <IonPage>
// //       <IonContent fullscreen className="login-background">
// //         <div className="login-container">
// //           <h1 className="app-title">Monefy!</h1>
// //           <h3 className="login-heading">Login</h3>
// //           {error && <p className="error-message">{error}</p>} {/* Display error message */}
// //           <IonItem className="input-item">
// //             <IonInput
// //               value={email}
// //               placeholder="Email"
// //               onIonChange={e => setEmail(e.detail.value!)}
// //               required
// //             />
// //           </IonItem>
// //           <IonItem className="input-item">
// //             <IonInput
// //               type="password"
// //               value={password}
// //               placeholder="Password"
// //               onIonChange={e => setPassword(e.detail.value!)}
// //               required
// //             />
// //           </IonItem>
// //           <div className="button-container">
// //             <IonButton expand="full" onClick={handleLogin} className="login-button">
// //               Login
// //             </IonButton>
// //
// //           </div>
// //           <div className="signup-link">
// //             Not registered yet? <a href="/signup">Sign up</a>
// //           </div>
// //         </div>
// //       </IonContent>
// //     </IonPage>
// //   );
// // };
// //
// // export default Home;
// //
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
import { signInWithEmail, signInWithPhone } from '../theme/firebaseConfig'; // Import Firebase functions
import { useHistory } from 'react-router-dom'; // Import useHistory for navigation

const Home: React.FC = () => {
  const [emailOrPhone, setEmailOrPhone] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isPhoneLogin, setIsPhoneLogin] = useState(false); // State to check if it's a phone login
  const history = useHistory(); // Initialize useHistory

  const handleLogin = async () => {
    try {
      setError(null); // Clear any previous errors

      const isPhoneNumber = /^\d{10,15}$/.test(emailOrPhone); // Validate phone number format (10-15 digits)

      if (isPhoneNumber) {
        // Sign in with phone number (check Firestore for phone number)
        await signInWithPhone(emailOrPhone);
        console.log('Phone number sign-in successful');

      } else if (emailOrPhone.includes('@')) {
        // Sign in with email (password required)
        await signInWithEmail(emailOrPhone, password);
        console.log('User logged in successfully with email');
      } else {
        throw new Error('Invalid email or phone number format.');
      }

      // Redirect to HomeUserPage upon successful login
      history.push('/userhome');
    } catch (err: any) {
      console.error('Login failed:', err.message);
      setError(err.message); // Display error to user
    }
  };

  return (
    <IonPage>
      <IonContent fullscreen className="login-background">
        <div className="login-container">
          <h1 className="app-title">Monefy!</h1>
          <h3 className="login-heading">Login</h3>
          {error && <p className="error-message">{error}</p>} {/* Display error message */}

          <IonItem className="input-item">
            <IonInput
              value={emailOrPhone}
              placeholder={isPhoneLogin ? "Phone Number" : "Email"}
              onIonChange={e => setEmailOrPhone(e.detail.value!)}
              required
            />
          </IonItem>

          {isPhoneLogin || (
            <IonItem className="input-item">
              <IonInput
                type="password"
                value={password}
                placeholder="Password"
                onIonChange={e => setPassword(e.detail.value!)}
                required
              />
            </IonItem>
          )}

          <div className="button-container">
            <IonButton expand="full" onClick={handleLogin} className="login-button">
              Login
            </IonButton>
          </div>

          <div className="signup-link">
            Not registered yet? <a href="/signup">Sign up</a>
          </div>
          <div>
            <button onClick={() => setIsPhoneLogin(!isPhoneLogin)}>
              Switch to {isPhoneLogin ? "Email" : "Phone"} Login
            </button>
          </div>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default Home;

