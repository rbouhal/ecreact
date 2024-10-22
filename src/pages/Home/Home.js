import React from 'react';
import './Home.css';
import VideoSection from '../../components/VideoSection/VideoSection';
import InfoSection from '../../components/InfoSection/InfoSection';

function Home() {
  return (
    <div className="home-container">
      <VideoSection />
      <div className="content">
        <InfoSection
          title="Uncover Local Opportunities"
          description="Our advanced event crawler finds the latest local events near your hotel, helping you stay ahead of the competition and boost guest engagement."
          imageSrc="images/event.jpg"
          isImageLeft={true}
        />
        <InfoSection
          title="Targeted Marketing Insights"
          description="Leverage real-time event data to create personalized marketing strategies, ensuring your hotel attracts the right guests at the right time."
          imageSrc="images/marketing.jpg"
          isImageLeft={false}
        />
        <InfoSection
          title="AI-Powered Event Recommendations"
          description="Our intelligent AI system delivers tailored event recommendations, helping you optimize room bookings and elevate your hotel's marketing strategy."
          imageSrc="images/ai.jpg"
          isImageLeft={true}
        />

      </div>
    </div>
  );
}

export default Home;
