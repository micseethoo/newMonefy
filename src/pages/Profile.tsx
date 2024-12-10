
    // src/pages/Profile.tsx

   /* import { IonContent, IonPage, IonSpinner, IonIcon } from '@ionic/react';
    import React, { useEffect, useState } from 'react';
    import './css/Profile.css';
    import { getAuth, onAuthStateChanged } from 'firebase/auth';
    import { getFirestore, doc, getDoc, updateDoc } from 'firebase/firestore';
    import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
    import { useHistory } from 'react-router-dom';
    import { refreshOutline } from 'ionicons/icons';

    const Profile: React.FC = () => {
      const [userName, setUserName] = useState<string>('Loading...');
      const [email, setEmail] = useState<string>('Loading...');
      const [profileImageUrl, setProfileImageUrl] = useState<string | null>(null);
      const [isLoading, setIsLoading] = useState(true);

      const auth = getAuth();
      const db = getFirestore();
      const storage = getStorage();
      const history = useHistory();

      useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
          if (currentUser) {
            try {
              setIsLoading(true);
              const userRef = doc(db, 'users', currentUser.uid);
              const userSnap = await getDoc(userRef);
              if (userSnap.exists()) {
                const userData = userSnap.data();
                setUserName(userData.displayName || 'No name available');
                setEmail(userData.email || 'No email available');
                if (userData.profileImageUrl) {
                  setProfileImageUrl(userData.profileImageUrl);
                }
              } else {
                console.error('No user data found in Firestore.');
              }
            } catch (error) {
              console.error('Error fetching user data:', error);
            } finally {
              setIsLoading(false);
            }
          } else {
            history.push('/login');
          }
        });

        return () => unsubscribe();
      }, [auth, db, history]);

      const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        try {
          setIsLoading(true);
          const currentUser = auth.currentUser;
          if (currentUser) {
            const fileRef = ref(storage, profilePictures/${currentUser.uid});
            await uploadBytes(fileRef, file);

            const downloadURL = await getDownloadURL(fileRef);
            setProfileImageUrl(downloadURL);

            const userRef = doc(db, 'users', currentUser.uid);
            await updateDoc(userRef, { profileImageUrl: downloadURL });
          }
        } catch (error) {
          console.error('Error uploading profile picture:', error);
        } finally {
          setIsLoading(false);
        }
      };

      const refreshUserData = async () => {
        try {
          setIsLoading(true);
          const currentUser = auth.currentUser;
          if (currentUser) {
            const userRef = doc(db, 'users', currentUser.uid);
            const userSnap = await getDoc(userRef);
            if (userSnap.exists()) {
              const userData = userSnap.data();
              setUserName(userData.displayName || 'No name available');
              setEmail(userData.email || 'No email available');
              setProfileImageUrl(userData.profileImageUrl || null);
            }
          }
        } catch (error) {
          console.error('Error refreshing user data:', error);
        } finally {
          setIsLoading(false);
        }
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
                  <IonIcon icon={refreshOutline} className="refresh-icon" onClick={refreshUserData} />
                </div>
                <div className="profile-picture">
                  {profileImageUrl ? (
                    <img src={${profileImageUrl}?${new Date().getTime()}} alt="User Profile" className="profile-img" />
                  ) : (
                    <div className="profile-img-placeholder">Upload Picture</div>
                  )}
                </div>
                <div className="upload-picture">
                  <label htmlFor="profile-upload">Upload Profile Picture (PNG or JPEG only)</label>
                  <input
                    id="profile-upload"
                    type="file"
                    accept=".png,.jpg,.jpeg"
                    onChange={handleFileChange}
                  />
                </div>
                <div className="profile-info">
                  <div className="profile-item">
                    <h4>Full Name</h4>
                    <p>{userName}</p>
                  </div>
                  <div className="profile-item">
                    <h4>Email</h4>
                    <p>{email}</p>
                  </div>
                </div>
              </div>
            )}
          </IonContent>
        </IonPage>
      );
    };

    export default Profile;*/

   /* import { IonContent, IonPage, IonSpinner, IonIcon } from '@ionic/react';
    import React, { useEffect, useState } from 'react';
    import './css/Profile.css';
    import { getAuth, onAuthStateChanged } from 'firebase/auth';
    import { getFirestore, doc, getDoc, collection, addDoc } from 'firebase/firestore';
    import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
    import { useHistory } from 'react-router-dom';
    import { refreshOutline } from 'ionicons/icons';

    const Profile: React.FC = () => {
      const [username, setUserName] = useState<string>('Loading...');
      const [email, setEmail] = useState<string>('Loading...');
      const [profileImageUrl, setProfileImageUrl] = useState<string | null>(null);
      const [isLoading, setIsLoading] = useState(true);

      const auth = getAuth();
      const db = getFirestore();
      const storage = getStorage();
      const history = useHistory();

      useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
          if (currentUser) {
            try {
              setIsLoading(true);
              const userRef = doc(db, 'users', currentUser.uid);
              const userSnap = await getDoc(userRef);
              if (userSnap.exists()) {
                const userData = userSnap.data();
                setUserName(userData.username || 'No name available');
                setEmail(userData.email || 'No email available');

                // Fetch the most recent profile image URL from the profileImages subcollection
                const profileImagesRef = collection(db, 'users', currentUser.uid, 'profileImages');
                const profileImagesSnap = await getDocs(profileImagesRef);
                if (!profileImagesSnap.empty) {
                  const latestProfileImage = profileImagesSnap.docs[profileImagesSnap.docs.length - 1].data();
                  setProfileImageUrl(latestProfileImage.profileImageUrl);
                }
              } else {
                console.error('No user data found in Firestore.');
              }
            } catch (error) {
              console.error('Error fetching user data:', error);
            } finally {
              setIsLoading(false);
            }
          } else {
            history.push('/login');
          }
        });

        return () => unsubscribe();
      }, [auth, db, history]);

      const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        try {
          setIsLoading(true);
          const currentUser = auth.currentUser;
          if (currentUser) {
            const fileRef = ref(storage, `profilePictures/${currentUser.uid}`);
            await uploadBytes(fileRef, file);

            // Get the download URL of the uploaded image
            const downloadURL = await getDownloadURL(fileRef);
            setProfileImageUrl(downloadURL);  // Update the state with the new image URL

            // Store the new profile image URL in the profileImages subcollection
            const profileImagesRef = collection(db, 'users', currentUser.uid, 'profileImages');
            await addDoc(profileImagesRef, {
              profileImageUrl: downloadURL,
              updatedAt: new Date().toISOString(),
            });
          }
        } catch (error) {
          console.error('Error uploading profile picture:', error);
        } finally {
          setIsLoading(false);
        }
      };

      const refreshUserData = async () => {
        try {
          setIsLoading(true);
          const currentUser = auth.currentUser;
          if (currentUser) {
            const userRef = doc(db, 'users', currentUser.uid);
            const userSnap = await getDoc(userRef);
            if (userSnap.exists()) {
              const userData = userSnap.data();
              setUserName(userData.username || 'No name available');
              setEmail(userData.email || 'No email available');

              // Fetch the most recent profile image URL from the profileImages subcollection
              const profileImagesRef = collection(db, 'users', currentUser.uid, 'profileImages');
              const profileImagesSnap = await getDocs(profileImagesRef);
              if (!profileImagesSnap.empty) {
                const latestProfileImage = profileImagesSnap.docs[profileImagesSnap.docs.length - 1].data();
                setProfileImageUrl(latestProfileImage.profileImageUrl);
              }
            }
          }
        } catch (error) {
          console.error('Error refreshing user data:', error);
        } finally {
          setIsLoading(false);
        }
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
                  <IonIcon icon={refreshOutline} className="refresh-icon" onClick={refreshUserData} />
                </div>
                <div className="profile-picture">
                  {profileImageUrl ? (
                    <img
                      src={`${profileImageUrl}?${new Date().getTime()}`} // Prevent caching by appending a timestamp
                      alt="User Profile"
                      className="profile-img"
                    />
                  ) : (
                    <div className="profile-img-placeholder">Upload Picture</div>
                  )}
                </div>
                <div className="upload-picture">
                  <label htmlFor="profile-upload">Upload Profile Picture (PNG or JPEG only)</label>
                  <input
                    id="profile-upload"
                    type="file"
                    accept=".png,.jpg,.jpeg"
                    onChange={handleFileChange}
                  />
                </div>
                <div className="profile-info">
                  <div className="profile-item">
                    <h4>Full Name</h4>
                    <p>{username}</p>
                  </div>
                  <div className="profile-item">
                    <h4>Email</h4>
                    <p>{email}</p>
                  </div>
                </div>
              </div>
            )}
          </IonContent>
        </IonPage>
      );
    };

    export default Profile;*/

