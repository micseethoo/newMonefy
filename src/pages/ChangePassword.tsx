import React, { useState } from 'react';
import { IonPage, IonContent, IonButton, IonInput, IonItem, IonLabel, IonIcon } from '@ionic/react';
import { eyeOffOutline, eyeOutline } from 'ionicons/icons';
import './css/ChangePassword.css'; // Import the CSS for styling
import { getAuth, reauthenticateWithCredential, EmailAuthProvider, updatePassword } from 'firebase/auth';
import { useHistory } from 'react-router-dom';

const ChangePassword: React.FC = () => {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const history = useHistory();

const resetForm = () => {
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
    setMessage('');
    setError('');
  };

  // Toggle password visibility function
  const togglePasswordVisibility = (field: string) => {
    if (field === 'current') {
      setShowCurrentPassword(!showCurrentPassword);
    } else if (field === 'new') {
      setShowNewPassword(!showNewPassword);
    } else if (field === 'confirm') {
      setShowConfirmPassword(!showConfirmPassword);
    }
  };
const handleCancel = () => {
    // Redirect to Profile page on cancel
    resetForm();  // Reset the form after confirming

    history.push('/profile');
  };
  const handlePasswordChange = async () => {
    if (newPassword !== confirmPassword) { resetForm();
      setError('New passwords do not match');

      return;
    }

    const auth = getAuth();
    const user = auth.currentUser;
    if (user) {
      const credential = EmailAuthProvider.credential(user.email!, currentPassword);
      try {
        await reauthenticateWithCredential(user, credential);
        await updatePassword(user, newPassword);resetForm();
        setMessage('Password updated successfully');

        setTimeout(() => {
          history.push('/profile');
        }, 3000);
      } catch (error) { resetForm();
        setError('Failed to change password');

      }
    }
  };

  return (
    <IonPage>
      <IonContent>
        <div className="change-password-container">


          <div className="change-password-form">
          <h2>Change Password</h2>

                    {/* Show message */}
                    {message && <div className="message">{message}</div>}
                    {error && <div className="error">{error}</div>}
            <IonItem>

              <IonInput
                type={showCurrentPassword ? 'text' : 'password'}
                value={currentPassword}
                placeholder="Current Password"
                onIonInput={(e) => setCurrentPassword(e.detail.value!)}
              />
              <IonIcon
                icon={showCurrentPassword ? eyeOutline : eyeOffOutline}
                slot="end"
                onClick={() => togglePasswordVisibility('current')}
                style={{ cursor: 'pointer' }}
              />
            </IonItem>

            <IonItem>

              <IonInput
                type={showNewPassword ? 'text' : 'password'}
                value={newPassword}
                placeholder="New Password"
                onIonInput={(e) => setNewPassword(e.detail.value!)}
              />
              <IonIcon
                icon={showNewPassword ? eyeOutline : eyeOffOutline}
                slot="end"
                onClick={() => togglePasswordVisibility('new')}
                style={{ cursor: 'pointer' }}
              />
            </IonItem>

            <IonItem>

              <IonInput
                type={showConfirmPassword ? 'text' : 'password'}
                value={confirmPassword}
                placeholder="Confirm New Password"
                onIonInput={(e) => setConfirmPassword(e.detail.value!)}
              />
              <IonIcon
                icon={showConfirmPassword ? eyeOutline : eyeOffOutline}
                slot="end"
                onClick={() => togglePasswordVisibility('confirm')}
                style={{ cursor: 'pointer' }}
              />
            </IonItem>

            <IonButton className="confirm-button" onClick={handlePasswordChange}>
              Confirm
            </IonButton>
<IonButton className="cancelcp-button" onClick={handleCancel}>
            Cancel
          </IonButton>
          </div>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default ChangePassword;
