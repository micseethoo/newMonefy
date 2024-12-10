// import React from 'react';
// import { useHistory } from 'react-router-dom';
// import { IonIcon } from '@ionic/react';
// import { homeOutline, personOutline, settingsOutline, helpCircleOutline } from 'ionicons/icons';
// import { cashOutline, analyticsOutline } from 'ionicons/icons';
//
// import './NavBar.css'; // Optional CSS for styling
//
// const NavBar: React.FC = () => {
//   const history = useHistory();
//
//   const navigateTo = (path: string) => {
//     history.push(path); // Use history.push to navigate to different pages
//   };
//
//   return (
//     <div className="navbar">
//       <div onClick={() => navigateTo('/userhome')} className="nav-item">
//         <IonIcon icon={homeOutline} />
//       </div>
//       <div onClick={() => navigateTo('/statistics')} className="nav-item">
//         <IonIcon icon={analyticsOutline} />
//       </div>
//       <div onClick={() => navigateTo('/savings')} className="nav-item">
//         <IonIcon icon={cashOutline} />
//       </div>
//       <div onClick={() => navigateTo('/profile')} className="nav-item">
//         <IonIcon icon={personOutline} />
//       </div>
//     </div>
//   );
// };
//
// export default NavBar;
//
//
//
// // hi

import React from 'react';
import { IonIcon, IonRouterLink } from '@ionic/react';
import { homeOutline, personOutline, settingsOutline, analyticsOutline, cashOutline } from 'ionicons/icons';

import './NavBar.css'; // Optional CSS for styling

const NavBar: React.FC = () => {
  return (
    <div className="navbar">
      <IonRouterLink routerLink="/userhome" className="nav-item">
        <IonIcon icon={homeOutline} />
      </IonRouterLink>
      <IonRouterLink routerLink="/statistics" className="nav-item">
        <IonIcon icon={analyticsOutline} />
      </IonRouterLink>
      <IonRouterLink routerLink="/savings" className="nav-item">
        <IonIcon icon={cashOutline} />
      </IonRouterLink>
      <IonRouterLink routerLink="/profile" className="nav-item">
        <IonIcon icon={personOutline} />
      </IonRouterLink>
    </div>
  );
};

export default NavBar;