/*import { IonContent, IonPage, IonSpinner, IonIcon } from '@ionic/react';
import React, { useEffect, useState } from 'react';
import './css/Profile.css';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { getFirestore, doc, getDoc, collection, getDocs, addDoc } from 'firebase/firestore';
import { useHistory } from 'react-router-dom';
import { refreshOutline } from 'ionicons/icons';

const Profile: React.FC = () => {
  const [username, setUserName] = useState<string>('Loading...');
  const [email, setEmail] = useState<string>('Loading...');
  const [profileImageUrl, setProfileImageUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [imageUrlInput, setImageUrlInput] = useState<string>('');
  const [isUrlInputVisible, setIsUrlInputVisible] = useState(false); // New state to toggle URL input visibility

  const auth = getAuth();
  const db = getFirestore();
  const history = useHistory();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        try {
          setIsLoading(true);
          const userRef = doc(db, 'users', currentUser.uid);
          const userSnap = await getDoc(userRef);
          if (userSnap.exists()) {
            const userData = userSnap.data();
            setUserName(userData.username || 'No name available');
            setEmail(userData.email || 'No email available');

            // Fetch the most recent profile image URL from the profileImages subcollection
            const profileImagesRef = collection(db, 'users', currentUser.uid, 'profileImages');
            const profileImagesSnap = await getDocs(profileImagesRef);
            if (!profileImagesSnap.empty) {
              const latestProfileImage = profileImagesSnap.docs[profileImagesSnap.docs.length - 1].data();
              setProfileImageUrl(latestProfileImage.profileImageUrl);
            }
          }
        } catch (error) {
          console.error('Error fetching user data:', error);
        } finally {
          setIsLoading(false);
        }
      } else {
        history.push('/login');
      }
    });

    return () => unsubscribe();
  }, [auth, db, history]);

  const handleUrlChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setImageUrlInput(event.target.value);
  };

  const handleUrlSubmit = async () => {
    if (imageUrlInput) {
      try {
        setIsLoading(true);
        const currentUser = auth.currentUser;
        if (currentUser) {
          // Store the image URL in Firestore's profileImages subcollection
          const profileImagesRef = collection(db, 'users', currentUser.uid, 'profileImages');
          await addDoc(profileImagesRef, {
            profileImageUrl: imageUrlInput,
            updatedAt: new Date().toISOString(),
          });

          // Update the local state to show the profile image immediately
          setProfileImageUrl(imageUrlInput);
          setIsUrlInputVisible(false); // Hide the URL input box after submission
          setImageUrlInput(''); // Clear the input field
        }
      } catch (error) {
        console.error('Error updating profile picture URL:', error);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const refreshUserData = async () => {
    try {
      setIsLoading(true);
      const currentUser = auth.currentUser;
      if (currentUser) {
        const userRef = doc(db, 'users', currentUser.uid);
        const userSnap = await getDoc(userRef);
        if (userSnap.exists()) {
          const userData = userSnap.data();
          setUserName(userData.username || 'No name available');
          setEmail(userData.email || 'No email available');

          // Fetch the most recent profile image URL from the profileImages subcollection
          const profileImagesRef = collection(db, 'users', currentUser.uid, 'profileImages');
          const profileImagesSnap = await getDocs(profileImagesRef);
          if (!profileImagesSnap.empty) {
            const latestProfileImage = profileImagesSnap.docs[profileImagesSnap.docs.length - 1].data();
            setProfileImageUrl(latestProfileImage.profileImageUrl);
          }
        }
      }
    } catch (error) {
      console.error('Error refreshing user data:', error);
    } finally {
      setIsLoading(false);
    }
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
              <IonIcon icon={refreshOutline} className="refresh-icon" onClick={refreshUserData} />
            </div>
            <div className="profile-picture">
              {profileImageUrl ? (
                <img
                  src={`${profileImageUrl}?${new Date().getTime()}`} // Prevent caching by appending a timestamp
                  alt="User Profile"
                  className="profile-img"
                />
              ) : (
                <div className="profile-img-placeholder">No Profile Picture</div>
              )}
            </div>
            <div className="upload-picture">
              {isUrlInputVisible ? (
                <>
                  <input
                    type="text"
                    value={imageUrlInput}
                    onChange={handleUrlChange}
                    placeholder="Paste image URL here"
                  />
                  <button onClick={handleUrlSubmit}>Enter</button>
                </>
              ) : (
                <button onClick={() => setIsUrlInputVisible(true)}>
                  Upload Image URL
                </button>
              )}
            </div>
            <div className="profile-info">
              <div className="profile-item">
                <h4>Full Name</h4>
                <p>{username}</p>
              </div>
              <div className="profile-item">
                <h4>Email</h4>
                <p>{email}</p>
              </div>
            </div>
          </div>
        )}
      </IonContent>
    </IonPage>
  );
};

export default Profile;*/

