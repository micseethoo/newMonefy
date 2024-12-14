// import React, { useEffect, useState } from 'react';
// import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonList, IonItem, IonLabel, IonButton, IonIcon } from '@ionic/react';
// import { Pie } from 'react-chartjs-2';
// import 'chart.js/auto';
// import { getAuth, onAuthStateChanged } from 'firebase/auth';
// import { getFirestore, collection, onSnapshot, query, orderBy } from 'firebase/firestore';
// import { useHistory } from 'react-router-dom'; // Added for navigation
// import { wallet, home, fastFood, carSport, alarm } from 'ionicons/icons'; // Add Ionicons here
// import FloatingMenuButton from '../components/FloatingMenuButton';
// import NavBar from '../components/NavBar';
// import './css/Statistics.css';
//
// const Statistics: React.FC = () => {
//   const [transactions, setTransactions] = useState<any[]>([]);
//   const [loading, setLoading] = useState(true); // Loading state
//   const auth = getAuth();
//   const db = getFirestore();
//   const history = useHistory(); // Initialize history for navigation
//
//   useEffect(() => {
//     const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
//       if (user) {
//         const userId = user.uid;
//
//         const expensesRef = query(
//           collection(db, `users/${userId}/expenses`),
//           orderBy('date', 'desc')
//         );
//
//         const unsubscribe = onSnapshot(expensesRef, (snapshot) => {
//           const expenseList: any[] = [];
//           snapshot.docs.forEach((doc) => {
//             expenseList.push({ id: doc.id, ...doc.data() });
//           });
//           setTransactions(expenseList);
//           setLoading(false); // Stop loading when data is fetched
//         });
//
//         // Cleanup Firestore listener
//         return () => unsubscribe();
//       } else {
//         setLoading(false); // Stop loading if user is not authenticated
//       }
//     });
//
//     // Cleanup authentication listener
//     return () => unsubscribeAuth();
//   }, [auth, db]);
//
//   const calculateData = () => {
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
//     const labels = Object.keys(tagAmounts);
//     const data = Object.values(tagAmounts);
//
//     return {
//       labels,
//       datasets: [
//         {
//           data,
//           backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF'],
//           hoverBackgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF'],
//         },
//       ],
//     };
//   };
//
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
//
//   // Function to return icon based on category/tag
//   const getCategoryIcon = (tag: string) => {
//     switch (tag) {
//       case 'Food':
//         return fastFood;
//       case 'Transport':
//         return carSport;
//       case 'Housing':
//         return home;
//       case 'Entertainment':
//         return wallet;
//       default:
//         return alarm; // Default icon for uncategorized tags
//     }
//   };
//
//   if (loading) {
//     return (
//       <IonPage>
//         <IonHeader>
//           <IonToolbar>
//             <IonTitle>Monthly Spending</IonTitle>
//           </IonToolbar>
//         </IonHeader>
//         <IonContent>
//           <div className="loading-container">Loading...</div>
//         </IonContent>
//       </IonPage>
//     );
//   }
//
//   // Navigate to budgeting page
//   const navigateToBudgeting = () => {
//     history.push('/budgeting');
//   };
//
//   return (
//     <IonPage>
//       <IonHeader>
//         <IonToolbar>
//           <IonTitle>Monthly Spending</IonTitle>
//         </IonToolbar>
//       </IonHeader>
//
//       <IonContent fullscreen className="statistics-container">
//         {/* Render Pie Chart */}
//         <div className="chart-container">
//           <Pie data={calculateData()} />
//         </div>
//
//         {/* Render Spending by Tag */}
//         <div className="tag-totals">
//           <h2>Spending by Tag</h2>
//           <IonList>
//             {Object.entries(tagTotals).map(([tag, total]) => (
//               <IonItem key={tag}>
//                 <IonIcon icon={getCategoryIcon(tag)} slot="start" />
//                 <IonLabel>
//                   <strong>{tag}:</strong> RM {total.toFixed(2)}
//                 </IonLabel>
//               </IonItem>
//             ))}
//           </IonList>
//         </div>
//
//         {/* Floating button */}
//         <FloatingMenuButton />
//
//         {/* Budgeting Button at the bottom */}
//         <div className="budgeting-button-container">
//           <IonButton
//             expand="block"
//             onClick={navigateToBudgeting}
//             className="budgeting-button"
//           >
//             Go to Budgeting
//           </IonButton>
//         </div>
//       </IonContent>
//
//       <NavBar />
//     </IonPage>
//   );
// };
//
// export default Statistics;

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

        {/* Render Spending by Tag and Budget Side by Side */}
        <div className="spending-budget-grid">
          <IonGrid className="center-grid">
            <IonRow>
              <IonCol size="4" offset="4"> {/* Center the content by adding offset */}
                <h2>Budget vs Actual Spending</h2>
                <IonList>
                  {Object.entries(categoryBudgets).map(([category, budget]) => {
                    const actualSpending = tagTotals[category] || 0;
                    const percentage = (actualSpending / budget) * 100;

                    // Get icon based on category
                    const icon = getCategoryIcon(category); // A function you should define to match each category with an icon

                    return (
                      <IonItem key={category}>
                        <IonIcon icon={icon} slot="start" /> {/* Add icon to the left side */}
                        <IonLabel>
                          <div className="budget-item">
                            <span className="category">{category}: </span>
                            <span className="actual-amount">
                              RM {actualSpending.toFixed(2)} (Actual) /
                            </span>
                            <span className="budget-amount">
                              RM {budget.toFixed(2)} (Budget)
                            </span>
                            <span className="percentage">
                              {percentage > 0 ? `- ${percentage.toFixed(2)}%` : ''}
                            </span>
                          </div>
                        </IonLabel>
                      </IonItem>
                    );
                  })}
                </IonList>
              </IonCol>
            </IonRow>
          </IonGrid>
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
