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
import { IonPage, IonContent, IonHeader, IonToolbar, IonTitle, IonGrid, IonRow, IonCol, IonCard, IonCardContent, IonItem, IonInput, IonButton, IonLabel, IonAlert, IonIcon, IonRange } from '@ionic/react';
import { getAuth } from 'firebase/auth';
import { getFirestore, collection, addDoc, onSnapshot, doc, setDoc, getDoc } from 'firebase/firestore';
import { Pie } from 'react-chartjs-2';
import Chart from 'chart.js/auto';
import { chevronForwardOutline } from 'ionicons/icons';
import './css/UserHome.css';

const Budgeting: React.FC = () => {
  const [isTotalBudgetSet, setIsTotalBudgetSet] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [categoryBudgets, setCategoryBudgets] = useState<{ [key: string]: number }>({});
  const [totalBudget, setTotalBudget] = useState<number | ''>('');  // Ensure totalBudget is a number or empty string
  const [incomeTotal, setIncomeTotal] = useState(0);
  const [expenseTotal, setExpenseTotal] = useState(0);
  const [balance, setBalance] = useState(0);
  const [showExceedAlert, setShowExceedAlert] = useState(false);
  const [exceedCategory, setExceedCategory] = useState<string | null>(null);
  const [sliderValues, setSliderValues] = useState<{ [key: string]: number }>({});

  const auth = getAuth();
  const db = getFirestore();
  const userId = auth.currentUser?.uid;

  // Load data
  useEffect(() => {
    if (!userId) return;

    const loadBudgetData = async () => {
      const budgetDocRef = doc(db, `users/${userId}/budget`, 'current');
      const budgetDoc = await getDoc(budgetDocRef);
      if (budgetDoc.exists()) {
        const budgetData = budgetDoc.data();
        setTotalBudget(budgetData?.totalBudget || '');  // Initialize totalBudget as string
        setCategoryBudgets(budgetData?.categoryBudgets || {});
        // Set initial slider values to the category budgets
        const initialSliderValues = Object.keys(budgetData?.categoryBudgets || {}).reduce((acc, category) => {
          acc[category] = budgetData.categoryBudgets[category] || 0;
          return acc;
        }, {});
        setSliderValues(initialSliderValues);
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
    if (totalCategoryBudget > Number(totalBudget)) {
      setShowExceedAlert(true);
      return;
    }

    const budgetDocRef = doc(db, `users/${userId}/budget`, 'current');
    try {
      await setDoc(budgetDocRef, {
        totalBudget: Number(totalBudget),  // Ensure totalBudget is used as a number
        categoryBudgets,
      });
      alert('Budget saved successfully!');
    } catch (error) {
      console.error('Error saving budget:', error);
    }
  };

  const handleCategoryBudgetChange = (category: string, amount: number) => {
    setCategoryBudgets({
      ...categoryBudgets,
      [category]: amount,
    });
  };

  const handleSliderChange = (category: string, value: number) => {
    setSliderValues({
      ...sliderValues,
      [category]: value,
    });
    handleCategoryBudgetChange(category, value);
  };

  const calculateCategoryPercentage = (category: string) => {
    const budgetAmount = categoryBudgets[category] || 0;
    const totalAmount = Number(totalBudget);  // Ensure totalBudget is a number for calculations
    return totalAmount > 0 ? (budgetAmount / totalAmount) * 100 : 0;
  };

  const chartData = {
    labels: Object.keys(categoryBudgets),
    datasets: [
      {
        data: Object.values(categoryBudgets),
        backgroundColor: [
          '#ff9999', '#66b3ff', '#99ff99', '#ffcc99', '#ffb3e6', '#ff6666',
        ],
        hoverBackgroundColor: [
          '#ff6666', '#3399ff', '#66ff66', '#ff9966', '#ff66b3', '#ff3333',
        ],
      },
    ],
  };

  const handleTotalBudgetChange = (e: any) => {
    setTotalBudget(e.detail.value);
  };

  const handleTotalBudgetInputChange = (e: any) => {
    const value = e.target.value;
    if (!isNaN(value)) {
      setTotalBudget(parseFloat(value));
    }
  };

  const handleCategoryBudgetInputChange = (category: string, e: any) => {
    const value = e.target.value;
    if (!isNaN(value)) {
      const updatedAmount = parseFloat(value);
      handleCategoryBudgetChange(category, updatedAmount);
      setSliderValues({
        ...sliderValues,
        [category]: updatedAmount,
      });
    }
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar color="primary">
          <IonTitle>Budgeting</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen className="budgeting-content">
        {/* Step 1: Set Total Budget */}
        {!isTotalBudgetSet ? (
          <IonCard color="secondary" className="total-budget-card" style={{ borderRadius: '15px', boxShadow: '0 5px 15px rgba(0,0,0,0.1)', padding: '15px' }}>
            <IonCardContent>
              <h3 style={{ fontSize: '18px', color: '#fff' }}>Set Total Budget</h3>
              <IonLabel style={{ fontSize: '16px' }}>Total Budget: </IonLabel>

              {/* Slider to set the total budget */}
              <IonRange
                min={0}
                max={10000}
                step={10}
                value={totalBudget || 0}
                onIonChange={handleTotalBudgetChange}
                style={{ margin: '10px 0' }}
              />
              <IonItem>
                <IonInput
                  type="number"
                  value={totalBudget || ''}
                  onIonInput={handleTotalBudgetInputChange}
                  placeholder="Enter total budget"
                />
              </IonItem>
              <div style={{ fontSize: '16px', fontWeight: 'bold', marginBottom: '10px' }}>
                ${totalBudget && typeof totalBudget === 'number' ? totalBudget.toFixed(2) : '0.00'}
              </div>

              <IonButton expand="full" color="primary" onClick={() => setIsTotalBudgetSet(true)} style={{ marginTop: '15px', padding: '12px', fontSize: '16px' }}>
                Set Total Budget
                <IonIcon slot="end" icon={chevronForwardOutline} />
              </IonButton>
            </IonCardContent>
          </IonCard>
        ) : (
          // Step 2: Set Category Budgets
          <>
            {/* Balance Display */}
            <IonCard color="secondary" className="balance-card" style={{ borderRadius: '15px', boxShadow: '0 5px 15px rgba(0,0,0,0.1)', padding: '15px' }}>
              <IonCardContent>
                <h3 style={{ fontSize: '18px', color: '#fff' }}>Total Income: <strong>${incomeTotal.toFixed(2)}</strong></h3>
                <h3 style={{ fontSize: '18px', color: '#fff' }}>Total Expenses: <strong>${expenseTotal.toFixed(2)}</strong></h3>
                <h3 style={{ fontSize: '18px', color: '#fff' }}>Balance: <strong>${balance.toFixed(2)}</strong></h3>
              </IonCardContent>
            </IonCard>

            {/* Category Budget Inputs */}
            <IonGrid>
              <IonRow>
                {['Food', 'Rent', 'Utilities', 'Entertainment', 'Others'].map((category) => {
                  const categoryPercentage = calculateCategoryPercentage(category);

                  return (
                    <IonCol size="12" key={category}>
                      <IonCard>
                        <IonCardContent>
                          <h3>{category}</h3>
                          <IonLabel>Total: ${categoryBudgets[category]?.toFixed(2)}</IonLabel>
                          <IonRange
                            min={0}
                            max={totalBudget}
                            step={10}
                            value={sliderValues[category] || 0}
                            onIonChange={(e) => handleSliderChange(category, e.detail.value)}
                          />
                          <IonItem>
                            <IonInput
                              type="number"
                              value={categoryBudgets[category] || ''}
                              onIonInput={(e) => handleCategoryBudgetInputChange(category, e)}
                              placeholder={`Enter ${category} budget`}
                            />
                          </IonItem>
                          <div>
                            <p>Percentage: {categoryPercentage.toFixed(2)}%</p>
                          </div>
                        </IonCardContent>
                      </IonCard>
                    </IonCol>
                  );
                })}
              </IonRow>
            </IonGrid>

            <IonButton expand="full" color="primary" onClick={handleSaveBudget} style={{ marginTop: '15px', padding: '12px', fontSize: '16px' }}>
              Save Budget
              <IonIcon slot="end" icon={chevronForwardOutline} />
            </IonButton>
          </>
        )}

        {/* Alert for exceeding budget */}
        <IonAlert
          isOpen={showExceedAlert}
          onDidDismiss={() => setShowExceedAlert(false)}
          header="Warning"
          message="The total of your category budgets exceeds your total budget. Please adjust accordingly."
          buttons={['OK']}
        />
      </IonContent>
    </IonPage>
  );
};

export default Budgeting;