/*import { IonContent, IonPage, IonSpinner, IonIcon } from '@ionic/react';
import React, { useEffect, useState } from 'react';
import './css/Profile.css';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { getFirestore, doc, getDoc, collection, getDocs, addDoc } from 'firebase/firestore';
import { useHistory } from 'react-router-dom';
import { refreshOutline } from 'ionicons/icons';

const Profile: React.FC = () => {
  const [username, setUserName] = useState<string>('Loading...');
  const [email, setEmail] = useState<string>('Loading...');
  const [profileImageUrl, setProfileImageUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [imageUrlInput, setImageUrlInput] = useState<string>('');  // URL input state
  const [isUrlInputVisible, setIsUrlInputVisible] = useState(false); // State to toggle URL input visibility

  const auth = getAuth();
  const db = getFirestore();
  const history = useHistory();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        try {
          setIsLoading(true);
          const userRef = doc(db, 'users', currentUser.uid);
          const userSnap = await getDoc(userRef);
          if (userSnap.exists()) {
            const userData = userSnap.data();
            setUserName(userData.username || 'No name available');
            setEmail(userData.email || 'No email available');

            // Fetch the most recent profile image URL from the profileImages subcollection
            const profileImagesRef = collection(db, 'users', currentUser.uid, 'profileImages');
            const profileImagesSnap = await getDocs(profileImagesRef);
            if (!profileImagesSnap.empty) {
              const latestProfileImage = profileImagesSnap.docs[profileImagesSnap.docs.length - 1].data();
              setProfileImageUrl(latestProfileImage.profileImageUrl);
            }
          }
        } catch (error) {
          console.error('Error fetching user data:', error);
        } finally {
          setIsLoading(false);
        }
      } else {
        history.push('/login');
      }
    });

    return () => unsubscribe();
  }, [auth, db, history]);

  const handleUrlChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setImageUrlInput(event.target.value); // Update the state with the new URL input
  };

  const handleUrlSubmit = async () => {
    if (imageUrlInput) {
      try {
        setIsLoading(true);
        const currentUser = auth.currentUser;
        if (currentUser) {
          // Store the image URL in Firestore's profileImages subcollection
          const profileImagesRef = collection(db, 'users', currentUser.uid, 'profileImages');
          await addDoc(profileImagesRef, {
            profileImageUrl: imageUrlInput,
            updatedAt: new Date().toISOString(),
          });

          // Update the local state to show the profile image immediately
          setProfileImageUrl(imageUrlInput);
          setIsUrlInputVisible(false); // Hide the URL input box after submission
          setImageUrlInput(''); // Clear the input field
        }
      } catch (error) {
        console.error('Error updating profile picture URL:', error);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const refreshUserData = async () => {
    try {
      setIsLoading(true);
      const currentUser = auth.currentUser;
      if (currentUser) {
        const userRef = doc(db, 'users', currentUser.uid);
        const userSnap = await getDoc(userRef);
        if (userSnap.exists()) {
          const userData = userSnap.data();
          setUserName(userData.username || 'No name available');
          setEmail(userData.email || 'No email available');

          // Fetch the most recent profile image URL from the profileImages subcollection
          const profileImagesRef = collection(db, 'users', currentUser.uid, 'profileImages');
          const profileImagesSnap = await getDocs(profileImagesRef);
          if (!profileImagesSnap.empty) {
            const latestProfileImage = profileImagesSnap.docs[profileImagesSnap.docs.length - 1].data();
            setProfileImageUrl(latestProfileImage.profileImageUrl);
          }
        }
      }
    } catch (error) {
      console.error('Error refreshing user data:', error);
    } finally {
      setIsLoading(false);
    }
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
              <IonIcon icon={refreshOutline} className="refresh-icon" onClick={refreshUserData} />
            </div>
            <div className="profile-picture">
              {profileImageUrl ? (
                <img
                  src={`${profileImageUrl}?${new Date().getTime()}`} // Prevent caching by appending a timestamp
                  alt="User Profile"
                  className="profile-img"
                />
              ) : (
                <div className="profile-img-placeholder">No Profile Picture</div>
              )}
            </div>
            <div className="upload-picture">
              {isUrlInputVisible ? (
                <>
                  <input
                    type="text"
                    value={imageUrlInput}
                    onChange={handleUrlChange}
                    placeholder="Paste image URL here"
                  />
                  <button onClick={handleUrlSubmit}>Enter</button>
                </>
              ) : (
                <button className="upload-button" onClick={() => setIsUrlInputVisible(true)}>
                  Upload Image URL
                </button>
              )}
            </div>
            <div className="profile-info">
              <div className="profile-item">
                <h4>Full Name</h4>
                <p>{username}</p>
              </div>
              <div className="profile-item">
                <h4>Email</h4>
                <p>{email}</p>
              </div>
            </div>
          </div>
        )}
      </IonContent>
    </IonPage>
  );
};

export default Profile;*/



