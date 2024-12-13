// import React, { useEffect, useState } from 'react';
// import { IonPage, IonContent, IonHeader, IonToolbar, IonTitle, IonGrid, IonRow, IonCol, IonCard, IonCardContent, IonItem, IonInput, IonButton, IonModal } from '@ionic/react';
// import { getAuth } from 'firebase/auth';
// import { getFirestore, collection, addDoc, onSnapshot, doc, setDoc, getDoc } from 'firebase/firestore';
// import './css/UserHome.css';
//
// const Budgeting: React.FC = () => {
//   const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
//   const [categoryBudgets, setCategoryBudgets] = useState<{ [key: string]: number }>({});
//   const [totalBudget, setTotalBudget] = useState<number | ''>('');
//   const [incomeTotal, setIncomeTotal] = useState(0);
//   const [expenseTotal, setExpenseTotal] = useState(0);
//   const [balance, setBalance] = useState(0);
//
//   const auth = getAuth();
//   const db = getFirestore();
//   const userId = auth.currentUser?.uid;
//
//   // Load data
//   useEffect(() => {
//     if (!userId) return;
//
//     const loadBudgetData = async () => {
//       const budgetDocRef = doc(db, `users/${userId}/budget`, 'current');
//       const budgetDoc = await getDoc(budgetDocRef);
//       if (budgetDoc.exists()) {
//         const budgetData = budgetDoc.data();
//         setTotalBudget(budgetData?.totalBudget || '');
//         setCategoryBudgets(budgetData?.categoryBudgets || {});
//       }
//     };
//
//     const loadTransactionData = () => {
//       const incomeRef = collection(db, `users/${userId}/incomes`);
//       const expenseRef = collection(db, `users/${userId}/expenses`);
//
//       onSnapshot(incomeRef, (snapshot) => {
//         const totalIncome = snapshot.docs.reduce((sum, doc) => sum + (doc.data().amount || 0), 0);
//         setIncomeTotal(totalIncome);
//       });
//
//       onSnapshot(expenseRef, (snapshot) => {
//         const totalExpense = snapshot.docs.reduce((sum, doc) => sum + (doc.data().amount || 0), 0);
//         setExpenseTotal(totalExpense);
//       });
//     };
//
//     loadBudgetData();
//     loadTransactionData();
//   }, [userId]);
//
//   useEffect(() => {
//     setBalance(incomeTotal - expenseTotal);
//   }, [incomeTotal, expenseTotal]);
//
//   const handleSaveBudget = async () => {
//     if (!userId) return;
//
//     const budgetDocRef = doc(db, `users/${userId}/budget`, 'current');
//     try {
//       await setDoc(budgetDocRef, {
//         totalBudget: Number(totalBudget),
//         categoryBudgets,
//       });
//       alert('Budget saved successfully!');
//     } catch (error) {
//       console.error('Error saving budget:', error);
//     }
//   };
//
//   const handleCategoryBudgetChange = (category: string, amount: number) => {
//     setCategoryBudgets({
//       ...categoryBudgets,
//       [category]: amount,
//     });
//     setSelectedCategory(null); // Close modal after setting budget
//   };
//
//   return (
//     <IonPage>
//       <IonHeader>
//         <IonToolbar color="primary">
//           <IonTitle>Budgeting</IonTitle>
//         </IonToolbar>
//       </IonHeader>
//       <IonContent fullscreen className="budgeting-content">
//         {/* Balance Display */}
//         <IonCard color="secondary" className="balance-card">
//           <IonCardContent>
//             <h3>Total Income: <strong>${incomeTotal.toFixed(2)}</strong></h3>
//             <h3>Total Expenses: <strong>${expenseTotal.toFixed(2)}</strong></h3>
//             <h2>Balance: <strong>${balance.toFixed(2)}</strong></h2>
//           </IonCardContent>
//         </IonCard>
//
//         <IonGrid>
//           {/* Menu Buttons */}
//           <IonRow>
//             {['Food', 'Transport', 'Entertainment', 'Bills', 'Other'].map((category) => (
//               <IonCol size="6" key={category}>
//                 <IonButton
//                   expand="block"
//                   onClick={() => setSelectedCategory(category)}
//                 >
//                   {category}
//                 </IonButton>
//               </IonCol>
//             ))}
//           </IonRow>
//
//           {/* Dynamically Display Budgets */}
//           <IonRow>
//             {Object.keys(categoryBudgets).map((category) => (
//               <IonCol size="12" key={category}>
//                 <IonCard>
//                   <IonCardContent>
//                     <h4>
//                       Budgeting for {category}: <strong>${categoryBudgets[category]}</strong>
//                     </h4>
//                   </IonCardContent>
//                 </IonCard>
//               </IonCol>
//             ))}
//           </IonRow>
//         </IonGrid>
//
//
//         {/* Modal for Setting Category Budget */}
// <IonModal isOpen={!!selectedCategory}>
//   <IonCard>
//     <IonCardContent>
//       <h3>Set Budget for {selectedCategory}</h3>
//       <IonItem>
//         <IonInput
//           type="number"
//           placeholder="Enter amount"
//           onIonChange={(e) => setCategoryBudgets({
//             ...categoryBudgets,
//             [selectedCategory!]: parseFloat(e.detail.value!) || 0,
//           })}
//         />
//       </IonItem>
//       <IonRow>
//         {/* Save Button */}
//         <IonCol>
//           <IonButton
//             expand="full"
//             onClick={() => setSelectedCategory(null)}
//           >
//             Save
//           </IonButton>
//         </IonCol>
//         {/* Close Button */}
//         <IonCol>
//           <IonButton
//             expand="full"
//             color="light"
//             onClick={() => setSelectedCategory(null)}
//           >
//             Close
//           </IonButton>
//         </IonCol>
//       </IonRow>
//     </IonCardContent>
//   </IonCard>
// </IonModal>
//       </IonContent>
//     </IonPage>
//   );
// };
//
// export default Budgeting;

