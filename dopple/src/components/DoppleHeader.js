import React from 'react';
import ReactPlayer from 'react-player';
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

    const streams = [
        "http://localhost:3000/cam1-videos/index.m3u8",
        "http://localhost:3000/cam2-videos/index.m3u8",
        "http://localhost:3000/cam3-videos/index.m3u8",
        "http://localhost:3000/cam4-videos/index.m3u8",
        "http://localhost:3000/cam5-videos/index.m3u8",
    ];

    return (
        <div className="dopple-header">
            <div className="dopple-header-logo">
                <img src={doppleLogo} alt="logo" />
            </div>
            <div className="dopple-header-time-date">
                {currentTime} {currentDate}
            </div>

            <h1>IP Camera Streaming</h1>
            <ReactPlayer
                url="http://localhost:3000/index.m3u8"
                playing
                controls
                width="450px"  // Set the width here
                height="450px" // Set the height here
                muted={true}
             />
            
            {streams.map((streamUrl, index) => (
                <div key={index}>
                    <h2>IP Camera {index + 1}</h2>
                    <ReactPlayer
                        url={streamUrl}
                        playing
                        controls
                        width="450px"
                        height="450px"
                        muted={true}
                    />
                </div>
            ))}

        </div>
    );
};

export default DoppleHeader;