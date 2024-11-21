import React, { useState } from 'react';
import FloatingMenuButton from '../components/FloatingMenuButton';
import NavBar from '../components/NavBar';
import SpendingTracker from '../components/SpendingTracker'; // Import your new component
import './css/Statistics.css';

const Statistics: React.FC = () => {
  return (
    <div>
        <div className="statistics-container">
          <h1>Monthly Spending</h1>
          <SpendingTracker /> {/* Render the SpendingTracker component */}

          <FloatingMenuButton />

        </div>
        <NavBar />
    </div>

  );
};

export default Statistics;
