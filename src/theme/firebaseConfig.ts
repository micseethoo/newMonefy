// firebaseConfig.ts
import { initializeApp } from 'firebase/app';
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import { getFirestore, collection, doc, addDoc, onSnapshot, setDoc } from 'firebase/firestore';

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

export const addTransaction = async (amount: number, type: 'income' | 'expense', description: string, date: Date) => {
  const user = auth.currentUser;
  if (!user) throw new Error("User is not logged in");

  try {
    const transactionRef = collection(doc(db, 'users', user.uid), 'transactions');
    await addDoc(transactionRef, {
      amount,
      type,
      description,
      date: date.toISOString()
    });
    console.log("Transaction added successfully");
  } catch (error) {
    console.error("Error adding transaction: ", error);
    throw error;
  }
};   

export { auth, db };
