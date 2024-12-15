// TransactionDetailsModal.tsx
import {
    IonHeader,
    IonContent,
    IonToolbar,
    IonTitle,
    IonButtons,
    IonButton,
    IonIcon,
    IonModal,
    IonList,
    IonItem,
    IonLabel,
  } from '@ionic/react';
  import { chevronBackOutline } from 'ionicons/icons';
  import './css/TransactionDetails.css';
  
  interface TransactionDetails{
    isOpen: boolean;
    onDismiss: () => void;
    transaction: any;
  }

  const formatAmount = (amount: number) => {
          return new Intl.NumberFormat('en-MY', {
            style: 'currency',
            currency: 'MYR',
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
          }).format(amount).replace('MYR', 'RM');
        };
  
  const TransactionDetails: React.FC<TransactionDetails> = ({
    isOpen,
    onDismiss,
    transaction,
  }) => {
    if (!transaction) return null;
  
    return (
      <IonModal isOpen={isOpen} onDidDismiss={onDismiss}>
        <IonHeader>
          <IonToolbar>
            <IonButtons slot="start">
              <IonButton onClick={onDismiss}>
                <IonIcon icon={chevronBackOutline} />
              </IonButton>
            </IonButtons>
            <IonTitle>Details</IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonContent>
          <div className="transaction-details-container">
            {/* Amount Section */}
            <div className="amount-section">
              <h1 className={`amount ${transaction.type === 'Income' ? 'positive' : 'negative'}`}>
                {transaction.type === 'Income' ? '+' : '-'}{formatAmount(transaction.amount)}
              </h1>
              <p className="transaction-type">{transaction.type}</p>
            </div>
  
            {/* Details List */}
            <IonList className="details-list">
              <IonItem>
                <IonLabel>
                  <h3>Title</h3>
                  <p>{transaction.title}</p>
                </IonLabel>
              </IonItem>
              <IonItem>
                <IonLabel>
                  <h3>Category</h3>
                  <p>{transaction.tag}</p>
                </IonLabel>
              </IonItem>
              <IonItem>
                <IonLabel>
                  <h3>Payment Method</h3>
                  <p>{transaction.paymentMethod}</p>
                </IonLabel>
              </IonItem>
              <IonItem>
                <IonLabel>
                  <h3>Description</h3>
                  <p>{transaction.description}</p>
                </IonLabel>
              </IonItem>
              <IonItem>
                <IonLabel>
                  <h3>Date/Time</h3>
                  <p>{new Date(transaction.date).toLocaleString()}</p>
                </IonLabel>
              </IonItem>
              <IonItem>
                <IonLabel>
                  <h3>Transaction ID</h3>
                  <p>{transaction.id || 'N/A'}</p>
                </IonLabel>
              </IonItem>
            </IonList>
          </div>
        </IonContent>
      </IonModal>
    );
  };
  
  export default TransactionDetails;