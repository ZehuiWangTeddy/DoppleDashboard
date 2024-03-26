import React from 'react';
import "./DoppleHeader.css";
import doppleLogo from "../assets/doppleLogo.png";

const DoppleHeader = () => {
    const currentTime = new Date().toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
    });
    const currentDate = new Date().toLocaleDateString('en-GB', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    });

    return (
        <div className="dopple-header">
            <div className="dopple-header-logo">
                <img src={doppleLogo} alt="logo" />
            </div>
            <div className="dopple-header-time-date">
                {currentTime} {currentDate}
            </div>
        </div>
    );
};

export default DoppleHeader;