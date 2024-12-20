import { IonContent, IonPage, IonButton, IonInput, IonItem, IonLabel, IonText } from '@ionic/react';
import React, { useState, useEffect } from 'react';
import './css/ForgotPassword.css'; // Import the CSS for styling
import { sendPasswordResetEmail } from 'firebase/auth';
import { auth } from '../theme/firebaseConfig'; // Adjust the path to where you configure Firebase auth
import { useHistory } from 'react-router-dom';

const ForgotPassword: React.FC = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [countdown, setCountdown] = useState(60); // Countdown timer for 60 seconds
  const [isDisabled, setIsDisabled] = useState(false);
  const history = useHistory(); // For redirecting to login page after reset

  // Countdown Timer
  useEffect(() => {
    let timer: NodeJS.Timeout | null = null;
    if (countdown > 0 && isDisabled) {
      timer = setInterval(() => {
        setCountdown((prev) => prev - 1);
      }, 1000);
    } else if (countdown === 0) {
      setIsDisabled(false);
      setMessage('Resend the email.');
    }
    return () => {
      if (timer) clearInterval(timer); // Cleanup on unmount
    };
  }, [countdown, isDisabled]);

  // Handle Send Reset Email
  const handleSendEmail = async () => {
    if (!email) {
      setError('Please enter your email address.');
      return;
    }
    try {
      await sendPasswordResetEmail(auth, email);
      setMessage('Email sent! Please check your inbox.');
      setIsDisabled(true); // Disable the button
      setCountdown(60); // Start the countdown
      setError('');
    } catch (err) {
      setError('Error: Unable to send reset email. Please check the email and try again.');
      setMessage('');
    }
  };

 return (
    <IonPage>
      <IonContent>
        <div className="forgot-password-container">
          <div className="forgot-password-content">
            <h2>Reset Password</h2>
            <IonItem>

              <IonInput
                type={email}
                value={email}
                placeholder="Email Address"
                onIonChange={(e) => setEmail(e.detail.value!)}
                required
              />
            </IonItem>

            {error && <IonText color="danger"><p>{error}</p></IonText>}
                      {message && <IonText color="success"><p>{message}</p></IonText>}

                      <IonButton
                        expand="full"
                        onClick={handleSendEmail}
                        disabled={isDisabled}
                        className="send-email-button"
                      >
                        Send Reset Email
                      </IonButton>

                      {isDisabled && (
                        <IonText color="medium">
                          <p>Resend Email in {countdown} seconds.</p>
                        </IonText>
                      )}

            <IonText>
            <div className="login-link">
                          <a href="/login">Return to Login</a>
                                </div>

            </IonText>
          </div>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default ForgotPassword;