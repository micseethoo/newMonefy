  import React, { useEffect, useState } from 'react';
  import {
    IonPage,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonList,
    IonItem,
    IonLabel,
    IonNote,
    IonButtons,
    IonButton,
    IonPopover,
    IonDatetime,
    IonModal,
    IonActionSheet,
    IonSkeletonText, 
    IonRefresher, 
    IonRefresherContent,
    IonIcon,
    IonSelect,
    IonSelectOption,
  } from '@ionic/react';
  import { tagIcons } from './TransactionIcons';
  import { calendarOutline } from 'ionicons/icons';
  import { getAuth, onAuthStateChanged } from 'firebase/auth';
  import { getFirestore, collection, getDocs } from 'firebase/firestore';
  import { funnelOutline, chevronBackOutline } from 'ionicons/icons'; // Icon for the filter button
  
  import './css/TransactionHistory.css';

  import TransactionDetails from './TransactionDetails';


  const TransactionHistory: React.FC = () => {

    const [selectedTransaction, setSelectedTransaction] = useState<any | null>(null);

  // Handle transaction click
  const handleTransactionClick = (transaction: any) => {
    setSelectedTransaction(transaction);
  };
    
    const [transactions, setTransactions] = useState<any[]>([]);
    const [filteredTransactions, setFilteredTransactions] = useState<any[]>([]);
    const [isPopoverOpen, setIsPopoverOpen] = useState(false);
    const [isActionSheetOpen, setIsActionSheetOpen] = useState(false);
    const [selectedFilter, setSelectedFilter] = useState<string | null>(null);
    const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);
    const [startDate, setStartDate] = useState<string | null>(null);
    const [endDate, setEndDate] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true); // Add loading state
    const [showFilters, setShowFilters] = useState(false);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<string>('all');
  const [selectedTag, setSelectedTag] = useState<string>('all');
  const [selectedType, setSelectedType] = useState<string>('all');
  

  const [paymentMethods, setPaymentMethods] = useState<string[]>([]);
  const [tags, setTags] = useState<string[]>([]);
    const types = ['all', 'Income', 'Expense'];

    const auth = getAuth();
    const db = getFirestore();
    const [userId, setUserId] = useState<string | null>(null); // Track userId separately

  // Fetch transactions and unique payment methods and tags
  const fetchTransactionsAndFilters = async (userId: string) => {
    setIsLoading(true);
    try {
      const expensesRef = collection(db, `users/${userId}/expenses`);
      const incomesRef = collection(db, `users/${userId}/incomes`);

      const [expensesSnapshot, incomesSnapshot] = await Promise.all([
        getDocs(expensesRef),
        getDocs(incomesRef),
      ]);

      const expenses = expensesSnapshot.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
        type: 'Expense',
        paymentMethod: doc.data().paymentMethod || 'N/A',
        tag: doc.data().tag || 'N/A',
      }));

      const incomes = incomesSnapshot.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
        type: 'Income',
        paymentMethod: doc.data().paymentMethod || 'N/A',
        tag: doc.data().tag || 'N/A',
      }));

      const allTransactions = [...expenses, ...incomes];

      // Extract unique payment methods and tags
      const uniquePaymentMethods = Array.from(
        new Set(allTransactions.map((t) => t.paymentMethod || 'N/A'))
      );
      const uniqueTags = Array.from(new Set(allTransactions.map((t) => t.tag || 'N/A')));

      setTransactions(allTransactions);
      setFilteredTransactions(allTransactions);
      setPaymentMethods(['all', ...uniquePaymentMethods]); // Add 'all' option for filtering
      setTags(['all', ...uniqueTags]); // Add 'all' option for filtering
    } catch (error) {
      console.error('Error fetching transactions:', error);
    } finally {
      setIsLoading(false);
    }
  };

    
     // Ensure userId is available and fetch data on load
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUserId(user.uid);
      } else {
        setUserId(null);
      }
    });

    return () => unsubscribe();
  }, [auth]);

  // Fetch transactions whenever userId changes
  useEffect(() => {
    if (userId) {
      fetchTransactionsAndFilters(userId);
    }
  }, [userId]);

    // Update filter logic
  useEffect(() => {
    let filtered = [...transactions];

    // Date range filter
    if (startDate && endDate) {
      filtered = filtered.filter(transaction => {
        const transactionDate = new Date(transaction.date).getTime();
        return transactionDate >= new Date(startDate).getTime() && 
               transactionDate <= new Date(endDate).getTime();
      });
    }

    // Payment method filter
    if (selectedPaymentMethod !== 'all') {
      filtered = filtered.filter(t => t.paymentMethod === selectedPaymentMethod);
    }

    // Tag filter
    if (selectedTag !== 'all') {
      filtered = filtered.filter(t => (t.tag || 'N/A') === selectedTag);
    }

    

    // Type filter
    if (selectedType !== 'all') {
      filtered = filtered.filter(t => t.type === selectedType);
    }

    setFilteredTransactions(filtered);
  }, [startDate, endDate, transactions, selectedPaymentMethod, selectedTag, selectedType]);

    // Handle Refresh Function
    const handleRefresh = async (event: CustomEvent) => {
      try {
          if (!userId) return;
          
          const expensesRef = collection(db, `users/${userId}/expenses`);
          const incomesRef = collection(db, `users/${userId}/incomes`);

          const expensesSnapshot = await getDocs(expensesRef);
          const incomesSnapshot = await getDocs(incomesRef);

          const expenses = expensesSnapshot.docs.map(doc => ({
              ...doc.data(),
              type: 'Expense',
          }));

          const incomes = incomesSnapshot.docs.map(doc => ({
              ...doc.data(),
              type: 'Income',
          }));

          const allTransactions = [...expenses, ...incomes];
          allTransactions.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

          setTransactions(allTransactions);
          setFilteredTransactions(allTransactions);
      } catch (error) {
          console.error('Error refreshing transactions:', error);
      } finally {
          event.detail.complete();
      }
  };

  // Date Format Function
  const formatDate = (date: string) => {
      return new Date(date).toLocaleString('en-GB', {
          day: '2-digit',
          month: 'short',
          hour: '2-digit',
          minute: '2-digit',
          hour12: false
      });
  };



    return (
      <IonPage>
        <IonHeader>
          <IonToolbar>
          <IonTitle>Transaction History</IonTitle>
          <IonButtons slot="start">
            <IonButton routerLink="/tabs/home">
              <IonIcon icon={chevronBackOutline} />
            </IonButton>
          </IonButtons>
          <IonButtons slot="secondary">
            <IonButton onClick={() => setIsDatePickerOpen(true)}>
              {startDate && endDate
                ? `${new Date(startDate).toLocaleDateString()} - ${new Date(endDate).toLocaleDateString()}`
                : ''}
              <IonIcon icon={calendarOutline} slot="end" />
            </IonButton>
          </IonButtons>
            <IonButtons slot="end">
            <IonButton onClick={() => setShowFilters(!showFilters)}>
              <IonIcon icon={funnelOutline} />
            </IonButton>
          </IonButtons>
        </IonToolbar>

         {/* Filter Section */}
         <div className={`filter-section ${showFilters ? 'show' : ''}`}>
          <IonList>
            <IonItem>
              <IonLabel>Payment Method</IonLabel>
              <IonSelect
                value={selectedPaymentMethod}
                onIonChange={e => setSelectedPaymentMethod(e.detail.value)}
              >
                {paymentMethods.map(method => (
                  <IonSelectOption key={method} value={method}>
                    {method === 'all' ? 'All Payment Methods' : method}
                  </IonSelectOption>
                ))}
              </IonSelect>
            </IonItem>

            <IonItem>
              <IonLabel>Category</IonLabel>
              <IonSelect
                value={selectedTag}
                onIonChange={e => setSelectedTag(e.detail.value)}
              >
                {tags.map(tag => (
                  <IonSelectOption key={tag} value={tag}>
                    {tag === 'all' ? 'All Categories' : tag}
                  </IonSelectOption>
                ))}
              </IonSelect>
            </IonItem>

            <IonItem>
              <IonLabel>Type</IonLabel>
              <IonSelect
                value={selectedType}
                onIonChange={e => setSelectedType(e.detail.value)}
              >
                {types.map(type => (
                  <IonSelectOption key={type} value={type}>
                    {type === 'all' ? 'All Types' : type}
                  </IonSelectOption>
                ))}
              </IonSelect>
            </IonItem>
          </IonList>
        </div>
      </IonHeader>

      <IonContent>
        <IonRefresher slot="fixed" onIonRefresh={handleRefresh}>
          <IonRefresherContent />
        </IonRefresher>

        {isLoading ? (
  // Loading skeleton with previous animation style
  Array(5).fill(null).map((_, index) => (
    <div className="transaction-row skeleton" key={`skeleton-${index}`}>
      <div className="icon-skeleton">
        <IonSkeletonText animated style={{ width: '100%', height: '100%' }} />
      </div>
      <div className="content-skeleton">
        <div className="text-content">
          <IonSkeletonText animated style={{ width: '60%', height: '20px' }} />
          <IonSkeletonText animated style={{ width: '40%', height: '16px' }} />
          <IonSkeletonText animated style={{ width: '30%', height: '16px' }} />
        </div>
        <div className="amount-skeleton">
          <IonSkeletonText animated style={{ width: '70px', height: '24px' }} />
        </div>
      </div>
    </div>
  ))
) : filteredTransactions.length === 0 ? (
  // Empty state
  <div className="empty-state">
    <p>No transactions found</p>
  </div>
) : (
  // Transactions list with new layout
  filteredTransactions.map((transaction, index) => (
    <IonItem 
      key={transaction.id || index} 
      className="transaction-row"
      onClick={() => handleTransactionClick(transaction)}
    >
      <div className="transaction-icon-wrapper">
        <IonIcon 
          icon={transaction.tag ? (tagIcons[transaction.tag] || tagIcons.default) : tagIcons.default} 
          className="category-icon"
        />
      </div>
      
      <div className="transaction-content">
        <div className="transaction-left">
          <h3 className="transaction-title">{transaction.title}</h3>
          <span className="transaction-payment">{transaction.paymentMethod}</span>
          <span className="transaction-date">{formatDate(transaction.date)}</span>
        </div>
        
        <div className="transaction-right">
          <span className={`transaction-amount ${
            transaction.type === 'Income' ? 'positive' : 'negative'
          }`}>
            {transaction.type === 'Income' ? '+' : '-'}
            RM{transaction.amount}
          </span>
        </div>
      </div>
    </IonItem>
  ))
)}
        
          {/* Modal for Date Range Picker */}
        <IonModal isOpen={isDatePickerOpen} onDidDismiss={() => setIsDatePickerOpen(false)}>
          <IonContent>
            <IonList>
              <IonItem>
                <IonLabel>Start Date</IonLabel>
                <IonDatetime
                  displayFormat="DD MMM YYYY"
                  value={startDate}
                  onIonChange={e => {
                    setStartDate(e.detail.value!);
                  }}
                />
              </IonItem>
              <IonItem>
                <IonLabel>End Date</IonLabel>
                <IonDatetime
                  displayFormat="DD MMM YYYY"
                  value={endDate}
                  onIonChange={e => {
                    setEndDate(e.detail.value!);
                  }}
                />
              </IonItem>
            </IonList>
            <IonButton expand="full" onClick={() => setIsDatePickerOpen(false)}>
              Close
            </IonButton>
          </IonContent>
        </IonModal>

           


          {/* Transaction Details Modal */}
        <TransactionDetails
          isOpen={!!selectedTransaction}
          onDismiss={() => setSelectedTransaction(null)}
          transaction={selectedTransaction}
        />
        </IonContent>
      </IonPage>
    );
  };

  export default TransactionHistory;