/*import { IonContent, IonPage, IonSpinner, IonIcon } from '@ionic/react';
import React, { useEffect, useState } from 'react';
import './css/Profile.css';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { getFirestore, doc, getDoc, collection, getDocs, addDoc } from 'firebase/firestore';
import { useHistory } from 'react-router-dom';
import { refreshOutline } from 'ionicons/icons';

const Profile: React.FC = () => {
  const [username, setUserName] = useState<string>('Loading...');
  const [email, setEmail] = useState<string>('Loading...');
  const [profileImageUrl, setProfileImageUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [imageUrlInput, setImageUrlInput] = useState<string>(''); // For storing the input URL
  const [isUrlInputVisible, setIsUrlInputVisible] = useState(false); // Toggle visibility of URL input

  const auth = getAuth();
  const db = getFirestore();
  const history = useHistory();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        try {
          setIsLoading(true);
          const userRef = doc(db, 'users', currentUser.uid);
          const userSnap = await getDoc(userRef);
          if (userSnap.exists()) {
            const userData = userSnap.data();
            setUserName(userData.username || 'No name available');
            setEmail(userData.email || 'No email available');

            // Fetch the most recent profile image URL from the profileImages subcollection
            const profileImagesRef = collection(db, 'users', currentUser.uid, 'profileImages');
            const profileImagesSnap = await getDocs(profileImagesRef);
            if (!profileImagesSnap.empty) {
              const latestProfileImage = profileImagesSnap.docs[profileImagesSnap.docs.length - 1].data();
              setProfileImageUrl(latestProfileImage.profileImageUrl);
            }
          }
        } catch (error) {
          console.error('Error fetching user data:', error);
        } finally {
          setIsLoading(false);
        }
      } else {
        history.push('/login');
      }
    });

    return () => unsubscribe();
  }, [auth, db, history]);

  // Handle URL input change
  const handleUrlChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setImageUrlInput(event.target.value);
  };

  // Submit the URL to Firestore
  const handleUrlSubmit = async () => {
    if (imageUrlInput) {
      try {
        setIsLoading(true);
        const currentUser = auth.currentUser;
        if (currentUser) {
          // Store the image URL in Firestore's profileImages subcollection
          const profileImagesRef = collection(db, 'users', currentUser.uid, 'profileImages');
          await addDoc(profileImagesRef, {
            profileImageUrl: imageUrlInput,
            updatedAt: new Date().toISOString(),
          });

          // Update the local state to show the profile image immediately
          setProfileImageUrl(imageUrlInput);
          setIsUrlInputVisible(false); // Hide the URL input box after submission
          setImageUrlInput(''); // Clear the input field
        }
      } catch (error) {
        console.error('Error updating profile picture URL:', error);
      } finally {
        setIsLoading(false);
      }
    }
  };

  // Refresh user data, including profile image URL
  const refreshUserData = async () => {
    try {
      setIsLoading(true);
      const currentUser = auth.currentUser;
      if (currentUser) {
        const userRef = doc(db, 'users', currentUser.uid);
        const userSnap = await getDoc(userRef);
        if (userSnap.exists()) {
          const userData = userSnap.data();
          setUserName(userData.username || 'No name available');
          setEmail(userData.email || 'No email available');

          // Fetch the most recent profile image URL from the profileImages subcollection
          const profileImagesRef = collection(db, 'users', currentUser.uid, 'profileImages');
          const profileImagesSnap = await getDocs(profileImagesRef);
          if (!profileImagesSnap.empty) {
            const latestProfileImage = profileImagesSnap.docs[profileImagesSnap.docs.length - 1].data();
            setProfileImageUrl(latestProfileImage.profileImageUrl);
          }
        }
      }
    } catch (error) {
      console.error('Error refreshing user data:', error);
    } finally {
      setIsLoading(false);
    }
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
              <IonIcon icon={refreshOutline} className="refresh-icon" onClick={refreshUserData} />
            </div>
            <div className="profile-picture">
              {profileImageUrl ? (
                <img
                  src={`${profileImageUrl}?${new Date().getTime()}`} // Prevent caching by appending a timestamp
                  alt="User Profile"
                  className="profile-img"
                />
              ) : (
                <div className="profile-img-placeholder">No Profile Picture</div>
              )}
            </div>
            <div className="upload-picture">
              {isUrlInputVisible ? (
                <>
                  <input
                    type="text"
                    value={imageUrlInput}
                    onChange={handleUrlChange}
                    placeholder="Paste image URL here"
                  />
                  <button onClick={handleUrlSubmit}>Enter</button>
                </>
              ) : (
                <button onClick={() => setIsUrlInputVisible(true)} className="upload-button">
                  Upload Image URL
                </button>
              )}
            </div>
            <div className="profile-info">
              <div className="profile-item">
                <h4>Full Name</h4>
                <p>{username}</p>
              </div>
              <div className="profile-item">
                <h4>Email</h4>
                <p>{email}</p>
              </div>
            </div>
          </div>
        )}
      </IonContent>
    </IonPage>
  );
};

export default Profile;*/


