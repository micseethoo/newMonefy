import React, { useState } from 'react';
import { IonButton } from '@ionic/react';
import './FloatingMenuButton.css';

const FloatingMenuButton: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <div className="floating-button-container">
      <IonButton onClick={toggleMenu} className="floating-button" color="primary" shape="round">
        +
      </IonButton>

      {isMenuOpen && (
        <div className="floating-menu">
          <IonButton color="primary" onClick={() => console.log('Option 1 clicked')}>
            Income
          </IonButton>
          <IonButton color="primary" onClick={() => console.log('Option 2 clicked')}>
            Expenses
          </IonButton>
          <IonButton color="primary" onClick={toggleMenu}>
            Back
          </IonButton>
        </div>
      )}
    </div>
  );
};

export default FloatingMenuButton;
