import React, { useState } from 'react';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

// Register Chart.js components
ChartJS.register(ArcElement, Tooltip, Legend);

const SpendingTracker = () => {
  const [spendingData, setSpendingData] = useState<{ category: string; amount: number }[]>([
    { category: 'Food', amount: 200 },
    { category: 'Transport', amount: 100 },
    { category: 'Entertainment', amount: 50 }
  ]);

  const addSpending = (category: string, amount: number) => {
    const existingCategory = spendingData.find(item => item.category === category);

    if (existingCategory) {
      const updatedSpendingData = spendingData.map(item =>
        item.category === category ? { ...item, amount: item.amount + amount } : item
      );
      setSpendingData(updatedSpendingData);
    } else {
      const newSpending = { category, amount };
      // Spread operator is used here ...spendingData, to merge newSpending with spendingData
      setSpendingData([...spendingData, newSpending]);
    }
  };

  // Prepare data for Pie chart
  const pieChartData = {
    labels: spendingData.map(item => item.category),  // Categories as labels
    datasets: [
      {
        data: spendingData.map(item => item.amount),  // Amounts as data
        backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF'],  // Color for each section
        hoverBackgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF']  // Hover color
      }
    ]
  };

  return (
    <div>
      <div>
        <input type="text" placeholder="Category" id="category" />
        <input type="number" placeholder="Amount" id="amount" />
        <button
          onClick={() => {
            const category = (document.getElementById('category') as HTMLInputElement).value;
            const amount = parseInt((document.getElementById('amount') as HTMLInputElement).value, 10);
            if (category && amount) {
              addSpending(category, amount);
            }
          }}
        >
          Add Spending
        </button>
      </div>

      {/* Render Pie Chart */}
      <div className="piechart">
          <Pie data={pieChartData} />
      </div>

      <div className="spending-list">
        {spendingData.map((item, index) => (
          <div className="spending-item" key={index}>
            <span className="category">{item.category}</span>
            <span className="amount">{item.amount}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SpendingTracker;
