import React, { useEffect, useState } from 'react';
import {
  IonPage,
  IonContent,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonGrid,
  IonRow,
  IonCol,
  IonCard,
  IonCardContent,
  IonItem,
  IonButton, // Import IonButton for the button
} from '@ionic/react';
import { getAuth } from 'firebase/auth';
import { getFirestore, doc, getDoc, collection, onSnapshot, query, orderBy } from 'firebase/firestore';
import { useHistory } from 'react-router-dom'; // Import useHistory for navigation
import './css/UserHome.css';
import FloatingMenuButton from '../components/FloatingMenuButton';
import NavBar from '../components/NavBar';

const UserHome: React.FC = () => {
  const [totalExpenses, setTotalExpenses] = useState(0);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [incomes, setIncomes] = useState<any[]>([]);
  const [userName, setUserName] = useState('User');
  const [userId, setUserId] = useState<string | null>(null);

  const auth = getAuth();
  const db = getFirestore();
  const history = useHistory(); // Initialize the useHistory hook

  useEffect(() => {
    const user = auth.currentUser;
    if (user) {
      setUserId(user.uid);

      // Fetch the user's username from Firestore
      const fetchUserName = async () => {
        const userRef = doc(db, 'users', user.uid); // Reference to the user's document
        const userDoc = await getDoc(userRef);

        if (userDoc.exists()) {
          const userData = userDoc.data();
          setUserName(userData?.username || user.displayName || 'User'); // Set username if available
        } else {
          setUserName(user.displayName || 'User'); // Fallback to displayName if no username
        }
      };

      fetchUserName(); // Call the function to fetch the username
    }
  }, [auth, db]);

  useEffect(() => {
    if (!userId) return;

    const expensesRef = query(
      collection(db, `users/${userId}/expenses`),
      orderBy('date', 'desc')
    );

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

  useEffect(() => {
    if (!userId) return;

    const incomesRef = query(
      collection(db, `users/${userId}/incomes`),
      orderBy('date', 'desc')
    );

    const unsubscribe = onSnapshot(incomesRef, (snapshot) => {
      const incomeList: any[] = [];

      snapshot.docs.forEach((doc) => {
        const incomeData = doc.data();
        incomeList.push({ id: doc.id, ...incomeData });
      });

      setIncomes(incomeList);
    });

    return () => unsubscribe();
  }, [userId]);

  const handleNavigateToTransactionHistory = () => {
    history.push('/transactionhistory'); // Navigate to the TransactionHistory page
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
              <IonCard className="welcome-card">
                <IonCardContent>
                  <h2>Welcome, {userName}!</h2> {/* Display the username here */}
                  <p>Here's an overview of your finances.</p>
                </IonCardContent>
              </IonCard>
            </IonCol>
          </IonRow>

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

          <IonRow>
            <IonCol size="12">
              <IonCard className="transactions-card">
                <IonCardContent>
                  <h3>Income History (Latest)</h3>
                  {incomes.length > 0 ? (
                    incomes.map((income, index) => (
                      <IonItem key={income.id}>
                        <div>
                          <h4>
                            {index + 1}. {income.title}
                          </h4>
                          <p>Amount: ${income.amount}</p>
                          <p>Description: {income.description || 'No description provided'}</p>
                          <p>
                            Date: {new Date(income.date).toLocaleDateString()} <br />
                            Time: {new Date(income.date).toLocaleTimeString()}
                          </p>
                        </div>
                      </IonItem>
                    ))
                  ) : (
                    <p>No income records.</p>
                  )}
                </IonCardContent>
              </IonCard>
            </IonCol>
          </IonRow>

          <IonRow>
            <IonCol size="12">
              <IonCard className="transactions-card">
                <IonCardContent>
                  <h3>Expense History (Latest)</h3>
                  {transactions.length > 0 ? (
                    transactions.map((transaction, index) => (
                      <IonItem key={transaction.id}>
                        <div>
                          <h4>
                            {index + 1}. {transaction.title}
                          </h4>
                          <p>Amount: ${transaction.amount}</p>
                          <p>Tag: {transaction.tag}</p>
                          <p>Payment Method: {transaction.paymentMethod}</p>
                          <p>Description: {transaction.description || 'No description provided'}</p>
                          <p>
                            Date: {new Date(transaction.date).toLocaleDateString()} <br />
                            Time: {new Date(transaction.date).toLocaleTimeString()}
                          </p>
                        </div>
                      </IonItem>
                    ))
                  ) : (
                    <p>No expense records.</p>
                  )}
                </IonCardContent>
              </IonCard>
            </IonCol>
          </IonRow>
        </IonGrid>

        {/* Add a button to navigate to the TransactionHistory page */}
        <IonRow className="ion-justify-content-center ion-align-items-center">
          <IonCol size="auto">
            <IonButton size="small" onClick={handleNavigateToTransactionHistory}>
              View Transaction History
            </IonButton>
          </IonCol>
        </IonRow>
      </IonContent>
      <FloatingMenuButton />
      <NavBar />
    </IonPage>
  );
};

export default UserHome;
