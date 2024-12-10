import React from 'react';
import { IonContent, IonPage, IonHeader, IonToolbar, IonTitle } from '@ionic/react'; // Import Ionic components
import './css/Savings.css'; // Link to CSS file for styling
import NavBar from '../components/NavBar';
import SavingsGoalDiv from '../components/SavingsGoalDiv'; // Import SavingsGoalDiv component

const Savings: React.FC = () => {
  return (
    <IonPage>
      {/* Header for the Savings page */}
      <IonHeader>
        <IonToolbar>
          <IonTitle className="savings-header">Savings</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen className="main-container">
        {/* Render SavingsGoalDiv components */}
        <SavingsGoalDiv goalName={"Car"} goalValue={10000} currentSavings={5000} />
        <SavingsGoalDiv goalName={"House"} goalValue={20000} currentSavings={12000} />
        <SavingsGoalDiv goalName={"Phone"} goalValue={15000} currentSavings={7000} />

        {/* Navigation bar at the bottom */}
        <NavBar />
      </IonContent>
    </IonPage>
  );
};

export default Savings;
