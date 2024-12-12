// import { initializeApp } from 'firebase/app';
// import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
// import { getFirestore, collection, doc, setDoc } from 'firebase/firestore';
//
// // Firebase configuration
// const firebaseConfig = {
//   apiKey: "AIzaSyA_QoDQIaxeQ6VRjnUx7sqxdhiIJNENGX8",
//   authDomain: "monefy-16fb6.firebaseapp.com",
//   projectId: "monefy-16fb6",
//   storageBucket: "monefy-16fb6.firebasestorage.app",
//   messagingSenderId: "328791518843",
//   appId: "1:328791518843:web:47b970a78db0d5e2f53cde",
//   measurementId: "G-YKRGWB9CVB"
// };
//
// // Initialize Firebase app and services
// const app = initializeApp(firebaseConfig);
// const auth = getAuth(app);
// const db = getFirestore(app);
//
// export { db };
//
// // Sign up with email function
// export const signUpWithEmail = async (email: string, password: string, username: string): Promise<void> => {
//   try {
//     const userCredential = await createUserWithEmailAndPassword(auth, email, password);
//     const user = userCredential.user;
//     console.log('User signed up:', user);
//
//     // Add user to Firestore
//     await setDoc(doc(db, 'users', user.uid), {
//       username,
//       email
//     });
//   } catch (error) {
//     console.error('Error signing up:', error);
//     throw error;
//   }
// };
//
// // Sign in with email function
// export const signInWithEmail = async (email: string, password: string): Promise<void> => {
//   try {
//     const userCredential = await signInWithEmailAndPassword(auth, email, password);
//     const user = userCredential.user;
//     console.log('User signed in:', user);
//   } catch (error) {
//     console.error('Error signing in:', error);
//     throw error;
//   }
// };
//

import { initializeApp } from 'firebase/app';
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import { getFirestore, collection, doc, getDoc, setDoc, query, where, getDocs } from 'firebase/firestore';

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

export { db };

// Sign up with email function
export const signUpWithEmail = async (email: string, password: string, username: string, phoneNumber: string): Promise<void> => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    console.log('User signed up:', user);

    // Add user to Firestore with email and phone number
    await setDoc(doc(db, 'users', user.uid), {
      username,
      email,
      phoneNumber // Store phone number for the user
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
    console.log('User signed in with email:', user);
  } catch (error) {
    console.error('Error signing in with email:', error);
    throw error;
  }
};

// Sign in with phone number function
export const signInWithPhone = async (phoneNumber: string): Promise<void> => {
  try {
    // Check Firestore for the phone number and retrieve user details
    const usersRef = collection(db, 'users');
    const querySnapshot = await getDocs(query(usersRef, where('phoneNumber', '==', phoneNumber)));

    if (!querySnapshot.empty) {
      const userDoc = querySnapshot.docs[0]; // Assuming the phone number is unique
      const userData = userDoc.data();
      console.log('Phone number match found in Firestore:', userData);

      // Proceed with user login, e.g., set user session or navigate to home page
    } else {
      throw new Error('Phone number not found.');
    }
  } catch (error) {
    console.error('Error signing in with phone number:', error);
    throw error;
  }
};
