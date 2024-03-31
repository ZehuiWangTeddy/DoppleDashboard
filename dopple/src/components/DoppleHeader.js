import React, { useEffect } from 'react';
import "./DoppleHeader.css";
import doppleLogo from "../assets/doppleLogo.png";

const DoppleHeader = () => {
  const [currentTime, setCurrentTime] = React.useState(new Date().toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  }));

  const currentDate = new Date().toLocaleDateString('en-GB', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date().toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
      }));
    }, 1000);

    return () => {
      clearInterval(timer);
    };
  }, []);

  return (
    <div className="dopple-header">
      <div className="dopple-header-logo">
        <img src={doppleLogo} alt="logo" />
      </div>
      <div className="dopple-header-time-date">
        <div className="dopple-header-time">{currentTime}</div>
        <div className="dopple-header-date">{currentDate}</div>
      </div>
    </div>
  );
};

export default DoppleHeader;