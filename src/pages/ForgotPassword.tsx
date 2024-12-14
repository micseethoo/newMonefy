/*
import { IonContent, IonPage, IonInput, IonButton, IonItem, IonLabel, IonText } from '@ionic/react';
import React, { useState } from 'react';
import './css/ForgotPassword.css'; // Import the CSS for styling
import { sendPasswordResetEmail } from 'firebase/auth';
import { auth } from '../theme/firebaseConfig'; // Adjust the path to where you configure Firebase auth

const ForgotPassword: React.FC = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handlePasswordReset = async () => {
    if (!email) {
      setError('Please enter your email address.');
      return;
    }

    try {
      await sendPasswordResetEmail(auth, email);
      setMessage('Password reset email sent! Please check your inbox.');
      setError(null);
    } catch (err) {
      setError('Error sending password reset email. Please try again.');
      setMessage(null);
    }
  };

  return (
    <IonPage>
      <IonContent className="forgot-password-container">
        <h2>Forgot Password</h2>
        <IonItem>
          <IonLabel position="floating">Email</IonLabel>
          <IonInput
            type="email"
            value={email}
            onIonChange={(e) => setEmail(e.detail.value!)}
            placeholder="Enter your email"
          />
        </IonItem>

        {error && <IonText color="danger"><p>{error}</p></IonText>}
        {message && <IonText color="success"><p>{message}</p></IonText>}

        <IonButton expand="full" onClick={handlePasswordReset}>Send Reset Link</IonButton>
      </IonContent>
    </IonPage>
  );
};

export default ForgotPassword;
 */


/*
import { IonContent, IonPage, IonButton, IonInput, IonItem, IonLabel, IonText } from '@ionic/react';
import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom'; // Import useHistory for navigation
import { sendPasswordResetEmail } from 'firebase/auth';
import { auth } from '../theme/firebaseConfig'; // Adjust the path to where you configure Firebase auth

const ForgotPassword: React.FC = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [timer, setTimer] = useState(10);  // Set initial timer to 10 seconds
  const history = useHistory();

  // Start the timer when the password reset email is sent
  useEffect(() => {
    let countdown: any;
    if (message === 'Password Reset Link Sent') {
      countdown = setInterval(() => {
        setTimer((prevTime) => {
          if (prevTime <= 1) {
            // Redirect to login page when timer reaches 0
            history.push('/login');
            clearInterval(countdown);  // Clear the interval
            return 0;
          }
          return prevTime - 1;
        });
      }, 1000);
    }

    return () => clearInterval(countdown);  // Clear interval on cleanup
  }, [message, history]);

  const handlePasswordReset = async () => {
    try {
      await sendPasswordResetEmail(auth, email);
      setMessage('Password Reset Link Sent');
    } catch (error) {
      setMessage('Error sending password reset link');
    }
  };

  return (
    <IonPage>
      <IonContent>
        <div className="forgot-password-container">
          <h2>Reset Password</h2>
          <IonItem>
            <IonLabel position="floating">Email Address</IonLabel>
            <IonInput
              type="email"
              value={email}
              onIonChange={(e) => setEmail(e.detail.value!)}
            />
          </IonItem>
          <IonButton expand="full" onClick={handlePasswordReset}>Send Reset Link</IonButton>

          {message && (
            <IonText color="success">
              <p>{message}</p>
              {message === 'Password Reset Link Sent' && (
                <p>You will be redirected to the login page in {timer} seconds.</p>
              )}
            </IonText>
          )}
        </div>
      </IonContent>
    </IonPage>
  );
};

export default ForgotPassword;
 */

/*
import { IonContent, IonPage, IonButton, IonInput, IonItem, IonLabel, IonText } from '@ionic/react';
import React, { useState } from 'react';
import './css/ForgotPassword.css'; // Import the CSS for styling
import { sendPasswordResetEmail } from 'firebase/auth';
import { auth } from '../theme/firebaseConfig'; // Ensure you have Firebase auth initialized

const ForgotPassword: React.FC = () => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');

  const handleResetPassword = async () => {
    try {
      await sendPasswordResetEmail(auth, email);
      // Handle success (e.g., show a success message, or redirect after 10 seconds)
    } catch (err) {
      setError('Failed to send reset email. Please try again.');
    }
  };

  return (
    <IonPage>
      <IonContent>
        <div className="forgot-password-container">
          <h2>Forgot Your Password?</h2>
          <p>Enter your email to receive a password reset link.</p>

          <IonItem>

            <IonInput
              type={email}
              placeholder="Email"
              onIonChange={e => setEmail(e.detail.value!)}
              required
            />
          </IonItem>

          {error && <p style={{ color: 'red' }}>{error}</p>}

          <IonButton expand="block" onClick={handleResetPassword}>
            Send Reset Email
          </IonButton>

          <IonText>
            <p>Remembered your password? <a href="/login">Login here</a></p>
          </IonText>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default ForgotPassword;

 */
