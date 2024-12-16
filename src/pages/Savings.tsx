import React, { useEffect, useState } from 'react';
import { IonPage, IonContent, IonHeader, IonToolbar, IonTitle, IonGrid, IonRow, IonCol, IonCard, IonCardContent, IonItem, IonLabel, IonInput, IonButton, IonToast } from '@ionic/react';
import { getAuth, onAuthStateChanged } from 'firebase/auth'; // Import onAuthStateChanged
import { getFirestore, collection, onSnapshot, getDocs, addDoc } from 'firebase/firestore';
import './css/Savings.css';
import NavBar from '../components/NavBar';
import SavingsGoalDiv from '../components/SavingsGoalDiv';

const Savings: React.FC = () => {
  const [savingsGoals, setSavingsGoals] = useState<any[]>([]);
  const [collectionExists, setCollectionExists] = useState<boolean>(false);
  const [goalName, setGoalName] = useState<string>('');
  const [goalValue, setGoalValue] = useState<number>(0);
  const [currentSavings, setCurrentSavings] = useState<number>(0);
  const [showToast, setShowToast] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string>('');
  const [userId, setUserId] = useState<string | null>(null); // State to hold user ID

  const auth = getAuth();
  const db = getFirestore();

  // Function to check if the collection exists
  const checkCollectionExists = async (collectionPath: string) => {
    try {
      const collectionRef = collection(db, collectionPath);
      const snapshot = await getDocs(collectionRef);
      setCollectionExists(!snapshot.empty);
    } catch (error) {
      console.error('Error checking collection existence:', error);
      setCollectionExists(false);
    }
  };

  // Function to add a new savings goal
  const addSavingsGoal = async () => {
    if (!goalName || goalValue <= 0 || currentSavings < 0) {
      setToastMessage('Please fill in all fields correctly.');
      setShowToast(true);
      return;
    }

    try {
      const savingsRef = collection(db, `users/${userId}/savings`);
      await addDoc(savingsRef, {
        goalName,
        goalValue,
        currentSavings,
      });

      // Reset form fields after submission
      setGoalName('');
      setGoalValue(0);
      setCurrentSavings(0);
      setToastMessage('Savings goal added successfully!');
      setShowToast(true);
    } catch (error: any) {
      console.error('Error adding savings goal:', error);
      setToastMessage('Failed to add savings goal: ' + error.message);
      setShowToast(true);
    }
  };

  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUserId(user.uid); // Set the userId when the user is authenticated
      } else {
        setUserId(null); // Set userId to null when the user is not authenticated
      }
    });

    return () => {
      unsubscribeAuth(); // Clean up the subscription when the component unmounts
    };
  }, [auth]);

  useEffect(() => {
    if (!userId) return;

    const savingsRef = collection(db, `users/${userId}/savings`);

    // Check if the collection exists before trying to load data
    checkCollectionExists(`users/${userId}/savings`);

    const unsubscribe = onSnapshot(savingsRef, (snapshot) => {
      const goalsList: any[] = [];
      snapshot.docs.forEach((doc) => {
        const goalData = doc.data();
        goalsList.push({ id: doc.id, ...goalData });
      });
      setSavingsGoals(goalsList);
    });

    return () => unsubscribe();
  }, [userId, db]);

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar color="primary">
          <IonTitle>Savings Goals</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen className="main-container">
        {collectionExists ? (
          <IonGrid>
            <IonRow>
              {savingsGoals.length > 0 ? (
                savingsGoals.map((goal) => (
                  <IonCol size="12" size-md="6" size-lg="4" key={goal.id} className="savings-goal">
                    <SavingsGoalDiv
                      goalName={goal.goalName}
                      goalValue={goal.goalValue}
                      currentSavings={goal.currentSavings}
                      goalId={goal.id} // Pass the goalId to the SavingsGoalDiv
                    />
                  </IonCol>
                ))
              ) : (
                <IonCol size="12">
                  <p>No savings goals found.</p>
                </IonCol>
              )}
            </IonRow>
          </IonGrid>
        ) : (
          <IonCard>
            <IonCardContent>
              <p>No savings goals collection found. Please add a goal to get started!</p>
            </IonCardContent>
          </IonCard>
        )}

        {/* Form to Add New Savings Goal */}
        <IonCard>
          <IonCardContent>
            <IonItem>
              <IonLabel position="stacked">Goal Name</IonLabel>
              <IonInput
                value={goalName}
                onIonChange={(e) => setGoalName(e.detail.value!)}
                placeholder="Enter goal name"
              />
            </IonItem>
            <IonItem>
              <IonLabel position="stacked">Goal Value</IonLabel>
              <IonInput
                type="number"
                value={goalValue}
                onIonChange={(e) => setGoalValue(Number(e.detail.value))}
                placeholder="Enter goal value"
              />
            </IonItem>
            <IonItem>
              <IonLabel position="stacked">Current Savings</IonLabel>
              <IonInput
                type="number"
                value={currentSavings}
                onIonChange={(e) => setCurrentSavings(Number(e.detail.value))}
                placeholder="Enter current savings"
              />
            </IonItem>
            <IonButton expand="full" onClick={addSavingsGoal}>
              Add Savings Goal
            </IonButton>
          </IonCardContent>
        </IonCard>

        {/* Display Toast Message */}
        <IonToast
          isOpen={showToast}
          message={toastMessage}
          duration={2000}
          onDidDismiss={() => setShowToast(false)}
        />
      </IonContent>
      <NavBar />
    </IonPage>
  );
};

export default Savings;
