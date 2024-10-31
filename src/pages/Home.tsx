import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonButton } from '@ionic/react';
import './css/Home.css';

const Home: React.FC = () => {
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Welcome</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen className="home-background">
        <div className="home-container">
          <h1 className="home-title">Welcome to Monefy!</h1>
          <p className="home-description">Manage your finances easily.</p>
          <IonButton expand="full" className="home-button" routerLink="/login">
            Go to Login
          </IonButton>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default Home;