/*

import { IonContent, IonPage, IonButton, IonInput, IonItem, IonLabel, IonText } from '@ionic/react';
import React, { useState, useEffect } from 'react';
import './css/ForgotPassword.css'; // Import the CSS for styling
import { sendPasswordResetEmail } from 'firebase/auth';
import { auth } from '../theme/firebaseConfig'; // Adjust the path to where you configure Firebase auth
import { useHistory } from 'react-router-dom'; // For redirecting to login page

const ForgotPassword: React.FC = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [countdown, setCountdown] = useState(0);
  const [isResending, setIsResending] = useState(false);
  const history = useHistory();

  // Start the countdown when email is sent
  useEffect(() => {
    if (countdown > 0 && isResending) {
      const timer = setInterval(() => {
        setCountdown((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(timer); // Clean up interval
    }
  }, [countdown, isResending]);

  // Handle the email reset process
  const handleSendResetEmail = async () => {
    if (!email) {
      setError('Please enter your email address.');
      return;
    }

    setError('');
    setMessage('');
    setIsResending(true);
    setCountdown(60); // Set countdown for 60 seconds before allowing another resend

    try {
      await sendPasswordResetEmail(auth, email);
      setMessage('Password reset email sent! Please check your inbox.');
    } catch (err) {
      setError('Error sending reset email. Please try again.');
    }
  };

  // Handle the redirect to the login page
  const handleRedirectToLogin = () => {
    history.push('/login');
  };

  return (
    <IonPage>
      <IonContent className="forgot-password-container">
        <h2>Forgot Password</h2>
        <IonItem>
          <IonLabel position="floating">Email</IonLabel>
          <IonInput
            value={email}
            onIonChange={(e) => setEmail(e.detail.value!)}
            type="email"
            required
          />
        </IonItem>

        {error && <IonText color="danger"><p>{error}</p></IonText>}
        {message && <IonText color="success"><p>{message}</p></IonText>}

        <IonButton
          expand="block"
          onClick={handleSendResetEmail}
          disabled={isResending || countdown > 0}
        >
          Send Reset Email
        </IonButton>

        {isResending && countdown > 0 && (
          <IonText color="primary">
            <p>Please wait {countdown}s before resending the email.</p>
          </IonText>
        )}

        { */
/* Redirect to Login page after reset or when user decides to return *//*
}
        <IonText color="primary">
          <p>
            <button onClick={handleRedirectToLogin}>Back to Login</button>
          </p>
        </IonText>
      </IonContent>
    </IonPage>
  );
};

export default ForgotPassword;
 */
/*


import { IonContent, IonPage, IonButton, IonInput, IonItem, IonLabel, IonText } from '@ionic/react';
import React, { useState, useEffect } from 'react';
import './css/ForgotPassword.css'; // Import the CSS for styling
import { sendPasswordResetEmail } from 'firebase/auth';
import { auth } from '../theme/firebaseConfig'; // Adjust the path to where you configure Firebase auth
import { useHistory } from 'react-router-dom'; // For navigation

const ForgotPassword: React.FC = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [isDisabled, setIsDisabled] = useState(false); // Disable the button temporarily
  const [countdown, setCountdown] = useState(60); // Countdown timer
  const history = useHistory();

  // Countdown timer
  useEffect(() => {
    let timer: NodeJS.Timeout;

    if (countdown > 0 && isDisabled) {
      timer = setInterval(() => {
        setCountdown((prev) => prev - 1);
      }, 1000);
    }

    if (countdown === 0) {
      setIsDisabled(false); // Re-enable the button after countdown reaches zero
    }

    return () => clearInterval(timer); // Clean up interval on unmount
  }, [countdown, isDisabled]);

  const handlePasswordReset = async () => {
    if (!email) {
      setError('Please enter your email address');
      return;
    }

    setError(''); // Clear previous errors
    try {
      await sendPasswordResetEmail(auth, email);
      setMessage('Password reset email sent. Please check your inbox.');
      setIsDisabled(true); // Disable button after email is sent
      setCountdown(60); // Reset countdown timer
    } catch (err) {
      setError('Failed to send reset email. Please check the email address and try again.');
    }
  };

  const handleLoginRedirect = () => {
    history.push('/login'); // Redirect to login page
  };

  return (
    <IonPage>
      <IonContent className="forgot-password-container">
        <div className="forgot-password-form">
          <h2>Forgot Password</h2>
          <IonItem>
            <IonLabel position="floating">Email Address</IonLabel>
            <IonInput
              type="email"
              value={email}
              onIonChange={(e) => setEmail(e.detail.value!)}
              required
            />
          </IonItem>

          {error && <IonText color="danger"><p>{error}</p></IonText>}
          {message && <IonText color="success"><p>{message}</p></IonText>}

          <IonButton
            expand="full"
            onClick={handlePasswordReset}
            disabled={isDisabled}
          >
            Send Reset Email
          </IonButton>

          {isDisabled && countdown > 0 && (
            <IonText color="medium">
              <p>Wait {countdown}s to resend</p>
            </IonText>
          )}

          <IonText color="primary">
            <p style={{ textAlign: 'center', marginTop: '10px' }}>
              <a href="/login" onClick={handleLoginRedirect}>Back to Login</a>
            </p>
          </IonText>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default ForgotPassword;
 */
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