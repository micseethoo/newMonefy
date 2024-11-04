// src/pages/Home.tsx
import React, { useEffect, useState } from 'react';
import { IonPage, IonContent, IonHeader, IonToolbar, IonTitle, IonGrid, IonRow, IonCol, IonCard, IonCardContent } from '@ionic/react';
import { getAuth } from 'firebase/auth';
import { getFirestore, doc, onSnapshot, collection, getDocs } from 'firebase/firestore';
import './css/UserHome.css';

const Home: React.FC = () => {
  const [balance, setBalance] = useState(0);
  const [totalIncome, setTotalIncome] = useState(0);
  const [totalExpenses, setTotalExpenses] = useState(0);

  const auth = getAuth();
  const db = getFirestore();

  const userId = auth.currentUser?.uid; // Ensure the user is logged in
  const userRef = doc(db, 'users', userId || '');

  // Fetch data for total income and total expenses
  useEffect(() => {
    if (!userId) return;

    const incomeRef = collection(userRef, 'income');
    const expensesRef = collection(userRef, 'expenses');

    // Listen for real-time updates
    const unsubscribeIncome = onSnapshot(incomeRef, (snapshot) => {
      const incomeSum = snapshot.docs.reduce((total, doc) => total + (doc.data().amount || 0), 0);
      setTotalIncome(incomeSum);
    });

    const unsubscribeExpenses = onSnapshot(expensesRef, (snapshot) => {
      const expensesSum = snapshot.docs.reduce((total, doc) => total + (doc.data().amount || 0), 0);
      setTotalExpenses(expensesSum);
    });

    // Set balance based on income and expenses
    setBalance(totalIncome - totalExpenses);

    // Clean up listeners
    return () => {
      unsubscribeIncome();
      unsubscribeExpenses();
    };
  }, [userId, totalIncome, totalExpenses]);

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar color="primary">
          <IonTitle>Expense Tracker</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen className="home-content">
        <IonGrid className="home-grid">
          <IonRow>
            <IonCol size="12">
              <IonCard className="balance-card">
                <IonCardContent>
                  <h2>Balance</h2>
                  <p className="balance-amount">${balance.toFixed(2)}</p>
                </IonCardContent>
              </IonCard>
            </IonCol>
          </IonRow>
          <IonRow>
            <IonCol size="6">
              <IonCard className="income-card">
                <IonCardContent>
                  <h3>Total Income</h3>
                  <p className="income-amount">${totalIncome.toFixed(2)}</p>
                </IonCardContent>
              </IonCard>
            </IonCol>
            <IonCol size="6">
              <IonCard className="expense-card">
                <IonCardContent>
                  <h3>Total Expenses</h3>
                  <p className="expense-amount">${totalExpenses.toFixed(2)}</p>
                </IonCardContent>
              </IonCard>
            </IonCol>
          </IonRow>
        </IonGrid>
      </IonContent>
    </IonPage>
  );
};

export default Home;
