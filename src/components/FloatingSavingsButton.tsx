import React, { useState } from 'react';
import { IonButton, IonCard, IonCardContent, IonInput, IonItem, IonLabel, IonToast, IonRow, IonCol } from '@ionic/react';
import './FloatingSavingsButton.css';
import { getAuth } from 'firebase/auth';
import { getFirestore, collection, addDoc } from 'firebase/firestore';

const FloatingSavingsButton: React.FC = () => {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [goalName, setGoalName] = useState('');
  const [goalValue, setGoalValue] = useState<number | undefined>(undefined);
  const [currentSavings, setCurrentSavings] = useState<number | undefined>(undefined);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  const auth = getAuth();
  const db = getFirestore();
  const userId = auth.currentUser?.uid;

  const toggleForm = () => {
    setIsFormOpen(!isFormOpen);
  };

  const addSavingsGoal = async () => {
    if (!userId || !goalName || !goalValue || currentSavings === undefined) {
      setToastMessage('Please fill out all fields');
      setShowToast(true);
      return;
    }

    try {
      const savingsRef = collection(db, `users/${userId}/savings`);
      await addDoc(savingsRef, {
        goalName,
        goalValue,
        currentSavings,
        createdDate: new Date().toISOString(),
      });
      setGoalName('');
      setGoalValue(undefined);
      setCurrentSavings(undefined);
      setToastMessage('Savings goal added successfully!');
    } catch (error) {
      setToastMessage('Error adding savings goal.');
      console.error('Error adding savings goal:', error);
    }
    setShowToast(true);
    setIsFormOpen(false); // Close the form after submission
  };

  return (
    <div className="floating-button-container">
      <IonButton onClick={toggleForm} className="floating-button" color="primary" shape="round">
        {isFormOpen ? 'x' : '+'}
      </IonButton>

      {isFormOpen && (
        <div className="savings-form-container">
          <IonRow>
            <IonCol size="12">
              <IonCard>
                <IonCardContent>
                  <h3>Add Savings Goal</h3>
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
            </IonCol>
          </IonRow>
        </div>
      )}

      {/* Display Toast Message */}
      <IonToast
        isOpen={showToast}
        message={toastMessage}
        duration={2000}
        onDidDismiss={() => setShowToast(false)}
      />
    </div>
  );
};

export default FloatingSavingsButton;
