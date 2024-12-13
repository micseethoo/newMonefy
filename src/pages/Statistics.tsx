// import React, { useEffect, useState } from 'react';
// import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonList, IonItem, IonLabel } from '@ionic/react';
// import { Pie } from 'react-chartjs-2';
// import 'chart.js/auto';
// import { getAuth, onAuthStateChanged } from 'firebase/auth';
// import { getFirestore, collection, onSnapshot, query, orderBy } from 'firebase/firestore';
// import FloatingMenuButton from '../components/FloatingMenuButton';
// import NavBar from '../components/NavBar';
// import './css/Statistics.css';
//
// const Statistics: React.FC = () => {
//   const [transactions, setTransactions] = useState<any[]>([]);
//   const [loading, setLoading] = useState(true); // Loading state
//   const auth = getAuth();
//   const db = getFirestore();
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
//       </IonContent>
//
//       <NavBar />
//     </IonPage>
//   );
// };
//
// export default Statistics;
//

import React, { useEffect, useState } from 'react';
import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonList, IonItem, IonLabel, IonButton } from '@ionic/react';
import { Pie } from 'react-chartjs-2';
import 'chart.js/auto';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { getFirestore, collection, onSnapshot, query, orderBy } from 'firebase/firestore';
import { useHistory } from 'react-router-dom'; // Added for navigation
import FloatingMenuButton from '../components/FloatingMenuButton';
import NavBar from '../components/NavBar';
import './css/Statistics.css';

const Statistics: React.FC = () => {
  const [transactions, setTransactions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true); // Loading state
  const auth = getAuth();
  const db = getFirestore();
  const history = useHistory(); // Initialize history for navigation

  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
      if (user) {
        const userId = user.uid;

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
          setLoading(false); // Stop loading when data is fetched
        });

        // Cleanup Firestore listener
        return () => unsubscribe();
      } else {
        setLoading(false); // Stop loading if user is not authenticated
      }
    });

    // Cleanup authentication listener
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
    history.push('/budgeting'); // Change to your budgeting page path
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

        {/* Render Spending by Tag */}
        <div className="tag-totals">
          <h2>Spending by Tag</h2>
          <IonList>
            {Object.entries(tagTotals).map(([tag, total]) => (
              <IonItem key={tag}>
                <IonLabel>
                  <strong>{tag}:</strong> RM {total.toFixed(2)}
                </IonLabel>
              </IonItem>
            ))}
          </IonList>
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
