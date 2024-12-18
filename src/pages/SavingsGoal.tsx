import React, { useEffect, useState } from 'react';
import { IonContent, IonPage, IonCard, IonCardContent, IonProgressBar, IonInput, IonButton, IonAlert } from '@ionic/react';
import { getFirestore, doc, getDoc, updateDoc, deleteDoc } from 'firebase/firestore';
import { useParams, useHistory } from 'react-router-dom';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import './css/SavingsGoal.css';
import NavBar from '../components/NavBar';
import FloatingMenuButton from '../components/FloatingMenuButton';

const SavingsGoal: React.FC = () => {
  const { goalId } = useParams<{ goalId: string }>();
  const [goalData, setGoalData] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const db = getFirestore();
  const [userId, setUserId] = useState<string | null>(null);
  const [newCurrentSavings, setNewCurrentSavings] = useState<number | string>('');
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [showDeleteAlert, setShowDeleteAlert] = useState<boolean>(false); // For confirmation alert
  const history = useHistory(); // For navigating back

  useEffect(() => {
    const auth = getAuth();
    const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUserId(user.uid);
      } else {
        setUserId(null);
      }
    });

    return () => unsubscribeAuth();
  }, []);

  const fetchGoalData = async () => {
    if (!goalId || !userId) return;

    try {
      const goalRef = doc(db, 'users', userId, 'savings', goalId);
      const goalDoc = await getDoc(goalRef);

      if (goalDoc.exists()) {
        setGoalData(goalDoc.data());
        setNewCurrentSavings(goalDoc.data()?.currentSavings || '');
      } else {
        console.error('Goal not found');
        setGoalData(null);
      }
    } catch (error) {
      console.error('Error fetching goal data:', error);
      setGoalData(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (userId) {
      fetchGoalData();
    }
  }, [goalId, userId]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!goalData) {
    return <div>No goal data found</div>;
  }

  const { goalName, currentSavings, goalValue } = goalData;

  const progress = currentSavings / goalValue;
  const progressPercentage = Math.min(Math.max(progress * 100, 0), 100).toFixed(0);

  const handleSaveCurrentSavings = async () => {
    if (newCurrentSavings && newCurrentSavings !== currentSavings) {
      try {
        const goalRef = doc(db, 'users', userId, 'savings', goalId);
        await updateDoc(goalRef, {
          currentSavings: Number(newCurrentSavings),
        });
        setGoalData((prevState: any) => ({
          ...prevState,
          currentSavings: Number(newCurrentSavings),
        }));
        setIsEditing(false);
        console.log('Current savings updated');
      } catch (error) {
        console.error('Error updating current savings:', error);
      }
    }
  };

  const handleCancelEdit = () => {
    setIsEditing(false); // Close the editing mode without saving changes
    setNewCurrentSavings(currentSavings); // Reset the input value
  };

  // Handle delete goal
  const handleDeleteGoal = async () => {
    if (!goalId || !userId) return;

    try {
      const goalRef = doc(db, 'users', userId, 'savings', goalId);
      await deleteDoc(goalRef);
      console.log('Goal deleted');
      // Redirect to the Savings page after deletion
      history.push('/savings'); // Navigate to Savings page
    } catch (error) {
      console.error('Error deleting goal:', error);
    }
  };

  return (
    <IonPage>
      <IonContent fullscreen className="main-container">
        <div className="text-container">
          <h1>
            <span>{goalName}</span>
          </h1>

          <h2>
            Current Savings
          </h2>

          <h2>
            RM <span>{currentSavings}</span>
          </h2>
        </div>

        <IonCard className="savings-goal-container">
          <IonCardContent>
            <IonProgressBar value={progress}></IonProgressBar>
            <p>Current Savings: RM {currentSavings.toFixed(2)} / RM {goalValue.toFixed(2)}</p>
          </IonCardContent>
        </IonCard>

        {/* Edit Button - Centered */}
        <div className="edit-button-container">
          <IonButton onClick={() => setIsEditing(!isEditing)}>
            Edit
          </IonButton>
        </div>

        {/* Delete Goal Button */}
        <div className="delete-button-container">
          <IonButton color="danger" onClick={() => setShowDeleteAlert(true)}>
            Delete Goal
          </IonButton>
        </div>

        {/* Editing Section */}
        {isEditing && (
          <div className="edit-section">
            <p className="edit-text">Change Savings Value</p>
            <IonInput
              value={newCurrentSavings}
              onIonChange={(e) => setNewCurrentSavings(e.detail.value!)}
              placeholder="Enter new savings"
              type="number"
            />
            <div className="button-container">
              <IonButton onClick={handleSaveCurrentSavings}>Save</IonButton>
              <IonButton onClick={handleCancelEdit} color="light">Cancel</IonButton>
            </div>
          </div>
        )}

        {/* Delete Confirmation Alert */}
        <div className="button-container">
            <IonAlert
              isOpen={showDeleteAlert}
              onDidDismiss={() => setShowDeleteAlert(false)}
              header="Delete Goal"
              message="Are you sure you want to delete this goal? This action cannot be undone."
              buttons={[
                {
                  text: 'Cancel',
                  role: 'cancel',
                  handler: () => {
                    setShowDeleteAlert(false);
                  },
                },
                {
                  text: 'Delete',
                  role: 'destructive',
                  handler: handleDeleteGoal,
                },
              ]}
            />
        </div>


        <FloatingMenuButton />
        <NavBar />
      </IonContent>
    </IonPage>
  );
};

export default SavingsGoal;
