import React, { useEffect, useState } from 'react';
import { IonPage, IonContent, IonHeader, IonToolbar, IonTitle, IonGrid, IonRow, IonCol, IonCard, IonCardContent, IonItem, IonInput, IonButton, IonSelect, IonSelectOption } from '@ionic/react';
import { getAuth } from 'firebase/auth';
import { getFirestore, collection, addDoc, onSnapshot, query, orderBy } from 'firebase/firestore';
import './css/UserHome.css';
import FloatingMenuButton from '../components/FloatingMenuButton';
import NavBar from '../components/NavBar';

const UserHome: React.FC = () => {
  const [totalExpenses, setTotalExpenses] = useState(0);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [incomes, setIncomes] = useState<any[]>([]); // New incomes state
  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState<number | ''>('');
  const [tag, setTag] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('');
  const [description, setDescription] = useState('');
  const [incomeTitle, setIncomeTitle] = useState('');
  const [incomeAmount, setIncomeAmount] = useState<number | ''>('');
  const [incomeDescription, setIncomeDescription] = useState('');

  const auth = getAuth();
  const db = getFirestore();
  const userId = auth.currentUser?.uid;

  useEffect(() => {
    if (!userId) return;

    // Set up a reference with ordered query by date in descending order for expenses
    const expensesRef = query(
      collection(db, `users/${userId}/expenses`),
      orderBy("date", "desc")
    );

    // Real-time listener for expenses collection
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

    // Set up a reference with ordered query by date in descending order for incomes
    const incomesRef = query(
      collection(db, `users/${userId}/incomes`),
      orderBy("date", "desc")
    );

    // Real-time listener for incomes collection
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

  const handleAddExpense = async () => {
    if (!userId || amount === '' || title === '' || tag === '' || paymentMethod === '') return;

    const expensesRef = collection(db, `users/${userId}/expenses`);

    try {
      const currentDate = new Date();
      await addDoc(expensesRef, {
        title,
        amount: Number(amount),
        tag,
        paymentMethod,
        description,
        date: currentDate.toISOString(),
      });
      setTitle('');
      setAmount('');
      setTag('');
      setPaymentMethod('');
      setDescription('');
    } catch (error) {
      console.error("Error adding expense:", error);
    }
  };

  const handleAddIncome = async () => {
    if (!userId || incomeAmount === '' || incomeTitle === '') return;

    const incomeRef = collection(db, `users/${userId}/incomes`);

    try {
      const currentDate = new Date();
      await addDoc(incomeRef, {
        title: incomeTitle,
        amount: Number(incomeAmount),
        description: incomeDescription,
        date: currentDate.toISOString(),
      });
      setIncomeTitle('');
      setIncomeAmount('');
      setIncomeDescription('');
    } catch (error) {
      console.error("Error adding income:", error);
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
                    <IonSelect
                      value={tag}
                      placeholder="Select Tag"
                      onIonChange={(e) => setTag(e.detail.value)}
                      required
                    >
                      <IonSelectOption value="Food">Food</IonSelectOption>
                      <IonSelectOption value="Transport">Transport</IonSelectOption>
                      <IonSelectOption value="Entertainment">Entertainment</IonSelectOption>
                      <IonSelectOption value="Bills">Bills</IonSelectOption>
                      <IonSelectOption value="Other">Other</IonSelectOption>
                    </IonSelect>
                  </IonItem>
                  <IonItem>
                    <IonSelect
                      value={paymentMethod}
                      placeholder="Select Payment Method"
                      onIonChange={(e) => setPaymentMethod(e.detail.value)}
                      required
                    >
                      <IonSelectOption value="E-Wallet">E-Wallet</IonSelectOption>
                      <IonSelectOption value="Debit Card">Debit Card</IonSelectOption>
                      <IonSelectOption value="Credit Card">Credit Card</IonSelectOption>
                      <IonSelectOption value="Cash">Cash</IonSelectOption>
                    </IonSelect>
                  </IonItem>
                  <IonItem>
                    <IonInput
                      value={description}
                      placeholder="Description"
                      onIonChange={(e) => setDescription(e.detail.value!)}
                    />
                  </IonItem>
                  <IonButton expand="full" onClick={handleAddExpense}>
                    Add Expense
                  </IonButton>
                </IonCardContent>
              </IonCard>
            </IonCol>
          </IonRow>

          {/* Income Form */}
          <IonRow>
            <IonCol size="12">
              <IonCard>
                <IonCardContent>
                  <h3>Add New Income</h3>
                  <IonItem>
                    <IonInput
                      value={incomeTitle}
                      placeholder="Income Title"
                      onIonChange={(e) => setIncomeTitle(e.detail.value!)}
                      required
                    />
                  </IonItem>
                  <IonItem>
                    <IonInput
                      type="number"
                      value={incomeAmount}
                      placeholder="Income Amount"
                      onIonChange={(e) => setIncomeAmount(parseFloat(e.detail.value!))}
                      required
                    />
                  </IonItem>
                  <IonItem>
                    <IonInput
                      value={incomeDescription}
                      placeholder="Income Description"
                      onIonChange={(e) => setIncomeDescription(e.detail.value!)}
                    />
                  </IonItem>
                  <IonButton expand="full" onClick={handleAddIncome}>
                    Add Income
                  </IonButton>
                </IonCardContent>
              </IonCard>
            </IonCol>
          </IonRow>

          {/* Income History */}
          <IonRow>
            <IonCol size="12">
              <IonCard className="transactions-card">
                <IonCardContent>
                  <h3>Income History (Latest)</h3>
                  {incomes.length > 0 ? (
                    incomes.map((income, index) => (
                      <IonItem key={income.id}>
                        <div>
                          <h4>{index + 1}. {income.title}</h4>
                          <p>Amount: ${income.amount}</p>
                          <p>Description: {income.description || "No description provided"}</p>
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

          {/* Transaction History */}
          <IonRow>
            <IonCol size="12">
              <IonCard className="transactions-card">
                <IonCardContent>
                  <h3>Transaction History (Latest)</h3>
                  {transactions.length > 0 ? (
                    transactions.map((transaction, index) => (
                      <IonItem key={transaction.id}>
                        <div>
                          <h4>{index + 1}. {transaction.title}</h4>
                          <p>Amount: ${transaction.amount}</p>
                          <p>Tag: {transaction.tag}</p>
                          <p>Payment Method: {transaction.paymentMethod}</p>
                          <p>Description: {transaction.description || "No description provided"}</p>
                          <p>
                            Date: {new Date(transaction.date).toLocaleDateString()} <br />
                            Time: {new Date(transaction.date).toLocaleTimeString()}
                          </p>
                        </div>
                      </IonItem>
                    ))
                  ) : (
                    <p>No transaction records.</p>
                  )}
                </IonCardContent>
              </IonCard>
            </IonCol>
          </IonRow>
        </IonGrid>
      </IonContent>
      <FloatingMenuButton />
      <NavBar />
    </IonPage>
  );
};

export default UserHome;