import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { IonPage, IonContent, IonHeader, IonToolbar, IonTitle, IonGrid, IonRow, IonCol, IonCard, IonCardContent, IonItem, IonInput, IonButton, IonModal, IonBackButton, IonButtons, IonRange, IonLabel, IonAlert } from '@ionic/react';
import { getAuth } from 'firebase/auth';
import { getFirestore, doc, setDoc, getDoc, collection, onSnapshot } from 'firebase/firestore';
import './css/UserHome.css';

const Budgeting: React.FC = () => {
  const [categoryBudgets, setCategoryBudgets] = useState<{ [key: string]: number }>({});
  const [totalBudget, setTotalBudget] = useState<number>(0);
  const [incomeTotal, setIncomeTotal] = useState(0);
  const [expenseTotal, setExpenseTotal] = useState(0);
  const [balance, setBalance] = useState(0);
  const [editMode, setEditMode] = useState(false);
  const [showAlert, setShowAlert] = useState(false); // Alert for budget exceeding total

  const auth = getAuth();
  const db = getFirestore();
  const userId = auth.currentUser?.uid;

  const history = useHistory(); // Hook for navigation

  useEffect(() => {
    if (!userId) return;

    const loadBudgetData = async () => {
      const budgetDocRef = doc(db, `users/${userId}/budget`, 'current');
      const budgetDoc = await getDoc(budgetDocRef);
      if (budgetDoc.exists()) {
        const budgetData = budgetDoc.data();
        setTotalBudget(budgetData?.totalBudget || 0);
        setCategoryBudgets(budgetData?.categoryBudgets || {});
      }
    };

    const loadTransactionData = () => {
      const incomeRef = collection(db, `users/${userId}/incomes`);
      const expenseRef = collection(db, `users/${userId}/expenses`);

      onSnapshot(incomeRef, (snapshot) => {
        const totalIncome = snapshot.docs.reduce((sum, doc) => sum + (doc.data().amount || 0), 0);
        setIncomeTotal(totalIncome);
      });

      onSnapshot(expenseRef, (snapshot) => {
        const totalExpense = snapshot.docs.reduce((sum, doc) => sum + (doc.data().amount || 0), 0);
        setExpenseTotal(totalExpense);
      });
    };

    loadBudgetData();
    loadTransactionData();
  }, [userId]);

  useEffect(() => {
    setBalance(incomeTotal - expenseTotal);
  }, [incomeTotal, expenseTotal]);

  const handleSaveBudget = async () => {
    if (!userId) return;

    const totalCategoryBudget = Object.values(categoryBudgets).reduce((sum, value) => sum + value, 0);
    if (totalCategoryBudget > totalBudget) {
      setShowAlert(true); // Show alert if total exceeds budget
      return;
    }

    const budgetDocRef = doc(db, `users/${userId}/budget`, 'current');
    try {
      await setDoc(budgetDocRef, {
        totalBudget,
        categoryBudgets,
      });
      alert('Budget saved successfully!');
      setEditMode(false); // Close the modal after saving
    } catch (error) {
      console.error('Error saving budget:', error);
    }
  };

  const handleCategoryBudgetChange = (category: string, amount: number) => {
    const updatedBudgets = {
      ...categoryBudgets,
      [category]: amount,
    };
    setCategoryBudgets(updatedBudgets);
  };

  const navigateToStatistics = () => {
    history.push('/statistics');
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar color="primary">
          <IonButtons slot="start">
            <IonBackButton text="Back" />
            <IonButton onClick={navigateToStatistics} size="small" style={{ marginLeft: '10px', backgroundColor: 'green', color: 'white' }}>
              Go to Statistics page
            </IonButton>
          </IonButtons>
          <IonTitle>Budgeting</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen className="budgeting-content">
        <IonCard color="secondary" className="balance-card">
          <IonCardContent>
            <h3>Total Budget: <strong>${totalBudget.toFixed(2)}</strong></h3>
            <h3>Total Income: <strong>${incomeTotal.toFixed(2)}</strong></h3>
            <h3>Total Expenses: <strong>${expenseTotal.toFixed(2)}</strong></h3>
            <h2>Balance: <strong>${balance.toFixed(2)}</strong></h2>
          </IonCardContent>
        </IonCard>

        <IonGrid>
          {Object.keys(categoryBudgets).map((category) => (
            <IonRow key={category}>
              <IonCol size="6">
                <strong>{category}</strong>
              </IonCol>
              <IonCol size="6">
                ${categoryBudgets[category]} ({((categoryBudgets[category] / totalBudget) * 100).toFixed(2)}%)
              </IonCol>
            </IonRow>
          ))}
        </IonGrid>

        <IonButton expand="block" onClick={() => setEditMode(true)}>Edit Budget</IonButton>

        <IonModal isOpen={editMode} onDidDismiss={() => setEditMode(false)}>
          <IonContent>
            <IonCard>
              <IonCardContent>
                <h3>Edit Total Budget</h3>
                <IonItem>
                  <IonInput
                    type="number"
                    value={totalBudget}
                    onIonChange={(e) => setTotalBudget(parseFloat(e.detail.value!) || 0)}
                  />
                </IonItem>

                <h3>Allocate Budget by Category</h3>
                {['Food', 'Transport', 'Entertainment', 'Bills', 'Other'].map((category) => (
                  <IonItem key={category}>
                    <IonLabel slot="start">{category}</IonLabel>
                    <IonInput
                      type="number"
                      value={categoryBudgets[category] || 0}
                      onIonChange={(e) => handleCategoryBudgetChange(category, parseFloat(e.detail.value!) || 0)}
                      style={{ width: '60px', textAlign: 'right' }}
                    />
                    <IonRange
                      min={0}
                      max={Math.max(0, totalBudget - Object.values(categoryBudgets).reduce((sum, value) => sum + value, 0) + (categoryBudgets[category] || 0))}
                      step={10}
                      value={categoryBudgets[category] || 0}
                      onIonChange={(e) => handleCategoryBudgetChange(category, parseFloat(e.detail.value as string))}
                    />
                    <div slot="end">
                      ${categoryBudgets[category] || 0} ({totalBudget > 0 ? ((categoryBudgets[category] / totalBudget) * 100).toFixed(2) : 0}%)
                    </div>
                  </IonItem>
                ))}

                <IonButton expand="block" onClick={handleSaveBudget}>Confirm</IonButton>
                <IonButton expand="block" color="light" onClick={() => setEditMode(false)}>Cancel</IonButton>
              </IonCardContent>
            </IonCard>
          </IonContent>
        </IonModal>

        <IonAlert
          isOpen={showAlert}
          onDidDismiss={() => setShowAlert(false)}
          header="Budget Error"
          message="The total of your category budgets exceeds the total budget!"
          buttons={["OK"]}
        />
      </IonContent>
    </IonPage>
  );
};

export default Budgeting;
