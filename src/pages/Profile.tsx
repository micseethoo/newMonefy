
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

export default Profile;*//* TRUE

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

export default Profile;*//*


import { IonContent, IonPage, IonSpinner, IonIcon } from '@ionic/react';
import React, { useEffect, useState } from 'react';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { getFirestore, doc, getDoc, collection, getDocs, addDoc, updateDoc } from 'firebase/firestore';
import { useHistory } from 'react-router-dom';
import { refreshOutline } from 'ionicons/icons';
import './css/Profile.css';

const Profile: React.FC = () => {
  const [username, setUsername] = useState<string>('Loading...');
  const [email, setEmail] = useState<string>('Loading...');
  const [profileImageUrl, setProfileImageUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [imageUrlInput, setImageUrlInput] = useState<string>('');
  const [isUrlInputVisible, setIsUrlInputVisible] = useState<boolean>(false);

  const auth = getAuth();
  const db = getFirestore();
  const history = useHistory();

  // Fetch user data when the component is loaded
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        await fetchUserData(currentUser.uid);
      } else {
        history.push('/login'); // Redirect to login if no user is authenticated
      }
    });

    return () => unsubscribe(); // Cleanup the subscription
  }, [auth, history]);

  // Function to fetch user data
  const fetchUserData = async (uid: string) => {
    try {
      setIsLoading(true);

      const userDocRef = doc(db, 'users', uid);
      const userDocSnap = await getDoc(userDocRef);

      if (userDocSnap.exists()) {
        const userData = userDocSnap.data();
        setUsername(userData.username || 'No name available');
        setEmail(userData.email || 'No email available');

        // Fetch the latest profile image from the profileImages subcollection
        const profileImagesRef = collection(db, 'users', uid, 'profileImages');
        const profileImagesSnap = await getDocs(profileImagesRef);

        if (!profileImagesSnap.empty) {
          const latestImageDoc = profileImagesSnap.docs[profileImagesSnap.docs.length - 1];
          setProfileImageUrl(latestImageDoc.data().profileImageUrl);
        }
      } else {
        console.error('User data not found');
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle profile image URL input change
  const handleUrlChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setImageUrlInput(event.target.value);
  };

  // Submit the image URL to Firestore
  const handleUrlSubmit = async () => {
    const currentUser = auth.currentUser;
    if (!currentUser) return;

    try {
      setIsLoading(true);

      const profileImagesRef = collection(db, 'users', currentUser.uid, 'profileImages');
      const profileImagesSnap = await getDocs(profileImagesRef);

      if (profileImagesSnap.empty) {
        // Add new profile image if none exists
        await addDoc(profileImagesRef, {
          profileImageUrl: imageUrlInput,
          updatedAt: new Date().toISOString(),
        });
      } else {
        // Update the existing profile image
        const latestImageDoc = profileImagesSnap.docs[profileImagesSnap.docs.length - 1];
        await updateDoc(latestImageDoc.ref, {
          profileImageUrl: imageUrlInput,
          updatedAt: new Date().toISOString(),
        });
      }

      // Update the local profile image state
      setProfileImageUrl(imageUrlInput);
      setImageUrlInput('');
      setIsUrlInputVisible(false);
    } catch (error) {
      console.error('Error updating profile picture URL:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle Google Drive URL conversion and other valid formats
  const handleImageUrl = (url: string) => {
    if (url.startsWith('https://drive.google.com/file/d/')) {
      return `https://drive.google.com/uc?id=${url.split('/d/')[1].split('/')[0]}`;
    }
    return url;
  };

  // Refresh user data
  const refreshUserData = async () => {
    const currentUser = auth.currentUser;
    if (currentUser) {
      await fetchUserData(currentUser.uid);
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
                  src={handleImageUrl(profileImageUrl)}
                  alt="Profile"
                  className="profile-img"
                />
              ) : (
                <div className="profile-img-placeholder">No Profile Picture</div>
              )}
            </div>
            <div className="upload-picture">
              {isUrlInputVisible ? (
                <div className="url-input-container">
                  <input
                    type="text"
                    value={imageUrlInput}
                    onChange={handleUrlChange}
                    placeholder="Enter image URL"
                  />
                  <button onClick={handleUrlSubmit}>Submit</button>
                </div>
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

export default Profile;*//* EDIT/SAVE in bottom


import { IonContent, IonPage, IonSpinner, IonIcon } from '@ionic/react';
import React, { useEffect, useState } from 'react';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { getFirestore, doc, getDoc, updateDoc } from 'firebase/firestore';
import { useHistory } from 'react-router-dom';
import { refreshOutline } from 'ionicons/icons';
import './css/Profile.css';

const Profile: React.FC = () => {
  const [username, setUsername] = useState<string>('Loading...');
  const [email, setEmail] = useState<string>('Loading...');
  const [phoneNumber, setPhoneNumber] = useState<string>('Not provided');
  const [profileImageUrl, setProfileImageUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isEditing, setIsEditing] = useState<boolean>(false);

  const auth = getAuth();
  const db = getFirestore();
  const history = useHistory();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        await fetchUserData(currentUser.uid);
      } else {
        history.push('/login');
      }
    });

    return () => unsubscribe();
  }, [auth, history]);

  const fetchUserData = async (uid: string) => {
    try {
      setIsLoading(true);
      const userDocRef = doc(db, 'users', uid);
      const userDocSnap = await getDoc(userDocRef);

      if (userDocSnap.exists()) {
        const userData = userDocSnap.data();
        setUsername(userData.username || 'No name available');
        setEmail(userData.email || 'No email available');
        setPhoneNumber(userData.phoneNumber || 'Not provided');
        setProfileImageUrl(userData.profileImageUrl || null);
      } else {
        console.error('User data not found');
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    const currentUser = auth.currentUser;
    if (!currentUser) return;

    try {
      setIsLoading(true);
      const userDocRef = doc(db, 'users', currentUser.uid);
      await updateDoc(userDocRef, {
        username: username,
        phoneNumber: phoneNumber,
      });
      setIsEditing(false); // Disable editing mode
    } catch (error) {
      console.error('Error updating user data:', error);
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
                  src={profileImageUrl}
                  alt="Profile"
                  className="profile-img"
                />
              ) : (
                <div className="profile-img-placeholder">No Profile Picture</div>
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
                <h4>Email</h4>
                <p>{email}</p>
              </div>
              <div className="profile-item">
                <h4>Phone Number</h4>
                {isEditing ? (
                  <input
                    type="text"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    placeholder="Enter your phone number"
                  />
                ) : (
                  <p>{phoneNumber}</p>
                )}
              </div>
            </div>
            <div className="profile-actions">
              {isEditing ? (
                <div className="edit-actions">
                  <button onClick={handleSave} className="save-button">Save</button>
                  <button onClick={() => setIsEditing(false)} className="cancel-button">Cancel</button>
                </div>
              ) : (
                <button onClick={() => setIsEditing(true)} className="edit-button">Edit</button>
              )}
            </div>
          </div>
        )}
      </IonContent>
    </IonPage>
  );
};

export default Profile;*//* Final with edit

import { IonContent, IonPage, IonSpinner, IonIcon } from '@ionic/react';
import React, { useEffect, useState } from 'react';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { getFirestore, doc, getDoc, updateDoc } from 'firebase/firestore';
import { useHistory } from 'react-router-dom';
import { refreshOutline } from 'ionicons/icons';
import './css/Profile.css';

const Profile: React.FC = () => {
  const [username, setUsername] = useState<string>('Loading...');
  const [email, setEmail] = useState<string>('Loading...');
  const [phoneNumber, setPhoneNumber] = useState<string>('Not provided');
  const [profileImageUrl, setProfileImageUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [newProfileImageUrl, setNewProfileImageUrl] = useState<string | null>(null);

  const auth = getAuth();
  const db = getFirestore();
  const history = useHistory();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        await fetchUserData(currentUser.uid);
      } else {
        history.push('/login');
      }
    });

    return () => unsubscribe();
  }, [auth, history]);

  const fetchUserData = async (uid: string) => {
    try {
      setIsLoading(true);
      const userDocRef = doc(db, 'users', uid);
      const userDocSnap = await getDoc(userDocRef);

      if (userDocSnap.exists()) {
        const userData = userDocSnap.data();
        setUsername(userData.username || 'No name available');
        setEmail(userData.email || 'No email available');
        setPhoneNumber(userData.phoneNumber || 'Not provided');
        setProfileImageUrl(userData.profileImageUrl || null);
      } else {
        console.error('User data not found');
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    const currentUser = auth.currentUser;
    if (!currentUser) return;

    try {
      setIsLoading(true);
      const userDocRef = doc(db, 'users', currentUser.uid);
      await updateDoc(userDocRef, {
        username: username,
        phoneNumber: phoneNumber,
        profileImageUrl: newProfileImageUrl || profileImageUrl, // Use updated link if provided
      });
      setProfileImageUrl(newProfileImageUrl || profileImageUrl); // Update UI with new image
      setNewProfileImageUrl(null); // Reset temp value
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating user data:', error);
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
                  value={newProfileImageUrl || ''}
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
                <h4>Email</h4>
                <p>{email}</p>
              </div>
              <div className="profile-item">
                <h4>Phone Number</h4>
                {isEditing ? (
                  <input
                    type="text"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    placeholder="Enter your phone number"
                  />
                ) : (
                  <p>{phoneNumber}</p>
                )}
              </div>
            </div>
            <div className="profile-actions">
              {isEditing ? (
                <div className="edit-actions">
                  <button onClick={handleSave} className="save-button">Save</button>
                  <button onClick={() => setIsEditing(false)} className="cancel-button">Cancel</button>
                </div>
              ) : (
                <button onClick={() => setIsEditing(true)} className="edit-button">Edit</button>
              )}
            </div>
          </div>
        )}
      </IonContent>
    </IonPage>
  );
};

