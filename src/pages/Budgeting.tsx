import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { IonPage, IonContent, IonHeader, IonToolbar, IonTitle, IonGrid, IonRow, IonCol, IonCard, IonCardContent, IonItem, IonInput, IonButton, IonModal, IonBackButton, IonButtons, IonRange, IonLabel, IonAlert } from '@ionic/react';
import { getAuth } from 'firebase/auth';
import { getFirestore, doc, setDoc, getDoc, collection, onSnapshot } from 'firebase/firestore';
import './css/UserHome.css';
import NavBar from '../components/NavBar';

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

  // Calculate the outstanding budget (remaining budget after allocating to categories)
  const getOutstandingBudget = () => {
    const totalCategoryBudget = Object.values(categoryBudgets).reduce((sum, value) => sum + value, 0);
    return totalBudget - totalCategoryBudget;
  };

  // Calculate the percentage for a category
  const calculateCategoryPercentage = (category: string) => {
    if (totalBudget === 0) return 0;
    return ((categoryBudgets[category] || 0) / totalBudget) * 100;
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar color="primary">
          <IonButtons slot="start">
            <IonBackButton text="Back" />
          </IonButtons>
          <IonTitle>Budgeting</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent fullscreen className="budgeting-content" style={{ backgroundColor: '#f4f7fb' }}>
        {/* Total Budget Summary */}
        <IonCard className="balance-card" style={{ borderRadius: '10px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)', marginBottom: '20px' }}>
          <IonCardContent style={{ padding: '20px' }}>
            <h3 style={{ color: '#2f353f' }}>Total Budget: <strong>${totalBudget.toFixed(2)}</strong></h3>
            <h3>Total Income: <strong>${incomeTotal.toFixed(2)}</strong></h3>
            <h3>Total Expenses: <strong>${expenseTotal.toFixed(2)}</strong></h3>
            <h2>Balance: <strong>${balance.toFixed(2)}</strong></h2>
            {/* Outstanding Budget */}
            <h3>Outstanding Budget: <strong>${getOutstandingBudget().toFixed(2)}</strong></h3>
          </IonCardContent>
        </IonCard>

        {/* Category Budgets */}
        <IonGrid>
          {Object.keys(categoryBudgets).map((category) => (
            <IonRow key={category}>
              <IonCol size="6">
                <strong>{category}</strong>
              </IonCol>
              <IonCol size="6" style={{ textAlign: 'right' }}>
                <span>${categoryBudgets[category]?.toFixed(2) || '0.00'}</span>
                <span style={{ marginLeft: '10px', fontSize: '14px', color: '#4CAF50' }}>
                  {((categoryBudgets[category] / totalBudget) * 100).toFixed(0)}%
                </span>
              </IonCol>
            </IonRow>
          ))}
        </IonGrid>

        {/* Edit Button */}
        <IonButton expand="block" onClick={() => setEditMode(true)} style={{ backgroundColor: '#4CAF50', color: '#fff', borderRadius: '8px' }}>
          Edit Budget
        </IonButton>

        {/* Edit Budget Modal */}
        <IonModal isOpen={editMode} onDidDismiss={() => setEditMode(false)}>
          <IonContent>
            <IonCard style={{ borderRadius: '10px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}>
              <IonCardContent>
                <h3>Edit Total Budget</h3>
                <IonItem>
                  <IonInput
                    type="number"
                    value={totalBudget}
                    onIonChange={(e) => setTotalBudget(parseFloat(e.detail.value!) || 0)}
                    style={{ paddingRight: '10px', fontWeight: 'bold' }}
                  />
                </IonItem>

                <h3>Allocate Budget by Category</h3>
                {['Food', 'Transport', 'Entertainment', 'Bills', 'Other'].map((category) => (
                  <IonItem key={category}>
                    <IonLabel slot="start">{category}</IonLabel>
                    <IonRange
                      min={0}
                      max={Math.max(0, totalBudget - Object.values(categoryBudgets).reduce((sum, value) => sum + value, 0) + (categoryBudgets[category] || 0))}
                      step={10}
                      value={categoryBudgets[category] || 0}
                      onIonChange={(e) => handleCategoryBudgetChange(category, parseFloat(e.detail.value as string))}
                    />
                    <IonInput
                      type="number"
                      slot="end"
                      value={categoryBudgets[category] || 0}
                      onIonChange={(e) => handleCategoryBudgetChange(category, parseFloat(e.detail.value!) || 0)}
                      style={{ textAlign: 'right', maxWidth: '80px', fontWeight: 'bold' }}
                    />
                    {/* Display percentage */}
                    <span style={{ fontSize: '14px', color: '#4CAF50', marginLeft: '10px' }}>
                      {calculateCategoryPercentage(category).toFixed(0)}%
                    </span>
                  </IonItem>
                ))}

                <IonButton expand="block" onClick={handleSaveBudget} style={{ backgroundColor: '#4CAF50', color: '#fff', borderRadius: '8px', marginTop: '20px' }}>
                  Save Budget
                </IonButton>
              </IonCardContent>
            </IonCard>
          </IonContent>
        </IonModal>

        {/* Alert for exceeding total budget */}
        <IonAlert
          isOpen={showAlert}
          onDidDismiss={() => setShowAlert(false)}
          header={'Budget Exceeded'}
          message={`The total budget allocated to categories exceeds the total budget amount of ${totalBudget.toFixed(2)}! Please adjust. `}
          buttons={['OK']}
        />
      </IonContent>
      <NavBar />
    </IonPage>
  );
};

export default Budgeting;