/*import { IonContent, IonPage, IonSpinner, IonIcon } from '@ionic/react';
import React, { useEffect, useState } from 'react';
import './css/Profile.css';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { getFirestore, doc, getDoc, collection, getDocs, addDoc } from 'firebase/firestore';
import { useHistory } from 'react-router-dom';
import { refreshOutline } from 'ionicons/icons';

const Profile: React.FC = () => {
  const [username, setUserName] = useState<string>('Loading...');
  const [email, setEmail] = useState<string>('Loading...');
  const [profileImageUrl, setProfileImageUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [imageUrlInput, setImageUrlInput] = useState<string>(''); // For storing the input URL
  const [isUrlInputVisible, setIsUrlInputVisible] = useState(false); // Toggle visibility of URL input

  const auth = getAuth();
  const db = getFirestore();
  const history = useHistory();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        try {
          setIsLoading(true);
          const userRef = doc(db, 'users', currentUser.uid);
          const userSnap = await getDoc(userRef);
          if (userSnap.exists()) {
            const userData = userSnap.data();
            setUserName(userData.username || 'No name available');
            setEmail(userData.email || 'No email available');

            // Fetch the most recent profile image URL from the profileImages subcollection
            const profileImagesRef = collection(db, 'users', currentUser.uid, 'profileImages');
            const profileImagesSnap = await getDocs(profileImagesRef);
            if (!profileImagesSnap.empty) {
              const latestProfileImage = profileImagesSnap.docs[profileImagesSnap.docs.length - 1].data();
              setProfileImageUrl(latestProfileImage.profileImageUrl);
            }
          }
        } catch (error) {
          console.error('Error fetching user data:', error);
        } finally {
          setIsLoading(false);
        }
      } else {
        history.push('/login');
      }
    });

    return () => unsubscribe();
  }, [auth, db, history]);

  // Handle URL input change
  const handleUrlChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setImageUrlInput(event.target.value);
  };

  // Submit the URL to Firestore
  const handleUrlSubmit = async () => {
    if (imageUrlInput) {
      try {
        setIsLoading(true);
        const currentUser = auth.currentUser;
        if (currentUser) {
          // Store the image URL in Firestore's profileImages subcollection
          const profileImagesRef = collection(db, 'users', currentUser.uid, 'profileImages');
          await addDoc(profileImagesRef, {
            profileImageUrl: imageUrlInput,
            updatedAt: new Date().toISOString(),
          });

          // Update the local state to show the profile image immediately
          setProfileImageUrl(imageUrlInput);
          setIsUrlInputVisible(false); // Hide the URL input box after submission
          setImageUrlInput(''); // Clear the input field
        }
      } catch (error) {
        console.error('Error updating profile picture URL:', error);
      } finally {
        setIsLoading(false);
      }
    }
  };

  // Refresh user data, including profile image URL
  const refreshUserData = async () => {
    try {
      setIsLoading(true);
      const currentUser = auth.currentUser;
      if (currentUser) {
        const userRef = doc(db, 'users', currentUser.uid);
        const userSnap = await getDoc(userRef);
        if (userSnap.exists()) {
          const userData = userSnap.data();
          setUserName(userData.username || 'No name available');
          setEmail(userData.email || 'No email available');

          // Fetch the most recent profile image URL from the profileImages subcollection
          const profileImagesRef = collection(db, 'users', currentUser.uid, 'profileImages');
          const profileImagesSnap = await getDocs(profileImagesRef);
          if (!profileImagesSnap.empty) {
            const latestProfileImage = profileImagesSnap.docs[profileImagesSnap.docs.length - 1].data();
            setProfileImageUrl(latestProfileImage.profileImageUrl);
          }
        }
      }
    } catch (error) {
      console.error('Error refreshing user data:', error);
    } finally {
      setIsLoading(false);
    }
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
              <IonIcon icon={refreshOutline} className="refresh-icon" onClick={refreshUserData} />
            </div>

            <div className="profile-picture">
              {profileImageUrl ? (
                <img
                  src={
                    profileImageUrl.startsWith('https://drive.google.com/uc?id=') // Check Google Drive format
                      ? profileImageUrl
                      : profileImageUrl.startsWith('data:image') // Check for base64 format
                      ? profileImageUrl
                      : `${profileImageUrl}?${new Date().getTime()}` // Fallback and add cache-busting
                  }
                  alt="User Profile"
                  className="profile-img"
                />
              ) : (
                <div className="profile-img-placeholder">No Profile Picture</div>
              )}
            </div>

            <div className="upload-picture">
              {isUrlInputVisible ? (
                <>
                  <input
                    type="text"
                    value={imageUrlInput}
                    onChange={handleUrlChange}
                    placeholder="Paste image URL here"
                  />
                  <button onClick={handleUrlSubmit}>Enter</button>
                </>
              ) : (
                <button onClick={() => setIsUrlInputVisible(true)} className="upload-button">
                  Upload Image URL
                </button>
              )}
            </div>
            <div className="profile-info">
              <div className="profile-item">
                <h4>Full Name</h4>
                <p>{username}</p>
              </div>
              <div className="profile-item">
                <h4>Email</h4>
                <p>{email}</p>
              </div>
            </div>
          </div>
        )}
      </IonContent>
    </IonPage>
  );
};

export default Profile;*/