export default Profile;*/ /*Final with LogOut

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

const Profile: React.FC = () => {
  const [username, setUsername] = useState<string>("Loading...");
  const [email, setEmail] = useState<string>("Loading...");
  const [phoneNumber, setPhoneNumber] = useState<string>("Not provided");
  const [profileImageUrl, setProfileImageUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [newProfileImageUrl, setNewProfileImageUrl] = useState<string | null>(
    null
  );

  const auth = getAuth();
  const db = getFirestore();
  const history = useHistory();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        await fetchUserData(currentUser.uid);
      } else {
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
        setEmail(userData.email || "No email available");
        setPhoneNumber(userData.phoneNumber || "Not provided");
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
      const userDocRef = doc(db, "users", currentUser.uid);
      await updateDoc(userDocRef, {
        username: username,
        phoneNumber: phoneNumber,
        profileImageUrl: newProfileImageUrl || profileImageUrl,
      });
      setProfileImageUrl(newProfileImageUrl || profileImageUrl);
      setNewProfileImageUrl(null);
      setIsEditing(false);
    } catch (error) {
      console.error("Error updating user data:", error);
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
                <h4>Email</h4>
                <p>{email}</p>
              </div>
              <div className="profile-item">
                <h4>Phone Number</h4>
                {isEditing ? (
                  <input
                    type="text"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    placeholder="Enter your phone number"
                  />
                ) : (
                  <p>{phoneNumber}</p>
                )}
              </div>
            </div>
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
            <IonButton expand="full" color="danger" className="logout-button" onClick={handleLogout}>
              Logout
            </IonButton>
          </div>
        )}
      </IonContent>
    </IonPage>
  );
};

export default Profile;*/ /*Logout Enhancement*/

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

