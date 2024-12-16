import React, { useEffect, useState } from 'react';
import { IonContent, IonPage, IonHeader, IonToolbar, IonTitle } from '@ionic/react'; // Import Ionic components
import { IonCard, IonCardHeader, IonCardTitle, IonCardContent, IonProgressBar } from '@ionic/react';
import { getFirestore, doc, getDoc } from 'firebase/firestore'; // Import Firestore functions
import { useParams } from 'react-router-dom'; // For routing and extracting the goal ID
import { getAuth, onAuthStateChanged } from 'firebase/auth'; // Import Firebase Authentication functions
import './css/SavingsGoal.css'; // Link to CSS file for styling
import NavBar from '../components/NavBar';
import FloatingMenuButton from '../components/FloatingMenuButton';

const SavingsGoal: React.FC = () => {
  const { goalId } = useParams<{ goalId: string }>(); // Extract goalId from the URL params
  const [goalData, setGoalData] = useState<any>(null); // Store goal data here
  const [loading, setLoading] = useState<boolean>(true); // Loading state
  const db = getFirestore(); // Initialize Firestore
  const [userId, setUserId] = useState<string | null>(null); // Track the authenticated user's UID

  useEffect(() => {
    const auth = getAuth();

    // Use onAuthStateChanged to listen for authentication state changes
    const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
      if (user) {
        console.log('Authenticated user UID:', user.uid);
        setUserId(user.uid); // Update the userId state when a user is authenticated
      } else {
        console.warn('No authenticated user');
        setUserId(null); // Reset userId if no user is authenticated
      }
    });

    // Clean up the onAuthStateChanged listener on unmount
    return () => unsubscribeAuth();
  }, []);

  // Function to fetch data from Firestore based on goalId and userId
  const fetchGoalData = async () => {
    if (!goalId || !userId) return; // Ensure both goalId and userId are available

    try {
      const goalRef = doc(db, 'users', userId, 'savings', goalId); // Firestore path using authenticated user's UID
      const goalDoc = await getDoc(goalRef);

      if (goalDoc.exists()) {
        setGoalData(goalDoc.data()); // Set goal data from Firestore
      } else {
        console.error('Goal not found');
        setGoalData(null); // Set data to null if goal is not found
      }
    } catch (error) {
      console.error('Error fetching goal data:', error);
      setGoalData(null); // Set data to null on error
    } finally {
      setLoading(false); // Stop loading
    }
  };

  useEffect(() => {
    if (userId) {
      fetchGoalData(); // Call fetchGoalData when userId changes
    }
  }, [goalId, userId]); // Re-run when goalId or userId changes

  if (loading) {
    return <div>Loading...</div>; // Show loading while fetching data
  }

  if (!goalData) {
    return <div>No goal data found</div>; // Handle no data found
  }

  // Destructure goal data
  const { goalName, currentSavings, goalValue } = goalData;

  // Calculate progress
  const progress = currentSavings / goalValue;
  const progressPercentage = Math.min(Math.max(progress * 100, 0), 100).toFixed(0); // Ensure progress is between 0-100

  return (
    <IonPage>
      <IonContent fullscreen className="main-container">
        <div className="text-container">
          <h1>
            <span style={{ color: 'white' }}>{goalName}</span>
          </h1>

          <h2 style={{ color: 'white' }}>
            Current Savings
          </h2>

          <h2 style={{ color: 'white' }}>
            RM <span style={{ color: 'white' }}>{currentSavings}</span>
          </h2>
        </div>

        <IonCard className="savings-goal-container">
          <IonCardContent>
            <IonProgressBar value={progress}></IonProgressBar>
            <p>Current Savings: RM {currentSavings.toFixed(2)} / RM {goalValue.toFixed(2)}</p>
          </IonCardContent>
        </IonCard>

        <FloatingMenuButton />
        <NavBar />
      </IonContent>
    </IonPage>
  );
};

export default SavingsGoal;
