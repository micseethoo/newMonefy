import React from 'react';
import { IonContent } from '@ionic/react';
import './ProgressBar.css';

interface ProgressBarProps {
    progress: number; // Percentage value between 0 and 100
}

const ProgressBar: React.FC<ProgressBarProps> = ({ progress }) => {
    return (
        <div className="progress-bar-container">
            <div className="progress-bar-fill" style={{ width: `${progress}%` }}>
                <span className="progress-label">{progress}%</span>
            </div>
        </div>
    );
}

export default ProgressBar;