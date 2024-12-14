import React, { useEffect, useState } from 'react';
import { IonContent, IonPage, IonHeader, IonToolbar, IonTitle } from '@ionic/react'; // Import Ionic components
import { IonCard, IonCardHeader, IonCardTitle, IonCardContent, IonProgressBar } from '@ionic/react';
import { getFirestore, doc, getDoc } from 'firebase/firestore'; // Import Firestore functions
import { useParams } from 'react-router-dom'; // For routing and extracting the goal ID
import { getAuth } from 'firebase/auth'; // Import Firebase Authentication functions
import './css/SavingsGoal.css'; // Link to CSS file for styling
import NavBar from '../components/NavBar';
import FloatingMenuButton from '../components/FloatingMenuButton';

const SavingsGoal: React.FC = () => {
  const { goalId } = useParams<{ goalId: string }>(); // Extract goalId from the URL params
  const [goalData, setGoalData] = useState<any>(null); // Store goal data here
  const [loading, setLoading] = useState<boolean>(true); // Loading state
  const db = getFirestore(); // Initialize Firestore

  // Get the current authenticated user
  const auth = getAuth();
  const user = auth.currentUser;

  // Log the goalId and user UID to check if they're correct
  useEffect(() => {
    console.log("Goal ID from URL:", goalId); // Log the goalId
    if (user) {
      console.log("Authenticated user UID:", user.uid); // Log the authenticated user's UID
    }
  }, [goalId, user]);

  // Function to fetch data from Firestore based on goalId
  const fetchGoalData = async () => {
    if (!goalId || !user) return; // Check if goalId or user is not available

    try {
      const goalRef = doc(db, 'users', user.uid, 'savings', goalId); // Correct Firestore path using the authenticated user's UID
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
      setLoading(false); // Set loading to false once done
    }
  };

  useEffect(() => {
    fetchGoalData(); // Call fetchGoalData when the component mounts or goalId changes
  }, [goalId, user]); // Re-run when goalId or user changes

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
      <IonHeader>
        <IonToolbar>
          <IonTitle className="savings-header">Savings Goal</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen className="main-container">
        <div className="text-container">
          <h1>
            <span style={{ color: 'white' }}>{goalName}</span>
          </h1>

          <h2>
            Current Savings
          </h2>

          <h2>
            RM <span style={{ color: 'blue' }}>{currentSavings}</span>
          </h2>
        </div>

        <IonCard className="savings-goal-container">
          <IonCardHeader>
            <div className="header-container">
              <IonCardTitle className="goal-name">{goalName}</IonCardTitle>
              <span className="progress-percentage">{progressPercentage}%</span>
            </div>
          </IonCardHeader>
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

