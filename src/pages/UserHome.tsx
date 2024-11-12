import React, { useEffect, useState } from 'react';
import { IonPage, IonContent, IonHeader, IonToolbar, IonTitle, IonGrid, IonRow, IonCol, IonCard, IonCardContent, IonItem, IonInput, IonButton } from '@ionic/react';
import { getAuth } from 'firebase/auth';
import { getFirestore, collection, addDoc, onSnapshot } from 'firebase/firestore';
import './css/UserHome.css';

const UserHome: React.FC = () => {
  const [totalExpenses, setTotalExpenses] = useState(0);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState<number | ''>('');
  const [tag, setTag] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('');
  
  const auth = getAuth();
  const db = getFirestore();
  const userId = auth.currentUser?.uid; // Ensure the user is logged in

  useEffect(() => {
    if (!userId) return;

    const expensesRef = collection(db, `users/${userId}/expenses`);

    // Set up a real-time listener for the expenses collection
    const unsubscribe = onSnapshot(expensesRef, (snapshot) => {
      let expensesSum = 0;
      const expenseList: any[] = [];
      
      snapshot.docs.forEach((doc) => {
        const expenseData = doc.data();
        if (expenseData.amount) {
          expensesSum += expenseData.amount;
        }
        expenseList.push({ id: doc.id, ...expenseData });
      });
      
      setTotalExpenses(expensesSum);
      setTransactions(expenseList);
    });

    return () => unsubscribe();
  }, [userId]);

  // Function to add a new expense
  const handleAddExpense = async () => {
    if (!userId || amount === '' || title === '' || tag === '' || paymentMethod === '') return;

    const expensesRef = collection(db, `users/${userId}/expenses`);

    try {
      await addDoc(expensesRef, {
        title,
        amount: Number(amount),
        tag,
        paymentMethod,
        date: new Date().toISOString()
      });
      // Clear input fields after adding
      setTitle('');
      setAmount('');
      setTag('');
      setPaymentMethod('');
    } catch (error) {
      console.error("Error adding expense:", error);
    }
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
                  <h2>Total Expenses</h2>
                  <p className="balance-amount">${totalExpenses.toFixed(2)}</p>
                </IonCardContent>
              </IonCard>
            </IonCol>
          </IonRow>

          {/* Expense Form */}
          <IonRow>
            <IonCol size="12">
              <IonCard>
                <IonCardContent>
                  <h3>Add New Expense</h3>
                  <IonItem>
                    <IonInput
                      value={title}
                      placeholder="Title"
                      onIonChange={(e) => setTitle(e.detail.value!)}
                      required
                    />
                  </IonItem>
                  <IonItem>
                    <IonInput
                      type="number"
                      value={amount}
                      placeholder="Amount"
                      onIonChange={(e) => setAmount(parseFloat(e.detail.value!))}
                      required
                    />
                  </IonItem>
                  <IonItem>
                    <IonInput
                      value={tag}
                      placeholder="Tag"
                      onIonChange={(e) => setTag(e.detail.value!)}
                      required
                    />
                  </IonItem>
                  <IonItem>
                    <IonInput
                      value={paymentMethod}
                      placeholder="Payment Method"
                      onIonChange={(e) => setPaymentMethod(e.detail.value!)}
                      required
                    />
                  </IonItem>
                  <IonButton expand="full" onClick={handleAddExpense}>
                    Add Expense
                  </IonButton>
                </IonCardContent>
              </IonCard>
            </IonCol>
          </IonRow>

          {/* Display Transactions */}
          <IonRow>
            <IonCol size="12">
              <IonCard className="transactions-card">
                <IonCardContent>
                  <h3>Transaction History</h3>
                  {transactions.length > 0 ? (
                    transactions.map((transaction) => (
                      <IonItem key={transaction.id}>
                        <div>
                          <h4>{transaction.title}</h4>
                          <p>Amount: ${transaction.amount}</p>
                          <p>Tag: {transaction.tag}</p>
                          <p>Payment Method: {transaction.paymentMethod}</p>
                          <p>Date: {new Date(transaction.date).toLocaleDateString()}</p>
                        </div>
                      </IonItem>
                    ))
                  ) : (
                    <p>No transactions recorded.</p>
                  )}
                </IonCardContent>
              </IonCard>
            </IonCol>
          </IonRow>
        </IonGrid>
      </IonContent>
    </IonPage>
  );
};

export default UserHome;
