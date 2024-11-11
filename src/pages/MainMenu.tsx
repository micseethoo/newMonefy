import React, { useState } from 'react';
import './css/MainMenu.css'; // Link to CSS file for styling
import NavBar from '../components/NavBar';

import ProgressBar from '../components/ProgressBar'; // Import ProgressBar component

const MainMenu: React.FC = () => {
  const name = "Lee Zii Jia";
  const spendingMoney = 1000;

  const [progress, setProgress] = useState(50); // Example progress value (50%)

  return (
    <div className="main-container">
      <div className="name-savings-container">
        <h1>Hi, <span style={{ color: 'blue' }}>{name}</span>!</h1>
        <h2>Savings: RM 25600.00</h2>
      </div>

      <div className="monthly-summary-container">
        <h3>Monthly Summary</h3>
        <h3>Spending Money : RM {spendingMoney}</h3>

        <div className="income-expense-container">
          <div className="left-item">
            <h3 className="income-text">Income</h3>
            <p className="income-value-text">+RM 4000.00</p>
          </div>
          <div className="right-item">
            <h3 className="expense-text">Expense</h3>
            <p className="expense-value-text">-RM 1500.00</p>
          </div>
        </div>
      </div>

      <br />
      <h3 className="transaction-h3">Transactions</h3>
      <div className="transaction-container">
          <div className="transaction-row">
              <div className="icon">💸</div>
              <div className="name">Coffee</div>
              <div className="amount">RM 5.00</div>
          </div>
          <div className="transaction-row">
              <div className="icon">🍔</div>
              <div className="name">Lunch</div>
              <div className="amount">RM 12.00</div>
          </div>
          <div className="transaction-row">
              <div className="icon">🎬</div>
              <div className="name">Movie</div>
              <div className="amount">RM 15.00</div>
          </div>
      </div>

      {/* Add the ProgressBar above NavBar */}
       <ProgressBar progress={progress} />

      <NavBar />
    </div>
  );
};

export default MainMenu;
