import React, { useEffect, useRef, useState } from "react";
import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  IonButtons,
  IonButton,
  IonMenu,
  IonList,
  IonItem,
  IonLabel,
  IonIcon,
  IonMenuButton,
  IonInput,
} from '@ionic/react';
import {
  homeOutline,
  callOutline,
  mailOutline,
  walletOutline,
  briefcaseOutline,
  shieldOutline,
  peopleOutline,
  menuOutline,
  arrowForward,
  rocketOutline,
  logoFacebook,
  logoTwitter,
  logoInstagram,
  logoLinkedin,
} from 'ionicons/icons';

import { useHistory } from 'react-router-dom'; // Import useHistory for navigation
import './css/Home.css';


const Home: React.FC = () => {

  const history = useHistory(); // Initialize useHistory

  const addRippleEffect = (event: React.MouseEvent<HTMLButtonElement>) => {
    const button = event.currentTarget;
    const ripple = document.createElement('span');
    const rect = button.getBoundingClientRect();

    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    ripple.style.left = x + 'px';
    ripple.style.top = y + 'px';
    ripple.className = 'ripple';

    button.appendChild(ripple);

    setTimeout(() => {
      ripple.remove();
    }, 600);
  };

  // Add the onClick handler to the button
  <button className="learn-more-btn" onClick={addRippleEffect}>
    <span>Learn More</span>
    <IonIcon name="arrow-forward-outline"></IonIcon >
  </button>


  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const trackSectionRef = useRef<HTMLDivElement>(null);
  const budgetSectionRef = useRef<HTMLDivElement>(null);
  const savingSectionRef = useRef<HTMLDivElement>(null);

  // Separate state for each section
  const [isTrackVisible, setIsTrackVisible] = useState(false);
  const [isBudgetVisible, setIsBudgetVisible] = useState(false);
  const [isSavingVisible, setIsSavingVisible] = useState(false);

  useEffect(() => {

    const sections = document.querySelectorAll('.feature-section, .feature-section-start');
  sections.forEach(section => section.classList.add('no-animation'));

  // Remove no-animation class after a short delay
  setTimeout(() => {
    sections.forEach(section => section.classList.remove('no-animation'));
  }, 100);

    const observerCallback = (setIsVisible: (value: boolean) => void) => (
      entries: IntersectionObserverEntry[]
    ) => {
      entries.forEach((entry) => {
        setIsVisible(entry.isIntersecting);
      });
    };

    const observer = new IntersectionObserver(
      observerCallback(setIsTrackVisible),
      { threshold: 0.2 }
    );

    const budgetObserver = new IntersectionObserver(
      observerCallback(setIsBudgetVisible),
      { threshold: 0.2 }
    );

    const savingObserver = new IntersectionObserver(
      observerCallback(setIsSavingVisible),
      { threshold: 0.2 }
    );

    if (trackSectionRef.current) {
      observer.observe(trackSectionRef.current);
    }
    if (budgetSectionRef.current) {
      budgetObserver.observe(budgetSectionRef.current);
    }
    if (savingSectionRef.current) {
      savingObserver.observe(savingSectionRef.current);
    }

    return () => {
      if (trackSectionRef.current) observer.unobserve(trackSectionRef.current);
      if (budgetSectionRef.current) budgetObserver.unobserve(budgetSectionRef.current);
      if (savingSectionRef.current) savingObserver.unobserve(savingSectionRef.current);
    };
  }, []);
  return (
    <>
      {/* Section Navigation Menu */}
      <IonMenu contentId="main-content">
        <IonHeader>
          <IonToolbar>
            <IonTitle className='title'>Monefy</IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonContent>
          <IonList>
            <IonItem button onClick={() => scrollToSection('hero')}>
              <IonIcon slot="start" icon={homeOutline} />
              <IonLabel>About Us</IonLabel>
            </IonItem>
            <IonItem button onClick={() => scrollToSection('track')}>
              <IonIcon slot="start" icon={walletOutline} />
              <IonLabel>Track Income & Expenses</IonLabel>
            </IonItem>
            <IonItem button onClick={() => scrollToSection('budget')}>
              <IonIcon slot="start" icon={briefcaseOutline} />
              <IonLabel>Budget Smarter</IonLabel>
            </IonItem>
            <IonItem button onClick={() => scrollToSection('saving')}>
              <IonIcon slot="start" icon={shieldOutline} />
              <IonLabel>Set Savings Goal</IonLabel>
            </IonItem>
          </IonList>
        </IonContent>
      </IonMenu>

      <IonPage id="main-content">
        <IonHeader >
        <IonToolbar className='Nav-Toolbar'>
  <IonButtons slot="start">
    <IonMenuButton className='Hamburger-btn'></IonMenuButton>
  </IonButtons>
  <IonTitle className='title'>Monefy</IonTitle>
  <IonButtons slot="end">
    <IonButton className="nav-button login-button" onClick={() => history.push('/Login')}>Login</IonButton>
    <IonButton className="nav-button signup-button" onClick={() => history.push('/SignUp')}>Sign Up</IonButton>
  </IonButtons>
</IonToolbar>
        </IonHeader>

        <IonContent fullscreen>
          {/* Hero Section */}
          <section id="hero" className="hero-container">
            <div className="animated-background"></div>
            <div className="hero-content">
              <div className="text-container">
                <h1 className="hero-title">
                Take Control of Your Finances with Ease
                </h1>
                <h2 className="hero-subtitle">
                Monefy is the smartest way to manage your money. Track your income and expenses, set budgets, and achieve your savings goals—all in one seamless app designed to simplify your financial journey.
                </h2>
                <div className="cta-button-container">
                  <IonButton onClick={() => history.push('/SignUp')}
                    className="get-started-btn"
                    size="large"
                  >
                    <img src="/assets/Monefy.png" alt="Monefy Logo" className='image-logo' />
                     Get Started
                  </IonButton>
                </div>
              </div>
            </div>
          </section>

  {/* Floating Image */}
<div className="floating-image-container">

  <img
    src="/assets/FloatingImage.png"
    alt="Feature Preview"
    className="floating-image"
  />
</div>


          {/* Track Your Income & Expenses Section */}

          <section ref={trackSectionRef} id="track" className="feature-section-start">
          <div className={`section-content animate-children ${isTrackVisible ? "is-visible" : ""}`}>
    <div className="content-wrapper">
      <div className="title-container">
        <h2 className="section-title">Track Your Income & Expenses</h2>
        <div className="title-underline"></div>
      </div>
      <p className="section-subtitle">Stay organized with detailed logs of your income and expenses. Easily categorize your transactions with titles, amounts, tags, and dates to keep a clear financial overview.</p>
      <div className="button-wrapper">
        <button className="learn-more-btn" onClick={() => history.push('/SignUp')}>
          <span>Learn More</span>
          <IonIcon name="arrow-forward-outline"></IonIcon>
        </button>
      </div>
    </div>
    <div className="image-placeholder">
      <img src="/assets/Track your income & Expenses.png" alt="Track Income & Expenses" />
    </div>
  </div>
    </section>

          {/* Visualize Spending & Budget Smarter Section */}
          <section ref={budgetSectionRef} id="budget" className="feature-section">
          <div className={`section-content animate-children ${isBudgetVisible ? "is-visible" : ""}`}>
    <div className="content-wrapper">
      <div className="title-container">
        <h2 className="section-title">Visualize Spending & Budget Smarter</h2>
        <div className="title-underline"></div>
      </div>
      <p className="section-subtitle">Understand your spending habits with intuitive pie charts. Set budgets for categories and see how your expenses align with your goals.</p>
      <div className="button-wrapper">
        <button className="learn-more-btn" onClick={() => history.push('/SignUp')}>
          <span>Learn More</span>
          <IonIcon name="arrow-forward-outline"></IonIcon>
        </button>
      </div>
    </div>
    <div className="image-placeholder">
      <img src="/assets/Budgeting.png" alt="Track Income & Expenses" />
    </div>
  </div>
          </section>

          {/* Savings Section */}

          <section ref={savingSectionRef} id="saving" className="feature-section">
          <div className={`section-content animate-children ${isSavingVisible ? "is-visible" : ""}`}>
    <div className="content-wrapper">
      <div className="title-container">
        <h2 className="section-title">Achieve Your Savings Goals</h2>
        <div className="title-underline"></div>
      </div>
      <p className="section-subtitle">Define your financial objectives and track progress in real time. Let smart recommendations help you stay on course to build your future.</p>
      <div className="button-wrapper">
        <button className="learn-more-btn" onClick={() => history.push('/SignUp')}>
          <span>Learn More</span>
          <IonIcon name="arrow-forward-outline"></IonIcon>
        </button>
      </div>
    </div>
    <div className="image-placeholder">
      <img src="/assets/Savings.png" alt="Track Income & Expenses" />
    </div>
  </div>
          </section>


             {/* Footer Section */}
<footer className="footer">
  <div className="footer-content">
    <div className="footer-section">
      <h4>Subscribe to Our Newsletter</h4>
      <p className="newsletter-description">
        Stay updated with our latest features and financial tips.
      </p>
      <form className="newsletter-form" onSubmit={(e) => e.preventDefault()}>
        <div className="input-group">
          <IonInput
            type="email"
            placeholder="Enter your email"
            className="newsletter-input"
          />
          <IonButton className="subscribe-btn">
            Subscribe
            <IonIcon slot="end" icon={arrowForward} />
          </IonButton>
        </div>
      </form>
    </div>

    <div className="footer-section">
      <h4>Contact Us</h4>
      <div className="contact-info">
        <p>
          <IonIcon icon={mailOutline} />
          <span>support@monefy.com</span>
        </p>
        <p>
          <IonIcon icon={callOutline} />
          <span>+60 10-2105926</span>
        </p>
      </div>
      <div className="social-links">
        <IonButton fill="clear" href="https://www.facebook.com/eugene.chongjieshan/" target="_blank">
          <IonIcon icon={logoFacebook} />
        </IonButton>
        <IonButton fill="clear" href="https://x.com/home" target="_blank">
          <IonIcon icon={logoTwitter} />
        </IonButton>
        <IonButton fill="clear" href="https://www.instagram.com/gnohc_enegue/" target="_blank">
          <IonIcon icon={logoInstagram} />
        </IonButton>
        <IonButton fill="clear" href="https://www.linkedin.com/in/eugene-jieshan/" target="_blank">
          <IonIcon icon={logoLinkedin} />
        </IonButton>
      </div>
    </div>
  </div>
  <div className="footer-bottom">
    <p>&copy; {new Date().getFullYear()} Monefy. All rights reserved.</p>
  </div>
</footer>
        </IonContent>
      </IonPage>
    </>
  );
};

export default Home;