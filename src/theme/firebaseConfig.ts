import { initializeApp } from 'firebase/app';
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import { getFirestore, collection, doc, setDoc } from 'firebase/firestore';

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBAkfZNwrNZNIc1p84iX1mdpakMMZQpMuc",
  authDomain: "testing-for-monefy.firebaseapp.com",
  projectId: "testing-for-monefy",
  storageBucket: "testing-for-monefy.firebasestorage.app",
  messagingSenderId: "611640356066",
  appId: "1:611640356066:web:a0e6d6ff18fd208f0082bb",
  measurementId: "G-CZ1XNH3HSS"
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
};
