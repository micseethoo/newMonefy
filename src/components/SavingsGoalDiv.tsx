import React from 'react';
import { IonCard, IonCardHeader, IonCardTitle, IonCardContent, IonProgressBar } from '@ionic/react';
import './SavingsGoalDiv.css';

// Define the interface for the props
interface SavingsGoalDivProps {
  goalValue: number;
  currentSavings: number;
  goalName: string;
  goalId: string; // The ID of the goal
}

const SavingsGoalDiv: React.FC<SavingsGoalDivProps> = ({ goalValue, currentSavings, goalName, goalId }) => {
  // Calculate progress as a fraction (0 to 1) for IonProgressBar
  const progress = currentSavings / goalValue;

  // Calculate progress percentage
  const progressPercentage = Math.min(Math.max(progress * 100, 0), 100).toFixed(0); // Clamp to 0-100 and round

  return (
    <IonCard
      className="savings-goal-container"
      button
      routerLink={`/savingsGoal/${goalId}`} // Dynamically navigate to the goal's details page
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
  );
};

export default SavingsGoalDiv;
