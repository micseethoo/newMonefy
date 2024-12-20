import {
  IonContent,
  IonPage,
  IonSpinner,
  IonIcon,
  IonButton,
} from "@ionic/react";
import React, { useEffect, useState } from "react";
import { getAuth, onAuthStateChanged, signOut } from "firebase/auth";
import { getFirestore, doc, getDoc, updateDoc } from "firebase/firestore";
import { useHistory } from "react-router-dom";
import { refreshOutline } from "ionicons/icons";
import "./css/Profile.css";
import NavBar from "../components/NavBar";

const Profile: React.FC = () => {
  const [username, setUsername] = useState<string>("Loading...");
  const [nickname, setNickname] = useState<string>("No nickname set");
  const [email, setEmail] = useState<string>("Loading...");
  const [profileImageUrl, setProfileImageUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [newProfileImageUrl, setNewProfileImageUrl] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string>("");

  const auth = getAuth();
  const db = getFirestore();
  const history = useHistory();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        await fetchUserData(currentUser.uid);
      } else {
        // If no user is logged in, redirect to login
        history.push("/login");
      }
    });

    return () => unsubscribe();
  }, [auth, history]);

  const fetchUserData = async (uid: string) => {
    try {
      setIsLoading(true);
      const userDocRef = doc(db, "users", uid);
      const userDocSnap = await getDoc(userDocRef);

      if (userDocSnap.exists()) {
        const userData = userDocSnap.data();
        setUsername(userData.username || "No name available");
        setNickname(userData.nickname || "No nickname set");
        setEmail(userData.email || "No email available");
        setProfileImageUrl(userData.profileImageUrl || null);
      } else {
        console.error("User data not found");
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    const currentUser = auth.currentUser;
    if (!currentUser) return;

    try {
      setIsLoading(true);
      setErrorMessage(""); // Clear previous error messages

      const userDocRef = doc(db, "users", currentUser.uid);
      await updateDoc(userDocRef, {
        username: username,
        nickname: nickname,
        profileImageUrl: newProfileImageUrl || profileImageUrl,
      });
      setProfileImageUrl(newProfileImageUrl || profileImageUrl);
      setNewProfileImageUrl(null);
      setIsEditing(false);
    } catch (error) {
      console.error("Error updating user data:", error);
      setErrorMessage("Failed to update user data. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  const refreshUserData = async () => {
    const currentUser = auth.currentUser;
    if (currentUser) {
      await fetchUserData(currentUser.uid);
    }
  };

  const handleLogout = () => {
    signOut(auth)
      .then(() => {
        history.push("/login");
      })
      .catch((error) => {
        console.error("Error during logout:", error);
      });
  };

const navigateToChangePassword = () => {
    history.push('/change-password'); // Navigate to ChangePassword page
  };
  return (
    <IonPage>
      <IonContent fullscreen className="profile-background">
        {isLoading ? (
          <div className="loading-container">
            <IonSpinner name="crescent" />
            <p>Loading user data...</p>
          </div>
        ) : (
          <div className="profile-container">
            <div className="profile-header">
              <h3 className="profile-heading">Profile</h3>
              <IonIcon
                icon={refreshOutline}
                className="refresh-icon"
                onClick={refreshUserData}
              />
            </div>
            <div className="profile-picture">
              {profileImageUrl ? (
                <img
                  src={profileImageUrl}
                  alt="Profile"
                  className="profile-img"
                />
              ) : (
                <div className="profile-img-placeholder">No Profile Picture</div>
              )}
              {isEditing && (
                <input
                  type="text"
                  placeholder="Paste new image URL"
                  value={newProfileImageUrl || ""}
                  onChange={(e) => setNewProfileImageUrl(e.target.value)}
                  className="profile-picture-input"
                />
              )}
            </div>
            <div className="profile-info">
              <div className="profile-item">
                <h4>Full Name</h4>
                {isEditing ? (
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Enter your full name"
                  />
                ) : (
                  <p>{username}</p>
                )}
              </div>
              <div className="profile-item">
                <h4>Nickname</h4>
                {isEditing ? (
                  <input
                    type="text"
                    value={nickname}
                    onChange={(e) => setNickname(e.target.value)}
                    placeholder="Enter your nickname"
                  />
                ) : (
                  <p>{nickname}</p>
                )}
              </div>
              <div className="profile-item">
                <h4>Email</h4>
                <p>{email}</p>
              </div>
            </div>
            {errorMessage && <p className="error-message">{errorMessage}</p>}
            <div className="profile-actions">
              {isEditing ? (
                <div className="edit-actions">
                  <button onClick={handleSave} className="save-button">
                    Save
                  </button>
                  <button
                    onClick={() => setIsEditing(false)}
                    className="cancel-button"
                  >
                    Cancel
                  </button>
                </div>
              ) : (
                <button onClick={() => setIsEditing(true)} className="edit-button">
                  Edit
                </button>
              )}
            </div>
            <IonButton className="change-password-button" onClick={navigateToChangePassword}>Change Password</IonButton>
            <IonButton expand="full" color="danger" className="logout-button" onClick={handleLogout}>
              Logout
            </IonButton>
          </div>
        )}
      </IonContent>
      <NavBar />
    </IonPage>
  );
};

export default Profile;

