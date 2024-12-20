import React, { useEffect, useState } from 'react';
import { tagIcons } from './TransactionIcons'; // Import the icons
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
  IonButton,
  IonIcon,
} from '@ionic/react';
import { eyeOutline, eyeOffOutline } from 'ionicons/icons';
import { getAuth } from 'firebase/auth';
import { getFirestore, doc, getDoc, collection, onSnapshot, query, orderBy, where } from 'firebase/firestore';
import { useHistory } from 'react-router-dom';
import './css/UserHome.css';
import FloatingMenuButton from '../components/FloatingMenuButton';
import NavBar from '../components/NavBar';


const UserHome: React.FC = () => {
  const [transactions, setTransactions] = useState<any[]>([]);
  const [totalExpenses, setTotalExpenses] = useState(0);
  const [totalIncome, setTotalIncome] = useState(0);
  const [userId, setUserId] = useState<string | null>(null);
  const [userName, setUserName] = useState('User');
  const [currentSavings, setCurrentSavings] = useState(0);
  const [isAmountVisible, setIsAmountVisible] = useState(true);
  const [monthlyExpenses, setMonthlyExpenses] = useState(0);
  const [monthlyIncome, setMonthlyIncome] = useState(0);
  const [recentTransactions, setRecentTransactions] = useState<any[]>([]);


  const auth = getAuth();
  const db = getFirestore();
  const history = useHistory();

 // Function to get greeting based on time of day
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  };

    const formatAmount = (amount: number) => {
      return new Intl.NumberFormat('en-MY', {
        style: 'currency',
        currency: 'MYR',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      }).format(amount).replace('MYR', 'RM');
    };

  // Get current month's date range
  const getCurrentMonthRange = () => {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);
    return { startOfMonth, endOfMonth };
  };

  useEffect(() => {
    const user = auth.currentUser;
    if (user) {
      setUserId(user.uid);
      fetchUserData(user.uid);
    }
  }, [auth]);

  // Recalculate current savings whenever totalIncome or totalExpenses changes
    useEffect(() => {
      setCurrentSavings(totalIncome - totalExpenses);
    }, [totalIncome, totalExpenses]);

  const fetchUserData = async (uid: string) => {
    // Fetch user details
    const userRef = doc(db, 'users', uid);
    const userDoc = await getDoc(userRef);
    if (userDoc.exists()) {
      setUserName(userDoc.data()?.username || 'User');
    }

    // Set up listeners for transactions
    const { startOfMonth, endOfMonth } = getCurrentMonthRange();

    // Fetch Expenses
    const expensesRef = query(
      collection(db, `users/${uid}/expenses`),
      orderBy('date', 'desc')
    );

    const unsubscribeExpenses = onSnapshot(expensesRef, (snapshot) => {
      let total = 0;
      const expensesList = snapshot.docs.map(doc => {
        const data = doc.data();
        if (data.amount) total += data.amount;
        return {
          id: doc.id,
          ...data,
          type: 'Expense'
        };
      });
      setTotalExpenses(total);
      updateTransactions([...expensesList]);
    });

    // Fetch Incomes
    const incomesRef = query(
      collection(db, `users/${uid}/incomes`),
      orderBy('date', 'desc')
    );

    const unsubscribeIncomes = onSnapshot(incomesRef, (snapshot) => {
      let total = 0;
      const incomesList = snapshot.docs.map(doc => {
        const data = doc.data();
        if (data.amount) total += data.amount;
        return {
          id: doc.id,
          ...data,
          type: 'Income'
        };
      });
      setTotalIncome(total);
      updateTransactions(prevTransactions => [...prevTransactions, ...incomesList]);
    });

    return () => {
      unsubscribeExpenses();
      unsubscribeIncomes();
    };
  };

  const updateTransactions = (newTransactions: any[]) => {
    // Sort transactions by date (newest first) and take only the first 3
    const sortedTransactions = newTransactions
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, 3);
    setTransactions(sortedTransactions);
  };

  // Transaction item component
  const TransactionItem: React.FC<{ transaction: any }> = ({ transaction }) => (
    <IonItem className="transaction-row">
      <div className="transaction-content">
        <div className="transaction-left">
          <h3 className="transaction-title">{transaction.title}</h3>
          <span className="transaction-date">
            {new Date(transaction.date).toLocaleDateString()}
          </span>
        </div>

        <div className="transaction-right">
          <span className="transaction-payment">{transaction.paymentMethod}</span>
          <span className={`transaction-amount ${
            transaction.type === 'Income' ? 'positive' : 'negative'
          }`}>
            {transaction.type === 'Income' ? '+' : '-'}
            RM{transaction.amount}
          </span>
        </div>
      </div>
    </IonItem>
  );

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar color="primary">
          <IonTitle>Home</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent fullscreen className="home-content">
        <IonGrid className="home-grid">
          {/* Welcome Section with Savings */}
                    <IonRow>
                      <IonCol size="12" className="welcome-section">
                        <div className="greeting-container">
                           <span className="greeting-text">{getGreeting()},</span>
                           <span className="user-name"> {userName}!</span>


                          <div className="savings-container">
                            <div className="savings-text">
                              <span>Current Balance: </span>
                              <span className={`amount ${!isAmountVisible ? 'blurred' : ''}`}>
                                {formatAmount(currentSavings)}
                              </span>
                              <IonIcon
                                icon={isAmountVisible ? eyeOutline : eyeOffOutline}
                                onClick={() => setIsAmountVisible(!isAmountVisible)}
                                className="eye-icon"
                              />
                            </div>
                          </div>
                        </div>
                      </IonCol>
                    </IonRow>



           {/* Monthly Summary Card */}
              <IonRow>
                <IonCol size="12">
                  <IonCard className="monthly-summary-card">
                    <IonCardContent>
                      <h2>{new Date().toLocaleString('default', { month: 'long' })} {new Date().getFullYear()}</h2>
                      <div className="summary-grid">
                        <div className="income-summary">
                          <h3>Total Income</h3>
                          <p className="income-amount">{formatAmount(totalIncome)}</p>
                        </div>
                        <div className="expenses-summary">
                          <h3>Total Expenses</h3>
                           <p className="expense-amount">{formatAmount(totalExpenses)}</p>
                        </div>
                      </div>
                    </IonCardContent>
                  </IonCard>
                </IonCol>
              </IonRow>

               {/* Recent Transactions Card */}
                        <IonRow>
                          <IonCol size="12">
                            <IonCard className="transactions-card">
                              <IonCardContent>
                                <div className="transactions-header">
                                  <h2>Recent Transactions</h2>
                                  <IonButton
                                    fill="clear"
                                    onClick={() => history.push('/transactionhistory')}
                                  >
                                    View More
                                  </IonButton>
                                </div>
                                {transactions.length > 0 ? (
                                  transactions.map((transaction) => (
                                    <IonItem key={transaction.id} className="transaction-row">
                                      <div className="transaction-icon-wrapper">
                                        <IonIcon
                                          icon={transaction.tag ? (tagIcons[transaction.tag] || tagIcons.default) : tagIcons.default}
                                          className="category-icon"
                                        />
                                      </div>
                                      <div className="transaction-content">
                                        <div className="transaction-left">
                                          <h3 className="transaction-title">{transaction.title}</h3>
                                          <span className="transaction-date">
                                            {new Date(transaction.date).toLocaleDateString()}
                                          </span>
                                        </div>
                                        <div className="transaction-right">
                                          <span className="transaction-payment">{transaction.paymentMethod}</span>
                                          <span className={`transaction-amount ${
                                            transaction.type === 'Income' ? 'positive' : 'negative'
                                          }`}>
                                            {transaction.type === 'Income' ? '+' : '-'}
                                             {formatAmount(Math.abs(transaction.amount))}
                                          </span>
                                        </div>
                                      </div>
                                    </IonItem>
                                  ))
                                ) : (
                                  <p>No recent transactions</p>
                                )}
                              </IonCardContent>
                            </IonCard>
                          </IonCol>
                        </IonRow>
        </IonGrid>

        <FloatingMenuButton />
        <NavBar />
      </IonContent>
    </IonPage>
  );
};

export default UserHome;