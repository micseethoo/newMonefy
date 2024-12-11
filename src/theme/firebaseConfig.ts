/*import { initializeApp } from 'firebase/app';
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import { getFirestore, collection, doc, setDoc } from 'firebase/firestore';

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

// Initialize Firebase app and services
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// Sign up with email function
export const signUpWithEmail = async (email: string, password: string, username: string): Promise<void> => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    console.log('User signed up:', user);

    // Add user to Firestore
    await setDoc(doc(db, 'users', user.uid), {
      username,
      email
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
};*/

// src/theme/firebaseConfig.ts
/*import { initializeApp } from 'firebase/app';
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import { getFirestore, collection, doc, addDoc, setDoc, getDoc, updateDoc } from 'firebase/firestore';

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

export const addExpense = async (
  title: string,
  amount: number,
  tag: string,
  paymentMethod: string
) => {
  const user = auth.currentUser;
  if (!user) throw new Error("User is not logged in");

  try {
    const expensesRef = collection(doc(db, 'users', user.uid), 'expenses');
    await addDoc(expensesRef, {
      title,
      amount,
      tag,
      paymentMethod,
      date: new Date().toISOString()
    });
    console.log("Expense added successfully");
  } catch (error) {
    console.error("Error adding expense: ", error);
    throw error;
  }
};

// Sign up with email function
export const signUpWithEmail = async (email: string, password: string, username: string): Promise<void> => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    console.log('User signed up:', user);

    // Add user to Firestore
    await setDoc(doc(db, 'users', user.uid), {
      username,
      email
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

// Add Profile Picture URL to the profile subcollection
export const updateProfilePictureUrl = async (url: string): Promise<void> => {
  const user = auth.currentUser;
  if (!user) throw new Error("User is not logged in");

  try {
    const profileRef = doc(db, 'users', user.uid, 'profile', 'profileData');
    await setDoc(profileRef, { profileImageUrl: url, updatedAt: new Date().toISOString() });
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
    // Fetch user document (username and email)
    const userRef = doc(db, 'users', user.uid);
    const userSnap = await getDoc(userRef);

    if (!userSnap.exists()) throw new Error("User data not found");

    const userData = userSnap.data();

    // Fetch profile picture URL from the 'profile' subcollection
    const profileRef = doc(db, 'users', user.uid, 'profile', 'profileData');
    const profileSnap = await getDoc(profileRef);

    let profileImageUrl = null;
    if (profileSnap.exists()) {
      profileImageUrl = profileSnap.data().profileImageUrl;
    }

    return { ...userData, profileImageUrl };
  } catch (error) {
    console.error("Error fetching user data:", error);
    throw error;
  }
};

export { auth, db };*/

// src/theme/firebaseConfig.ts
/*import { initializeApp } from 'firebase/app';
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import { getFirestore, collection, doc, addDoc, setDoc, getDoc, updateDoc, getDocs } from 'firebase/firestore';

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
export const signUpWithEmail = async (email: string, password: string, username: string): Promise<void> => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    console.log('User signed up:', user);

    // Add user to Firestore
    await setDoc(doc(db, 'users', user.uid), {
      username,
      email
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

// Add Profile Picture URL to the profileImages subcollection
export const updateProfilePictureUrl = async (url: string): Promise<void> => {
  const user = auth.currentUser;
  if (!user) throw new Error("User is not logged in");

  try {
    const profileImagesRef = collection(db, 'users', user.uid, 'profileImages');
    await addDoc(profileImagesRef, {
      profileImageUrl: url,
      updatedAt: new Date().toISOString(),
    });
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

export { auth, db };*/

/*import { initializeApp } from 'firebase/app';
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
export const signUpWithEmail = async (email: string, password: string, username: string): Promise<void> => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    console.log('User signed up:', user);

    // Add user to Firestore
    await setDoc(doc(db, 'users', user.uid), {
      username,
      email
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

// Add Profile Picture URL to the profileImages subcollection
// This function will overwrite the existing profile image URL with the new one
export const updateProfilePictureUrl = async (url: string): Promise<void> => {
  const user = auth.currentUser;
  if (!user) throw new Error("User is not logged in");

  try {
    // Overwrite any existing profile image in the 'profileImages' subcollection
    const profileImagesRef = collection(db, 'users', user.uid, 'profileImages');
    const profileImagesSnap = await getDocs(profileImagesRef);

    // Delete the existing profile image data if it exists
    profileImagesSnap.forEach(doc => {
      // Delete the old profile image from Firestore
      updateDoc(doc.ref, { profileImageUrl: url, updatedAt: new Date().toISOString() });
    });

    // If no previous image, create a new document with the image URL
    if (profileImagesSnap.empty) {
      await addDoc(profileImagesRef, {
        profileImageUrl: url,
        updatedAt: new Date().toISOString(),
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

export { auth, db };*/ /*TRUE

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
export const signUpWithEmail = async (email: string, password: string, username: string): Promise<void> => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    console.log('User signed up:', user);

    // Add user to Firestore
    await setDoc(doc(db, 'users', user.uid), {
      username,
      email
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

export { auth, db };*/


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
export const signUpWithEmail = async (email: string, password: string, username: string, phoneNumber: int): Promise<void> => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    console.log('User signed up:', user);

    // Add user to Firestore
    await setDoc(doc(db, 'users', user.uid), {
      username,
      email,
      phoneNumber, // Save phone number in Firestore
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

