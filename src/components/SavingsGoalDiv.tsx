import React from 'react';
import ProgressBar from './ProgressBar'; // Import ProgressBar component
import './SavingsGoalDiv.css';

// Define the interface for the props
interface SavingsGoalDivProps {
  goalValue: number;
  currentSavings: number;
  goalName: string;
}

const SavingsGoalDiv: React.FC<SavingsGoalDivProps> = ({ goalValue, currentSavings, goalName }) => {
  // Calculate progress (percentage)
  const progress = (currentSavings / goalValue) * 100;

  return (
    <div className="savings-goal-container">
      <h3>{goalName}</h3>
      <ProgressBar progress={progress} />
      <p>Current Savings: RM {currentSavings} / {goalValue}</p>
    </div>
  );
};

export default SavingsGoalDiv;
