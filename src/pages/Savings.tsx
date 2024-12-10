import React, { useState } from 'react';
import './css/Savings.css'; // Link to CSS file for styling
import NavBar from '../components/NavBar';
import SavingsGoalDiv from '../components/SavingsGoalDiv'; // Import SavingsGoalDiv component
import ProgressBar from '../components/ProgressBar'; // Import ProgressBar component
import FloatingMenuButton from '../components/FloatingMenuButton';

const Savings: React.FC = () => {
  return (
    <div className="main-container">
      {/* Center the Savings header using a styled h1 */}
      <h1 className="savings-header">Savings</h1>

      {/* Render SavingsGoalDiv components */}
      <SavingsGoalDiv goalName={"Car"} goalValue={10000} currentSavings={5000} />
      <SavingsGoalDiv goalName={"House"} goalValue={20000} currentSavings={12000} />
      <SavingsGoalDiv goalName={"Phone"} goalValue={15000} currentSavings={7000} />

      <FloatingMenuButton />
      <NavBar />
    </div>
  );
};

export default Savings;
