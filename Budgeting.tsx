import React, { useEffect, useState } from 'react';
import { IonPage, IonContent, IonHeader, IonToolbar, IonTitle, IonGrid, IonRow, IonCol, IonCard, IonCardContent, IonItem, IonInput, IonButton, IonSelect, IonSelectOption } from '@ionic/react';
import { getAuth } from 'firebase/auth';
import { getFirestore, collection, addDoc, onSnapshot, doc, setDoc, getDoc } from 'firebase/firestore';
import './css/UserHome.css';

const Budgeting: React.FC = () => {
  const [totalBudget, setTotalBudget] = useState<number | ''>('');
  const [categoryBudgets, setCategoryBudgets] = useState<{ [key: string]: number }>({});
  const [savingsGoal, setSavingsGoal] = useState<number | ''>('');
  const [savingsDescription, setSavingsDescription] = useState('');
  const [incomeTotal, setIncomeTotal] = useState(0);
  const [expenseTotal, setExpenseTotal] = useState(0);
  const [balance, setBalance] = useState(0);

  const auth = getAuth();
  const db = getFirestore();
  const userId = auth.currentUser?.uid;

  // Load existing budget and calculate balance
  useEffect(() => {
    if (!userId) return;

    const loadBudgetData = async () => {
      const budgetDocRef = doc(db, `users/${userId}/budget`, 'current');
      const budgetDoc = await getDoc(budgetDocRef);

      if (budgetDoc.exists()) {
        const budgetData = budgetDoc.data();
        setTotalBudget(budgetData?.totalBudget || '');
        setCategoryBudgets(budgetData?.categoryBudgets || {});
      }
    };

    // Load income and expenses for balance calculation
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

  // Calculate balance whenever income or expenses change
  useEffect(() => {
    setBalance(incomeTotal - expenseTotal);
  }, [incomeTotal, expenseTotal]);

  // Save budget to Firebase
  const handleSaveBudget = async () => {
    if (!userId || totalBudget === '') return;

    const budgetDocRef = doc(db, `users/${userId}/budget`, 'current');
    try {
      await setDoc(budgetDocRef, {
        totalBudget: Number(totalBudget),
        categoryBudgets,
      });
      alert('Budget saved successfully!');
    } catch (error) {
      console.error('Error saving budget:', error);
    }
  };

  // Save savings goal to Firebase
  const handleSaveSavingsGoal = async () => {
    if (!userId || savingsGoal === '' || savingsDescription === '') return;

    const savingsDocRef = collection(db, `users/${userId}/savings`);
    try {
      await addDoc(savingsDocRef, {
        goalAmount: Number(savingsGoal),
        description: savingsDescription,
        dateSet: new Date().toISOString(),
      });
      setSavingsGoal('');
      setSavingsDescription('');
      alert('Savings goal set successfully!');
    } catch (error) {
      console.error('Error saving savings goal:', error);
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
        <IonGrid className="budgeting-grid">

          {/* Set Total Budget */}
          <IonRow>
            <IonCol size="12">
              <IonCard>
                <IonCardContent>
                  <h3>Set Monthly/Annual Budget</h3>
                  <IonItem>
                    <IonInput
                      type="number"
                      value={totalBudget}
                      placeholder="Enter total budget"
                      onIonChange={(e) => setTotalBudget(parseFloat(e.detail.value!))}
                      required
                    />
                  </IonItem>
                  {['Food', 'Transport', 'Entertainment', 'Bills', 'Other'].map((category) => (
                    <IonItem key={category}>
                      <IonInput
                        type="number"
                        value={categoryBudgets[category] || ''}
                        placeholder={`Budget for ${category}`}
                        onIonChange={(e) =>
                          setCategoryBudgets({
                            ...categoryBudgets,
                            [category]: parseFloat(e.detail.value!) || 0,
                          })
                        }
                      />
                    </IonItem>
                  ))}
                  <IonButton expand="full" onClick={handleSaveBudget}>
                    Save Budget
                  </IonButton>
                </IonCardContent>
              </IonCard>
            </IonCol>
          </IonRow>

          {/* Set Savings Goal */}
          <IonRow>
            <IonCol size="12">
              <IonCard>
                <IonCardContent>
                  <h3>Set Savings Goal</h3>
                  <IonItem>
                    <IonInput
                      type="number"
                      value={savingsGoal}
                      placeholder="Enter savings goal amount"
                      onIonChange={(e) => setSavingsGoal(parseFloat(e.detail.value!))}
                      required
                    />
                  </IonItem>
                  <IonItem>
                    <IonInput
                      value={savingsDescription}
                      placeholder="Description (e.g., 'New Laptop')"
                      onIonChange={(e) => setSavingsDescription(e.detail.value!)}
                      required
                    />
                  </IonItem>
                  <IonButton expand="full" onClick={handleSaveSavingsGoal}>
                    Save Savings Goal
                  </IonButton>
                </IonCardContent>
              </IonCard>
            </IonCol>
          </IonRow>

          {/* Income & Expense Balance */}
          <IonRow>
            <IonCol size="12">
              <IonCard>
                <IonCardContent>
                  <h3>Income & Expense Balance</h3>
                  <p>Total Income: ${incomeTotal.toFixed(2)}</p>
                  <p>Total Expenses: ${expenseTotal.toFixed(2)}</p>
                  <p>Balance: ${balance.toFixed(2)}</p>
                </IonCardContent>
              </IonCard>
            </IonCol>
          </IonRow>

        </IonGrid>
      </IonContent>
    </IonPage>
  );
};

export default Budgeting;