/*import { IonContent, IonPage, IonSpinner, IonIcon } from '@ionic/react';
import React, { useEffect, useState } from 'react';
import './css/Profile.css';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { getFirestore, doc, getDoc, collection, getDocs, addDoc } from 'firebase/firestore';
import { useHistory } from 'react-router-dom';
import { refreshOutline } from 'ionicons/icons';

const Profile: React.FC = () => {
  const [username, setUserName] = useState<string>('Loading...');
  const [email, setEmail] = useState<string>('Loading...');
  const [profileImageUrl, setProfileImageUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [imageUrlInput, setImageUrlInput] = useState<string>(''); // For storing the input URL
  const [isUrlInputVisible, setIsUrlInputVisible] = useState(false); // Toggle visibility of URL input

  const auth = getAuth();
  const db = getFirestore();
  const history = useHistory();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        try {
          setIsLoading(true);
          const userRef = doc(db, 'users', currentUser.uid);
          const userSnap = await getDoc(userRef);
          if (userSnap.exists()) {
            const userData = userSnap.data();
            setUserName(userData.username || 'No name available');
            setEmail(userData.email || 'No email available');

            // Fetch the most recent profile image URL from the profileImages subcollection
            const profileImagesRef = collection(db, 'users', currentUser.uid, 'profileImages');
            const profileImagesSnap = await getDocs(profileImagesRef);
            if (!profileImagesSnap.empty) {
              const latestProfileImage = profileImagesSnap.docs[profileImagesSnap.docs.length - 1].data();
              setProfileImageUrl(latestProfileImage.profileImageUrl);
            }
          }
        } catch (error) {
          console.error('Error fetching user data:', error);
        } finally {
          setIsLoading(false);
        }
      } else {
        history.push('/login');
      }
    });

    return () => unsubscribe();
  }, [auth, db, history]);

  // Handle URL input change
  const handleUrlChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setImageUrlInput(event.target.value);
  };

  // Submit the URL to Firestore
  const handleUrlSubmit = async () => {
    if (imageUrlInput) {
      try {
        setIsLoading(true);
        const currentUser = auth.currentUser;
        if (currentUser) {
          // Store the image URL in Firestore's profileImages subcollection
          const profileImagesRef = collection(db, 'users', currentUser.uid, 'profileImages');
          await addDoc(profileImagesRef, {
            profileImageUrl: imageUrlInput,
            updatedAt: new Date().toISOString(),
          });

          // Update the local state to show the profile image immediately
          setProfileImageUrl(imageUrlInput);
          setIsUrlInputVisible(false); // Hide the URL input box after submission
          setImageUrlInput(''); // Clear the input field
        }
      } catch (error) {
        console.error('Error updating profile picture URL:', error);
      } finally {
        setIsLoading(false);
      }
    }
  };

  // Refresh user data, including profile image URL
  const refreshUserData = async () => {
    try {
      setIsLoading(true);
      const currentUser = auth.currentUser;
      if (currentUser) {
        const userRef = doc(db, 'users', currentUser.uid);
        const userSnap = await getDoc(userRef);
        if (userSnap.exists()) {
          const userData = userSnap.data();
          setUserName(userData.username || 'No name available');
          setEmail(userData.email || 'No email available');

          // Fetch the most recent profile image URL from the profileImages subcollection
          const profileImagesRef = collection(db, 'users', currentUser.uid, 'profileImages');
          const profileImagesSnap = await getDocs(profileImagesRef);
          if (!profileImagesSnap.empty) {
            const latestProfileImage = profileImagesSnap.docs[profileImagesSnap.docs.length - 1].data();
            setProfileImageUrl(latestProfileImage.profileImageUrl);
          }
        }
      }
    } catch (error) {
      console.error('Error refreshing user data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle image URL for Google Drive and other formats
  const handleImageUrl = (url: string) => {
    // If the URL is a Google Drive link, modify it to be directly accessible
    if (url.startsWith('https://drive.google.com/file/d/')) {
      return `https://drive.google.com/uc?id=${url.split('/d/')[1].split('/')[0]}`;
    }
    return url;
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
              <IonIcon icon={refreshOutline} className="refresh-icon" onClick={refreshUserData} />
            </div>
            <div className="profile-picture">
              {profileImageUrl ? (
                <img
                  src={handleImageUrl(profileImageUrl)}  // Handle image URL
                  alt="User Profile"
                  className="profile-img"
                />
              ) : (
                <div className="profile-img-placeholder">No Profile Picture</div>
              )}
            </div>
            <div className="upload-picture">
              {isUrlInputVisible ? (
                <>
                  <input
                    type="text"
                    value={imageUrlInput}
                    onChange={handleUrlChange}
                    placeholder="Paste image URL here"
                  />
                  <button onClick={handleUrlSubmit}>Enter</button>
                </>
              ) : (
                <button onClick={() => setIsUrlInputVisible(true)} className="upload-button">
                  Upload Image URL
                </button>
              )}
            </div>
            <div className="profile-info">
              <div className="profile-item">
                <h4>Full Name</h4>
                <p>{username}</p>
              </div>
              <div className="profile-item">
                <h4>Email</h4>
                <p>{email}</p>
              </div>
            </div>
          </div>
        )}
      </IonContent>
    </IonPage>
  );
};

export default Profile;*/