const Profile: React.FC = () => {
  const [username, setUsername] = useState<string>("Loading...");
  const [email, setEmail] = useState<string>("Loading...");
  const [phoneNumber, setPhoneNumber] = useState<string>("Not provided");
  const [profileImageUrl, setProfileImageUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [newProfileImageUrl, setNewProfileImageUrl] = useState<string | null>(
    null
  );

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
        setEmail(userData.email || "No email available");
        setPhoneNumber(userData.phoneNumber || "Not provided");
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
      const userDocRef = doc(db, "users", currentUser.uid);
      await updateDoc(userDocRef, {
        username: username,
        phoneNumber: phoneNumber,
        profileImageUrl: newProfileImageUrl || profileImageUrl,
      });
      setProfileImageUrl(newProfileImageUrl || profileImageUrl);
      setNewProfileImageUrl(null);
      setIsEditing(false);
    } catch (error) {
      console.error("Error updating user data:", error);
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
        // After logout, redirect to login page
        history.push("/login");
      })
      .catch((error) => {
        console.error("Error during logout:", error);
      });
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
                <h4>Email</h4>
                <p>{email}</p>
              </div>
              <div className="profile-item">
                <h4>Phone Number</h4>
                {isEditing ? (
                  <input
                    type="text"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    placeholder="Enter your phone number"
                  />
                ) : (
                  <p>{phoneNumber}</p>
                )}
              </div>
            </div>
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
            <IonButton expand="full" color="danger" className="logout-button" onClick={handleLogout}>
              Logout
            </IonButton>
          </div>
        )}
      </IonContent>
    </IonPage>
  );
};

export default Profile;

