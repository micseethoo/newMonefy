import { initializeApp } from 'firebase/app';
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import { getFirestore, collection, doc, setDoc, getDoc, addDoc, getDocs, updateDoc } from 'firebase/firestore';

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyA_QoDQIaxeQ6VRjnUx7sqxdhiIJNENGX8",
  authDomain: "monefy-16fb6.firebaseapp.com",
  projectId: "monefy-16fb6",
  storageBucket: "monefy-16fb6.firebasestorage.app",
  messagingSenderId: "328791518843",
  appId: "1:328791518843:web:47b970a78db0d5e2f53cde",
  measurementId: "G-YKRGWB9CVB"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// Sign up with email function
export const signUpWithEmail = async (email: string, password: string, username: string, nickname: string): Promise<void> => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    console.log('User signed up:', user);

    // Add user to Firestore
    await setDoc(doc(db, 'users', user.uid), {
      username,
      email,
      nickname,
    });
  } catch (error) {
    console.error('Error signing up:', error);
    throw error;
  }
};
// Sign in with email function
export const signInWithEmail = async (email: string, password: string): Promise<void> => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    console.log('User signed in:', user);
  } catch (error) {
    console.error('Error signing in:', error);
    throw error;
  }
};

// Update Profile Picture URL in Firestore (base64 image string)
export const updateProfilePictureUrl = async (base64Url: string): Promise<void> => {
  const user = auth.currentUser;
  if (!user) throw new Error("User is not logged in");

  try {
    // Ensure that the base64 string starts with the correct prefix
    if (!base64Url.startsWith('data:image')) {
      throw new Error('Invalid base64 image format');
    }

    // Store the base64 string in Firestore
    const profileImagesRef = collection(db, 'users', user.uid, 'profileImages');
    const profileImagesSnap = await getDocs(profileImagesRef);

    // If no previous image exists, add a new one
    if (profileImagesSnap.empty) {
      await addDoc(profileImagesRef, {
        profileImageUrl: base64Url,
        updatedAt: new Date().toISOString(),
      });
    } else {
      // Otherwise, overwrite the existing profile image with the new one
      profileImagesSnap.forEach(async (doc) => {
        await updateDoc(doc.ref, { profileImageUrl: base64Url, updatedAt: new Date().toISOString() });
      });
    }

    console.log("Profile picture URL updated successfully");
  } catch (error) {
    console.error("Error updating profile picture URL:", error);
    throw error;
  }
};

// Fetch user data (including profile picture URL)
export const fetchUserData = async () => {
  const user = auth.currentUser;
  if (!user) throw new Error("User is not logged in");

  try {
    const userRef = doc(db, 'users', user.uid);
    const userSnap = await getDoc(userRef);

    if (!userSnap.exists()) throw new Error("User data not found");

    const userData = userSnap.data();

    // Fetch the most recent profile image URL from the 'profileImages' subcollection
    const profileImagesRef = collection(db, 'users', user.uid, 'profileImages');
    const profileImagesSnap = await getDocs(profileImagesRef);

    let profileImageUrl = null;
    if (!profileImagesSnap.empty) {
      const latestProfileImage = profileImagesSnap.docs[profileImagesSnap.docs.length - 1].data();
      profileImageUrl = latestProfileImage.profileImageUrl;
    }

    return { ...userData, profileImageUrl };
  } catch (error) {
    console.error("Error fetching user data:", error);
    throw error;
  }
};

export { auth, db };
