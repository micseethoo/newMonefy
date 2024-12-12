import React from 'react';
import { IonContent, IonPage, IonHeader, IonToolbar, IonTitle } from '@ionic/react'; // Import Ionic components
import { IonCard, IonCardHeader, IonCardTitle, IonCardContent, IonProgressBar } from '@ionic/react';
import './css/SavingsGoal.css'; // Link to CSS file for styling
import NavBar from '../components/NavBar';
import SavingsGoalDiv from '../components/SavingsGoalDiv'; // Import SavingsGoalDiv component
import FloatingMenuButton from '../components/FloatingMenuButton';

const SavingsGoal: React.FC = () => {
    const goalName = "Goal Name";
    const currentSavings = 5000;
    const goalValue = 10000;
    // Calculate progress as a fraction (0 to 1) for IonProgressBar
      const progress = currentSavings / goalValue;

      // Calculate progress percentage
      const progressPercentage = Math.min(Math.max(progress * 100, 0), 100).toFixed(0); // Clamp to 0-100 and round
  return (
    <IonPage>
      {/* Header for the Savings page */}
      <IonHeader>
        <IonToolbar>
          <IonTitle className="savings-header">Savings</IonTitle>
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


        <IonCard
              className="savings-goal-container" // Navigate to the specified details page
            >
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

        {/* Navigation bar at the bottom */}
        <FloatingMenuButton />
        <NavBar />
      </IonContent>
    </IonPage>
  );
};

export default SavingsGoal;
