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
  import { getAuth, onAuthStateChanged } from 'firebase/auth';
  import { getFirestore, collection, getDocs } from 'firebase/firestore';
  import { swapVerticalOutline,walletOutline,calendarOutline, funnelOutline, chevronBackOutline, chevronUpOutline, chevronDownOutline } from 'ionicons/icons'; // Icon for the filter button
  
  import './css/TransactionHistory.css';

  import TransactionDetails from './TransactionDetails';


  const TransactionHistory: React.FC = () => {

     // Fetch predefined filters (categories and payment methods)
  const fetchPredefinedFilters = async () => {
    try {
      const filtersRef = collection(db, 'filters');

      const paymentMethodsSnapshot = await getDocs(collection(filtersRef, 'paymentMethods'));
      const tagsSnapshot = await getDocs(collection(filtersRef, 'tags'));

      const paymentMethodsList = paymentMethodsSnapshot.docs.map((doc) => doc.data().name);
      const tagsList = tagsSnapshot.docs.map((doc) => doc.data().name);

      setPaymentMethods(['all', ...paymentMethodsList]);
      setTags(['all', ...tagsList]);
    } catch (error) {
      console.error('Error fetching predefined filters:', error);
    }
  };

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
    const [netAmount, setNetAmount] = useState<number>(0); // Net transaction amount
    const [showNetAmount, setShowNetAmount] = useState(true);

    const auth = getAuth();
    const db = getFirestore();
    const [userId, setUserId] = useState<string | null>(null); // Track userId separately

   // Fetch transactions and unique payment methods and tags
   const fetchTransactions = async (userId: string) => {
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
        amount: doc.data().amount || 0, // Default amount to 0 if missing
      }));

      const incomes = incomesSnapshot.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
        type: 'Income',
        paymentMethod: doc.data().paymentMethod || 'N/A',
        tag: doc.data().tag || 'N/A',
        amount: doc.data().amount || 0, // Default amount to 0 if missing
      }));

      

      const allTransactions = [...expenses, ...incomes];

      // Sort transactions by date (newest to oldest)
      allTransactions.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

      setTransactions(allTransactions);
      setFilteredTransactions(allTransactions);

      // Extract unique payment methods and tags
        // Extract unique payment methods and tags from both incomes and expenses
        const uniquePaymentMethods = Array.from(new Set(allTransactions.map((t) => t.paymentMethod)));
        const uniqueTags = Array.from(new Set(allTransactions.map((t) => t.tag)));

      setTransactions(allTransactions);
      setFilteredTransactions(allTransactions);
      setPaymentMethods(['all', ...uniquePaymentMethods]); // Add 'all' option for filtering
      setTags(['all', ...uniqueTags]); // Add 'all' option for filtering

      // Calculate net transaction amount
      calculateNetAmount(allTransactions);
    } catch (error) {
      console.error('Error fetching transactions:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Calculate the net amount
  const calculateNetAmount = (transactions: any[]) => {
    const totalIncome = transactions
      .filter((t) => t.type === 'Income')
      .reduce((sum, t) => sum + t.amount, 0);

    const totalExpenses = transactions
      .filter((t) => t.type === 'Expense')
      .reduce((sum, t) => sum + t.amount, 0);

    setNetAmount(totalIncome - totalExpenses); // Set the net amount
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

  
  // Fetch all data (transactions and filters)
  const fetchAllData = async () => {
    if (userId) {
      await Promise.all([fetchPredefinedFilters(), fetchTransactions(userId)]);
    }
  };


  // Fetch transactions whenever userId changes
  useEffect(() => {
    if (userId) {
      fetchAllData();
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

  const handleClearFilters = () => {
    // Reset all filters to their default values
    setSelectedPaymentMethod('all');
    setSelectedTag('all');
    setSelectedType('all');
    setStartDate(null);
    setEndDate(null);
  };

  // Recalculate net amount when filteredTransactions change
  useEffect(() => {
    calculateNetAmount(filteredTransactions);
  }, [filteredTransactions]);

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
  <div className="filter-container">
    <div className="filter-header">
      <h3>Filter Transactions</h3>
      <button className="clear-filters" onClick={handleClearFilters}>
        Clear All
      </button>
    </div>
    
    <div className="filters-grid">
      {/* Payment Method Filter */}
      <div className="filter-item">
        <label className="filter-label">
          Payment Method
        </label>
        <IonSelect
          className="custom-select"
          value={selectedPaymentMethod}
          onIonChange={e => setSelectedPaymentMethod(e.detail.value)}
          interface="popover"
        >
          {paymentMethods.map(method => (
            <IonSelectOption key={method} value={method}>
              {method === 'all' ? 'All Payment Methods' : method}
            </IonSelectOption>
          ))}
        </IonSelect>
      </div>

      {/* Category Filter */}
      <div className="filter-item">
        <label className="filter-label">
          Category
        </label>
        <IonSelect
          className="custom-select"
          value={selectedTag}
          onIonChange={e => setSelectedTag(e.detail.value)}
          interface="popover"
        >
          {tags.map(tag => (
            <IonSelectOption key={tag} value={tag}>
              {tag === 'all' ? 'All Categories' : tag}
            </IonSelectOption>
          ))}
        </IonSelect>
      </div>

      {/* Type Filter */}
      <div className="filter-item">
        <label className="filter-label">
          Type
        </label>
        <IonSelect
          className="custom-select"
          value={selectedType}
          onIonChange={e => setSelectedType(e.detail.value)}
          interface="popover"
        >
          {types.map(type => (
            <IonSelectOption key={type} value={type}>
              {type === 'all' ? 'All Types' : type}
            </IonSelectOption>
          ))}
        </IonSelect>
      </div>
    </div>

    {/* Active Filters Display */}
    <div className="active-filters">
      {(selectedPaymentMethod !== 'all' || selectedTag !== 'all' || selectedType !== 'all') && (
        <div className="active-filters-container">
          {selectedPaymentMethod !== 'all' && (
            <span className="filter-tag">
              {selectedPaymentMethod}
              <button onClick={() => setSelectedPaymentMethod('all')}>×</button>
            </span>
          )}
          {selectedTag !== 'all' && (
            <span className="filter-tag">
              {selectedTag}
              <button onClick={() => setSelectedTag('all')}>×</button>
            </span>
          )}
          {selectedType !== 'all' && (
            <span className="filter-tag">
              {selectedType}
              <button onClick={() => setSelectedType('all')}>×</button>
            </span>
          )}
        </div>
      )}
    </div>
  </div>
</div>

    
{/* Net Transaction Amount with Show/Hide Buttons */}
<div className="net-amount-container">
  <button 
    className="net-amount-toggle-btn" 
    onClick={() => setShowNetAmount(!showNetAmount)}
    aria-expanded={showNetAmount}
    aria-controls="net-amount-content"
  >
    <span className="btn-text">{showNetAmount ? 'Hide' : 'Show'} Net Amount</span>
    <span className={`btn-icon ${showNetAmount ? 'rotate' : ''}`}>
      ▼
    </span>
  </button>

  <div 
    id="net-amount-content"
    className={`net-amount ${showNetAmount ? 'show' : 'hide'} ${netAmount >= 0 ? 'positive' : 'negative'}`}
  >
    <div className="net-amount-content">
      <div className="amount-label">Net Transaction Amount</div>
      <div className="amount-value">
        <span className="currency">RM</span>
        <span className="value">{Math.abs(netAmount).toFixed(2)}</span>
        <span className="indicator">{netAmount >= 0 ? '▲' : '▼'}</span>
      </div>
    </div>
  </div>
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
          <span className="transaction-date">{formatDate(transaction.date)}</span>
        </div>
        
        <div className="transaction-right">
        <span className="transaction-payment">{transaction.paymentMethod}</span>
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
