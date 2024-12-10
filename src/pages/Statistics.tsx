import React, { useEffect, useState } from 'react';
import { Pie } from 'react-chartjs-2';
import 'chart.js/auto';
import { getAuth } from 'firebase/auth';
import { getFirestore, collection, onSnapshot, query, orderBy } from 'firebase/firestore';
import FloatingMenuButton from '../components/FloatingMenuButton';
import NavBar from '../components/NavBar';
import './css/Statistics.css';

const Statistics: React.FC = () => {
  const [transactions, setTransactions] = useState<any[]>([]);
  const auth = getAuth();
  const db = getFirestore();
  const userId = auth.currentUser?.uid;

  useEffect(() => {
    if (!userId) return;

    const expensesRef = query(
      collection(db, `users/${userId}/expenses`),
      orderBy('date', 'desc')
    );

    const unsubscribe = onSnapshot(expensesRef, (snapshot) => {
      const expenseList: any[] = [];
      snapshot.docs.forEach((doc) => {
        expenseList.push({ id: doc.id, ...doc.data() });
      });
      setTransactions(expenseList);
    });

    return () => unsubscribe();
  }, [userId]);

  const calculateData = () => {
    const tagAmounts: { [key: string]: number } = {};

    transactions.forEach((transaction) => {
      if (tagAmounts[transaction.tag]) {
        tagAmounts[transaction.tag] += transaction.amount;
      } else {
        tagAmounts[transaction.tag] = transaction.amount;
      }
    });

    return {
      labels: Object.keys(tagAmounts),
      datasets: [
        {
          data: Object.values(tagAmounts),
          backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF'],
          hoverBackgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF'],
        },
      ],
    };
  };

  const calculateTagTotals = () => {
    const tagAmounts: { [key: string]: number } = {};

    transactions.forEach((transaction) => {
      if (tagAmounts[transaction.tag]) {
        tagAmounts[transaction.tag] += transaction.amount;
      } else {
        tagAmounts[transaction.tag] = transaction.amount;
      }
    });

    return tagAmounts;
  };

  const tagTotals = calculateTagTotals();

  return (
    <div>
      <div className="statistics-container">
        <h1>Monthly Spending</h1>
        <div className="chart-container">
          <Pie data={calculateData()} />
        </div>
        <div className="tag-totals">
          <h2>Spending by Tag</h2>
          <ul>
            {Object.entries(tagTotals).map(([tag, total]) => (
              <li key={tag}>
                <strong>{tag}:</strong> RM {total.toFixed(2)}
              </li>
            ))}
          </ul>
        </div>
        <FloatingMenuButton />
      </div>
      <NavBar />
    </div>
  );
};

export default Statistics;
