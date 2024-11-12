// src/pages/Home.tsx
import React, { useEffect, useState } from 'react';
import { IonPage, IonContent, IonHeader, IonToolbar, IonTitle, IonGrid, IonRow, IonCol, IonCard, IonCardContent, IonInput, IonButton, IonItem } from '@ionic/react';
import { getAuth } from 'firebase/auth';
import { addExpense } from '../theme/firebaseConfig';
import { db } from '../theme/firebaseConfig';
import { collection, onSnapshot, doc } from 'firebase/firestore';
import './css/UserHome.css';

const Home: React.FC = () => {
  const [balance, setBalance] = useState(0);
  const [totalExpenses, setTotalExpenses] = useState(0);

  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState<number>(0);
  const [tag, setTag] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('');

  const auth = getAuth();
  const user = auth.currentUser;

  // Fetch total expenses in real-time
  useEffect(() => {
    if (!user) return;

    const expensesRef = collection(doc(db, 'users', user.uid), 'expenses');

    const unsubscribeExpenses = onSnapshot(expensesRef, (snapshot) => {
      let expensesSum = 0;

      snapshot.forEach((doc) => {
        const data = doc.data();
        expensesSum += data.amount;
      });

      setTotalExpenses(expensesSum);
      setBalance(-expensesSum); // Assuming balance is just total expenses as a negative value
    });

    // Cleanup listener on component unmount
    return () => unsubscribeExpenses();
  }, [user]);

  // Add new expense
  const handleAddExpense = async () => {
    if (!title || !amount || !tag || !paymentMethod) {
      alert('Please fill all fields');
      return;
    }
    await addExpense(title, amount, tag, paymentMethod);
    setTitle('');
    setAmount(0);
    setTag('');
    setPaymentMethod('');
  };

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
              <IonCard className="expense-card">
                <IonCardContent>
                  <h3>Total Expenses</h3>
                  <p className="expense-amount">${totalExpenses.toFixed(2)}</p>
                </IonCardContent>
              </IonCard>
            </IonCol>
          </IonRow>
          <IonRow>
            <IonCol size="12">
              <h3>Record Expense</h3>
              <IonItem>
                <IonInput placeholder="Title" value={title} onIonChange={(e) => setTitle(e.detail.value!)} />
              </IonItem>
              <IonItem>
                <IonInput placeholder="Amount" type="number" value={amount} onIonChange={(e) => setAmount(parseFloat(e.detail.value!))} />
              </IonItem>
              <IonItem>
                <IonInput placeholder="Tag" value={tag} onIonChange={(e) => setTag(e.detail.value!)} />
              </IonItem>
              <IonItem>
                <IonInput placeholder="Payment Method" value={paymentMethod} onIonChange={(e) => setPaymentMethod(e.detail.value!)} />
              </IonItem>
              <IonButton expand="full" onClick={handleAddExpense}>Add Expense</IonButton>
            </IonCol>
          </IonRow>
        </IonGrid>
      </IonContent>
    </IonPage>
  );
};

export default Home;