import { IonContent, IonPage, IonSpinner, IonIcon } from '@ionic/react';
import React, { useEffect, useState } from 'react';
import './css/Profile.css';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { getFirestore, doc, getDoc, collection, getDocs, addDoc, updateDoc } from 'firebase/firestore';
import { useHistory } from 'react-router-dom';
import { refreshOutline } from 'ionicons/icons';

const Profile: React.FC = () => {
  const [username, setUserName] = useState<string>('Loading...');
  const [email, setEmail] = useState<string>('Loading...');
  const [profileImageUrl, setProfileImageUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [imageUrlInput, setImageUrlInput] = useState<string>(''); // For storing the input URL
  const [isUrlInputVisible, setIsUrlInputVisible] = useState(false); // Toggle visibility of URL input

  const auth = getAuth();
  const db = getFirestore();
  const history = useHistory();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        try {
          setIsLoading(true);
          const userRef = doc(db, 'users', currentUser.uid);
          const userSnap = await getDoc(userRef);
          if (userSnap.exists()) {
            const userData = userSnap.data();
            setUserName(userData.username || 'No name available');
            setEmail(userData.email || 'No email available');

            // Fetch the most recent profile image URL from the profileImages subcollection
            const profileImagesRef = collection(db, 'users', currentUser.uid, 'profileImages');
            const profileImagesSnap = await getDocs(profileImagesRef);
            if (!profileImagesSnap.empty) {
              const latestProfileImage = profileImagesSnap.docs[profileImagesSnap.docs.length - 1].data();
              setProfileImageUrl(latestProfileImage.profileImageUrl);
            }
          }
        } catch (error) {
          console.error('Error fetching user data:', error);
        } finally {
          setIsLoading(false);
        }
      } else {
        history.push('/login');
      }
    });

    return () => unsubscribe();
  }, [auth, db, history]);

  // Handle URL input change
  const handleUrlChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setImageUrlInput(event.target.value);
  };

  // Submit the URL to Firestore
  const handleUrlSubmit = async () => {
    if (imageUrlInput) {
      try {
        setIsLoading(true);
        const currentUser = auth.currentUser;
        if (currentUser) {
          // Reference to the profileImages subcollection
          const profileImagesRef = collection(db, 'users', currentUser.uid, 'profileImages');
          const profileImagesSnap = await getDocs(profileImagesRef);

          // Check if any image exists, if so update the first one
          if (!profileImagesSnap.empty) {
            const latestProfileImageDoc = profileImagesSnap.docs[0]; // Use the first image found
            await updateDoc(latestProfileImageDoc.ref, {
              profileImageUrl: imageUrlInput,
              updatedAt: new Date().toISOString(),
            });
          } else {
            // If no images exist, add a new one
            await addDoc(profileImagesRef, {
              profileImageUrl: imageUrlInput,
              updatedAt: new Date().toISOString(),
            });
          }

          // Update the local state to show the profile image immediately
          setProfileImageUrl(imageUrlInput);
          setIsUrlInputVisible(false); // Hide the URL input box after submission
          setImageUrlInput(''); // Clear the input field
        }
      } catch (error) {
        console.error('Error updating profile picture URL:', error);
      } finally {
        setIsLoading(false);
      }
    }
  };

  // Refresh user data, including profile image URL
  const refreshUserData = async () => {
    try {
      setIsLoading(true);
      const currentUser = auth.currentUser;
      if (currentUser) {
        const userRef = doc(db, 'users', currentUser.uid);
        const userSnap = await getDoc(userRef);
        if (userSnap.exists()) {
          const userData = userSnap.data();
          setUserName(userData.username || 'No name available');
          setEmail(userData.email || 'No email available');

          // Fetch the most recent profile image URL from the profileImages subcollection
          const profileImagesRef = collection(db, 'users', currentUser.uid, 'profileImages');
          const profileImagesSnap = await getDocs(profileImagesRef);
          if (!profileImagesSnap.empty) {
            const latestProfileImage = profileImagesSnap.docs[profileImagesSnap.docs.length - 1].data();
            setProfileImageUrl(latestProfileImage.profileImageUrl);
          }
        }
      }
    } catch (error) {
      console.error('Error refreshing user data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle image URL for Google Drive and other formats
  const handleImageUrl = (url: string) => {
    // If the URL is a Google Drive link, modify it to be directly accessible
    if (url.startsWith('https://drive.google.com/file/d/')) {
      return `https://drive.google.com/uc?id=${url.split('/d/')[1].split('/')[0]}`;
    }
    return url;
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
              <IonIcon icon={refreshOutline} className="refresh-icon" onClick={refreshUserData} />
            </div>
            <div className="profile-picture">
              {profileImageUrl ? (
                <img
                  src={handleImageUrl(profileImageUrl)}  // Handle image URL
                  alt="User Profile"
                  className="profile-img"
                />
              ) : (
                <div className="profile-img-placeholder">No Profile Picture</div>
              )}
            </div>
            <div className="upload-picture">
              {isUrlInputVisible ? (
                <>
                  <input
                    type="text"
                    value={imageUrlInput}
                    onChange={handleUrlChange}
                    placeholder="Paste image URL here"
                  />
                  <button onClick={handleUrlSubmit}>Enter</button>
                </>
              ) : (
                <button onClick={() => setIsUrlInputVisible(true)} className="upload-button">
                  Upload Image URL
                </button>
              )}
            </div>
            <div className="profile-info">
              <div className="profile-item">
                <h4>Full Name</h4>
                <p>{username}</p>
              </div>
              <div className="profile-item">
                <h4>Email</h4>
                <p>{email}</p>
              </div>
            </div>
          </div>
        )}
      </IonContent>
    </IonPage>
  );
};

export default Profile;

