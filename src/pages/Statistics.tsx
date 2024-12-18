import React, { useEffect, useState } from 'react';
import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonList, IonItem, IonLabel, IonButton, IonIcon, IonGrid, IonRow, IonCol } from '@ionic/react';
import { Pie } from 'react-chartjs-2';
import 'chart.js/auto';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { getFirestore, doc, getDoc, collection, onSnapshot, query, orderBy } from 'firebase/firestore';
import { useHistory } from 'react-router-dom';
import { wallet, home, fastFood, carSport, alarm } from 'ionicons/icons';
import FloatingMenuButton from '../components/FloatingMenuButton';
import NavBar from '../components/NavBar';
import './css/Statistics.css';

const Statistics: React.FC = () => {
  const [transactions, setTransactions] = useState<any[]>([]);
  const [categoryBudgets, setCategoryBudgets] = useState<{ [key: string]: number }>({});
  const [totalBudget, setTotalBudget] = useState(0);
  const [loading, setLoading] = useState(true);
  const auth = getAuth();
  const db = getFirestore();
  const history = useHistory();

  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
      if (user) {
        const userId = user.uid;

        // Fetch budget data
        const budgetDocRef = doc(db, `users/${userId}/budget`, 'current');
        getDoc(budgetDocRef).then((budgetDoc) => {
          if (budgetDoc.exists()) {
            const budgetData = budgetDoc.data();
            setTotalBudget(budgetData?.totalBudget || 0);
            setCategoryBudgets(budgetData?.categoryBudgets || {});
          }
        });

        // Fetch transaction data
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
          setLoading(false);
        });

        return () => unsubscribe();
      } else {
        setLoading(false);
      }
    });

    return () => unsubscribeAuth();
  }, [auth, db]);

  const calculateData = () => {
    const tagAmounts: { [key: string]: number } = {};

    transactions.forEach((transaction) => {
      if (tagAmounts[transaction.tag]) {
        tagAmounts[transaction.tag] += transaction.amount;
      } else {
        tagAmounts[transaction.tag] = transaction.amount;
      }
    });

    const labels = Object.keys(tagAmounts);
    const data = Object.values(tagAmounts);

    return {
      labels,
      datasets: [
        {
          data,
          backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF'],
          hoverBackgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF'],
        },
      ],
    };
  };

//   const calculateTagTotals = () => {
//     const tagAmounts: { [key: string]: number } = {};
//
//     transactions.forEach((transaction) => {
//       if (tagAmounts[transaction.tag]) {
//         tagAmounts[transaction.tag] += transaction.amount;
//       } else {
//         tagAmounts[transaction.tag] = transaction.amount;
//       }
//     });
//
//     return tagAmounts;
//   };
//
//   const tagTotals = calculateTagTotals();
const calculateTagTotals = () => {
  const tagAmounts: { [key: string]: number } = {};

  // Get the current date and the start of the current month
  const currentDate = new Date();
  const currentMonth = currentDate.getMonth(); // 0-based index (0 = January, 11 = December)
  const currentYear = currentDate.getFullYear();

  transactions.forEach((transaction) => {
    const transactionDate = new Date(transaction.date); // Assuming `transaction.date` is in a valid date format

    // Check if the transaction is in the current month and year
    if (transactionDate.getMonth() === currentMonth && transactionDate.getFullYear() === currentYear) {
      if (tagAmounts[transaction.tag]) {
        tagAmounts[transaction.tag] += transaction.amount;
      } else {
        tagAmounts[transaction.tag] = transaction.amount;
      }
    }
  });

  return tagAmounts;
};

const tagTotals = calculateTagTotals();

  // Function to return icon based on category/tag
  const getCategoryIcon = (tag: string) => {
    switch (tag) {
      case 'Food':
        return fastFood;
      case 'Transport':
        return carSport;
      case 'Housing':
        return home;
      case 'Entertainment':
        return wallet;
      default:
        return alarm;
    }
  };

  if (loading) {
    return (
      <IonPage>
        <IonHeader>
          <IonToolbar>
            <IonTitle>Monthly Spending</IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonContent>
          <div className="loading-container">Loading...</div>
        </IonContent>
      </IonPage>
    );
  }

  // Navigate to budgeting page
  const navigateToBudgeting = () => {
    history.push('/budgeting');
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Monthly Spending</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent fullscreen className="statistics-container">
        {/* Render Pie Chart */}
        <div className="chart-container">
          <Pie data={calculateData()} />
        </div>

        <h2 className="h2-text">Spending for the Month</h2>

        <div className="budget-container">
          {Object.entries(categoryBudgets).map(([category, budget]) => {
            const actualSpending = tagTotals[category] || 0;
            const percentage = (actualSpending / budget) * 100;

            // Get icon based on category
            const icon = getCategoryIcon(category); // A function you should define to match each category with an icon

            // Determine if actualSpending exceeds budget
            const isOverBudget = actualSpending > budget;
            console.log(isOverBudget);

            return (
                <>
                <div className="icon grid-item">
                     <IonIcon icon={icon} /> {/* Add icon to the left side */}
                </div>
                <div className="category grid-item">{category}</div>
                <div className="actual-spending grid-item">
                  <span
                  className={`spending-amount ${
                    isOverBudget ? "over-budget" : ""
                  }`}
                >
                  RM {actualSpending.toFixed(2)}
                </span>
                  <div className="budget-text">/ RM {budget.toFixed(2)}</div>
                </div>
                </>
            );
          })}
        </div>




        {/* Floating button */}
        <FloatingMenuButton />

        {/* Budgeting Button at the bottom */}
        <div className="budgeting-button-container">
          <IonButton
            expand="block"
            onClick={navigateToBudgeting}
            className="budgeting-button"
          >
            Go to Budgeting
          </IonButton>
        </div>
      </IonContent>

      <NavBar />
    </IonPage>
  );
};

export default Statistics;
