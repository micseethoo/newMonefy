import React, { useState } from 'react';
import { IonButton, IonItem, IonInput, IonSelect, IonSelectOption, IonCard, IonCardContent, IonRow, IonCol } from '@ionic/react';
import { getAuth } from 'firebase/auth';
import { getFirestore, collection, addDoc } from 'firebase/firestore';
import './FloatingMenuButton.css';

const FloatingMenuButton: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState<string | null>(null); // To track the selected option
  const [expenseTitle, setExpenseTitle] = useState('');
  const [expenseAmount, setExpenseAmount] = useState(0);
  const [expenseTag, setExpenseTag] = useState('');
  const [expensePaymentMethod, setExpensePaymentMethod] = useState('');
  const [expenseDescription, setExpenseDescription] = useState('');

  const [incomeTitle, setIncomeTitle] = useState('');
  const [incomeAmount, setIncomeAmount] = useState(0);
  const [incomeDescription, setIncomeDescription] = useState('');

  const auth = getAuth();
  const db = getFirestore();
  const userId = auth.currentUser?.uid;

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
    setSelectedOption(null); // Reset when closing the menu
  };

  const handleOptionClick = (option: string) => {
    setSelectedOption(option);
    setIsMenuOpen(false); // Close the menu when an option is selected
  };

  const handleAddExpense = async () => {
    if (!userId || !expenseAmount || !expenseTitle || !expenseTag || !expensePaymentMethod) return;
    const expensesRef = collection(db, `users/${userId}/expenses`);
    try {
      const currentDate = new Date();
      await addDoc(expensesRef, {
        title: expenseTitle,
        amount: expenseAmount,
        tag: expenseTag,
        paymentMethod: expensePaymentMethod,
        description: expenseDescription,
        date: currentDate.toISOString(),
      });
      setExpenseTitle('');
      setExpenseAmount(0);
      setExpenseTag('');
      setExpensePaymentMethod('');
      setExpenseDescription('');
    } catch (error) {
      console.error('Error adding expense:', error);
    }
  };

  const handleAddIncome = async () => {
    if (!userId || !incomeAmount || !incomeTitle) return;
    const incomesRef = collection(db, `users/${userId}/incomes`);
    try {
      const currentDate = new Date();
      await addDoc(incomesRef, {
        title: incomeTitle,
        amount: incomeAmount,
        description: incomeDescription,
        date: currentDate.toISOString(),
      });
      setIncomeTitle('');
      setIncomeAmount(0);
      setIncomeDescription('');
    } catch (error) {
      console.error('Error adding income:', error);
    }
  };

  return (
    <div className="floating-button-container">
      <IonButton onClick={toggleMenu} className="floating-button" color="primary" shape="round">
        +
      </IonButton>

      {isMenuOpen && (
        <div className="floating-menu">
          <IonButton color="primary" onClick={() => handleOptionClick('Income')}>
            Income
          </IonButton>
          <IonButton color="primary" onClick={() => handleOptionClick('Expense')}>
            Expenses
          </IonButton>
//           <IonButton color="primary" onClick={toggleMenu}>
//             Back
//           </IonButton>
        </div>
      )}

      {/* Conditionally render forms based on selected option */}
      {selectedOption === 'Expense' && (
        <div className="expense-form-container">
          <IonRow>
            <IonCol size="12">
              <IonCard>
                <IonCardContent>
                  <h3>Add Expense</h3>
                  <IonItem>
                    <IonInput
                      value={expenseTitle}
                      placeholder="Title"
                      onIonChange={(e) => setExpenseTitle(e.detail.value!)}
                      required
                    />
                  </IonItem>
                  <IonItem>
                    <IonInput
                      type="number"
                      value={expenseAmount}
                      placeholder="Amount"
                      onIonChange={(e) => setExpenseAmount(parseFloat(e.detail.value!))}
                      required
                    />
                  </IonItem>
                  <IonItem>
                    <IonSelect
                      value={expenseTag}
                      placeholder="Select Tag"
                      onIonChange={(e) => setExpenseTag(e.detail.value)}
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
                      value={expensePaymentMethod}
                      placeholder="Select Payment Method"
                      onIonChange={(e) => setExpensePaymentMethod(e.detail.value)}
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
                      value={expenseDescription}
                      placeholder="Description"
                      onIonChange={(e) => setExpenseDescription(e.detail.value!)}
                    />
                  </IonItem>
                  <IonButton expand="full" onClick={handleAddExpense}>
                    Add Expense
                  </IonButton>
                </IonCardContent>
              </IonCard>
            </IonCol>
          </IonRow>
        </div>
      )}

      {selectedOption === 'Income' && (
        <div className="income-form-container">
          <IonRow>
            <IonCol size="12">
              <IonCard>
                <IonCardContent>
                  <h3>Add Income</h3>
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
                      placeholder="Amount"
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
        </div>
      )}
    </div>
  );
};

export default FloatingMenuButton;
