import React from 'react';
import { useNavigate } from 'react-router-dom';
import './VideoSection.css';

function VideoSection() {
  const navigate = useNavigate();

  const handleGetStartedClick = () => {
    navigate('/find-events');
  };

  const handleLearnMoreClick = () => {
    window.scrollBy(0, 800);
  };

  return (
    <div className="video-container">
      <video className="background-video" autoPlay loop muted playsInline disablePictureInPicture controls={false}>
        <source src="images/ecvideo.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>
      <div className="video-overlay">
        <div className="overlay-content">
          <div className="overlay-heading">
            <h1>Find Events, <br /> Fuel Hotel Success.</h1>
          </div>
          <div className="overlay-description">
            <p>Learn how to uncover <strong>local events</strong> and enhance your hotel's marketing with <strong>targeted insights</strong> in real-time.</p>
          </div>
          <button className="overlay-button" onClick={handleGetStartedClick}>Get Started</button>
        </div>
        <div className="learn-more" onClick={handleLearnMoreClick}>
          Learn More
        </div>
      </div>
    </div>
  );
}

export default VideoSection;
